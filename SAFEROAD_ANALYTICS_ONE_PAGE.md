# SAFEROAD ANALYTICS
*Madurai District Road Safety Intelligence & GIS Decision Support System*

### PROJECT OVERVIEW
SafeRoad Analytics is a full-stack road safety intelligence and geospatial analytics platform designed to analyze empirical road accident data for Madurai District, Tamil Nadu. It converts official police crime and accident records into interactive crash severity comparisons, high-risk highway corridor visualizations, vehicular vulnerability rankings, and public safety advisories. It uses descriptive data science methodologies—including frequency distribution, cross-tabulation, and percentage growth calculations—to empower transport authorities and citizens with verified evidence.

### PROBLEM STATEMENT
Traditional road accident records are locked in static, opaque annual government PDF reports and aggregate tables without spatial or demographic correlation. Citizens and transport planners lack accessible tools to identify deadly road types (like State Highways vs. NHAI), vulnerable vehicle groups (two-wheelers), or rural hit-and-run disparities. SafeRoad Analytics aims to integrate verified statistical analytics with decoupled GIS corridor mapping into one unified, transparent platform.

### PROJECT OBJECTIVES
Analyze empirical multi-year accident trends for Madurai District (2021–2025). • Perform frequency tables, cross-tabulation, and percentage analysis on road and vehicle casualties. • Model 15 verified Madurai highway corridors on an interactive GIS map. • Maintain 100% data integrity with zero synthetic coordinates. • Ingest and validate updated CSV datasets with automatic backup and hot-reloading. • Provide commuter safety advisories and emergency golden-hour assistance. • Generate downloadable executive PDF audit reports.

### KEY MODULES & FEATURES
• **Executive Dashboard**: Real-time KPI metrics on total accidents, fatalities, severity rates, and priority risk alerts.  
• **Longitudinal Trends**: Multi-year (2021–2024) comparison of crash growth rates and Tamil Nadu state benchmarking.  
• **Road Infrastructure Risk**: Accident and fatality distribution across NHAI NH, State PWD NH, State Highways, Major District Roads, and Village Roads.  
• **Vehicle Vulnerability**: Comparative vulnerability and crash lethality rate analysis for Two-Wheelers, Cars, Trucks, Buses, and Auto-Rickshaws.  
• **Hit & Run Analysis**: Jurisdictional comparison between Madurai Rural Police and Madurai City Police Commissionerate.  
• **Interactive GIS Road Map**: React-Leaflet OpenStreetMap engine mapping 15 verified highway corridors (492.6 km) with road layer toggles and casualty side panel.  
• **Citizen Safety Advisories**: Commuter speed limits, helmet/seatbelt guidelines, Golden Hour rescue protocols, and emergency helpline numbers (108, 1033, 112).  
• **Dataset Upload & Ingestion Engine**: Real-time CSV validation, automatic schema detection, automatic timestamped backups, Madurai subset synchronization, and cache hot-reloading.  
• **Data Explorer & PDF Audit Reports**: Full raw dataset viewer with automated, downloadable formal PDF reports via ReportLab.  

### TECHNOLOGY STACK
**Frontend**: React.js 18, Vite, Bootstrap 5.3, React-Bootstrap, Recharts, Modern Glassmorphism UI  
**Backend**: Python 3.12, FastAPI, Uvicorn, Pydantic, Python-Multipart  
**Data Analytics Engine**: Pandas 2.2, NumPy 2.2, Matplotlib 3.10  
**GIS & Mapping**: Leaflet, React-Leaflet, OpenStreetMap, GeoJSON Vector Layers  
**Reporting & Export**: ReportLab PDF Generation  
**Testing & Verification**: Automated Diagnostic Test Suite (`backend/test_backend.py` - 15/15 tests passing)  
**Exploratory Data Analysis (EDA)**: Standalone Python Script (`eda_analysis.py`)  

### PROJECT LINKS
**GitHub**: https://github.com/devops941/saferoad_analytics  
**Application Link**: Not provided  
**Domain**: Smart Transportation / Road Safety Analytics / GovTech  
**Application Type**: Full-Stack GIS Web Application & Decision Support System  
