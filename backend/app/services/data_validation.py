"""
Data Validation Service for SafeRoad Analytics.
Verifies dataset integrity, schema compliance, and arithmetic consistency.
"""
from typing import Dict, Any, List
from app.services.data_loader import data_loader
from app.utils.constants import DISTRICT_FOCUS

class DataValidationService:
    @staticmethod
    def run_full_validation() -> Dict[str, Any]:
        results: Dict[str, Any] = {
            "status": "VALID",
            "datasets_checked": 0,
            "checks_passed": 0,
            "warnings": [],
            "dataset_details": {}
        }

        # 1. Check datasets presence
        datasets = [
            "districts_2021_2023",
            "severity_2024",
            "madurai_severity_2024",
            "severity_2025_q1",
            "madurai_severity_2025_q1",
            "road_wise_2025_q1",
            "madurai_road_wise_2025_q1",
            "vehicle_wise_2025_q1",
            "madurai_vehicle_wise_2025_q1",
            "hit_and_run"
        ]

        for key in datasets:
            try:
                df = data_loader.get_df(key)
                results["datasets_checked"] += 1
                null_count = int(df.isnull().sum().sum())
                dup_count = int(df.duplicated().sum())

                details = {
                    "shape": list(df.shape),
                    "columns": list(df.columns),
                    "null_count": null_count,
                    "duplicate_count": dup_count,
                    "status": "OK"
                }

                if key == "districts_2021_2023" and null_count > 0:
                    details["note"] = "Mayiladuthurai 2021 NA due to district bifurcation on 28-Dec-2020 (Valid government source record)."

                results["dataset_details"][key] = details
                results["checks_passed"] += 1
            except Exception as e:
                results["status"] = "ERROR"
                results["warnings"].append(f"Validation failed for {key}: {str(e)}")

        # 2. Arithmetic integrity for Madurai 2024
        df_sev24 = data_loader.get_df("madurai_severity_2024")
        if not df_sev24.empty:
            row = df_sev24.iloc[0]
            cat_sum = int(row["Fatal_Accidents"]) + int(row["Grievous_Accidents"]) + int(row["Minor_Accidents"]) + int(row["Non_Injury_Accidents"])
            tot = int(row["Total_Accidents"])
            if cat_sum == tot:
                results["checks_passed"] += 1
            else:
                results["warnings"].append(f"Madurai 2024 severity sum mismatch: {cat_sum} != {tot}")

        # 3. Arithmetic integrity for Madurai 2025 Q1 Road-Wise
        df_road25 = data_loader.get_df("madurai_road_wise_2025_q1")
        if not df_road25.empty:
            row = df_road25.iloc[0]
            road_sum = (
                int(row["NH_NHAI_Accidents"]) + int(row["NH_StatePWD_Accidents"]) +
                int(row["State_Highway_Accidents"]) + int(row["District_Road_Accidents"]) +
                int(row["Village_Road_Accidents"]) + int(row["Other_Roads_Accidents"])
            )
            tot = int(row["Total_Accidents"])
            if road_sum == tot:
                results["checks_passed"] += 1
            else:
                results["warnings"].append(f"Madurai 2025 Q1 road accidents sum mismatch: {road_sum} != {tot}")

        return results

data_validation_service = DataValidationService()
