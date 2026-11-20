"""
Data Loader Service for SafeRoad Analytics.
Loads and caches verified CSV datasets from backend/data/.
Ensures read-only access and safe type handling.
"""
import pandas as pd
from pathlib import Path
from typing import Dict, Any, Optional, List
from app.core.config import DATA_DIR
from app.utils.constants import DISTRICT_FOCUS

class DataLoader:
    def __init__(self):
        self.data_dir: Path = DATA_DIR
        self._cache: Dict[str, pd.DataFrame] = {}
        self.reload_all()

    def reload_all(self):
        """Loads and prepares all datasets into memory."""
        self._cache = {
            "districts_2021_2023": self._load_csv("tamilnadu_district_accidents_deaths_2021_2023.csv"),
            "severity_2024": self._load_csv("tamilnadu_accident_severity_2024.csv"),
            "madurai_severity_2024": self._load_csv("madurai_accident_severity_2024.csv"),
            "severity_2025_q1": self._load_csv("tamilnadu_accident_severity_2025_q1.csv"),
            "madurai_severity_2025_q1": self._load_csv("madurai_accident_severity_2025_q1.csv"),
            "road_wise_2025_q1": self._load_csv("tamilnadu_road_wise_accidents_fatalities_2025_q1.csv"),
            "madurai_road_wise_2025_q1": self._load_csv("madurai_road_wise_accidents_fatalities_2025_q1.csv"),
            "vehicle_wise_2025_q1": self._load_csv("tamilnadu_vehicle_wise_accidents_fatalities_2025_q1.csv"),
            "madurai_vehicle_wise_2025_q1": self._load_csv("madurai_vehicle_wise_accidents_fatalities_2025_q1.csv"),
            "hit_and_run": self._load_csv("madurai_hit_and_run.csv"),
        }

    def _load_csv(self, filename: str) -> pd.DataFrame:
        path = self.data_dir / filename
        if not path.exists():
            raise FileNotFoundError(f"Dataset file missing: {path}")
        df = pd.read_csv(path)
        # Strip string columns
        for col in df.select_dtypes(include=["object"]).columns:
            df[col] = df[col].astype(str).str.strip()
        return df

    def get_df(self, key: str) -> pd.DataFrame:
        if key not in self._cache:
            raise KeyError(f"Dataset key '{key}' not found in DataLoader cache.")
        return self._cache[key].copy()

    def get_madurai_row(self, df: pd.DataFrame, col_name: str = "District") -> Optional[pd.Series]:
        """Finds Madurai row case-insensitively."""
        matches = df[df[col_name].str.upper() == DISTRICT_FOCUS]
        if not matches.empty:
            return matches.iloc[0]
        return None

    def get_state_total_row(self, df: pd.DataFrame, col_name: str = "District") -> pd.Series:
        """Finds Total row if present, otherwise computes column sums for all districts."""
        matches = df[df[col_name].str.upper() == "TOTAL"]
        if not matches.empty:
            return matches.iloc[0]

        # Compute dynamic sum across numeric columns
        tot_dict: Dict[str, Any] = {col_name: "TOTAL"}
        for c in df.columns:
            if c != col_name:
                try:
                    tot_dict[c] = pd.to_numeric(df[c], errors="coerce").sum()
                except Exception:
                    tot_dict[c] = 0
        return pd.Series(tot_dict)

    def get_all_districts(self) -> List[str]:
        """Returns sorted list of all unique districts from 2024 dataset."""
        df = self._cache["severity_2024"]
        districts = [d for d in df["District"].unique() if d.upper() != "TOTAL"]
        return sorted(districts)

    def get_inventory_summary(self) -> Dict[str, Any]:
        """Returns summary of all datasets."""
        summary = {}
        for key, df in self._cache.items():
            summary[key] = {
                "records": len(df),
                "columns": list(df.columns),
                "null_cells": int(df.isnull().sum().sum())
            }
        return summary

# Global singleton
data_loader = DataLoader()
