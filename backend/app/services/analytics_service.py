"""
Analytics Service for SafeRoad Analytics.
Performs descriptive calculations, trend comparisons, severity breakdowns,
road-type metrics, vehicular risk analysis, and hit-and-run evaluations.
"""
from typing import Dict, Any, List, Optional
import pandas as pd
from app.services.data_loader import data_loader
from app.utils.constants import DISTRICT_FOCUS, ROAD_CATEGORIES, VEHICLE_CATEGORIES, SEVERITY_CATEGORIES, JURISDICTIONS
from app.utils.helpers import safe_int, safe_float, calc_rate, calc_percentage_change

class AnalyticsService:

    # ==========================================
    # 1. DASHBOARD & KPIS
    # ==========================================
    def get_dashboard_summary(self) -> Dict[str, Any]:
        """Provides high-level KPI cards and quick indicator widgets."""
        # 1. Load multi-year trends and 2024 severity
        df_trends = data_loader.get_df("districts_2021_2023")
        df_sev24 = data_loader.get_df("severity_2024")
        df_sev25_q1 = data_loader.get_df("severity_2025_q1")

        m_trend = data_loader.get_madurai_row(df_trends)
        m_24 = data_loader.get_madurai_row(df_sev24)
        m_25 = data_loader.get_madurai_row(df_sev25_q1)

        # 2023 Madurai baselines
        acc_2023 = safe_int(m_trend["Total Accidents 2023"]) if m_trend is not None else 2660
        deaths_2023 = safe_int(m_trend["Total Deaths 2023"]) if m_trend is not None else 890

        # 2024 Madurai numbers
        acc_2024 = safe_int(m_24["Total_Accidents"]) if m_24 is not None else 2497
        deaths_2024 = safe_int(m_24["Fatal_Persons_Killed"]) if m_24 is not None else 763
        fatal_acc_2024 = safe_int(m_24["Fatal_Accidents"]) if m_24 is not None else 741
        grievous_inj_2024 = safe_int(m_24["Grievous_Persons_Injured"]) if m_24 is not None else 633
        minor_inj_2024 = safe_int(m_24["Minor_Persons_Injured"]) if m_24 is not None else 1632
        injuries_2024 = grievous_inj_2024 + minor_inj_2024
        total_casualties_2024 = deaths_2024 + injuries_2024
        sev_rate_2024 = calc_rate(deaths_2024, acc_2024)
        sev_rate_2023 = calc_rate(deaths_2023, acc_2023)

        # YoY changes (2024 vs 2023)
        acc_change = calc_percentage_change(acc_2023, acc_2024)
        death_change = calc_percentage_change(deaths_2023, deaths_2024)

        # Madurai Rank in Tamil Nadu for 2024
        # Sort districts by accidents and deaths descending (excluding Total)
        dist_24 = df_sev24[df_sev24["District"].str.upper() != "TOTAL"].copy()
        dist_24["Total_Accidents_num"] = dist_24["Total_Accidents"].astype(int)
        dist_24["Deaths_num"] = dist_24["Fatal_Persons_Killed"].astype(int)
        
        dist_24_acc_sorted = dist_24.sort_values(by="Total_Accidents_num", ascending=False).reset_index(drop=True)
        dist_24_death_sorted = dist_24.sort_values(by="Deaths_num", ascending=False).reset_index(drop=True)
        
        acc_rank = int(dist_24_acc_sorted[dist_24_acc_sorted["District"].str.upper() == DISTRICT_FOCUS].index[0]) + 1
        death_rank = int(dist_24_death_sorted[dist_24_death_sorted["District"].str.upper() == DISTRICT_FOCUS].index[0]) + 1

        # 2025 Q1 Numbers
        acc_2025_q1 = safe_int(m_25["Total_Accidents"]) if m_25 is not None else 565
        deaths_2025_q1 = safe_int(m_25["Fatal_Persons_Killed"]) if m_25 is not None else 159
        injuries_2025_q1 = safe_int(m_25["Grievous_Persons_Injured"]) + safe_int(m_25["Minor_Persons_Injured"]) if m_25 is not None else 495
        sev_rate_2025_q1 = calc_rate(deaths_2025_q1, acc_2025_q1)

        kpis_2024 = [
            {
                "id": "accidents_2024",
                "title": "Total Road Accidents",
                "value": acc_2024,
                "change_percentage": acc_change,
                "is_positive_change": acc_change < 0,  # Reduction in accidents is positive
                "trend_direction": "down" if acc_change < 0 else "up",
                "period": "2024 (Full Year)",
                "subtitle": f"Down from {acc_2023:,} in 2023",
                "badge": f"Rank #{acc_rank} in TN"
            },
            {
                "id": "deaths_2024",
                "title": "Total Road Fatalities",
                "value": deaths_2024,
                "change_percentage": death_change,
                "is_positive_change": death_change < 0, # Reduction in deaths is positive
                "trend_direction": "down" if death_change < 0 else "up",
                "period": "2024 (Full Year)",
                "subtitle": f"Down from {deaths_2023:,} in 2023",
                "badge": f"Rank #{death_rank} in TN"
            },
            {
                "id": "injuries_2024",
                "title": "Persons Injured",
                "value": injuries_2024,
                "change_percentage": None,
                "is_positive_change": None,
                "trend_direction": None,
                "period": "2024 (Full Year)",
                "subtitle": f"{grievous_inj_2024} Grievous, {minor_inj_2024} Minor",
                "badge": "Casualties"
            },
            {
                "id": "severity_2024",
                "title": "Accident Severity Rate",
                "value": f"{sev_rate_2024}%",
                "change_percentage": round(sev_rate_2024 - sev_rate_2023, 2),
                "is_positive_change": (sev_rate_2024 - sev_rate_2023) < 0,
                "trend_direction": "down" if (sev_rate_2024 - sev_rate_2023) < 0 else "up",
                "period": "2024 (Full Year)",
                "subtitle": f"Deaths per 100 accidents (2023: {sev_rate_2023}%)",
                "badge": "MoRTH Standard"
            }
        ]

        kpis_2025_q1 = [
            {
                "id": "accidents_2025_q1",
                "title": "Q1 Total Accidents",
                "value": acc_2025_q1,
                "period": "Jan – Mar 2025 (Provisional)",
                "subtitle": "First quarter provisional count",
                "badge": "Q1 2025"
            },
            {
                "id": "deaths_2025_q1",
                "title": "Q1 Fatalities",
                "value": deaths_2025_q1,
                "period": "Jan – Mar 2025 (Provisional)",
                "subtitle": f"{deaths_2025_q1} deaths reported in 3 months",
                "badge": "Q1 2025"
            },
            {
                "id": "injuries_2025_q1",
                "title": "Q1 Persons Injured",
                "value": injuries_2025_q1,
                "period": "Jan – Mar 2025 (Provisional)",
                "subtitle": "Casualties needing medical attention",
                "badge": "Q1 2025"
            },
            {
                "id": "severity_2025_q1",
                "title": "Q1 Severity Rate",
                "value": f"{sev_rate_2025_q1}%",
                "period": "Jan – Mar 2025 (Provisional)",
                "subtitle": "Deaths per 100 accidents in Q1",
                "badge": "Q1 Severity"
            }
        ]

        return {
            "district": "Madurai District",
            "state": "Tamil Nadu",
            "kpis_2024": kpis_2024,
            "kpis_2025_q1": kpis_2025_q1,
            "quick_severity_2024": {
                "fatal_accidents": fatal_acc_2024,
                "grievous_accidents": safe_int(m_24["Grievous_Accidents"]),
                "minor_accidents": safe_int(m_24["Minor_Accidents"]),
                "non_injury_accidents": safe_int(m_24["Non_Injury_Accidents"]),
                "total_accidents": acc_2024
            },
            "quick_trend_summary": {
                "baseline_2021": {"accidents": safe_int(m_trend["Total Accidents 2021"]), "deaths": safe_int(m_trend["Total Deaths 2021"])},
                "latest_2024": {"accidents": acc_2024, "deaths": deaths_2024},
                "net_accident_change_4yr": calc_percentage_change(m_trend["Total Accidents 2021"], acc_2024),
                "net_death_change_4yr": calc_percentage_change(m_trend["Total Deaths 2021"], deaths_2024)
            },
            "metadata": {
                "source": "State Crime Records Bureau (SCRB) & Commissionerate of Transport and Road Safety, Chennai",
                "document": "Monthly Information Booklet March 2025, Government of Tamil Nadu",
                "jurisdiction_clarification": "Madurai District figures include rural and taluk networks as reported in state transport tables. Madurai City Police Commissionerate is tracked separately in police crime reports."
            }
        }

    # ==========================================
    # 2. YEAR-WISE TRENDS (2021 - 2024 + Q1 2025)
    # ==========================================
    def get_trends_analysis(self) -> Dict[str, Any]:
        """Calculates multi-year annual trends (2021-2024) and benchmarks against Tamil Nadu."""
        df_trends = data_loader.get_df("districts_2021_2023")
        df_sev24 = data_loader.get_df("severity_2024")
        df_sev25_q1 = data_loader.get_df("severity_2025_q1")

        m_trend = data_loader.get_madurai_row(df_trends)
        m_24 = data_loader.get_madurai_row(df_sev24)
        m_25 = data_loader.get_madurai_row(df_sev25_q1)

        # Tamil Nadu State Totals
        tot_trend = data_loader.get_state_total_row(df_trends)
        tot_24 = data_loader.get_state_total_row(df_sev24)
        tot_25 = data_loader.get_state_total_row(df_sev25_q1)

        series = [
            {
                "year": 2021,
                "accidents": safe_int(m_trend["Total Accidents 2021"]),
                "fatalities": safe_int(m_trend["Total Deaths 2021"]),
                "severity_rate": calc_rate(m_trend["Total Deaths 2021"], m_trend["Total Accidents 2021"]),
                "yoy_accident_growth": None,
                "yoy_fatality_growth": None,
                "reporting_type": "Full Calendar Year"
            },
            {
                "year": 2022,
                "accidents": safe_int(m_trend["Total Accidents 2022"]),
                "fatalities": safe_int(m_trend["Total Deaths 2022"]),
                "severity_rate": calc_rate(m_trend["Total Deaths 2022"], m_trend["Total Accidents 2022"]),
                "yoy_accident_growth": calc_percentage_change(m_trend["Total Accidents 2021"], m_trend["Total Accidents 2022"]),
                "yoy_fatality_growth": calc_percentage_change(m_trend["Total Deaths 2021"], m_trend["Total Deaths 2022"]),
                "reporting_type": "Full Calendar Year"
            },
            {
                "year": 2023,
                "accidents": safe_int(m_trend["Total Accidents 2023"]),
                "fatalities": safe_int(m_trend["Total Deaths 2023"]),
                "severity_rate": calc_rate(m_trend["Total Deaths 2023"], m_trend["Total Accidents 2023"]),
                "yoy_accident_growth": calc_percentage_change(m_trend["Total Accidents 2022"], m_trend["Total Accidents 2023"]),
                "yoy_fatality_growth": calc_percentage_change(m_trend["Total Deaths 2022"], m_trend["Total Deaths 2023"]),
                "reporting_type": "Full Calendar Year"
            },
            {
                "year": 2024,
                "accidents": safe_int(m_24["Total_Accidents"]),
                "fatalities": safe_int(m_24["Fatal_Persons_Killed"]),
                "severity_rate": calc_rate(m_24["Fatal_Persons_Killed"], m_24["Total_Accidents"]),
                "yoy_accident_growth": calc_percentage_change(m_trend["Total Accidents 2023"], m_24["Total_Accidents"]),
                "yoy_fatality_growth": calc_percentage_change(m_trend["Total Deaths 2023"], m_24["Fatal_Persons_Killed"]),
                "reporting_type": "Full Calendar Year"
            }
        ]

        state_benchmark = [
            {
                "year": 2021,
                "state_accidents": safe_int(tot_trend["Total Accidents 2021"]),
                "state_fatalities": safe_int(tot_trend["Total Deaths 2021"]),
                "state_severity_rate": calc_rate(tot_trend["Total Deaths 2021"], tot_trend["Total Accidents 2021"]),
                "madurai_accident_share": calc_rate(m_trend["Total Accidents 2021"], tot_trend["Total Accidents 2021"]),
                "madurai_fatality_share": calc_rate(m_trend["Total Deaths 2021"], tot_trend["Total Deaths 2021"])
            },
            {
                "year": 2022,
                "state_accidents": safe_int(tot_trend["Total Accidents 2022"]),
                "state_fatalities": safe_int(tot_trend["Total Deaths 2022"]),
                "state_severity_rate": calc_rate(tot_trend["Total Deaths 2022"], tot_trend["Total Accidents 2022"]),
                "madurai_accident_share": calc_rate(m_trend["Total Accidents 2022"], tot_trend["Total Accidents 2022"]),
                "madurai_fatality_share": calc_rate(m_trend["Total Deaths 2022"], tot_trend["Total Deaths 2022"])
            },
            {
                "year": 2023,
                "state_accidents": safe_int(tot_trend["Total Accidents 2023"]),
                "state_fatalities": safe_int(tot_trend["Total Deaths 2023"]),
                "state_severity_rate": calc_rate(tot_trend["Total Deaths 2023"], tot_trend["Total Accidents 2023"]),
                "madurai_accident_share": calc_rate(m_trend["Total Accidents 2023"], tot_trend["Total Accidents 2023"]),
                "madurai_fatality_share": calc_rate(m_trend["Total Deaths 2023"], tot_trend["Total Deaths 2023"])
            },
            {
                "year": 2024,
                "state_accidents": safe_int(tot_24["Total_Accidents"]),
                "state_fatalities": safe_int(tot_24["Fatal_Persons_Killed"]),
                "state_severity_rate": calc_rate(tot_24["Fatal_Persons_Killed"], tot_24["Total_Accidents"]),
                "madurai_accident_share": calc_rate(m_24["Total_Accidents"], tot_24["Total_Accidents"]),
                "madurai_fatality_share": calc_rate(m_24["Fatal_Persons_Killed"], tot_24["Fatal_Persons_Killed"])
            }
        ]

        q1_2025_snapshot = {
            "period": "January to March 2025 (Provisional)",
            "accidents": safe_int(m_25["Total_Accidents"]),
            "fatalities": safe_int(m_25["Fatal_Persons_Killed"]),
            "severity_rate": calc_rate(m_25["Fatal_Persons_Killed"], m_25["Total_Accidents"]),
            "state_accidents": safe_int(tot_25["Total_Accidents"]) if tot_25 is not None else 16952,
            "state_fatalities": safe_int(tot_25["Fatal_Persons_Killed"]) if tot_25 is not None else 4138,
            "madurai_accident_share": calc_rate(m_25["Total_Accidents"], tot_25["Total_Accidents"]) if tot_25 is not None else 3.33,
            "madurai_fatality_share": calc_rate(m_25["Fatal_Persons_Killed"], tot_25["Fatal_Persons_Killed"]) if tot_25 is not None else 3.84,
            "note": "Quarterly data: Must not be compared as equivalent to 12-month annual figures."
        }

        insights = [
            "Accidents in Madurai peaked in 2023 at 2,660 crashes and 890 deaths.",
            "In 2024, road safety interventions led to a 6.13% reduction in accidents (2,497) and a sharp 14.27% reduction in fatalities (763).",
            "Madurai severity rate (30.56% in 2024) remains higher than the Tamil Nadu state average (26.90%), meaning crashes in Madurai have higher fatality consequences.",
            "Madurai accounts for approximately 3.7% of all road accidents and 4.2% of all road deaths across the 38 districts of Tamil Nadu."
        ]

        return {
            "district": "Madurai District",
            "series": series,
            "state_benchmark_series": state_benchmark,
            "q1_2025_snapshot": q1_2025_snapshot,
            "insights": insights
        }

    # ==========================================
    # 3. ACCIDENT SEVERITY ANALYSIS
    # ==========================================
    def get_severity_analysis(self, period: str = "2024") -> Dict[str, Any]:
        """Provides category-wise accident severity and casualty breakdown."""
        dataset_key = "severity_2024" if period == "2024" else "severity_2025_q1"
        period_label = "2024 (Full Year)" if period == "2024" else "2025 Q1 (Jan–Mar Provisional)"

        df = data_loader.get_df(dataset_key)
        m_row = data_loader.get_madurai_row(df)
        tot_row = data_loader.get_state_total_row(df)

        if m_row is None:
            raise ValueError(f"Madurai record not found in {dataset_key}")

        total_acc = safe_int(m_row["Total_Accidents"])
        fatal_acc = safe_int(m_row["Fatal_Accidents"])
        grievous_acc = safe_int(m_row["Grievous_Accidents"])
        minor_acc = safe_int(m_row["Minor_Accidents"])
        non_inj_acc = safe_int(m_row["Non_Injury_Accidents"])

        persons_killed = safe_int(m_row["Fatal_Persons_Killed"])
        grievous_inj = safe_int(m_row["Grievous_Persons_Injured"])
        minor_inj = safe_int(m_row["Minor_Persons_Injured"])
        total_inj = grievous_inj + minor_inj
        total_casualties = persons_killed + total_inj

        categories = [
            {
                "category": "Fatal",
                "label": "Fatal Accidents",
                "accidents": fatal_acc,
                "accidents_share": calc_rate(fatal_acc, total_acc),
                "fatalities": persons_killed,
                "injuries": 0,
                "fatalities_per_accident": calc_rate(persons_killed, fatal_acc, 1.0),
                "color": "#dc2626"
            },
            {
                "category": "Grievous_Injury",
                "label": "Grievous Injury Accidents",
                "accidents": grievous_acc,
                "accidents_share": calc_rate(grievous_acc, total_acc),
                "fatalities": 0,
                "injuries": grievous_inj,
                "injuries_per_accident": calc_rate(grievous_inj, grievous_acc, 1.0),
                "color": "#ea580c"
            },
            {
                "category": "Minor_Injury",
                "label": "Minor Injury Accidents",
                "accidents": minor_acc,
                "accidents_share": calc_rate(minor_acc, total_acc),
                "fatalities": 0,
                "injuries": minor_inj,
                "injuries_per_accident": calc_rate(minor_inj, minor_acc, 1.0),
                "color": "#f59e0b"
            },
            {
                "category": "Non_Injury",
                "label": "Non-Injury Accidents",
                "accidents": non_inj_acc,
                "accidents_share": calc_rate(non_inj_acc, total_acc),
                "fatalities": 0,
                "injuries": 0,
                "injuries_per_accident": 0.0,
                "color": "#10b981"
            }
        ]

        # Tamil Nadu State comparison
        state_total_acc = safe_int(tot_row["Total_Accidents"]) if tot_row is not None else 67183
        state_deaths = safe_int(tot_row["Fatal_Persons_Killed"]) if tot_row is not None else 18074
        state_injuries = safe_int(tot_row["Grievous_Persons_Injured"]) + safe_int(tot_row["Minor_Persons_Injured"]) if tot_row is not None else 71440

        state_comparison = {
            "madurai_severity_rate": calc_rate(persons_killed, total_acc),
            "state_severity_rate": calc_rate(state_deaths, state_total_acc),
            "madurai_fatal_acc_share": calc_rate(fatal_acc, total_acc),
            "state_fatal_acc_share": calc_rate(tot_row["Fatal_Accidents"], state_total_acc) if tot_row is not None else 25.72,
            "madurai_injuries_per_100_acc": calc_rate(total_inj, total_acc),
            "state_injuries_per_100_acc": calc_rate(state_injuries, state_total_acc)
        }

        return {
            "district": "Madurai District",
            "period": period_label,
            "total_accidents": total_acc,
            "total_fatalities": persons_killed,
            "total_injuries": total_inj,
            "total_casualties": total_casualties,
            "severity_rate": calc_rate(persons_killed, total_acc),
            "categories": categories,
            "casualty_distribution": {
                "fatalities": persons_killed,
                "fatalities_share": calc_rate(persons_killed, total_casualties),
                "grievous_injuries": grievous_inj,
                "grievous_injuries_share": calc_rate(grievous_inj, total_casualties),
                "minor_injuries": minor_inj,
                "minor_injuries_share": calc_rate(minor_inj, total_casualties),
            },
            "state_comparison": state_comparison
        }

    # ==========================================
    # 4. ROAD CATEGORY ANALYSIS (2025 Q1)
    # ==========================================
    def get_road_analysis(self) -> Dict[str, Any]:
        """Evaluates accidents, fatalities, and lethality by road classification."""
        df_road = data_loader.get_df("madurai_road_wise_2025_q1")
        if df_road.empty:
            raise ValueError("Madurai road-wise dataset is empty")

        row = df_road.iloc[0]
        total_acc = safe_int(row["Total_Accidents"])
        total_fat = safe_int(row["Total_Fatalities"])

        categories = []
        highest_risk_road = None
        max_deaths = -1

        for item in ROAD_CATEGORIES:
            k = item["key"]
            acc = safe_int(row[f"{k}_Accidents"])
            fat = safe_int(row[f"{k}_Fatalities"])
            acc_share = calc_rate(acc, total_acc)
            fat_share = calc_rate(fat, total_fat)
            lethality = calc_rate(fat, acc)

            cat_dict = {
                "key": k,
                "label": item["label"],
                "accidents": acc,
                "accidents_share": acc_share,
                "fatalities": fat,
                "fatalities_share": fat_share,
                "lethality_rate": lethality
            }
            categories.append(cat_dict)

            if fat > max_deaths:
                max_deaths = fat
                highest_risk_road = cat_dict

        key_findings = [
            f"State Highways (SH) present the highest absolute risk, accounting for {row['State_Highway_Accidents']} accidents (33.3%) and {row['State_Highway_Fatalities']} deaths (35.8%).",
            f"National Highways (NHAI & State PWD combined) account for {int(row['NH_NHAI_Accidents']) + int(row['NH_StatePWD_Accidents'])} accidents (35.8%) and {int(row['NH_NHAI_Fatalities']) + int(row['NH_StatePWD_Fatalities'])} fatalities (33.3%).",
            "Major District Roads (MDR) recorded 60 accidents and 17 deaths with a 28.3% lethality rate.",
            "Village and rural roads recorded lower crash volume (43 crashes) and the lowest lethality rate (20.9%)."
        ]

        return {
            "district": "Madurai District",
            "period": "January to March 2025 (Provisional Q1)",
            "total_accidents": total_acc,
            "total_fatalities": total_fat,
            "categories": categories,
            "highest_risk_road": highest_risk_road,
            "key_findings": key_findings
        }

    # ==========================================
    # 5. VEHICLE CATEGORY ANALYSIS (2025 Q1)
    # ==========================================
    def get_vehicle_analysis(self) -> Dict[str, Any]:
        """Evaluates accidents, fatalities, and crash risk by vehicle classification."""
        df_veh = data_loader.get_df("madurai_vehicle_wise_2025_q1")
        if df_veh.empty:
            raise ValueError("Madurai vehicle-wise dataset is empty")

        row = df_veh.iloc[0]
        total_acc = safe_int(row["Total_Accidents"])
        total_fat = safe_int(row["Total_Fatalities"])

        categories = []
        highest_vulnerable = None
        highest_lethal = None
        max_deaths = -1
        max_lethality = -1.0

        for item in VEHICLE_CATEGORIES:
            k = item["key"]
            acc = safe_int(row[f"{k}_Accidents"])
            fat = safe_int(row[f"{k}_Fatalities"])
            acc_share = calc_rate(acc, total_acc)
            fat_share = calc_rate(fat, total_fat)
            lethality = calc_rate(fat, acc)

            cat_dict = {
                "key": k,
                "label": item["label"],
                "accidents": acc,
                "accidents_share": acc_share,
                "fatalities": fat,
                "fatalities_share": fat_share,
                "fatality_rate_per_crash": lethality
            }
            categories.append(cat_dict)

            if fat > max_deaths:
                max_deaths = fat
                highest_vulnerable = cat_dict

            if lethality > max_lethality:
                max_lethality = lethality
                highest_lethal = cat_dict

        key_findings = [
            f"Two-Wheelers are the single most vulnerable vehicle class, involved in {row['Two_Wheeler_Accidents']} crashes (41.1%) and causing {row['Two_Wheeler_Fatalities']} deaths (41.5%).",
            f"Cars, Jeeps, and Light Motor Vehicles (LMVs) represent the second highest crash volume ({row['Car_Jeep_Taxi_Van_LMV_Accidents']} crashes, 26.4%).",
            f"Trucks and heavy lorries exhibit the highest lethality rate at 35.9% ({row['Truck_Lorry_Fatalities']} deaths from {row['Truck_Lorry_Accidents']} crashes).",
            "Auto Rickshaws exhibited the lowest fatality rate per crash at 19.4% (6 fatalities from 31 accidents)."
        ]

        return {
            "district": "Madurai District",
            "period": "January to March 2025 (Provisional Q1)",
            "total_accidents": total_acc,
            "total_fatalities": total_fat,
            "categories": categories,
            "highest_vulnerable_vehicle": highest_vulnerable,
            "highest_lethal_vehicle": highest_lethal,
            "key_findings": key_findings
        }

    # ==========================================
    # 6. HIT AND RUN ANALYSIS (DISTRICT VS CITY)
    # ==========================================
    def get_hit_and_run_analysis(self) -> Dict[str, Any]:
        """Compares Hit-and-Run incidence between Madurai District (Rural) and Madurai City."""
        df_hnr = data_loader.get_df("hit_and_run")
        comparison = []

        for idx, row in df_hnr.iterrows():
            dist_name = str(row["Districts"]).strip()
            is_city = "CITY" in dist_name.upper()
            j_info = JURISDICTIONS["CITY"] if is_city else JURISDICTIONS["RURAL"]

            tot_i = safe_int(row["Total Road Accidents - Incidence"])
            tot_v = safe_int(row["Total Road Accidents - Victims"])
            tot_r = safe_float(row["Total Road Accidents - Rate"])

            hnr_i = safe_int(row["Hit and Run - I"])
            hnr_v = safe_int(row["Hit and Run - V"])
            hnr_r = safe_float(row["Hit and Run - R"])
            hnr_pct = calc_rate(hnr_i, tot_i)

            oth_i = safe_int(row["Other Accidents - I"])
            oth_v = safe_int(row["Other Accidents - V"])
            oth_r = safe_float(row["Other Accidents - R"])

            comparison.append({
                "id": safe_int(row["_id"]),
                "jurisdiction_name": dist_name,
                "jurisdiction_title": j_info["name"],
                "jurisdiction_type": j_info["type"],
                "jurisdiction_description": j_info["description"],
                "total_accidents": tot_i,
                "total_victims": tot_v,
                "total_rate": tot_r,
                "hit_and_run_accidents": hnr_i,
                "hit_and_run_victims": hnr_v,
                "hit_and_run_rate": hnr_r,
                "hit_and_run_percentage": hnr_pct,
                "other_accidents": oth_i,
                "other_victims": oth_v,
                "other_rate": oth_r
            })

        insights = [
            "Madurai City Police jurisdiction reports a higher hit-and-run proportion: 19.02% of all accidents are hit-and-run, compared to 12.07% in Madurai District (Rural).",
            "In Madurai City, 35 out of 184 accidents were hit-and-run, involving 35 victims.",
            "In Madurai District (Rural), 71 out of 588 accidents were hit-and-run, involving 71 victims.",
            "Overall road accident incidence rate per unit population is higher in Madurai District (27.4) than in Madurai City (17.0), but city driving conditions see higher hit-and-run escape ratios."
        ]

        notes = "Rates represent official crime/accident incidence rates as recorded by police authorities per standard population unit (per 100,000 population). Denominators are jurisdiction-specific and must not be aggregated."

        return {
            "comparison": comparison,
            "rural_vs_city_insights": insights,
            "notes": notes
        }

    # ==========================================
    # 7. DATA EXPLORER & QUERY ENGINE
    # ==========================================
    def get_explorer_data(
        self,
        dataset_key: str = "districts_2021_2023",
        search: Optional[str] = None,
        district: Optional[str] = None,
        page: int = 1,
        page_size: int = 15
    ) -> Dict[str, Any]:
        """Provides filterable, paginated query access to any of the verified datasets."""
        df = data_loader.get_df(dataset_key)

        # Filter by district if supported
        district_col = None
        for col in ["District", "Districts", "DISTRICT/CITY"]:
            if col in df.columns:
                district_col = col
                break

        if district and isinstance(district, str) and district_col:
            df = df[df[district_col].str.upper() == district.upper()]

        # Filter by search string across text columns
        if search and isinstance(search, str):
            search_str = search.lower().strip()
            mask = df.apply(lambda row: row.astype(str).str.lower().str.contains(search_str, regex=False).any(), axis=1)
            df = df[mask]

        total_records = len(df)
        total_pages = max(1, (total_records + page_size - 1) // page_size)
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size

        paginated_df = df.iloc[start_idx:end_idx]

        return {
            "dataset_key": dataset_key,
            "total_records": total_records,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "columns": list(df.columns),
            "records": paginated_df.to_dict(orient="records"),
            "available_districts": data_loader.get_all_districts()
        }

# Global singleton
analytics_service = AnalyticsService()
