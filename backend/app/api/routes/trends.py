from fastapi import APIRouter, Query, HTTPException
from typing import Optional
import pandas as pd
from app.services.analytics_service import analytics_service
from app.services.data_loader import data_loader

router = APIRouter(prefix="/trends", tags=["Trends"])

@router.get("/year-wise")
def get_year_wise_trends():
    """
    Returns multi-year annual trends (2021 to 2024) for Madurai District
    along with Tamil Nadu state total benchmark comparisons.
    """
    return analytics_service.get_trends_analysis()

@router.get("/districts-comparison")
def get_districts_comparison(year: int = 2024):
    """
    Compares Madurai with other Tamil Nadu districts for a selected year (2021-2024).
    """
    # Safe integer parsing
    try:
        year_num = int(year)
    except (ValueError, TypeError):
        year_num = 2024

    if year_num not in [2021, 2022, 2023, 2024]:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid year '{year}'. Supported comparison years are 2021, 2022, 2023, 2024."
        )

    if year_num == 2024:
        df = data_loader.get_df("severity_2024")
        records = []
        for _, row in df[df["District"].str.upper() != "TOTAL"].iterrows():
            records.append({
                "district": row["District"],
                "accidents": int(row["Total_Accidents"]),
                "fatalities": int(row["Fatal_Persons_Killed"]),
                "severity_rate": round(int(row["Fatal_Persons_Killed"]) / int(row["Total_Accidents"]) * 100, 2) if int(row["Total_Accidents"]) > 0 else 0.0
            })
    else:
        df = data_loader.get_df("districts_2021_2023")
        records = []
        for _, row in df[df["District"].str.upper() != "TOTAL"].iterrows():
            acc = row.get(f"Total Accidents {year_num}")
            deaths = row.get(f"Total Deaths {year_num}")
            try:
                acc_val = int(float(acc)) if acc != "NA" and pd.notna(acc) else 0
                death_val = int(float(deaths)) if deaths != "NA" and pd.notna(deaths) else 0
            except:
                acc_val, death_val = 0, 0
            records.append({
                "district": row["District"],
                "accidents": acc_val,
                "fatalities": death_val,
                "severity_rate": round(death_val / acc_val * 100, 2) if acc_val > 0 else 0.0
            })
    
    # Sort by accidents descending
    records_sorted = sorted(records, key=lambda x: x["accidents"], reverse=True)
    return {
        "year": year_num,
        "total_districts": len(records_sorted),
        "rankings": records_sorted
    }
