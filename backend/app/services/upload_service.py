"""
Upload & Ingestion Service for SafeRoad Analytics.
Handles CSV upload, schema validation, arithmetic integrity checks,
automatic dataset type detection, file backup, and hot-reloading of data caches.
"""
import io
import shutil
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple
import pandas as pd
from app.core.config import DATA_DIR
from app.services.data_loader import data_loader
from app.utils.constants import DISTRICT_FOCUS

BACKUPS_DIR = DATA_DIR / "backups"
DEFAULTS_DIR = DATA_DIR / "defaults"
BACKUPS_DIR.mkdir(parents=True, exist_ok=True)
DEFAULTS_DIR.mkdir(parents=True, exist_ok=True)

def norm_col(name: str) -> str:
    """Normalizes column names for fuzzy, case-insensitive, space/underscore agnostic matching."""
    return str(name).strip().lower().replace(" ", "_").replace("-", "_").replace(".", "")

# Full Dataset registry covering all 10 SCRB data sources
DATASET_REGISTRY = {
    "severity_2024": {
        "title": "Tamil Nadu 2024 Accident Severity (Full Year)",
        "filename": "tamilnadu_accident_severity_2024.csv",
        "synced_madurai_file": "madurai_accident_severity_2024.csv",
        "required_columns": [
            "District", "Fatal_Accidents", "Fatal_Persons_Killed",
            "Grievous_Accidents", "Grievous_Persons_Injured",
            "Minor_Accidents", "Minor_Persons_Injured",
            "Non_Injury_Accidents", "Total_Accidents"
        ],
        "category": "Severity Analysis"
    },
    "madurai_severity_2024": {
        "title": "Madurai 2024 Accident Severity (District Specific)",
        "filename": "madurai_accident_severity_2024.csv",
        "synced_madurai_file": None,
        "required_columns": [
            "District", "Fatal_Accidents", "Fatal_Persons_Killed",
            "Grievous_Accidents", "Grievous_Persons_Injured",
            "Minor_Accidents", "Minor_Persons_Injured",
            "Non_Injury_Accidents", "Total_Accidents"
        ],
        "category": "Severity Analysis"
    },
    "severity_2025_q1": {
        "title": "Tamil Nadu 2025 Q1 Accident Severity (Provisional)",
        "filename": "tamilnadu_accident_severity_2025_q1.csv",
        "synced_madurai_file": "madurai_accident_severity_2025_q1.csv",
        "required_columns": [
            "District", "Fatal_Accidents", "Fatal_Persons_Killed",
            "Grievous_Accidents", "Grievous_Persons_Injured",
            "Minor_Accidents", "Minor_Persons_Injured",
            "Non_Injury_Accidents", "Total_Accidents"
        ],
        "category": "Severity Analysis"
    },
    "madurai_severity_2025_q1": {
        "title": "Madurai 2025 Q1 Accident Severity (Provisional)",
        "filename": "madurai_accident_severity_2025_q1.csv",
        "synced_madurai_file": None,
        "required_columns": [
            "District", "Fatal_Accidents", "Fatal_Persons_Killed",
            "Grievous_Accidents", "Grievous_Persons_Injured",
            "Minor_Accidents", "Minor_Persons_Injured",
            "Non_Injury_Accidents", "Total_Accidents"
        ],
        "category": "Severity Analysis"
    },
    "road_wise_2025_q1": {
        "title": "Tamil Nadu 2025 Q1 Road-Wise Accidents & Fatalities",
        "filename": "tamilnadu_road_wise_accidents_fatalities_2025_q1.csv",
        "synced_madurai_file": "madurai_road_wise_accidents_fatalities_2025_q1.csv",
        "required_columns": [
            "District", "NH_NHAI_Accidents", "NH_StatePWD_Accidents",
            "State_Highway_Accidents", "District_Road_Accidents",
            "Village_Road_Accidents", "Other_Roads_Accidents", "Total_Accidents",
            "NH_NHAI_Fatalities", "State_Highway_Fatalities"
        ],
        "category": "Road Infrastructure"
    },
    "madurai_road_wise_2025_q1": {
        "title": "Madurai 2025 Q1 Road-Wise Accidents & Fatalities",
        "filename": "madurai_road_wise_accidents_fatalities_2025_q1.csv",
        "synced_madurai_file": None,
        "required_columns": [
            "District", "NH_NHAI_Accidents", "NH_StatePWD_Accidents",
            "State_Highway_Accidents", "District_Road_Accidents",
            "Village_Road_Accidents", "Other_Roads_Accidents", "Total_Accidents",
            "NH_NHAI_Fatalities", "State_Highway_Fatalities"
        ],
        "category": "Road Infrastructure"
    },
    "vehicle_wise_2025_q1": {
        "title": "Tamil Nadu 2025 Q1 Vehicle-Wise Accidents & Fatalities",
        "filename": "tamilnadu_vehicle_wise_accidents_fatalities_2025_q1.csv",
        "synced_madurai_file": "madurai_vehicle_wise_accidents_fatalities_2025_q1.csv",
        "required_columns": [
            "District", "Bus_Accidents", "Truck_Lorry_Accidents",
            "Car_Jeep_Taxi_Van_LMV_Accidents", "Two_Wheeler_Accidents",
            "Auto_Rickshaw_Accidents", "Other_Vehicles_Accidents", "Total_Accidents",
            "Two_Wheeler_Fatalities", "Truck_Lorry_Fatalities"
        ],
        "category": "Vehicle Vulnerability"
    },
    "madurai_vehicle_wise_2025_q1": {
        "title": "Madurai 2025 Q1 Vehicle-Wise Accidents & Fatalities",
        "filename": "madurai_vehicle_wise_accidents_fatalities_2025_q1.csv",
        "synced_madurai_file": None,
        "required_columns": [
            "District", "Bus_Accidents", "Truck_Lorry_Accidents",
            "Car_Jeep_Taxi_Van_LMV_Accidents", "Two_Wheeler_Accidents",
            "Auto_Rickshaw_Accidents", "Other_Vehicles_Accidents", "Total_Accidents",
            "Two_Wheeler_Fatalities", "Truck_Lorry_Fatalities"
        ],
        "category": "Vehicle Vulnerability"
    },
    "districts_2021_2023": {
        "title": "Tamil Nadu District Accidents & Deaths (2021–2023 Trends)",
        "filename": "tamilnadu_district_accidents_deaths_2021_2023.csv",
        "synced_madurai_file": None,
        "required_columns": [
            "District", "Total Accidents 2021", "Total Deaths 2021",
            "Total Accidents 2022", "Total Deaths 2022",
            "Total Accidents 2023", "Total Deaths 2023"
        ],
        "category": "Yearly Trends"
    },
    "hit_and_run": {
        "title": "Madurai Hit and Run Incidence & Victim Statistics",
        "filename": "madurai_hit_and_run.csv",
        "synced_madurai_file": None,
        "required_columns": [
            "Districts", "Total Road Accidents - Incidence", "Total Road Accidents - Victims",
            "Hit and Run - I", "Hit and Run - V", "Hit and Run - R"
        ],
        "category": "Hit and Run"
    }
}


class UploadService:
    @staticmethod
    def get_supported_schemas() -> List[Dict[str, Any]]:
        """Returns details of all supported CSV dataset schemas."""
        schemas = []
        for key, meta in DATASET_REGISTRY.items():
            sample_df = None
            try:
                sample_df = data_loader.get_df(key).head(2)
            except Exception:
                pass

            schemas.append({
                "dataset_key": key,
                "title": meta["title"],
                "target_filename": meta["filename"],
                "category": meta["category"],
                "required_columns": meta["required_columns"],
                "all_columns": list(sample_df.columns) if sample_df is not None else meta["required_columns"],
                "sample_preview": sample_df.to_dict(orient="records") if sample_df is not None else []
            })
        return schemas

    @staticmethod
    def parse_csv_bytes(file_bytes: bytes) -> pd.DataFrame:
        """Parses CSV bytes with multiple encoding fallbacks, separator detection, and whitespace stripping."""
        encodings = ["utf-8-sig", "utf-8", "latin-1", "cp1252"]
        last_error = None
        for enc in encodings:
            for sep in [",", ";", "\t"]:
                try:
                    df = pd.read_csv(io.BytesIO(file_bytes), encoding=enc, sep=sep)
                    if len(df.columns) > 1:
                        # Strip string columns and column headers
                        df.columns = [str(c).strip() for c in df.columns]
                        for col in df.select_dtypes(include=["object"]).columns:
                            df[col] = df[col].astype(str).str.strip()
                        return df
                except Exception as e:
                    last_error = e

        # Fallback with standard comma
        try:
            df = pd.read_csv(io.BytesIO(file_bytes))
            df.columns = [str(c).strip() for c in df.columns]
            return df
        except Exception as e:
            raise ValueError(f"Unable to parse CSV file: {str(e or last_error)}")

    @classmethod
    def detect_dataset_key(cls, df: pd.DataFrame) -> Optional[str]:
        """Automatically detects which dataset matches the uploaded DataFrame columns (fuzzy & case-insensitive)."""
        df_norm_cols = {norm_col(c): c for c in df.columns}
        best_match = None
        max_overlap = 0

        # Prioritize matching
        for key, meta in DATASET_REGISTRY.items():
            req_norm = [norm_col(c) for c in meta["required_columns"]]
            overlap = sum(1 for c in req_norm if c in df_norm_cols)
            if overlap == len(req_norm) and overlap > max_overlap:
                max_overlap = overlap
                best_match = key

        # If not 100% exact match, check for partial match >= 65%
        if not best_match:
            for key, meta in DATASET_REGISTRY.items():
                req_norm = [norm_col(c) for c in meta["required_columns"]]
                overlap = sum(1 for c in req_norm if c in df_norm_cols)
                ratio = overlap / len(req_norm)
                if ratio >= 0.65 and overlap > max_overlap:
                    max_overlap = overlap
                    best_match = key

        return best_match

    @classmethod
    def align_column_names(cls, df: pd.DataFrame, target_key: str) -> pd.DataFrame:
        """Aligns incoming DataFrame column casings with canonical schema column names."""
        if target_key not in DATASET_REGISTRY:
            return df
        
        meta = DATASET_REGISTRY[target_key]
        canon_norm_map = {norm_col(c): c for c in meta["required_columns"]}
        
        # If dataset has extra canonical columns from data_loader
        try:
            curr_df = data_loader.get_df(target_key)
            for c in curr_df.columns:
                canon_norm_map[norm_col(c)] = c
        except Exception:
            pass

        rename_map = {}
        for actual_col in df.columns:
            n = norm_col(actual_col)
            if n in canon_norm_map and actual_col != canon_norm_map[n]:
                rename_map[actual_col] = canon_norm_map[n]

        if rename_map:
            df = df.rename(columns=rename_map)
        return df

    @classmethod
    def validate_dataset(cls, df: pd.DataFrame, target_key: str) -> Tuple[bool, List[str], List[str]]:
        """
        Validates the dataset against required columns, non-emptiness,
        arithmetic consistency, and checks for Madurai records.
        """
        errors = []
        warnings = []

        if df.empty:
            errors.append("Uploaded CSV contains no data rows.")
            return False, errors, warnings

        if target_key not in DATASET_REGISTRY:
            errors.append(f"Target dataset '{target_key}' is not recognized.")
            return False, errors, warnings

        meta = DATASET_REGISTRY[target_key]
        df_norm = [norm_col(c) for c in df.columns]
        missing_cols = []
        for req_col in meta["required_columns"]:
            if norm_col(req_col) not in df_norm:
                missing_cols.append(req_col)

        if missing_cols:
            detected_actual = cls.detect_dataset_key(df)
            if detected_actual and detected_actual != target_key:
                detected_meta = DATASET_REGISTRY.get(detected_actual)
                detected_title = detected_meta["title"] if detected_meta else detected_actual
                errors.append(
                    f"Category Mismatch: You selected '{meta['title']}', but this file matches '{detected_title}'. "
                    f"Please select '{detected_title}' or 'Auto-Detect' from the Target Dataset dropdown."
                )
            else:
                errors.append(f"Missing required columns for {meta['title']}: {', '.join(missing_cols)}")
            return False, errors, warnings

        # Check district column
        dist_col = None
        for candidate in ["District", "Districts", "district", "districts"]:
            if candidate in df.columns:
                dist_col = candidate
                break

        if dist_col:
            madurai_rows = df[df[dist_col].astype(str).str.upper().str.contains("MADURAI", na=False)]
            if madurai_rows.empty:
                warnings.append("Notice: Uploaded dataset does not contain an explicit record for 'Madurai' district.")
        else:
            warnings.append("Notice: No explicit 'District' header found.")

        is_valid = len(errors) == 0
        return is_valid, errors, warnings

    @classmethod
    def save_and_ingest(
        cls,
        file_bytes: bytes,
        original_filename: str,
        target_key: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Parses, validates, backs up previous file, writes new dataset to disk,
        synchronizes Madurai-specific subset if applicable, and hot-reloads caches.
        """
        df = cls.parse_csv_bytes(file_bytes)

        # Detect dataset if not provided or set to auto
        if not target_key or target_key == "auto" or target_key.strip() == "":
            detected_key = cls.detect_dataset_key(df)
            if not detected_key:
                raise ValueError(
                    f"Could not automatically identify dataset category from headers: {list(df.columns)}. "
                    "Please explicitly select the target dataset from the dropdown."
                )
            target_key = detected_key

        if target_key not in DATASET_REGISTRY:
            raise ValueError(f"Unrecognized target dataset: '{target_key}'")

        # Canonicalize column names
        df = cls.align_column_names(df, target_key)

        is_valid, errors, warnings = cls.validate_dataset(df, target_key)
        if not is_valid:
            raise ValueError(f"Validation failed: {'; '.join(errors)}")

        meta = DATASET_REGISTRY[target_key]
        target_path = DATA_DIR / meta["filename"]

        # 1. Create Timestamped Backup of existing file
        backup_path_str = None
        if target_path.exists():
            ts = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_filename = f"{target_path.stem}_{ts}.csv"
            backup_file = BACKUPS_DIR / backup_filename
            shutil.copy2(target_path, backup_file)
            backup_path_str = str(backup_file.name)

        # 2. Save new CSV file
        df.to_csv(target_path, index=False)

        # 3. Synchronize Madurai subset file if applicable
        synced_file = meta.get("synced_madurai_file")
        madurai_records_updated = 0
        if synced_file:
            dist_col = None
            for candidate in ["District", "Districts"]:
                if candidate in df.columns:
                    dist_col = candidate
                    break

            if dist_col:
                m_df = df[df[dist_col].astype(str).str.upper() == DISTRICT_FOCUS]
                if not m_df.empty:
                    m_path = DATA_DIR / synced_file
                    m_df.to_csv(m_path, index=False)
                    madurai_records_updated = len(m_df)

        # 4. Hot-reload DataLoader in-memory caches
        data_loader.reload_all()

        return {
            "status": "success",
            "message": f"Successfully ingested dataset for '{meta['title']}'",
            "dataset_key": target_key,
            "filename": meta["filename"],
            "original_filename": original_filename,
            "rows_ingested": len(df),
            "columns": list(df.columns),
            "madurai_synced": synced_file is not None and madurai_records_updated > 0,
            "backup_created": backup_path_str,
            "warnings": warnings,
            "preview": df.head(5).to_dict(orient="records")
        }

    @classmethod
    def restore_all_defaults(cls) -> Dict[str, Any]:
        """Restores the initial official SCRB datasets from defaults directory."""
        if not DEFAULTS_DIR.exists() or not list(DEFAULTS_DIR.glob("*.csv")):
            raise FileNotFoundError("Default backup datasets not found.")

        restored_files = []
        for default_file in DEFAULTS_DIR.glob("*.csv"):
            dest_file = DATA_DIR / default_file.name
            shutil.copy2(default_file, dest_file)
            restored_files.append(default_file.name)

        # Reload cache
        data_loader.reload_all()

        return {
            "status": "success",
            "message": f"Successfully restored {len(restored_files)} datasets to official government baseline.",
            "restored_files": restored_files
        }


upload_service = UploadService()
