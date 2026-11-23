from fastapi import APIRouter
from app.services.data_loader import data_loader
from app.services.data_validation import data_validation_service
from app.api.routes import (
    dashboard_router,
    trends_router,
    severity_router,
    road_analysis_router,
    vehicle_analysis_router,
    hit_and_run_router,
    reports_router,
    safety_tips_router,
    gis_router,
    upload_router,
)

router = APIRouter()

# System & Meta endpoints
@router.get("/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "service": "SafeRoad Analytics API",
        "district": "Madurai District, Tamil Nadu, India",
        "version": "1.0.0"
    }

@router.get("/datasets/inventory", tags=["System"])
def get_dataset_inventory():
    return {
        "status": "success",
        "inventory": data_loader.get_inventory_summary()
    }

@router.get("/datasets/validation", tags=["System"])
def get_dataset_validation():
    return {
        "status": "success",
        "validation_report": data_validation_service.run_full_validation()
    }

# Include all modular feature routers
router.include_router(dashboard_router)
router.include_router(trends_router)
router.include_router(severity_router)
router.include_router(road_analysis_router)
router.include_router(vehicle_analysis_router)
router.include_router(hit_and_run_router)
router.include_router(reports_router)
router.include_router(safety_tips_router)
router.include_router(gis_router)
router.include_router(upload_router)
