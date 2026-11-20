# SafeRoad Analytics: Road Accident Data Exploration and Severity Comparison

A professional, descriptive data analytics web application focused on historical road accident data for **Madurai District, Tamil Nadu, India**.

> **Note**: This application is strictly a **descriptive data exploration and analytics system**. It is **not** an accident prediction or machine learning forecasting platform.

---

## 1. Project Overview & Scope
- **Geographic Focus**: Madurai District (with separate comparative records for Madurai City Police jurisdiction and Tamil Nadu State benchmarks).
- **Primary Source Data**:
  - Government of Tamil Nadu (Home) Transport Department – Commissionerate of Transport and Road Safety (March 2025 Information Booklet).
  - State Crime Records Bureau (SCRB), Tamil Nadu Police.
  - Ministry of Road Transport and Highways (MoRTH) & National Crime Records Bureau (NCRB) publications.
- **Reporting Timeframes Covered**:
  - **2021 – 2023**: Multi-year District-wise accident and fatality trends across all 38 districts of Tamil Nadu.
  - **2024 (Full Year)**: Detailed accident severity classification (Fatal, Grievous Injury, Minor Injury, Non-Injury, Fatalities, and Persons Injured).
  - **2025 Q1 (Jan – Mar 2025 Provisional)**:
    - Road category analysis (NHAI National Highway, State PWD NH, State Highways, Major District Roads, Village Roads, Other Roads).
    - Vehicle category analysis (Two-wheelers, Cars/Jeeps/LMVs, Buses, Trucks/Lorries, Auto Rickshaws, Other Vehicles).
    - Severity breakdown for Q1 2025.
  - **Hit-and-Run Incident Data**: Separate incidence, victim counts, and rates for Madurai District vs. Madurai City.

---

## 2. Technology Stack

### Frontend
- **Framework**: React.js (v18)
- **Bundler & Tooling**: Vite
- **UI & Layout**: Bootstrap 5 / React-Bootstrap
- **Data Visualization**: Recharts / Chart.js
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Framework**: Python 3.12, FastAPI
- **Data Processing**: Pandas, NumPy
- **Chart & Static Export**: Matplotlib, Seaborn
- **PDF Generation**: ReportLab
- **Server**: Uvicorn (ASGI)

---

## 3. Project Directory Architecture

```text
saferoad_analytics/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── endpoints.py
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   └── config.py
│   │   └── services/
│   │       ├── __init__.py
│   │       └── data_service.py
│   ├── data/
│   │   ├── raw/
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
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 4. Key Data Principles Observed
1. **No Data Fabrication**: Only official government data from SCRB and the Transport Department is loaded.
2. **Distinct Jurisdictions**: Madurai District (Rural) and Madurai City Police Commissionerate data are reported separately.
3. **Period Segregation**: Full calendar years (2021–2024) and quarterly reports (2025 Q1) are clearly distinguished.
4. **Accidents vs. Victims**: Incident counts (crashes) and victim counts (persons killed/injured) are maintained as separate metrics.
5. **Verified Severity Rate**: Standard MoRTH definition used: `(Total Deaths / Total Accidents) * 100`.

---

## 5. Development Phases
- **Phase 1 (Completed)**: Dataset discovery, validation, architecture design, and initial scaffolding.
- **Phase 2 (Pending Approval)**: Backend API implementation, analytical calculations, and ReportLab PDF engine.
- **Phase 3**: React UI dashboard, KPI cards, charts, and filter controls.
- **Phase 4**: Verification, edge case testing, and final documentation.
