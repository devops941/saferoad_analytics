from fastapi import APIRouter, Query
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/severity", tags=["Accident Severity"])

@router.get("/breakdown")
def get_severity_breakdown(period: str = Query(default="2024", pattern="^(2024|2025_q1)$")):
    """
    Returns breakdown of crashes into Fatal, Grievous Injury, Minor Injury,
    and Non-Injury categories for either 2024 (Full Year) or 2025 Q1.
    """
    return analytics_service.get_severity_analysis(period=period)

@router.get("/casualty-impact")
def get_casualty_impact():
    """
    Returns casualty distributions (Persons Killed vs Grievous vs Minor Injuries).
    """
    sev24 = analytics_service.get_severity_analysis("2024")
    sev25 = analytics_service.get_severity_analysis("2025_q1")
    return {
        "district": "Madurai District",
        "period_2024": sev24["casualty_distribution"],
        "period_2025_q1": sev25["casualty_distribution"],
        "state_comparison_2024": sev24["state_comparison"]
    }
