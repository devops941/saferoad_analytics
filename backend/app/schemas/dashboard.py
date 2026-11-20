from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Union

class KPICard(BaseModel):
    title: str
    value: Union[int, float, str]
    subtitle: Optional[str] = None
    change_percentage: Optional[float] = None
    is_positive_change: Optional[bool] = None
    trend_direction: Optional[str] = None
    period: str
    badge: Optional[str] = None

class DashboardSummaryResponse(BaseModel):
    district: str
    state: str
    kpis_2024: List[Dict[str, Any]]
    kpis_2025_q1: List[Dict[str, Any]]
    quick_severity_2024: Dict[str, Any]
    quick_trend_summary: Dict[str, Any]
    metadata: Dict[str, Any]
