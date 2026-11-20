# SafeRoad Analytics: Road Accident Data Exploration and Severity Comparison

A professional, descriptive data analytics web application specifically analyzing historical road accident data for **Madurai District, Tamil Nadu, India**.

> **Important Scope Clarification**:  
> SafeRoad Analytics is strictly a **descriptive historical data analytics system**. It is **not** an accident prediction, risk forecasting, or hotspot simulation platform. All figures originate from verified official government publications.

---

## 1. Project Overview

SafeRoad Analytics provides evidence-based descriptive insights into road safety dynamics in Madurai District, Tamil Nadu. The platform bridges administrative reporting with actionable visual analytics, covering multi-year accident trends, crash severity distributions, road infrastructure classifications, vehicular vulnerability profiles, and rural vs. urban hit-and-run dynamics.

### Key Objectives
- **Historical Accident Exploration**: Explore crash counts, casualty impacts, and annual trend trajectories for Madurai District.
- **Severity Comparison**: Evaluate crash lethality rates (Fatal, Grievous Injury, Minor Injury, Non-Injury) using standard Ministry of Road Transport and Highways (MoRTH) definitions.
- **Infrastructure Risk**: Analyze accident and fatality distribution across National Highways (NHAI & State PWD), State Highways, Major District Roads, and Rural/Village roads.
- **Vehicular Vulnerability**: Compare vulnerability shares across Two-Wheelers, LMVs, Heavy Trucks, Buses, and Auto-Rickshaws.
- **Jurisdictional Independence**: Distinguish between Madurai District Police (Rural) and Madurai City Police Commissionerate reporting.
- **Executive Audit Reporting**: One-click generation and streaming of formal PDF audit reports via ReportLab.

---

## 2. Technology Stack

### Frontend
- **Framework**: React.js 18 (Vite)
- **Routing**: React Router DOM (v7)
- **UI & Layout**: React-Bootstrap, Bootstrap 5.3, Bootstrap Icons
- **Data Visualization**: Recharts (v2.15)
- **HTTP Client**: Axios (v1.7)
- **Theme**: Crisp, modern light-theme analytics layout (`#ffffff` card background, `#1e40af` primary blue, responsive sidebar)

### Backend
- **Framework**: Python 3.12, FastAPI (v0.115)
- **Server**: Uvicorn (ASGI)
- **Data Engine**: Pandas (v2.2), NumPy (v2.2)
- **Schema Validation**: Pydantic (v2.10)
- **Report Generation**: ReportLab (v4.2)
- **Data Architecture**: In-memory cached CSV processing (Read-only data access layer)

---

## 3. Folder Architecture

```text
saferoad_analytics/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── __init__.py           # Sub-route bundler
│   │   │   │   ├── dashboard.py          # /dashboard/kpis, /dashboard/summary
│   │   │   │   ├── trends.py             # /trends/year-wise, /trends/districts-comparison
│   │   │   │   ├── severity.py           # /severity/breakdown, /severity/casualty-impact
│   │   │   │   ├── road_analysis.py      # /roads/distribution, /roads/lethality
│   │   │   │   ├── vehicle_analysis.py   # /vehicles/distribution, /vehicles/vulnerability
│   │   │   │   ├── hit_and_run.py        # /hit-and-run/comparison
│   │   │   │   └── reports.py            # /reports/pdf, /reports/explorer
│   │   │   └── endpoints.py              # Main router uniting routes + /health & /datasets/*
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   └── config.py                 # Absolute directory paths, CORS origins & app settings
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── data_loader.py            # Pandas caching & safe data access singleton
│   │   │   ├── data_validation.py        # Cross-table arithmetic verification & health checks
│   │   │   ├── analytics_service.py      # Analytical calculation engine for Madurai
│   │   │   └── report_service.py         # ReportLab executive PDF generation service
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── dashboard.py              # Pydantic models for KPIs and summary cards
│   │   │   └── analytics.py              # Pydantic models for trends, severity, roads, vehicles
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── constants.py              # Category lists, colors, labels, and jurisdiction metadata
│   │       └── helpers.py                # Safe type conversion, rate & percentage change calculators
│   ├── data/                             # 10 verified official CSV datasets
│   │   ├── raw/                          # Untouched raw source copies
│   │   │   ├── d23e7ba9-6a60-41db-b37b-62413cc72365.csv
│   │   │   └── d272a39c-50fd-4bf5-bce2-51d5f12c91fc.csv
│   │   ├── madurai_accident_severity_2024.csv
│   │   ├── madurai_accident_severity_2025_q1.csv
│   │   ├── madurai_hit_and_run.csv
│   │   ├── madurai_road_wise_accidents_fatalities_2025_q1.csv
│   │   ├── madurai_vehicle_wise_accidents_fatalities_2025_q1.csv
│   │   ├── tamilnadu_accident_severity_2024.csv
│   │   ├── tamilnadu_accident_severity_2025_q1.csv
│   │   ├── tamilnadu_district_accidents_deaths_2021_2023.csv
│   │   ├── tamilnadu_road_wise_accidents_fatalities_2025_q1.csv
│   │   └── tamilnadu_vehicle_wise_accidents_fatalities_2025_q1.csv
│   ├── main.py                           # FastAPI application entrypoint
│   └── requirements.txt                  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/                   # Layout, Sidebar, Header, KPICard, Alert widgets
│   │   ├── pages/                        # 8 feature pages
│   │   ├── services/
│   │   │   └── api.js                    # Centralized Axios client
│   │   ├── App.jsx                       # Route setup
│   │   ├── index.css                     # Custom light theme design
│   │   └── main.jsx                      # React entrypoint
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## 4. Dataset Inventory & Primary Sources

All datasets originate strictly from official publications of the **State Crime Records Bureau (SCRB), Tamil Nadu Police**, and the **Commissionerate of Transport and Road Safety, Government of Tamil Nadu (Monthly Information Booklet March 2025)**:

| Dataset Identifier | File Name | Records | Reporting Period | Geographic Scope | Primary Metrics Covered |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `districts_2021_2023` | `tamilnadu_district_accidents_deaths_2021_2023.csv` | 39 | 2021–2023 (Annual) | All 38 TN Districts + State Total | Annual crash & fatality totals per district |
| `madurai_severity_2024` | `madurai_accident_severity_2024.csv` | 1 | 2024 (Full Year) | Madurai District | Fatal, Grievous, Minor, Non-Injury, Casualties |
| `severity_2024` | `tamilnadu_accident_severity_2024.csv` | 38 | 2024 (Full Year) | All 38 TN Districts | Statewide comparative severity breakdown |
| `madurai_severity_2025_q1` | `madurai_accident_severity_2025_q1.csv` | 1 | Jan–Mar 2025 (Provisional) | Madurai District | Q1 Fatal, Grievous, Minor, Non-Injury, Casualties |
| `severity_2025_q1` | `tamilnadu_accident_severity_2025_q1.csv` | 38 | Jan–Mar 2025 (Provisional) | All 38 TN Districts | Statewide Q1 severity distribution |
| `madurai_road_wise_2025_q1` | `madurai_road_wise_accidents_fatalities_2025_q1.csv` | 1 | Jan–Mar 2025 (Provisional) | Madurai District | NHAI NH, State PWD NH, SH, MDR, Village, Other Roads |
| `road_wise_2025_q1` | `tamilnadu_road_wise_accidents_fatalities_2025_q1.csv` | 38 | Jan–Mar 2025 (Provisional) | All 38 TN Districts | Statewide road-wise accidents and fatalities |
| `madurai_vehicle_wise_2025_q1`| `madurai_vehicle_wise_accidents_fatalities_2025_q1.csv` | 1 | Jan–Mar 2025 (Provisional) | Madurai District | Two-Wheelers, LMVs, Buses, Trucks, Autos, Others |
| `vehicle_wise_2025_q1` | `tamilnadu_vehicle_wise_accidents_fatalities_2025_q1.csv` | 38 | Jan–Mar 2025 (Provisional) | All 38 TN Districts | Statewide vehicle-wise accidents and fatalities |
| `hit_and_run` | `madurai_hit_and_run.csv` | 2 | Crime Records Series | Madurai Rural vs. Madurai City | Total crashes, hit-and-run crashes, victims, crime rates |

---

## 5. Installation & Run Instructions

### Prerequisites
- **Python**: Version 3.10+ (Tested on Python 3.12.4)
- **Node.js**: Version 18+ (Tested on Node v24.21.0, npm 11.19.0)

### Backend Setup & Execution
```powershell
# 1. Navigate to backend directory
cd d:\collegeprojects\saferoad_analytics\backend

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Launch FastAPI server
python main.py
```
- **Backend Service**: `http://127.0.0.1:8000`
- **Interactive Swagger Documentation**: `http://127.0.0.1:8000/docs`
- **ReDoc Documentation**: `http://127.0.0.1:8000/redoc`

### Frontend Setup & Execution
```powershell
# 1. Navigate to frontend directory
cd d:\collegeprojects\saferoad_analytics\frontend

# 2. Install Node dependencies
npm install

# 3. Launch Vite development server
npm run dev
```
- **Frontend Dashboard**: `http://localhost:5173`

---

## 6. Key Data Integrity Rules Observed

1. **No Data Fabrication**: Only official government data from SCRB and the Transport Department is loaded. Zero synthetic values or mocked numbers exist.
2. **Distinct Jurisdictions**: Madurai District (Rural Police) and Madurai City (City Police Commissionerate) have separate administrative boundaries and population denominators. They are kept strictly separate.
3. **Period Segregation**: Full calendar years (2021–2024) and quarterly reports (2025 Q1) are clearly distinguished to prevent statistical distortion.
4. **Accidents vs. Victims**: Incident counts (crashes) and victim counts (persons killed/injured) are maintained as separate metrics.
5. **Verified Severity Rate**: Standard MoRTH definition used:
   $$\text{Severity Rate} = \left(\frac{\text{Total Deaths}}{\text{Total Accidents}}\right) \times 100$$
6. **Unavailable Data Policy**: Attributes missing from government summary tables (such as micro-location GPS coordinates or weather conditions) are clearly displayed as **Unavailable**, never as zero or fabricated defaults.

---

## 7. Project Limitations

1. **Geospatial Granularity**: Official district summary tables do not record micro-location coordinates (latitude/longitude) or GIS geometry. Map overlays and geographic heatmaps are strictly omitted to avoid fabricating coordinates.
2. **Weather & Environmental Factors**: Source tables do not record precipitation, fog, or road surface condition at the incident level.
3. **Time-of-Day / Peak Hour Granularity**: Crash timestamps and hourly time-of-day distributions are not present in district summary publications.
4. **Driver Demographics**: Age brackets, helmet compliance, and seatbelt usage metrics are absent in the district-level summary tables.
5. **Quarterly Span**: 2025 Q1 covers January to March 2025 (provisional). It is not annualized to prevent speculative distortion.
