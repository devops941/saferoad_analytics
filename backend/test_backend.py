"""
Automated Comprehensive Backend Diagnostic & Test Suite for SafeRoad Analytics.
Executes and validates all backend components without external test runner.
"""
import sys
from pathlib import Path

# Setup Path
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

passed = 0
failed = 0
errors = []

def run_test(name: str, fn):
    global passed, failed, errors
    try:
        fn()
        passed += 1
        print(f"  [PASS] {name}", flush=True)
    except Exception as e:
        failed += 1
        errors.append((name, str(e)))
        print(f"  [FAIL] {name}: {str(e)}", flush=True)

print("=" * 80, flush=True)
print("   SAFEROAD ANALYTICS - BACKEND DIAGNOSTIC TEST RUNNER", flush=True)
print("=" * 80, flush=True)

print("\n--- 1. Testing Core Imports & Data Loader ---", flush=True)
from app.services.data_loader import data_loader
from app.services.analytics_service import analytics_service
from app.services.upload_service import upload_service
from app.services.report_service import report_service

def test_cache():
    if len(data_loader._cache) != 10:
        raise AssertionError(f"Expected 10 datasets, got {len(data_loader._cache)}")
run_test("DataLoader loaded 10 SCRB datasets", test_cache)

def test_madurai():
    row = data_loader.get_madurai_row(data_loader.get_df("severity_2024"))
    if row is None:
        raise AssertionError("Madurai row missing in severity_2024")
    if int(row["Total_Accidents"]) != 2497:
        raise AssertionError(f"Expected 2497 accidents, got {row['Total_Accidents']}")
run_test("Madurai 2024 Severity Baseline Check", test_madurai)

print("\n--- 2. Testing Modular API Endpoint Services ---", flush=True)
from app.api.routes import (
    dashboard, trends, severity, road_analysis,
    vehicle_analysis, hit_and_run, reports, safety_tips, gis, upload
)

def test_dash():
    res = dashboard.get_dashboard_summary()
    if "kpis_2024" not in res or "district" not in res:
        raise AssertionError(f"Invalid dashboard response keys: {list(res.keys())}")
run_test("Dashboard Summary & KPI Endpoint", test_dash)

def test_trends():
    res = trends.get_year_wise_trends()
    if "series" not in res or len(res["series"]) < 4:
        raise AssertionError(f"Invalid trends response keys: {list(res.keys())}")
run_test("Yearly Trends (2021-2024) Endpoint", test_trends)

def test_sev():
    res = severity.get_severity_breakdown("2024")
    if "categories" not in res or len(res["categories"]) != 4:
        raise AssertionError(f"Invalid severity response keys: {list(res.keys())}")
run_test("Accident Severity Breakdown Endpoint", test_sev)

def test_road():
    res = road_analysis.get_road_distribution()
    if "categories" not in res or len(res["categories"]) != 6:
        raise AssertionError(f"Invalid road response keys: {list(res.keys())}")
run_test("Road Infrastructure Risk Endpoint", test_road)

def test_veh():
    res = vehicle_analysis.get_vehicle_distribution()
    if "categories" not in res or len(res["categories"]) != 6:
        raise AssertionError(f"Invalid vehicle response keys: {list(res.keys())}")
run_test("Vehicle Vulnerability & Lethality Endpoint", test_veh)

def test_hnr():
    res = hit_and_run.get_hit_and_run_comparison()
    if "comparison" not in res:
        raise AssertionError(f"Invalid hit and run response keys: {list(res.keys())}")
run_test("Hit and Run Comparison Endpoint", test_hnr)

def test_tips():
    res = safety_tips.get_citizen_safety_advisories()
    if "advisories" not in res or len(res["advisories"]) == 0:
        raise AssertionError(f"Invalid safety tips response keys: {list(res.keys())}")
run_test("Safety Advisories Guidance Endpoint", test_tips)

print("\n--- 3. Testing GIS GeoJSON Networks ---", flush=True)
def test_gis_roads():
    res = gis.get_road_network()
    if res.get("type") != "FeatureCollection" or len(res.get("features", [])) != 15:
        raise AssertionError(f"Expected 15 road corridors, got {len(res.get('features', []))}")
run_test("GIS Road Network Corridors Endpoint", test_gis_roads)

def test_gis_boundary():
    res = gis.get_district_boundary()
    if res.get("type") != "FeatureCollection" or len(res.get("features", [])) != 1:
        raise AssertionError("Invalid boundary response")
run_test("GIS District Boundary Endpoint", test_gis_boundary)

def test_gis_overview():
    res = gis.get_gis_overview()
    if "total_mapped_corridors" not in res or res["total_mapped_corridors"] != 15:
        raise AssertionError("Invalid GIS overview response")
run_test("GIS Overview Endpoint", test_gis_overview)

print("\n--- 4. Testing Data Ingestion & Upload Engine ---", flush=True)
def test_upload_schemas():
    res = upload.get_supported_upload_schemas()
    if res.get("status") != "success" or len(res.get("schemas", [])) < 6:
        raise AssertionError("Invalid upload schemas response")
run_test("Upload Supported Schemas Endpoint", test_upload_schemas)

def test_upload_validation():
    sample_csv = "District,Fatal_Accidents,Fatal_Persons_Killed,Grievous_Accidents,Grievous_Persons_Injured,Minor_Accidents,Minor_Persons_Injured,Non_Injury_Accidents,Total_Accidents\nMADURAI,10,10,20,20,30,30,5,65\n".encode("utf-8")
    df = upload_service.parse_csv_bytes(sample_csv)
    valid, errs, warns = upload_service.validate_dataset(df, "severity_2024")
    if not valid:
        raise AssertionError(f"Expected valid CSV, got: {errs}")
run_test("Upload Validation Dry-Run Check", test_upload_validation)

print("\n--- 5. Testing ReportLab PDF Generation ---", flush=True)
def test_pdf():
    pdf_buf = report_service.generate_pdf_report()
    if len(pdf_buf.getvalue()) < 5000:
        raise AssertionError("PDF buffer unexpectedly small")
run_test("Executive PDF Streaming Generation", test_pdf)

print("\n" + "=" * 80, flush=True)
print(f"RESULTS: {passed} PASSED, {failed} FAILED.", flush=True)
if failed == 0:
    print("ALL BACKEND CHECKS PASSED: ZERO ERRORS DETECTED!", flush=True)
else:
    print("WARNINGS/ERRORS FOUND:", flush=True)
    for name, err in errors:
        print(f"  - {name}: {err}", flush=True)
print("=" * 80, flush=True)

if failed > 0:
    sys.exit(1)
