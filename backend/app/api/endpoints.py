from fastapi import APIRouter
from app.services.data_service import data_service

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SafeRoad Analytics API",
        "district": "Madurai, Tamil Nadu, India",
        "version": "1.0.0"
    }

@router.get("/datasets/inventory")
def list_datasets():
    return {
        "status": "success",
        "inventory": data_service.get_inventory()
    }
