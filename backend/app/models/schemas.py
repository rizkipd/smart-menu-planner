from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime


# Meal Plan Schemas
class WeeklyMealPlan(BaseModel):
    day: str
    breakfast: str
    lunch: str
    dinner: str


class ShoppingListItem(BaseModel):
    ingredient: str
    quantity: str
    category: Optional[str] = None


class MealPlanCreate(BaseModel):
    plan_mode: str  # Diet, Satisfaction, Economic
    weekly_plan: List[WeeklyMealPlan]
    shopping_list: List[ShoppingListItem]


class MealPlanResponse(BaseModel):
    id: int
    plan_mode: str
    weekly_plan: List[WeeklyMealPlan]
    shopping_list: List[ShoppingListItem]
    created_at: datetime
    
    class Config:
        from_attributes = True


# User Schemas
class UserCreate(BaseModel):
    email: EmailStr


class UserResponse(BaseModel):
    id: int
    email: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# Plan Variation Schemas
class PlanVariationCreate(BaseModel):
    plan_id: int
    feedback: str = "neutral"


class PlanVariationResponse(BaseModel):
    id: int
    plan_id: int
    user_id: int
    feedback: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# Mobile API Response Schemas
class MobileResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    message: Optional[str] = None
    error_code: Optional[str] = None


class PlanModeSelection(BaseModel):
    mode: str  # Diet, Satisfaction, Economic


class GeneratePlanRequest(BaseModel):
    mode: str
    preferences: Optional[Dict[str, Any]] = None  # allergies, budget, people count, etc.