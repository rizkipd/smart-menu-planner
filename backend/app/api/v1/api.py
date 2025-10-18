from fastapi import APIRouter
from app.api.v1.endpoints import mobile

api_router = APIRouter()

# Mobile app endpoints
api_router.include_router(
    mobile.router, 
    prefix="/mobile", 
    tags=["mobile"]
)