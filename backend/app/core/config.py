from pydantic_settings import BaseSettings
from typing import List, Optional
import os


class Settings(BaseSettings):
    # API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Smart Menu Planner"
    
    # OpenAI
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-3.5-turbo"
    
    # Database
    DATABASE_URL: str = "sqlite:///./smart_menu_planner.db"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Mobile API settings
    MOBILE_API_VERSION: str = "v1"
    MAX_MOBILE_REQUEST_SIZE: int = 10 * 1024 * 1024  # 10MB for mobile uploads
    
    class Config:
        env_file = "../.env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields in .env


settings = Settings()