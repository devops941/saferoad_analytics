"""
Data Ingestion & Upload Router for SafeRoad Analytics.
Allows transport authorities and reviewers to upload updated CSV datasets,
validate schemas, preview parsed tables, and hot-reload analytics caches.
"""
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from app.services.upload_service import upload_service

router = APIRouter(prefix="/upload", tags=["Data Ingestion & Upload"])


@router.get("/schemas")
def get_supported_upload_schemas():
    """
    Returns the supported dataset categories, expected filenames,
    required column headers, and sample preview data.
    """
    return {
        "status": "success",
        "schemas": upload_service.get_supported_schemas()
    }


@router.post("/file")
async def upload_dataset_file(
    file: UploadFile = File(...),
    target_dataset: Optional[str] = Form(default="auto")
):
    """
    Uploads, validates, backs up, and ingests a new CSV dataset.
    Hot-reloads data caches so analytics immediately reflect the new data.
    """
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file extension. Only .csv files are supported (received: {file.filename})."
        )

    try:
        content = await file.read()
        if len(content) == 0:
            raise HTTPException(status_code=400, detail="The uploaded file is empty.")

        result = upload_service.save_and_ingest(
            file_bytes=content,
            original_filename=file.filename,
            target_key=target_dataset
        )
        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")


@router.post("/validate")
async def validate_dataset_file(
    file: UploadFile = File(...),
    target_dataset: Optional[str] = Form(default="auto")
):
    """
    Performs dry-run pre-validation on an uploaded CSV file without modifying system files.
    """
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file extension. Only .csv files are supported (received: {file.filename})."
        )

    try:
        content = await file.read()
        df = upload_service.parse_csv_bytes(content)
        detected_key = upload_service.detect_dataset_key(df) if (not target_dataset or target_dataset == "auto") else target_dataset
        
        if not detected_key:
            return {
                "status": "warning",
                "is_valid": False,
                "detected_key": None,
                "rows": len(df),
                "columns": list(df.columns),
                "errors": ["Could not match columns to any known dataset schema."],
                "warnings": []
            }

        is_valid, errors, warnings = upload_service.validate_dataset(df, detected_key)
        return {
            "status": "success" if is_valid else "invalid",
            "is_valid": is_valid,
            "detected_key": detected_key,
            "rows": len(df),
            "columns": list(df.columns),
            "errors": errors,
            "warnings": warnings,
            "preview": df.head(3).to_dict(orient="records")
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Validation failed: {str(e)}")


@router.post("/restore-defaults")
def restore_default_datasets():
    """
    Reverts all datasets back to the original verified government SCRB baseline.
    """
    try:
        return upload_service.restore_all_defaults()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Restore failed: {str(e)}")
