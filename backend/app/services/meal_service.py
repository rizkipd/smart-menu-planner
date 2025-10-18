from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.models.models import MealPlan, PlanVariation, User, Ingredient
from app.models.schemas import MealPlanCreate, PlanVariationCreate
from typing import List, Optional, Dict, Any
import json


class MealPlanService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_existing_plans(self, mode: str, limit: int = 5) -> List[MealPlan]:
        """
        Get existing meal plans for a given mode to show to user before generating new ones.
        """
        return self.db.query(MealPlan)\
                      .filter(MealPlan.plan_mode == mode)\
                      .order_by(MealPlan.created_at.desc())\
                      .limit(limit)\
                      .all()
    
    def create_meal_plan(self, plan_data: MealPlanCreate) -> MealPlan:
        """
        Create a new meal plan in the database.
        """
        # Convert to dict for JSON storage
        weekly_plan_dict = [meal.dict() for meal in plan_data.weekly_plan]
        shopping_list_dict = [item.dict() for item in plan_data.shopping_list]
        
        db_plan = MealPlan(
            plan_mode=plan_data.plan_mode,
            weekly_plan=weekly_plan_dict,
            shopping_list=shopping_list_dict
        )
        
        self.db.add(db_plan)
        self.db.commit()
        self.db.refresh(db_plan)
        
        return db_plan
    
    def get_plan_by_id(self, plan_id: int) -> Optional[MealPlan]:
        """Get a specific meal plan by ID."""
        return self.db.query(MealPlan).filter(MealPlan.id == plan_id).first()
    
    def create_plan_variation(self, variation_data: PlanVariationCreate, user_id: int) -> PlanVariation:
        """
        Create a plan variation (when user selects or rates a plan).
        """
        db_variation = PlanVariation(
            plan_id=variation_data.plan_id,
            user_id=user_id,
            feedback=variation_data.feedback
        )
        
        self.db.add(db_variation)
        self.db.commit()
        self.db.refresh(db_variation)
        
        return db_variation
    
    def get_popular_plans(self, mode: str, limit: int = 10) -> List[MealPlan]:
        """
        Get popular plans based on user feedback.
        """
        # Get plans with positive feedback
        popular_plan_ids = self.db.query(PlanVariation.plan_id)\
                                 .filter(PlanVariation.feedback == "like")\
                                 .group_by(PlanVariation.plan_id)\
                                 .order_by(PlanVariation.created_at.desc())\
                                 .limit(limit)\
                                 .all()
        
        plan_ids = [pid[0] for pid in popular_plan_ids]
        
        if not plan_ids:
            # Fallback to recent plans if no liked plans
            return self.get_existing_plans(mode, limit)
        
        return self.db.query(MealPlan)\
                      .filter(and_(MealPlan.id.in_(plan_ids), MealPlan.plan_mode == mode))\
                      .all()
    
    def search_plans_by_ingredients(self, ingredients: List[str], mode: str = None) -> List[MealPlan]:
        """
        Search meal plans that contain specific ingredients.
        """
        query = self.db.query(MealPlan)
        
        if mode:
            query = query.filter(MealPlan.plan_mode == mode)
        
        # Search in shopping lists for the ingredients
        matching_plans = []
        for plan in query.all():
            plan_ingredients = [item["ingredient"].lower() for item in plan.shopping_list]
            if any(ingredient.lower() in plan_ingredients for ingredient in ingredients):
                matching_plans.append(plan)
        
        return matching_plans
    
    def update_plan_feedback(self, plan_id: int, user_id: int, feedback: str) -> bool:
        """
        Update user feedback for a plan.
        """
        variation = self.db.query(PlanVariation)\
                          .filter(and_(PlanVariation.plan_id == plan_id, 
                                     PlanVariation.user_id == user_id))\
                          .first()
        
        if variation:
            variation.feedback = feedback
            self.db.commit()
            return True
        else:
            # Create new variation if it doesn't exist
            new_variation = PlanVariation(
                plan_id=plan_id,
                user_id=user_id,
                feedback=feedback
            )
            self.db.add(new_variation)
            self.db.commit()
            return True


class UserService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_or_create_user(self, email: str) -> User:
        """Get existing user or create new one."""
        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            user = User(email=email)
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)
        return user
    
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        return self.db.query(User).filter(User.id == user_id).first()


class IngredientService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_ingredient(self, name: str, unit: str, category: str) -> Ingredient:
        """Create a new ingredient."""
        ingredient = Ingredient(name=name, unit=unit, category=category)
        self.db.add(ingredient)
        self.db.commit()
        self.db.refresh(ingredient)
        return ingredient
    
    def get_all_ingredients(self) -> List[Ingredient]:
        """Get all ingredients."""
        return self.db.query(Ingredient).order_by(Ingredient.name).all()
    
    def search_ingredients(self, query: str) -> List[Ingredient]:
        """Search ingredients by name."""
        return self.db.query(Ingredient)\
                      .filter(Ingredient.name.ilike(f"%{query}%"))\
                      .all()