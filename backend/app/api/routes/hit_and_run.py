from fastapi import APIRouter
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/hit-and-run", tags=["Hit and Run"])

@router.get("/comparison")
def get_hit_and_run_comparison():
    """
    Returns comparative hit-and-run statistics for Madurai District (Rural Police)
    versus Madurai City Police Commissionerate.
    """
    return analytics_service.get_hit_and_run_analysis()
