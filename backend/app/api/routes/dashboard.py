from fastapi import APIRouter
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary")
def get_dashboard_summary():
    """
    Returns full dashboard summary including 2024 KPIs, 2025 Q1 KPIs,
    quick severity overview, and YoY comparison metadata.
    """
    return analytics_service.get_dashboard_summary()

@router.get("/kpis")
def get_dashboard_kpis():
    """
    Returns isolated KPI cards for 2024 full year and 2025 Q1 provisional.
    """
    summary = analytics_service.get_dashboard_summary()
    return {
        "district": summary["district"],
        "kpis_2024": summary["kpis_2024"],
        "kpis_2025_q1": summary["kpis_2025_q1"]
    }
