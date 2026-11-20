import json
import os
from pathlib import Path
from fastapi import APIRouter, HTTPException
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/gis", tags=["GIS Road Network"])

GIS_DATA_DIR = Path(__file__).resolve().parents[3] / "data" / "gis"

def load_geojson(filename: str):
    file_path = GIS_DATA_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"GIS file {filename} not found.")
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/road-network")
def get_road_network():
    """
    Returns verified GeoJSON FeatureCollection of Madurai District major road network
    categorized by road classification (NH, SH, MDR, Village Roads).
    """
    return load_geojson("madurai_road_network.geojson")

@router.get("/district-boundary")
def get_district_boundary():
    """
    Returns verified GeoJSON FeatureCollection of Madurai District administrative boundary.
    """
    return load_geojson("madurai_district_boundary.geojson")

@router.get("/overview")
def get_gis_overview():
    """
    Combines verified road geometry metadata with official Q1 2025 road accident
    and fatality statistics from SCRB / Highways department.
    """
    road_analysis = analytics_service.get_road_analysis()
    network_geojson = load_geojson("madurai_road_network.geojson")
    features = network_geojson.get("features", [])

    total_mapped_km = round(
        sum(f["properties"].get("length_in_district_km", 0) for f in features), 1
    )

    # Correlate category-wise counts with road statistics
    category_meta = {
        "nh_nhai": {
            "name": "National Highway (NHAI)",
            "mapped_corridors": [f["properties"]["ref"] for f in features if f["properties"]["category_key"] == "nh_nhai"],
            "color": "#dc2626",
            "lanes": "4-6 Lanes",
        },
        "nh_state_pwd": {
            "name": "National Highway (State PWD)",
            "mapped_corridors": [f["properties"]["ref"] for f in features if f["properties"]["category_key"] == "nh_state_pwd"],
            "color": "#ea580c",
            "lanes": "2-4 Lanes",
        },
        "state_highway": {
            "name": "State Highway",
            "mapped_corridors": [f["properties"]["ref"] for f in features if f["properties"]["category_key"] == "state_highway"],
            "color": "#f59e0b",
            "lanes": "2-4 Lanes",
        },
        "district_road": {
            "name": "Major District Road",
            "mapped_corridors": [f["properties"]["ref"] for f in features if f["properties"]["category_key"] == "district_road"],
            "color": "#2563eb",
            "lanes": "2 Lanes",
        },
        "village_road": {
            "name": "Village Road & Others",
            "mapped_corridors": [f["properties"]["ref"] for f in features if f["properties"]["category_key"] in ["village_road", "other_roads"]],
            "color": "#059669",
            "lanes": "Single Lane Paved",
        },
    }

    return {
        "status": "success",
        "district": "Madurai District",
        "state": "Tamil Nadu",
        "center_coordinates": [9.9252, 78.1198],
        "default_zoom": 10,
        "total_mapped_corridors": len(features),
        "total_mapped_corridors_km": total_mapped_km,
        "reporting_period": road_analysis["period"],
        "road_statistics": road_analysis["categories"],
        "highest_risk_road": road_analysis["highest_risk_road"],
        "category_metadata": category_meta,
        "data_integrity_notice": {
            "is_micro_level_gps": False,
            "statement": "Mapped lines represent verified administrative road network centerlines. In accordance with DATA_AVAILABILITY_REPORT.md, individual collision coordinates (micro-level incident spots) are NOT plotted because published SCRB/MoRTH government reports provide district-level aggregates only. Mapped geometry and crash counts are strictly separated."
        }
    }
