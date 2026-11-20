from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class YearTrendPoint(BaseModel):
    year: int
    accidents: int
    fatalities: int
    severity_rate: float
    yoy_accident_growth: Optional[float] = None
    yoy_fatality_growth: Optional[float] = None

class TrendResponse(BaseModel):
    district: str
    series: List[YearTrendPoint]
    state_benchmark_series: List[Dict[str, Any]]
    q1_2025_snapshot: Dict[str, Any]
    insights: List[str]

class SeverityItem(BaseModel):
    category: str
    label: str
    accidents: int
    accidents_share: float
    fatalities: int
    injuries: int
    color: str

class SeverityResponse(BaseModel):
    district: str
    period: str
    total_accidents: int
    total_fatalities: int
    total_injuries: int
    severity_rate: float
    categories: List[SeverityItem]
    casualty_distribution: Dict[str, Any]
    state_comparison: Dict[str, Any]

class RoadCategoryItem(BaseModel):
    key: str
    label: str
    accidents: int
    accidents_share: float
    fatalities: int
    fatalities_share: float
    lethality_rate: float

class RoadAnalysisResponse(BaseModel):
    district: str
    period: str
    total_accidents: int
    total_fatalities: int
    categories: List[RoadCategoryItem]
    highest_risk_road: Dict[str, Any]
    key_findings: List[str]

class VehicleCategoryItem(BaseModel):
    key: str
    label: str
    accidents: int
    accidents_share: float
    fatalities: int
    fatalities_share: float
    fatality_rate_per_crash: float

class VehicleAnalysisResponse(BaseModel):
    district: str
    period: str
    total_accidents: int
    total_fatalities: int
    categories: List[VehicleCategoryItem]
    highest_vulnerable_vehicle: Dict[str, Any]
    highest_lethal_vehicle: Dict[str, Any]
    key_findings: List[str]

class HitAndRunComparisonItem(BaseModel):
    id: int
    jurisdiction_name: str
    jurisdiction_type: str
    total_accidents: int
    total_victims: int
    total_rate: float
    hit_and_run_accidents: int
    hit_and_run_victims: int
    hit_and_run_rate: float
    hit_and_run_percentage: float
    other_accidents: int
    other_victims: int
    other_rate: float

class HitAndRunResponse(BaseModel):
    comparison: List[HitAndRunComparisonItem]
    rural_vs_city_insights: List[str]
    notes: str
