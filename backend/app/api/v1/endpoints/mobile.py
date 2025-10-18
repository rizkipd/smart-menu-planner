from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.schemas import (
    MobileResponse, 
    PlanModeSelection, 
    GeneratePlanRequest,
    MealPlanResponse,
    PlanVariationCreate
)
from app.services.ai_service import ai_service
from app.services.meal_service import MealPlanService, UserService
from app.models.models import MealPlan
import json

router = APIRouter()


@router.get("/modes", response_model=MobileResponse)
async def get_plan_modes():
    """
    Get available meal plan modes for mobile app.
    """
    modes = [
        {
            "id": "diet",
            "name": "🥗 Diet / Health",
            "description": "Nutrition-focused with balanced calories",
            "icon": "🥗",
            "color": "#4CAF50"
        },
        {
            "id": "satisfaction", 
            "name": "🍱 Satisfaction / Delicious",
            "description": "Taste-focused with variety and flavor",
            "icon": "🍱",
            "color": "#FF9800"
        },
        {
            "id": "economic",
            "name": "💰 Economic / Saving", 
            "description": "Budget-focused with cost efficiency",
            "icon": "💰",
            "color": "#2196F3"
        }
    ]
    
    return MobileResponse(
        success=True,
        data={"modes": modes}
    )


@router.post("/select-mode", response_model=MobileResponse)
async def select_plan_mode(
    request: PlanModeSelection,
    db: Session = Depends(get_db)
):
    """
    Handle plan mode selection and show existing plans or generate new ones.
    """
    try:
        meal_service = MealPlanService(db)
        
        # Get existing plans for this mode
        existing_plans = meal_service.get_existing_plans(request.mode, limit=3)
        
        if existing_plans:
            # Show existing plans to user
            plans_data = []
            for plan in existing_plans:
                plans_data.append({
                    "id": plan.id,
                    "created_at": plan.created_at.isoformat(),
                    "preview": f"{plan.weekly_plan[0]['breakfast'][:30]}..." if plan.weekly_plan else "New plan"
                })
            
            return MobileResponse(
                success=True,
                data={
                    "has_existing_plans": True,
                    "existing_plans": plans_data,
                    "mode": request.mode
                }
            )
        else:
            # No existing plans, will need to generate new one
            return MobileResponse(
                success=True,
                data={
                    "has_existing_plans": False,
                    "mode": request.mode
                }
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate", response_model=MobileResponse)
async def generate_new_plan(
    request: GeneratePlanRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Generate a new meal plan using AI.
    """
    try:
        # Generate meal plan using AI
        plan_data = await ai_service.generate_meal_plan(
            mode=request.mode,
            preferences=request.preferences
        )
        
        # Save to database
        meal_service = MealPlanService(db)
        
        # Convert to schema objects
        from app.models.schemas import MealPlanCreate, WeeklyMealPlan, ShoppingListItem
        
        weekly_plan = [WeeklyMealPlan(**day) for day in plan_data["weekly_plan"]]
        shopping_list = [ShoppingListItem(**item) for item in plan_data["shopping_list"]]
        
        meal_plan_create = MealPlanCreate(
            plan_mode=request.mode,
            weekly_plan=weekly_plan,
            shopping_list=shopping_list
        )
        
        db_plan = meal_service.create_meal_plan(meal_plan_create)
        
        return MobileResponse(
            success=True,
            data={
                "plan_id": db_plan.id,
                "weekly_plan": plan_data["weekly_plan"],
                "shopping_list": plan_data["shopping_list"],
                "created_at": db_plan.created_at.isoformat(),
                "mode": request.mode
            }
        )
        
    except Exception as e:
        return MobileResponse(
            success=False,
            message=f"Failed to generate meal plan: {str(e)}",
            error_code="GENERATION_FAILED"
        )


@router.get("/plan/{plan_id}", response_model=MobileResponse)
async def get_plan_details(
    plan_id: int,
    db: Session = Depends(get_db)
):
    """
    Get detailed meal plan by ID.
    """
    try:
        meal_service = MealPlanService(db)
        plan = meal_service.get_plan_by_id(plan_id)
        
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
        
        return MobileResponse(
            success=True,
            data={
                "id": plan.id,
                "mode": plan.plan_mode,
                "weekly_plan": plan.weekly_plan,
                "shopping_list": plan.shopping_list,
                "created_at": plan.created_at.isoformat()
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        return MobileResponse(
            success=False,
            message=f"Failed to get plan: {str(e)}",
            error_code="PLAN_NOT_FOUND"
        )


@router.post("/plan/{plan_id}/feedback", response_model=MobileResponse)
async def submit_plan_feedback(
    plan_id: int,
    feedback: str,
    user_email: str = "guest@mobile.app",  # In real app, get from auth
    db: Session = Depends(get_db)
):
    """
    Submit user feedback for a plan (like/dislike).
    """
    try:
        user_service = UserService(db)
        meal_service = MealPlanService(db)
        
        # Get or create user
        user = user_service.get_or_create_user(user_email)
        
        # Update feedback
        success = meal_service.update_plan_feedback(plan_id, user.id, feedback)
        
        if success:
            return MobileResponse(
                success=True,
                data={"feedback": feedback, "plan_id": plan_id}
            )
        else:
            return MobileResponse(
                success=False,
                message="Failed to submit feedback",
                error_code="FEEDBACK_FAILED"
            )
            
    except Exception as e:
        return MobileResponse(
            success=False,
            message=f"Failed to submit feedback: {str(e)}",
            error_code="FEEDBACK_ERROR"
        )


@router.get("/popular/{mode}", response_model=MobileResponse)
async def get_popular_plans(
    mode: str,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Get popular plans for a specific mode.
    """
    try:
        meal_service = MealPlanService(db)
        popular_plans = meal_service.get_popular_plans(mode, limit)
        
        plans_data = []
        for plan in popular_plans:
            plans_data.append({
                "id": plan.id,
                "created_at": plan.created_at.isoformat(),
                "preview": f"{plan.weekly_plan[0]['breakfast'][:30]}..." if plan.weekly_plan else "Popular plan"
            })
        
        return MobileResponse(
            success=True,
            data={"popular_plans": plans_data, "mode": mode}
        )
        
    except Exception as e:
        return MobileResponse(
            success=False,
            message=f"Failed to get popular plans: {str(e)}",
            error_code="POPULAR_PLANS_ERROR"
        )


@router.get("/shopping-list/{plan_id}", response_model=MobileResponse)
async def get_shopping_list(
    plan_id: int,
    db: Session = Depends(get_db)
):
    """
    Get shopping list for a specific plan (mobile optimized).
    """
    try:
        meal_service = MealPlanService(db)
        plan = meal_service.get_plan_by_id(plan_id)
        
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
        
        # Group shopping list by category for mobile
        categorized_list = {}
        for item in plan.shopping_list:
            category = item.get("category", "Other")
            if category not in categorized_list:
                categorized_list[category] = []
            categorized_list[category].append(item)
        
        return MobileResponse(
            success=True,
            data={
                "plan_id": plan_id,
                "shopping_list": plan.shopping_list,
                "categorized_list": categorized_list,
                "total_items": len(plan.shopping_list)
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        return MobileResponse(
            success=False,
            message=f"Failed to get shopping list: {str(e)}",
            error_code="SHOPPING_LIST_ERROR"
        )