from fastapi import APIRouter
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/roads", tags=["Road Analysis"])

@router.get("/distribution")
def get_road_distribution():
    """
    Returns accident and fatality distributions across road categories
    (NHAI NH, State PWD NH, State Highways, District Roads, Village Roads, Other Roads).
    """
    return analytics_service.get_road_analysis()

@router.get("/lethality")
def get_road_lethality():
    """
    Returns lethality comparisons (Fatalities per accident) by road type.
    """
    analysis = analytics_service.get_road_analysis()
    return {
        "district": analysis["district"],
        "period": analysis["period"],
        "categories": [
            {
                "road_type": c["label"],
                "accidents": c["accidents"],
                "fatalities": c["fatalities"],
                "lethality_rate": c["lethality_rate"]
            }
            for c in analysis["categories"]
        ],
        "highest_risk_road": analysis["highest_risk_road"]
    }
