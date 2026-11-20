# SafeRoad Analytics: Single-Page Project Documentation
**Road Safety Intelligence & GIS Decision Support System (Madurai District)**  
*Academic Project & Research Evaluation Document (2026)*

---

## 1. Executive Summary
**SafeRoad Analytics** is an evidence-based, interactive data intelligence and Geographic Information System (GIS) portal specifically designed for **Madurai District, Tamil Nadu**. The system bridges the gap between static, opaque government accident reports and actionable decision support by transforming official **State Crime Records Bureau (SCRB), Tamil Nadu** statistics (2021–2025) into intuitive visual benchmarks, high-risk corridor maps, and commuter safety advisories.

Built with a high-performance **Python FastAPI** backend and a modern **React + Vite** frontend, the system maintains strict scientific data integrity by analyzing authentic government aggregate datasets without fabricating micro-level GPS coordinates.

---

## 2. Problem Statement & Objectives

### The Problem
* **Data Inaccessibility**: Road crash statistics are historically locked inside complex, multi-page annual government PDF reports.
* **Lack of Geospatial Corroboration**: Decision-makers and citizens cannot easily correlate road administration categories (NHAI, State Highways, Major District Roads) with casualty lethality.
* **Vulnerability Blind Spots**: Vulnerable road users (two-wheelers, pedestrians) lack clear, localized safety advisories highlighting high-risk corridors in Madurai.

### Project Objectives
1. **Empirical Aggregation**: Collect, parse, and validate multi-year accident datasets for Madurai District.
2. **Statistical Rigor**: Apply Pandas-driven **Frequency Tables**, **Cross-Tabulation**, and **Percentage Analysis** to identify accident patterns.
3. **Decoupled GIS Mapping**: Model official Madurai highway corridors on an interactive OpenStreetMap layer using verified GeoJSON geometries without inventing fake accident coordinates.
4. **Actionable Citizen Guidance**: Provide safety advisories, emergency numbers, and golden hour awareness for citizens.
5. **Automated Audit Reporting**: Provide one-click downloadable PDF audit reports for administrative decision-making.

---

## 3. Official Data Sources & Integrity Standards
The system operates exclusively on **10 official datasets** published by the **State Crime Records Bureau (SCRB), Police Department, Government of Tamil Nadu**:

1. `tamilnadu_district_accidents_deaths_2021_2023.csv` — 3-year historical crash & fatality records across all 38 districts.
2. `tamilnadu_accident_severity_2024.csv` — Full-year 2024 accident severity classifications across Tamil Nadu.
3. `madurai_accident_severity_2024.csv` — Madurai District 2024 severity and casualty record.
4. `tamilnadu_accident_severity_2025_q1.csv` — 2025 Q1 provisional severity figures for Tamil Nadu.
5. `madurai_accident_severity_2025_q1.csv` — 2025 Q1 provisional severity figures for Madurai.
6. `tamilnadu_road_wise_accidents_fatalities_2025_q1.csv` — State-wide road classification statistics.
7. `madurai_road_wise_accidents_fatalities_2025_q1.csv` — Madurai road-wise crashes and fatalities across 6 road categories.
8. `tamilnadu_vehicle_wise_accidents_fatalities_2025_q1.csv` — State-wide vehicle collision breakdown.
9. `madurai_vehicle_wise_accidents_fatalities_2025_q1.csv` — Madurai vehicle-wise crash and lethality metrics.
10. `madurai_hit_and_run.csv` — Hit & Run incidence and rates comparing Madurai Rural Police and Madurai City Police Commissionerate.

> **Data Integrity Guarantee**:  
> In compliance with ethical research standards, zero synthetic records or simulated coordinates are generated. Category totals are clearly reported as district aggregates and decoupled from corridor vector geometries.

---

## 4. Key Empirical Findings (Madurai District)

* **Annual Crash Volume (2024)**: Madurai recorded **2,497 total road accidents** and **763 fatalities**, reflecting a **6.13% reduction in accidents** and a **14.27% reduction in deaths** compared to 2023 (2,660 crashes, 890 deaths).
* **Severity Index**: Madurai stands at **30.56 deaths per 100 accidents** (Tamil Nadu state average: 26.90%), ranking #7 in fatality severity among Tamil Nadu districts.
* **Deadliest Road Infrastructure**: **State Highways (SH)** are the most dangerous corridors, accounting for **35.85% of all fatalities** (57 deaths in Q1 2025) and 33.27% of total crashes due to high speeds on undivided 2-lane roads.
* **Most Vulnerable Road Users**: **Two-Wheelers** suffer the highest casualty toll, representing **41.51% of all fatalities** (66 deaths out of 159 in Q1 2025) and 41.06% of total accidents.
* **Most Lethal Collision Type**: **Heavy Commercial Trucks** present the highest lethality rate at **35.90%** (more than 1 in every 3 truck crashes results in death).
* **Hit-and-Run Disparity**: **Madurai Rural Police** jurisdiction has a significantly higher Hit & Run incidence rate (**19.02%**) compared to **Madurai City Police Commissionerate** (**12.07%**), highlighting lighting and surveillance gaps on rural highways.

---

## 5. System Architecture & Tech Stack

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   USER BROWSER / CLIENT APPLICATION                    │
│   React 18 + Vite + Bootstrap 5 + Recharts + React-Leaflet + OSM Maps  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ JSON REST API / GeoJSON / PDF Stream
┌───────────────────────────────────▼────────────────────────────────────┐
│                       PYTHON FASTAPI BACKEND                           │
│  ├── Endpoints: /dashboard, /trends, /road, /vehicle, /gis, /reports   │
│  ├── Analytics Engine: Pandas & NumPy Data Processing                  │
│  ├── GIS Service: GeoJSON corridor & boundary provider                 │
│  └── PDF Generator: ReportLab report formatting engine                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Read-Only Access
┌───────────────────────────────────▼────────────────────────────────────┐
│                      DATA & ARTIFACT REPOSITORY                        │
│  ├── Official SCRB CSV Datasets (10 files)                             │
│  ├── GeoJSON Vector Corridors (Madurai District & 15 Road Lines)       │
│  └── Matplotlib EDA Visualizations (Saved PNG charts in reports/plots) │
└────────────────────────────────────────────────────────────────────────┘
```

### Technology Breakdown
* **Frontend**: React.js 18, Vite 6, Bootstrap 5.3, Recharts 2.15, Leaflet 1.9, React-Leaflet 4.2.
* **Backend**: Python 3.12, FastAPI 0.115, Uvicorn, Pydantic 2.10.
* **Data Science Engine**: Pandas 2.2, NumPy 2.2, Matplotlib 3.10.
* **Reporting**: ReportLab 4.2 (Server-side dynamic PDF compilation).
* **Mapping Base**: OpenStreetMap (OSM) tile layers + Leaflet GeoJSON vector engine.

---

## 6. Analytical Methodologies

The project applies standard statistical and data mining procedures:

### A. Frequency Tables
Calculates absolute frequencies, relative percentage shares, and cumulative distributions across discrete categorical dimensions (Road Classifications, Vehicle Types, and Crash Severity).

### B. Cross-Tabulation (Crosstab)
Constructs bivariate contingency matrices analyzing the interaction between:
1. `Road Category` $\times$ `Casualty Metrics` (Accidents, Fatalities, Injuries, Lethality %).
2. `Vehicle Category` $\times$ `Casualty Outcomes` (Accidents, Fatalities, Fatal Rate %).
3. `Police Jurisdiction` $\times$ `Hit-and-Run Incidents` (City vs. Rural crash patterns).

### C. Percentage Analysis & Mathematical Formulas
* **Percentage Change (YoY Growth/Decline)**:
  $$\Delta \% = \left(\frac{\text{Value}_{\text{current}} - \text{Value}_{\text{baseline}}}{\text{Value}_{\text{baseline}}}\right) \times 100$$
* **Accident Severity Rate**:
  $$\text{Severity Index} = \left(\frac{\text{Persons Killed}}{\text{Total Accidents}}\right) \times 100$$
* **Collision Lethality Rate**:
  $$\text{Lethality Rate} = \left(\frac{\text{Category Fatalities}}{\text{Category Accidents}}\right) \times 100$$
* **Category Contribution Share**:
  $$\text{Fatality Share} = \left(\frac{\text{Category Fatalities}}{\sum \text{District Fatalities}}\right) \times 100$$

---

## 7. Application Modules & Functional Overview

| # | Screen / Module | Primary Route | Purpose & Key Features |
|---|---|---|---|
| 1 | **Home & Overview** | `/` | Hero portal, Madurai overview, primary casualty badges, and quick links. |
| 2 | **Executive Dashboard** | `/dashboard` | High-level KPI cards, year-over-year changes, and priority risk alerts. |
| 3 | **Yearly Trends & Benchmarks** | `/trends` | 2021–2024 multi-year line charts and Madurai vs. Tamil Nadu state benchmarking. |
| 4 | **Accident Severity** | `/severity` | Fatal, Grievous, Minor, and Non-injury casualty breakdowns. |
| 5 | **Road Infrastructure** | `/road-analysis` | NHAI NH, State PWD NH, SH, MDR, and Village road casualty and lethality charts. |
| 6 | **Vehicle Vulnerability** | `/vehicle-analysis` | 2-Wheelers, Cars, Trucks, Buses, Autos risk profiles and horizontal lethality chart. |
| 7 | **Hit & Run Analysis** | `/hit-and-run` | Madurai Rural Police (19.02%) vs. City Police Commissionerate (12.07%) comparison. |
| 8 | **GIS Road Map (Phase 6)** | `/gis-map` | Interactive Leaflet map displaying 15 verified road corridors with category toggles and statistics. |
| 9 | **Citizen Safety Advisories** | `/safety-tips` | Commuter safety rules, Golden Hour guidelines, and emergency hotlines (108, 1033, 112). |
| 10| **Data Explorer & Audit PDF** | `/reports` | Tabular data viewer with CSV audit logs and one-click PDF report generation. |

---

## 8. GIS Road Network Implementation (Phase 6)
* **Map Center**: Madurai District coordinates (`[9.9252, 78.1198]`), zoom level 10.
* **Corridor Coverage**: 15 verified major corridors spanning **492.6 km**:
  * *NHAI National Highways*: NH-44 (North & South corridors), NH-85 (Bodi/Kochi road), NH-744 (Kollam road), NH-38 (Aruppukkottai bypass).
  * *State PWD National Highways*: NH-85 Urban bypass, NH-383 (Natham Highway).
  * *State Highways*: SH-72 (Madurai–Natham), SH-73 (Madurai–Sivagangai), SH-72A (Madurai–Alagarkoil), SH-37 (Madurai–Theni feeder).
  * *Major District Roads (MDR)*: MDR-201, MDR-403, MDR-512.
  * *Village / Rural Corridors*: Sholavandan Rural Link, Melur Feeder Road.
* **Layer Toggles**: Filter individual road hierarchies with real-time length (km) indicators.
* **Corridor Inspector**: Click any road segment to view official corridor name, classification, length, and administrative jurisdiction.

---

## 9. Exploratory Data Analysis & Matplotlib Outputs
A dedicated Python EDA script (`backend/eda_analysis.py`) performs standalone statistical processing and outputs 4 publication-quality charts to `backend/reports/plots/`:

1. `01_road_category_distribution.png`: Grouped bar chart comparing Accidents and Fatalities across 6 road categories.
2. `02_vehicle_vulnerability_lethality.png`: Horizontal bar chart illustrating lethality percentage by vehicle type.
3. `03_accident_severity_distribution.png`: Donut chart illustrating 2024 accident severity levels.
4. `04_yearly_trends_2021_2024.png`: Dual-axis line plot showing longitudinal trends from 2021 to 2024.

---

## 10. How to Run the Project Locally

### 1. Backend Setup (FastAPI)
```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional)
python -m venv venv
# Windows:
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn app.main:app --reload --port 8000
```
*API Documentation available at:* `http://localhost:8000/docs`

### 2. Standalone EDA Script (Pandas & Matplotlib)
```bash
# Execute statistical analysis and generate Matplotlib plots
python backend/eda_analysis.py
```

### 3. Frontend Setup (React & Vite)
```bash
# Navigate to frontend directory
cd frontend

# Install packages
npm install

# Start Vite development server
npm run dev
```
*Web Application available at:* `http://localhost:5173`

---

## 11. Viva & Review Examination Q&A Cheatsheet

### Q1: What makes SafeRoad Analytics different from existing traffic software?
**A**: Most traffic tools attempt black-box AI predictions with synthetic coordinates. SafeRoad Analytics focuses on authentic descriptive intelligence for Madurai District using 10 verified SCRB government datasets, providing decoupled GIS corridor visualization and empirical severity indexing without generating fake crash spots.

### Q2: What is the single biggest finding in your Madurai research?
**A**: State Highways (SH) are the deadliest road category (35.85% of all road fatalities), while Two-Wheelers represent 41.51% of all deaths. The deadliest collision type is heavy trucks, where 35.90% of crashes turn fatal.

### Q3: Why are individual accident dots (pins) not shown on the map?
**A**: Government published reports provide district-level aggregate totals, not individual FIR latitude/longitude coordinates. Inventing random GPS points would be scientifically unethical. Therefore, we accurately mapped official road geometries and synchronized them with district-level category statistics in the analytics side panel.

### Q4: Which statistical techniques were implemented?
**A**: Frequency tables (incident distributions), Cross-tabulation (Road/Vehicle vs. Casualty outcomes), and Percentage analysis (YoY growth, severity index, lethality rates, and jurisdiction comparisons).

---
**SafeRoad Analytics © 2026** — *Madurai Road Safety Intelligence Portal*
