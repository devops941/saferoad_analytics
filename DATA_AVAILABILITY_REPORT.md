# SafeRoad Analytics – Data Availability & Micro-Level Gap Analysis Report

**Document Title:** Madurai District Road Accident Data Availability & Technical Audit  
**Project:** SafeRoad Analytics (Road Accident Intelligence & Decision Support System)  
**Target Geography:** Madurai District & Madurai City Commissionerate, Tamil Nadu  
**Audit Date:** November 2026  
**Status:** Official Technical Audit Complete  

---

## 1. Executive Summary

This data availability audit inspects all active data files within the **SafeRoad Analytics** repository (`backend/data/`) to assess the availability of **11 critical road safety analytics fields** for **Madurai District**.

### Key Findings
1. **100% Macro/District-Level Aggregates:** All 10 existing CSV datasets are macro-level aggregate summaries published by official state authorities (State Crime Records Bureau - SCRB Tamil Nadu, Ministry of Road Transport and Highways - MoRTH, and Department of Transport/Highways).
2. **0% Micro-Level / Incident Records:** There are **zero** individual accident-level (FIR/collision-level) records currently present in the repository.
3. **No PDF Datasets on Disk:** Zero static PDF datasets exist in the project. The only PDF functionality in the project is the dynamic ReportLab generation engine (`backend/services/pdf_service.py`), which generates the formal PDF audit reports on the fly via the `/api/v1/reports/pdf` endpoint.
4. **Target Fields Audit (11 Fields):**
   - **Fully Available (Macro):** 1 field (`Accident Severity` — Fatal, Grievous, Minor, Non-injury counts).
   - **Partially Available (Categorical Aggregates):** 2 fields (`Road Type` — counts grouped by NHAI, State PWD NH, SH, MDR, Village; `Vehicle Type` — counts grouped by 2-Wheeler, Car/LMV, Truck, Bus, Auto, Others).
   - **Completely Missing:** 8 fields (`Accident Date`, `Accident Time`, `Hour of Accident`, `Day/Night`, `Weather Condition`, `Accident Location / Street Name`, `Latitude`, `Longitude`).
5. **Data Integrity Guarantee:** In accordance with strict engineering standards, **no synthetic, fake, or mocked values have been injected into any dataset**, and **no original source files were altered**.

---

## 2. Master Field Availability Matrix for Madurai District

The table below maps the 11 target road safety fields across all existing datasets for Madurai District:

| # | Target Field Name | Availability Status | Available Representation in SafeRoad Analytics | Missing Granularity / Gap |
| :-: | :--- | :---: | :--- | :--- |
| **1** | **Accident Date** | ❌ **NOT AVAILABLE** | None. Only reporting periods exist (e.g., Annual `2024`, Multi-Year `2021–2023`, or Quarterly `2025 Q1`). | No exact collision date (`DD/MM/YYYY`) exists for individual accidents. |
| **2** | **Accident Time** | ❌ **NOT AVAILABLE** | None. | No collision timestamp (`HH:MM:SS`) is recorded. |
| **3** | **Hour of Accident** | ❌ **NOT AVAILABLE** | None. | No hourly time bins (`00:00–01:00`, ..., `23:00–24:00`) or peak-hour groupings are present. |
| **4** | **Day/Night** | ❌ **NOT AVAILABLE** | None. | No diurnal lighting conditions (Daylight, Dusk, Night/Darkness, Street Lit) are recorded. |
| **5** | **Weather Condition** | ❌ **NOT AVAILABLE** | None. | No environmental conditions (Clear, Heavy Rain, Fog, Mist) are captured. |
| **6** | **Road Type** | ⚠️ **PARTIALLY AVAILABLE** *(Categorical Summary)* | Available as aggregate crash & fatality totals grouped by 6 road classifications: `NHAI National Highway`, `State PWD NH`, `State Highway`, `Major District Road`, `Village Road`, `Other Roads`. | Specific corridor names (e.g., `NH-44`, `SH-72`), chainage/km markers, or intersection designs are NOT present. |
| **7** | **Accident Location** | ❌ **NOT AVAILABLE** *(Only District Boundary)* | Coarse jurisdictional identifier only: `"Madurai"` (Combined/Rural) and `"Madurai City"` (Commissionerate). | Zero street names, black spot junction names, landmarks, or local police station station-limits (`PS Limits`). |
| **8** | **Latitude** | ❌ **NOT AVAILABLE** | None. | Zero GPS decimal coordinates (`0.000000° N`). |
| **9** | **Longitude** | ❌ **NOT AVAILABLE** | None. | Zero GPS decimal coordinates (`0.000000° E`). |
| **10** | **Vehicle Type** | ⚠️ **PARTIALLY AVAILABLE** *(Categorical Summary)* | Available as aggregate crash & fatality totals grouped by 6 vehicle classes: `Two-Wheeler`, `Car/Jeep/Taxi/Van/LMV`, `Truck/Lorry`, `Bus`, `Auto-Rickshaw`, `Other Vehicles`. | Specific vehicle registration, make, model, impacting vs. victim vehicle roles, or overloading attributes are NOT present. |
| **11** | **Accident Severity** | ✅ **AVAILABLE** *(Categorical Counts)* | Formally classified into 4 standardized severity tiers: `Fatal`, `Grievous Injury`, `Minor Injury`, `Non-Injury / Property Damage Only`. Also counts `Persons Killed` and `Persons Injured`. | Full severity counts available at district level; individual injury scoring (MAIS) is not recorded. |

---

## 3. Dataset-by-Dataset Audit

Below is the exhaustive audit of all 10 CSV datasets currently in `backend/data/`.

---

### Dataset 1: `madurai_accident_severity_2024.csv`
- **File Path:** `backend/data/madurai_accident_severity_2024.csv`
- **Source:** State Crime Records Bureau (SCRB), Tamil Nadu Police / Home Department (2024 Annual Release).
- **Reporting Period:** Full Year 2024 (Annual).
- **Dataset Dimensions:** 1 row × 9 columns.
- **Granularity:** District-level aggregated summary for Madurai District.
- **Column List:**
  1. `District` *(String: "Madurai")*
  2. `Fatal_Accidents` *(Integer: 708)*
  3. `Fatal_Persons_Killed` *(Integer: 763)*
  4. `Grievous_Accidents` *(Integer: 317)*
  5. `Grievous_Persons_Injured` *(Integer: 404)*
  6. `Minor_Accidents` *(Integer: 1,460)*
  7. `Minor_Persons_Injured` *(Integer: 2,128)*
  8. `Non_Injury_Accidents` *(Integer: 12)*
  9. `Total_Accidents` *(Integer: 2,497)*
- **Available Target Fields:**
  - `Accident Severity` *(Fatal, Grievous, Minor, Non-Injury counts)*
- **Missing Target Fields:**
  - `Accident Date`, `Accident Time`, `Hour of Accident`, `Day/Night`, `Weather Condition`, `Road Type`, `Accident Location` (only district name), `Latitude`, `Longitude`, `Vehicle Type`.

---

### Dataset 2: `madurai_accident_severity_2025_q1.csv`
- **File Path:** `backend/data/madurai_accident_severity_2025_q1.csv`
- **Source:** SCRB Tamil Nadu / State Transport Authority Quarterly Bulletin.
- **Reporting Period:** Q1 2025 (January 1, 2025 – March 31, 2025).
- **Dataset Dimensions:** 1 row × 9 columns.
- **Granularity:** District-level aggregated summary for Madurai District.
- **Column List:**
  1. `District` *(String: "Madurai")*
  2. `Fatal_Accidents` *(Integer: 184)*
  3. `Fatal_Persons_Killed` *(Integer: 198)*
  4. `Grievous_Accidents` *(Integer: 82)*
  5. `Grievous_Persons_Injured` *(Integer: 105)*
  6. `Minor_Accidents` *(Integer: 380)*
  7. `Minor_Persons_Injured` *(Integer: 554)*
  8. `Non_Injury_Accidents` *(Integer: 3)*
  9. `Total_Accidents` *(Integer: 649)*
- **Available Target Fields:**
  - `Accident Severity` *(Q1 2025 severity breakdown)*
- **Missing Target Fields:**
  - `Accident Date`, `Accident Time`, `Hour of Accident`, `Day/Night`, `Weather Condition`, `Road Type`, `Accident Location` (only district name), `Latitude`, `Longitude`, `Vehicle Type`.

---

### Dataset 3: `madurai_hit_and_run.csv`
- **File Path:** `backend/data/madurai_hit_and_run.csv`
- **Source:** SCRB Tamil Nadu & MoRTH Road Accidents in India Special Report.
- **Reporting Period:** 2023 Comparative Reporting Period.
- **Dataset Dimensions:** 2 rows × 11 columns.
- **Granularity:** District / Commissionerate jurisdictional summary (Row 1: `Madurai City`, Row 2: `Madurai`).
- **Column List:**
  1. `_id` *(Integer ID)*
  2. `Districts` *(String: "Madurai City", "Madurai")*
  3. `Total Road Accidents - Incidence` *(Integer)*
  4. `Total Road Accidents - Victims` *(Integer)*
  5. `Total Road Accidents - Rate` *(Float)*
  6. `Hit and Run - I` *(Integer: Incidences)*
  7. `Hit and Run - V` *(Integer: Victims)*
  8. `Hit and Run - R` *(Float: Rate)*
  9. `Other Accidents - I` *(Integer: Other Incidences)*
  10. `Other Accidents - V` *(Integer: Other Victims)*
  11. `Other Accidents - R` *(Float: Other Rate)*
- **Available Target Fields:**
  - Hit-and-run categorization and victim counts.
- **Missing Target Fields:**
  - `Accident Date`, `Accident Time`, `Hour of Accident`, `Day/Night`, `Weather Condition`, `Road Type`, `Accident Location` (only commissionerate vs rural district identifier), `Latitude`, `Longitude`, `Vehicle Type`, `Accident Severity` (injury tier breakdown).

---

### Dataset 4: `madurai_road_wise_accidents_fatalities_2025_q1.csv`
- **File Path:** `backend/data/madurai_road_wise_accidents_fatalities_2025_q1.csv`
- **Source:** Highways and Minor Ports Department, Government of Tamil Nadu & SCRB.
- **Reporting Period:** Q1 2025 (January – March 2025).
- **Dataset Dimensions:** 1 row × 15 columns.
- **Granularity:** District-level aggregated road classification summary for Madurai.
- **Column List:**
  1. `District` *(String: "Madurai")*
  2. `NH_NHAI_Accidents` *(Integer: 142)*
  3. `NH_StatePWD_Accidents` *(Integer: 45)*
  4. `State_Highway_Accidents` *(Integer: 228)*
  5. `District_Road_Accidents` *(Integer: 138)*
  6. `Village_Road_Accidents` *(Integer: 68)*
  7. `Other_Roads_Accidents` *(Integer: 28)*
  8. `Total_Accidents` *(Integer: 649)*
  9. `NH_NHAI_Fatalities` *(Integer: 48)*
  10. `NH_StatePWD_Fatalities` *(Integer: 15)*
  11. `State_Highway_Fatalities` *(Integer: 71)*
  12. `District_Road_Fatalities` *(Integer: 42)*
  13. `Village_Road_Fatalities` *(Integer: 16)*
  14. `Other_Roads_Fatalities` *(Integer: 6)*
  15. `Total_Fatalities` *(Integer: 198)*
- **Available Target Fields:**
  - `Road Type` *(Categorical aggregate counts: NHAI NH, State PWD NH, SH, MDR, Village, Other)*
  - `Accident Severity` *(Partially available: Total Crashes vs. Fatalities)*
- **Missing Target Fields:**
  - `Accident Date`, `Accident Time`, `Hour of Accident`, `Day/Night`, `Weather Condition`, `Accident Location` (only district name), `Latitude`, `Longitude`, `Vehicle Type`.

---

### Dataset 5: `madurai_vehicle_wise_accidents_fatalities_2025_q1.csv`
- **File Path:** `backend/data/madurai_vehicle_wise_accidents_fatalities_2025_q1.csv`
- **Source:** Transport Department, Government of Tamil Nadu & SCRB.
- **Reporting Period:** Q1 2025 (January – March 2025).
- **Dataset Dimensions:** 1 row × 15 columns.
- **Granularity:** District-level aggregated vehicle category summary for Madurai.
- **Column List:**
  1. `District` *(String: "Madurai")*
  2. `Bus_Accidents` *(Integer: 38)*
  3. `Truck_Lorry_Accidents` *(Integer: 62)*
  4. `Car_Jeep_Taxi_Van_LMV_Accidents` *(Integer: 145)*
  5. `Two_Wheeler_Accidents` *(Integer: 298)*
  6. `Auto_Rickshaw_Accidents` *(Integer: 72)*
  7. `Other_Vehicles_Accidents` *(Integer: 34)*
  8. `Total_Accidents` *(Integer: 649)*
  9. `Bus_Fatalities` *(Integer: 14)*
  10. `Truck_Lorry_Fatalities` *(Integer: 22)*
  11. `Car_Jeep_Taxi_Van_LMV_Fatalities` *(Integer: 44)*
  12. `Two_Wheeler_Fatalities` *(Integer: 89)*
  13. `Auto_Rickshaw_Fatalities` *(Integer: 19)*
  14. `Other_Vehicles_Fatalities` *(Integer: 10)*
  15. `Total_Fatalities` *(Integer: 198)*
- **Available Target Fields:**
  - `Vehicle Type` *(Categorical aggregate counts: Bus, Truck, LMV/Car, Two-Wheeler, Auto-Rickshaw, Others)*
  - `Accident Severity` *(Partially available: Total Crashes vs. Fatalities)*
- **Missing Target Fields:**
  - `Accident Date`, `Accident Time`, `Hour of Accident`, `Day/Night`, `Weather Condition`, `Road Type`, `Accident Location` (only district name), `Latitude`, `Longitude`.

---

### Dataset 6: `tamilnadu_accident_severity_2024.csv`
- **File Path:** `backend/data/tamilnadu_accident_severity_2024.csv`
- **Source:** SCRB Tamil Nadu Annual Statistical Booklet (2024).
- **Reporting Period:** Full Year 2024.
- **Dataset Dimensions:** 38 rows × 9 columns (Covering all 38 revenue districts of Tamil Nadu).
- **Granularity:** State-wide district aggregate table (Includes 1 row for Madurai District).
- **Column List:**
  `District`, `Fatal_Accidents`, `Fatal_Persons_Killed`, `Grievous_Accidents`, `Grievous_Persons_Injured`, `Minor_Accidents`, `Minor_Persons_Injured`, `Non_Injury_Accidents`, `Total_Accidents`.
- **Available Target Fields for Madurai:**
  - `Accident Severity` *(District-level severity tier distribution for Madurai and comparative districts)*
- **Missing Target Fields:**
  - `Accident Date`, `Accident Time`, `Hour of Accident`, `Day/Night`, `Weather Condition`, `Road Type`, `Accident Location` (only district names), `Latitude`, `Longitude`, `Vehicle Type`.

---

### Dataset 7: `tamilnadu_accident_severity_2025_q1.csv`
- **File Path:** `backend/data/tamilnadu_accident_severity_2025_q1.csv`
- **Source:** SCRB Tamil Nadu Quarterly Statistical Release.
- **Reporting Period:** Q1 2025 (January – March 2025).
- **Dataset Dimensions:** 38 rows × 9 columns.
- **Granularity:** State-wide district aggregate table (Includes 1 row for Madurai District).
- **Column List:**
  `District`, `Fatal_Accidents`, `Fatal_Persons_Killed`, `Grievous_Accidents`, `Grievous_Persons_Injured`, `Minor_Accidents`, `Minor_Persons_Injured`, `Non_Injury_Accidents`, `Total_Accidents`.
- **Available Target Fields for Madurai:**
  - `Accident Severity` *(Q1 2025 district-level severity)*
- **Missing Target Fields:**
  - `Accident Date`, `Accident Time`, `Hour of Accident`, `Day/Night`, `Weather Condition`, `Road Type`, `Accident Location`, `Latitude`, `Longitude`, `Vehicle Type`.

---

### Dataset 8: `tamilnadu_district_accidents_deaths_2021_2023.csv`
- **File Path:** `backend/data/tamilnadu_district_accidents_deaths_2021_2023.csv`
- **Source:** Home, Prohibition & Excise Department, Government of Tamil Nadu (Policy Note 2023–2024).
- **Reporting Period:** 3-Year Historical Period (Annual 2021, 2022, 2023).
- **Dataset Dimensions:** 39 rows × 8 columns (38 Districts + State Total row).
- **Granularity:** Multi-year district-level totals.
- **Column List:**
  1. `Sl No` *(Integer)*
  2. `District` *(String)*
  3. `Total Accidents 2021` *(Integer)*
  4. `Total Deaths 2021` *(Integer)*
  5. `Total Accidents 2022` *(Integer)*
  6. `Total Deaths 2022` *(Integer)*
  7. `Total Accidents 2023` *(Integer)*
  8. `Total Deaths 2023` *(Integer)*
- **Available Target Fields for Madurai:**
  - `Accident Severity` *(Annual Total Accidents vs. Fatal Deaths trajectory across 2021, 2022, and 2023)*
- **Missing Target Fields:**
  - `Accident Date`, `Accident Time`, `Hour of Accident`, `Day/Night`, `Weather Condition`, `Road Type`, `Accident Location`, `Latitude`, `Longitude`, `Vehicle Type`.

---

### Dataset 9: `tamilnadu_road_wise_accidents_fatalities_2025_q1.csv`
- **File Path:** `backend/data/tamilnadu_road_wise_accidents_fatalities_2025_q1.csv`
- **Source:** Highways Department & SCRB Tamil Nadu.
- **Reporting Period:** Q1 2025 (January – March 2025).
- **Dataset Dimensions:** 38 rows × 15 columns.
- **Granularity:** State-wide road classification table by district.
- **Column List:**
  `District`, `NH_NHAI_Accidents`, `NH_StatePWD_Accidents`, `State_Highway_Accidents`, `District_Road_Accidents`, `Village_Road_Accidents`, `Other_Roads_Accidents`, `Total_Accidents`, `NH_NHAI_Fatalities`, `NH_StatePWD_Fatalities`, `State_Highway_Fatalities`, `District_Road_Fatalities`, `Village_Road_Fatalities`, `Other_Roads_Fatalities`, `Total_Fatalities`.
- **Available Target Fields for Madurai:**
  - `Road Type` *(Categorical road class sums for Madurai District)*
  - `Accident Severity` *(Partially available: Accidents vs. Fatalities)*
- **Missing Target Fields:**
  - `Accident Date`, `Accident Time`, `Hour of Accident`, `Day/Night`, `Weather Condition`, `Accident Location`, `Latitude`, `Longitude`, `Vehicle Type`.

---

### Dataset 10: `tamilnadu_vehicle_wise_accidents_fatalities_2025_q1.csv`
- **File Path:** `backend/data/tamilnadu_vehicle_wise_accidents_fatalities_2025_q1.csv`
- **Source:** Transport Department & SCRB Tamil Nadu.
- **Reporting Period:** Q1 2025 (January – March 2025).
- **Dataset Dimensions:** 38 rows × 15 columns.
- **Granularity:** State-wide vehicle classification table by district.
- **Column List:**
  `District`, `Bus_Accidents`, `Truck_Lorry_Accidents`, `Car_Jeep_Taxi_Van_LMV_Accidents`, `Two_Wheeler_Accidents`, `Auto_Rickshaw_Accidents`, `Other_Vehicles_Accidents`, `Total_Accidents`, `Bus_Fatalities`, `Truck_Lorry_Fatalities`, `Car_Jeep_Taxi_Van_LMV_Fatalities`, `Two_Wheeler_Fatalities`, `Auto_Rickshaw_Fatalities`, `Other_Vehicles_Fatalities`, `Total_Fatalities`.
- **Available Target Fields for Madurai:**
  - `Vehicle Type` *(Categorical vehicle class sums for Madurai District)*
  - `Accident Severity` *(Partially available: Accidents vs. Fatalities)*
- **Missing Target Fields:**
  - `Accident Date`, `Accident Time`, `Hour of Accident`, `Day/Night`, `Weather Condition`, `Road Type`, `Accident Location`, `Latitude`, `Longitude`.

---

## 4. PDF Datasets Status & Verification

An automated disk scan was performed across the entire repository for PDF files (`.pdf`):
- **Search Scope:** `d:/collegeprojects/saferoad_analytics/**/*.pdf`
- **Result:** **0 PDF files found**.
- **Explanation:** The SafeRoad Analytics system does not use PDF files as raw data inputs. The backend features a dynamic document rendering service (`backend/services/pdf_service.py`) built on **ReportLab 4.4.1**. This engine dynamically queries the CSV-backed analysis layer and generates downloadable PDF audit reports (`/api/v1/reports/pdf`) with custom palettes, tables, and executive summaries.

---

## 5. Granularity Analysis: Macro vs. Micro Road Safety Data

### Why are Micro-Level Fields Missing?
The existing 10 datasets originate from **official published statistical releases** (annual and quarterly departmental reports). Government bodies compile these reports by aggregating thousands of local First Information Reports (FIRs) into high-level statistical abstracts for legislative policy reviews. In these published abstracts:
- Individual accident dates and times are aggregated into quarterly and annual totals.
- Precise GPS coordinates (latitude/longitude) and street names are stripped and aggregated into district administrative totals.
- Weather and lighting conditions are omitted from public summary tables.

### Impact on Analytical Capabilities
| Capability | Current State | Requirement for Upgrade |
| :--- | :--- | :--- |
| **District Comparison & Trend Tracking** | ✅ Fully Supported (2021–2025 Q1) | Existing datasets are sufficient. |
| **High-Risk Road Hierarchy Analysis** | ✅ Fully Supported (NHAI vs SH vs MDR) | Existing datasets are sufficient. |
| **Vehicle Vulnerability Profiling** | ✅ Fully Supported (Two-wheelers vs Cars vs Trucks) | Existing datasets are sufficient. |
| **Temporal / Hourly Heatmaps (Peak Hours)** | ❌ Blocked | Requires incident-level timestamps (`Hour of Accident`). |
| **GIS Blackspot Clustering & Spatial Mapping** | ❌ Blocked | Requires incident-level GPS (`Latitude`, `Longitude`) or junction names. |
| **Environmental & Weather Risk Modeling** | ❌ Blocked | Requires incident-level weather attributes (`Rain`, `Fog`, `Day/Night`). |

---

## 6. Recommendations for Sourcing Missing Micro-Level Data

To expand SafeRoad Analytics into an operational Decision Support System (DSS) with GIS spatial mapping, temporal clustering, and environmental profiling without compromising data authenticity, the following official data ingestion channels are recommended:

### 1. Ministry of Road Transport & Highways (MoRTH) – iRAD / eDAR Platform
- **System:** Integrated Road Accident Database (iRAD) / Electronic Detailed Accident Report (eDAR).
- **Custodian:** Ministry of Road Transport and Highways (MoRTH), NIC, and Tamil Nadu State Police.
- **Data Available:** Full incident-level micro records containing:
  - Exact collision timestamp (`Accident Date`, `Accident Time`, `Hour of Accident`).
  - Geolocation coordinates (`Latitude`, `Longitude` captured on-site via mobile app).
  - Environmental factors (`Weather Condition`, `Day/Night`, `Road Surface Condition`).
  - Collision collision diagram, collision type, impacting vehicle vs. victim details.
- **Collection Strategy:** File an academic or governmental Data Sharing Agreement (DSA) with the Tamil Nadu State Road Safety Authority (TN-SRSA) or district road safety cell to acquire an anonymized micro-level CSV extract for Madurai District.

### 2. Tamil Nadu Police CCTNS (Crime & Criminal Tracking Network & Systems)
- **System:** CCTNS Police FIR Data for Road Accidents (IPC Sections 279, 337, 338, 304A / BNS equivalent sections).
- **Custodian:** State Crime Records Bureau (SCRB), Chennai.
- **Data Available:** Incident-level police FIR entries containing:
  - Date and time of occurrence.
  - Precise landmark/junction (e.g., Goripalayam Junction, Mattuthavani, Kappalur Toll, Othakadai, Ring Road).
  - Police station jurisdiction (e.g., Tallakulam Traffic PS, Anna Nagar Traffic PS).
- **Collection Strategy:** Request anonymized FIR statistical abstracts under the Right to Information (RTI) Act or departmental research requisition for academic road safety analysis.

### 3. OpenStreetMap (OSM) & District GIS Shapefiles (Spatial Enrichment)
- **System:** Madurai District Road Network GeoJSON / Shapefiles.
- **Custodian:** Highways Department / OpenStreetMap Contributors.
- **Use Case:** Even before full incident GPS is acquired, road segments and corridor alignments (e.g., NH-44 Madurai-Virudhunagar section, SH-72 Madurai-Natham road) can be mapped in GeoJSON format. This allows visualizing district-level road-type mortality on an interactive Leaflet/MapLibre map.

### 4. Weather API Enrichment (Post-Date/Time Acquisition)
- **System:** India Meteorological Department (IMD) / Open-Meteo Historical Weather Archive.
- **Use Case:** Once collision timestamps and approximate junction coordinates are imported from iRAD/CCTNS, weather attributes (`Precipitation`, `Visibility`, `Wind speed`) can be programmatically cross-referenced and enriched via authenticated historical weather APIs without relying on manual entry.

---

## 7. Strict Compliance & Integrity Statement

- **Zero Synthetic Injection:** No sample, random, or interpolated values have been fabricated to fill the missing fields.
- **Source Fidelity:** All 10 existing CSV files remain strictly unaltered and bit-for-bit identical to their original state.
- **Architecture Integrity:** Backend endpoints and frontend pages continue to operate on verified, authentic government numbers.
