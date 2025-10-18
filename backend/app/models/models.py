from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.session import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    plan_variations = relationship("PlanVariation", back_populates="user")
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}')>"


class MealPlan(Base):
    __tablename__ = "meal_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    plan_mode = Column(String, nullable=False)  # Diet, Satisfaction, Economic
    weekly_plan = Column(JSON, nullable=False)  # 7-day meal plan structure
    shopping_list = Column(JSON, nullable=False)  # Shopping list items
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    variations = relationship("PlanVariation", back_populates="meal_plan")
    
    def __repr__(self):
        return f"<MealPlan(id={self.id}, mode='{self.plan_mode}')>"


class PlanVariation(Base):
    __tablename__ = "plan_variations"
    
    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("meal_plans.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    feedback = Column(String, default="neutral")  # like, dislike, neutral
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    meal_plan = relationship("MealPlan", back_populates="variations")
    user = relationship("User", back_populates="plan_variations")
    
    def __repr__(self):
        return f"<PlanVariation(id={self.id}, plan_id={self.plan_id}, feedback='{self.feedback}')>"


class Ingredient(Base):
    __tablename__ = "ingredients"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    unit = Column(String, nullable=False)  # kg, pcs, liters, etc.
    category = Column(String, nullable=False)  # protein, vegetable, grain, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<Ingredient(id={self.id}, name='{self.name}', unit='{self.unit}')>"