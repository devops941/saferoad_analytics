from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.trends import router as trends_router
from app.api.routes.severity import router as severity_router
from app.api.routes.road_analysis import router as road_analysis_router
from app.api.routes.vehicle_analysis import router as vehicle_analysis_router
from app.api.routes.hit_and_run import router as hit_and_run_router
from app.api.routes.reports import router as reports_router
from app.api.routes.safety_tips import router as safety_tips_router
from app.api.routes.gis import router as gis_router
from app.api.routes.upload import router as upload_router

__all__ = [
    "dashboard_router",
    "trends_router",
    "severity_router",
    "road_analysis_router",
    "vehicle_analysis_router",
    "hit_and_run_router",
    "reports_router",
    "safety_tips_router",
    "gis_router",
    "upload_router",
]
