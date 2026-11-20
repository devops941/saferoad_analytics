from fastapi import APIRouter
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/vehicles", tags=["Vehicle Analysis"])

@router.get("/distribution")
def get_vehicle_distribution():
    """
    Returns accident and fatality distribution across vehicle types
    (Two-Wheelers, Cars/LMVs, Buses, Trucks, Auto-Rickshaws, Other Vehicles).
    """
    return analytics_service.get_vehicle_analysis()

@router.get("/vulnerability")
def get_vehicle_vulnerability():
    """
    Returns crash share vs fatality risk by vehicle type.
    """
    analysis = analytics_service.get_vehicle_analysis()
    return {
        "district": analysis["district"],
        "period": analysis["period"],
        "categories": [
            {
                "vehicle_type": c["label"],
                "accidents": c["accidents"],
                "fatalities": c["fatalities"],
                "accidents_share": c["accidents_share"],
                "fatalities_share": c["fatalities_share"],
                "fatality_rate_per_crash": c["fatality_rate_per_crash"]
            }
            for c in analysis["categories"]
        ],
        "highest_vulnerable_vehicle": analysis["highest_vulnerable_vehicle"],
        "highest_lethal_vehicle": analysis["highest_lethal_vehicle"]
    }
