import os
import pandas as pd
from typing import Dict, Any, Optional
from app.core.config import DATA_DIR

class DataService:
    """
    Central Data Access Service for SafeRoad Analytics.
    Loads and provides read-only, validated access to official accident datasets.
    """
    def __init__(self):
        self.data_dir = DATA_DIR
        self._cache: Dict[str, pd.DataFrame] = {}
        self._preload_datasets()

    def _preload_datasets(self):
        files = {
            "districts_2021_2023": "tamilnadu_district_accidents_deaths_2021_2023.csv",
            "severity_2024": "tamilnadu_accident_severity_2024.csv",
            "madurai_severity_2024": "madurai_accident_severity_2024.csv",
            "severity_2025_q1": "tamilnadu_accident_severity_2025_q1.csv",
            "madurai_severity_2025_q1": "madurai_accident_severity_2025_q1.csv",
            "road_wise_2025_q1": "tamilnadu_road_wise_accidents_fatalities_2025_q1.csv",
            "madurai_road_wise_2025_q1": "madurai_road_wise_accidents_fatalities_2025_q1.csv",
            "vehicle_wise_2025_q1": "tamilnadu_vehicle_wise_accidents_fatalities_2025_q1.csv",
            "madurai_vehicle_wise_2025_q1": "madurai_vehicle_wise_accidents_fatalities_2025_q1.csv",
            "hit_and_run": "madurai_hit_and_run.csv",
        }
        for key, fname in files.items():
            path = self.data_dir / fname
            if path.exists():
                self._cache[key] = pd.read_csv(path)

    def get_dataset(self, key: str) -> Optional[pd.DataFrame]:
        return self._cache.get(key)

    def get_inventory(self) -> Dict[str, Any]:
        inventory = {}
        for key, df in self._cache.items():
            inventory[key] = {
                "records": len(df),
                "columns": list(df.columns),
                "null_count": int(df.isnull().sum().sum())
            }
        return inventory

# Singleton instance
data_service = DataService()
