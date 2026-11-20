# SafeRoad Analytics: Road Accident Data Exploration and Severity Comparison

A professional, descriptive data analytics web application specifically analyzing historical road accident data for **Madurai District, Tamil Nadu, India**.

> **Important Scope Clarification**:  
> SafeRoad Analytics is strictly a **descriptive historical data analytics system**. It is **not** an accident prediction, risk forecasting, or hotspot simulation platform. All figures originate from verified official government publications.

---

## 1. Project Overview

SafeRoad Analytics provides evidence-based descriptive insights into road safety dynamics in Madurai District, Tamil Nadu. The platform bridges administrative reporting with actionable visual analytics, covering multi-year accident trends, crash severity distributions, road infrastructure classifications, vehicular vulnerability profiles, and rural vs. urban hit-and-run dynamics.

### Key Analytical Pillars
- **Multi-Year Trends (2021–2024)**: Explores crash counts, casualty impacts, and annual trend trajectories for Madurai District compared against Tamil Nadu state benchmarks.
- **Accident Severity Classification**: Evaluates crash lethality rates (Fatal, Grievous Injury, Minor Injury, Non-Injury) using standard Ministry of Road Transport and Highways (MoRTH) definitions.
- **Infrastructure Risk**: Analyzes accident and fatality distributions across National Highways (NHAI & State PWD), State Highways, Major District Roads, and Rural/Village roads.
- **Vehicular Vulnerability**: Compares vulnerability shares across Two-Wheelers, LMVs, Heavy Trucks, Buses, and Auto-Rickshaws.
- **Jurisdictional Independence**: Distinguishes between Madurai District Police (Rural) and Madurai City Police Commissionerate reporting.
- **Executive Audit Reporting**: One-click generation and streaming of formal PDF audit reports via ReportLab.

---

## 2. Technology Stack

### Frontend
- **Framework**: React.js 18 (Vite)
- **Routing**: React Router DOM (v7)
- **UI & Layout**: React-Bootstrap, Bootstrap 5.3, Bootstrap Icons
- **Data Visualization**: Recharts (v2.15)
- **HTTP Client**: Axios (v1.7)
- **Deployment Platform**: Vercel (SPA with `vercel.json` rewrite routing)

### Backend
- **Framework**: Python 3.12, FastAPI (v0.115)
- **Server**: Uvicorn (ASGI) / Gunicorn
- **Data Engine**: Pandas (v2.2), NumPy (v2.2)
- **Schema Validation**: Pydantic (v2.10)
- **Report Generation**: ReportLab (v4.2)
- **Deployment Platform**: Render (`render.yaml` blueprint included)

---

## 3. Folder Architecture

```text
saferoad_analytics/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── __init__.py           # Sub-route exports
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
│   │   │   └── config.py                 # Platform-independent paths & dynamic CORS
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── data_loader.py            # Safe Pandas caching singleton
│   │   │   ├── data_validation.py        # Cross-table verification & health checks
│   │   │   ├── analytics_service.py      # Analytical calculation engine for Madurai
│   │   │   └── report_service.py         # ReportLab executive PDF generator
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── dashboard.py              # Pydantic schemas for KPIs
│   │   │   └── analytics.py              # Pydantic schemas for trends, severity, roads
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── constants.py              # Standard labels, colors, and jurisdiction metadata
│   │       └── helpers.py                # Safe type conversion, rate & percentage helpers
│   ├── data/                             # 10 verified official CSV datasets
│   │   ├── raw/                          # Untouched raw source files
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
│   └── requirements.txt                  # Python production dependencies
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
│   ├── vercel.json                       # Vercel SPA client routing configuration
│   └── vite.config.js                    # Optimized Vite build with manual chunks
├── render.yaml                           # Render Blueprint for automated backend deployment
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

## 5. Local Development Instructions

### Local Backend Run
```powershell
cd d:\collegeprojects\saferoad_analytics\backend
pip install -r requirements.txt
python main.py
```
- **Service URL**: `http://127.0.0.1:8000`
- **Swagger Documentation**: `http://127.0.0.1:8000/docs`

### Local Frontend Run
```powershell
cd d:\collegeprojects\saferoad_analytics\frontend
npm install
npm run dev
```
- **Dashboard URL**: `http://localhost:5173`

---

## 6. Production Deployment Guide (Step-by-Step)

### Step 6.1: Push Repository to GitHub
Create a new private or public repository on GitHub (e.g. `saferoad-analytics`):
```powershell
cd d:\collegeprojects\saferoad_analytics
git remote add origin https://github.com/<your-username>/saferoad-analytics.git
git branch -M main
git push -u origin main
```

---

### Step 6.2: Backend Deployment on Render

Render hosts the FastAPI application using the preconfigured `render.yaml` or through manual service setup:

#### Option A: Using Render Blueprint (Recommended)
1. Log in to [Render](https://render.com).
2. Click **New +** $\rightarrow$ **Blueprint**.
3. Connect your GitHub repository `saferoad-analytics`.
4. Render will auto-detect `render.yaml` and configure:
   - **Service Name**: `saferoad-analytics-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click **Apply**. Once built, note your live backend URL (e.g., `https://saferoad-analytics-backend.onrender.com`).

#### Option B: Manual Web Service Setup on Render
1. Click **New +** $\rightarrow$ **Web Service**.
2. Select your repository `saferoad-analytics`.
3. Set the following parameters:
   - **Name**: `saferoad-analytics-backend`
   - **Region**: Singapore or nearest
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. In **Environment Variables**, add:
   - `PYTHON_VERSION`: `3.12.4`
   - `ENVIRONMENT`: `production`
   - `CORS_ORIGINS`: `*` (or your Vercel frontend URL once deployed)
5. Click **Create Web Service**.

---

### Step 6.3: Frontend Deployment on Vercel

Vercel hosts the React + Vite single-page application:

1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** $\rightarrow$ **Project**.
3. Import your GitHub repository `saferoad-analytics`.
4. Configure the Project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click **Edit** and select `frontend`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. In **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://saferoad-analytics-backend.onrender.com/api/v1` *(replace with your actual Render URL)*
6. Click **Deploy**.
7. Vercel will build and assign your production domain (e.g., `https://saferoad-analytics.vercel.app`).
8. The included `frontend/vercel.json` ensures that direct navigation and page reloads on routes like `/trends` or `/severity` resolve correctly to `/index.html`.

---

## 7. Production Environment Variables Summary

| Platform | Variable Name | Recommended Value | Purpose |
| :--- | :--- | :--- | :--- |
| **Render (Backend)** | `PORT` | `10000` *(Render sets this automatically)* | Port for Uvicorn server |
| **Render (Backend)** | `ENVIRONMENT` | `production` | Disables hot reload in production |
| **Render (Backend)** | `PYTHON_VERSION` | `3.12.4` | Ensures compatible Python runtime |
| **Render (Backend)** | `CORS_ORIGINS` | `*` *(or `https://your-app.vercel.app`)* | Cross-Origin Request allowance |
| **Vercel (Frontend)**| `VITE_API_BASE_URL` | `https://<render-app>.onrender.com/api/v1` | Points Axios client to Render backend |

---

## 8. Post-Deployment Verification Checklist

Once deployed to Render and Vercel, verify the live installation:

1. **Backend Health Check**:
   Visit `https://<your-render-url>.onrender.com/api/v1/health`.  
   Expected JSON response: `{"status": "healthy", "service": "SafeRoad Analytics API", ...}`
2. **Swagger Documentation**:
   Visit `https://<your-render-url>.onrender.com/docs`.  
   Verify that all 15 endpoints are listed and can be tested via Swagger UI.
3. **Frontend Dashboard Connectivity**:
   Visit `https://<your-vercel-url>.vercel.app`.  
   Verify that KPI cards load actual values (`2,497` accidents, `763` deaths).
4. **Interactive Routing**:
   Click through all 8 pages (`/`, `/trends`, `/severity`, `/roads`, `/vehicles`, `/hit-and-run`, `/explorer`, `/reports`) to confirm client-side routing.
5. **PDF Report Streaming**:
   Navigate to the **Reports** page and click **Download Executive PDF Report**.  
   Verify that `SafeRoad_Analytics_Madurai_Report.pdf` downloads cleanly and opens with formatted tables.
6. **Data Explorer Filter & Export**:
   Navigate to the **Data Explorer** page, filter by district, and click **Export CSV** to verify client-side export.

---

## 9. Key Data Integrity Rules Observed

1. **No Data Fabrication**: Only official government data from SCRB and the Transport Department is loaded. Zero synthetic values or mocked numbers exist.
2. **Distinct Jurisdictions**: Madurai District (Rural Police) and Madurai City (City Police Commissionerate) have separate administrative boundaries and population denominators. They are kept strictly separate.
3. **Period Segregation**: Full calendar years (2021–2024) and quarterly reports (2025 Q1) are clearly distinguished to prevent statistical distortion.
4. **Accidents vs. Victims**: Incident counts (crashes) and victim counts (persons killed/injured) are maintained as separate metrics.
5. **Verified Severity Rate**: Standard MoRTH definition used:
   $$\text{Severity Rate} = \left(\frac{\text{Total Deaths}}{\text{Total Accidents}}\right) \times 100$$
6. **Unavailable Data Policy**: Attributes missing from government summary tables (such as micro-location GPS coordinates or weather conditions) are clearly displayed as **Unavailable**, never as zero or fabricated defaults.

---

## 10. Project Limitations

1. **Geospatial Granularity**: Official district summary tables do not record micro-location coordinates (latitude/longitude) or GIS geometry. Map overlays and geographic heatmaps are strictly omitted to avoid fabricating coordinates.
2. **Weather & Environmental Factors**: Source tables do not record precipitation, fog, or road surface condition at the incident level.
3. **Time-of-Day / Peak Hour Granularity**: Crash timestamps and hourly time-of-day distributions are not present in district summary publications.
4. **Driver Demographics**: Age brackets, helmet compliance, and seatbelt usage metrics are absent in the district-level summary tables.
5. **Quarterly Span**: 2025 Q1 covers January to March 2025 (provisional). It is not annualized to prevent speculative distortion.
