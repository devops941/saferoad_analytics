from fastapi import APIRouter, Query, Response, HTTPException
from fastapi.responses import StreamingResponse
from typing import Optional
from app.services.report_service import report_service
from app.services.analytics_service import analytics_service
from app.services.data_loader import data_loader

router = APIRouter(prefix="/reports", tags=["Reports & Explorer"])

VALID_DATASETS = [
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

@router.get("/pdf")
def download_pdf_report():
    """
    Generates and streams an executive PDF road safety exploration report.
    """
    buffer = report_service.generate_pdf_report()
    filename = "SafeRoad_Analytics_Madurai_Report.pdf"
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )

@router.get("/explorer")
def query_explorer_dataset(
    dataset: str = "districts_2021_2023",
    search: Optional[str] = None,
    district: Optional[str] = None,
    page: int = 1,
    page_size: int = 15
):
    """
    Filterable and paginated endpoint for the tabular Data Explorer module.
    """
    dataset_str = str(dataset).strip()
    if dataset_str not in VALID_DATASETS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid dataset '{dataset_str}'. Supported datasets: {VALID_DATASETS}"
        )

    dist_str = str(district).strip() if district is not None and isinstance(district, str) else None
    search_str = str(search).strip() if search is not None and isinstance(search, str) else None
    page_num = int(page) if page is not None and isinstance(page, (int, float, str)) and str(page).isdigit() else 1
    p_size = int(page_size) if page_size is not None and isinstance(page_size, (int, float, str)) and str(page_size).isdigit() else 15

    return analytics_service.get_explorer_data(
        dataset_key=dataset_str,
        search=search_str,
        district=dist_str,
        page=page_num,
        page_size=p_size
    )
