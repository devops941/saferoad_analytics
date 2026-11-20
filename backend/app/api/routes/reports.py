from fastapi import APIRouter, Query, Response
from fastapi.responses import StreamingResponse
from typing import Optional
from app.services.report_service import report_service
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/reports", tags=["Reports & Explorer"])

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
    # Safeguard against direct function invocations passing Query defaults
    dist_str = str(district) if district is not None and isinstance(district, str) else None
    search_str = str(search) if search is not None and isinstance(search, str) else None
    page_num = int(page) if page is not None and isinstance(page, (int, float, str)) and str(page).isdigit() else 1
    p_size = int(page_size) if page_size is not None and isinstance(page_size, (int, float, str)) and str(page_size).isdigit() else 15

    return analytics_service.get_explorer_data(
        dataset_key=str(dataset),
        search=search_str,
        district=dist_str,
        page=page_num,
        page_size=p_size
    )
