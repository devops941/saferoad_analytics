"""
Exploratory Data Analysis (EDA) Script for SafeRoad Analytics (Madurai District).
Performs:
1. Frequency Tables (Distributions across Road Categories, Vehicle Types, and Severity)
2. Cross-Tabulation (Road/Vehicle Categories cross-tabulated with Casualties and Lethality)
3. Percentage Analysis (YoY Growth rates, Lethality rates, Casualty shares)
4. Matplotlib Visualizations (Generates publication-quality charts saved to disk)
"""

import os
from pathlib import Path
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.ticker as mtick

# 1. Paths Setup
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
PLOTS_DIR = BASE_DIR / "reports" / "plots"
PLOTS_DIR.mkdir(parents=True, exist_ok=True)

# Set clean Matplotlib style
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.size'] = 10
plt.rcParams['figure.autolayout'] = True

print("=" * 80)
print("   SAFEROAD ANALYTICS - EXPLORATORY DATA ANALYSIS (EDA)")
print("   Focus: Madurai District Road Safety Intelligence")
print("=" * 80)

# ==============================================================================
# PART 1: LOAD OFFICIAL GOVERNMENT DATASETS VIA PANDAS
# ==============================================================================
df_road = pd.read_csv(DATA_DIR / "madurai_road_wise_accidents_fatalities_2025_q1.csv")
df_vehicle = pd.read_csv(DATA_DIR / "madurai_vehicle_wise_accidents_fatalities_2025_q1.csv")
df_severity_24 = pd.read_csv(DATA_DIR / "madurai_accident_severity_2024.csv")
df_trends = pd.read_csv(DATA_DIR / "tamilnadu_district_accidents_deaths_2021_2023.csv")
df_hnr = pd.read_csv(DATA_DIR / "madurai_hit_and_run.csv")

# Extract Madurai row from trends
m_trends = df_trends[df_trends["District"].str.upper() == "MADURAI"].iloc[0]

# ==============================================================================
# PART 2: FREQUENCY TABLES & PERCENTAGE ANALYSIS
# ==============================================================================
print("\n" + "#" * 80)
print("1. FREQUENCY TABLES & PERCENTAGE ANALYSIS")
print("#" * 80)

# A. Road Category Frequency Table
road_records = [
    {"Category": "NHAI NH", "Accidents": int(df_road["NH_NHAI_Accidents"].iloc[0]), "Fatalities": int(df_road["NH_NHAI_Fatalities"].iloc[0])},
    {"Category": "State PWD NH", "Accidents": int(df_road["NH_StatePWD_Accidents"].iloc[0]), "Fatalities": int(df_road["NH_StatePWD_Fatalities"].iloc[0])},
    {"Category": "State Highway (SH)", "Accidents": int(df_road["State_Highway_Accidents"].iloc[0]), "Fatalities": int(df_road["State_Highway_Fatalities"].iloc[0])},
    {"Category": "Major District Road", "Accidents": int(df_road["District_Road_Accidents"].iloc[0]), "Fatalities": int(df_road["District_Road_Fatalities"].iloc[0])},
    {"Category": "Village Road", "Accidents": int(df_road["Village_Road_Accidents"].iloc[0]), "Fatalities": int(df_road["Village_Road_Fatalities"].iloc[0])},
    {"Category": "Other/Municipal", "Accidents": int(df_road["Other_Roads_Accidents"].iloc[0]), "Fatalities": int(df_road["Other_Roads_Fatalities"].iloc[0])},
]
freq_road = pd.DataFrame(road_records)
total_road_acc = freq_road["Accidents"].sum()
total_road_fat = freq_road["Fatalities"].sum()

# Percentage calculations
freq_road["Accident_Share_%"] = (freq_road["Accidents"] / total_road_acc * 100).round(2)
freq_road["Fatality_Share_%"] = (freq_road["Fatalities"] / total_road_fat * 100).round(2)
freq_road["Lethality_Rate_%"] = (freq_road["Fatalities"] / freq_road["Accidents"] * 100).round(2)

print("\n--- [A] Road Infrastructure Frequency Table & Casualty Distribution ---")
print(freq_road.to_string(index=False))

# B. Vehicle Category Frequency Table
vehicle_records = [
    {"Vehicle_Type": "Two-Wheelers", "Accidents": int(df_vehicle["Two_Wheeler_Accidents"].iloc[0]), "Fatalities": int(df_vehicle["Two_Wheeler_Fatalities"].iloc[0])},
    {"Vehicle_Type": "Cars/Jeeps/LMV", "Accidents": int(df_vehicle["Car_Jeep_Taxi_Van_LMV_Accidents"].iloc[0]), "Fatalities": int(df_vehicle["Car_Jeep_Taxi_Van_LMV_Fatalities"].iloc[0])},
    {"Vehicle_Type": "Heavy Trucks/Lorries", "Accidents": int(df_vehicle["Truck_Lorry_Accidents"].iloc[0]), "Fatalities": int(df_vehicle["Truck_Lorry_Fatalities"].iloc[0])},
    {"Vehicle_Type": "Buses", "Accidents": int(df_vehicle["Bus_Accidents"].iloc[0]), "Fatalities": int(df_vehicle["Bus_Fatalities"].iloc[0])},
    {"Vehicle_Type": "Auto Rickshaws", "Accidents": int(df_vehicle["Auto_Rickshaw_Accidents"].iloc[0]), "Fatalities": int(df_vehicle["Auto_Rickshaw_Fatalities"].iloc[0])},
    {"Vehicle_Type": "Other Vehicles", "Accidents": int(df_vehicle["Other_Vehicles_Accidents"].iloc[0]), "Fatalities": int(df_vehicle["Other_Vehicles_Fatalities"].iloc[0])},
]
freq_vehicle = pd.DataFrame(vehicle_records)
total_veh_acc = freq_vehicle["Accidents"].sum()
total_veh_fat = freq_vehicle["Fatalities"].sum()

freq_vehicle["Accident_Share_%"] = (freq_vehicle["Accidents"] / total_veh_acc * 100).round(2)
freq_vehicle["Fatality_Share_%"] = (freq_vehicle["Fatalities"] / total_veh_fat * 100).round(2)
freq_vehicle["Lethality_Rate_%"] = (freq_vehicle["Fatalities"] / freq_vehicle["Accidents"] * 100).round(2)

print("\n--- [B] Vehicle Category Frequency Table & Vulnerability Analysis ---")
print(freq_vehicle.to_string(index=False))

# ==============================================================================
# PART 3: CROSS-TABULATION (CROSSTAB & PIVOT)
# ==============================================================================
print("\n" + "#" * 80)
print("2. CROSS-TABULATION ANALYSIS")
print("#" * 80)

# A. Cross-tabulation of Accident Severity (2024 Full Year)
sev_row = df_severity_24.iloc[0]
severity_records = [
    {"Severity_Level": "Fatal Accidents", "Accident_Frequency": int(sev_row["Fatal_Accidents"]), "Persons_Killed": int(sev_row["Fatal_Persons_Killed"]), "Persons_Injured": 0},
    {"Severity_Level": "Grievous Injury", "Accident_Frequency": int(sev_row["Grievous_Accidents"]), "Persons_Killed": 0, "Persons_Injured": int(sev_row["Grievous_Persons_Injured"])},
    {"Severity_Level": "Minor Injury", "Accident_Frequency": int(sev_row["Minor_Accidents"]), "Persons_Killed": 0, "Persons_Injured": int(sev_row["Minor_Persons_Injured"])},
    {"Severity_Level": "Non-Injury", "Accident_Frequency": int(sev_row["Non_Injury_Accidents"]), "Persons_Killed": 0, "Persons_Injured": 0},
]
crosstab_sev = pd.DataFrame(severity_records)
total_sev_acc = crosstab_sev["Accident_Frequency"].sum()
crosstab_sev["Accident_Distribution_%"] = (crosstab_sev["Accident_Frequency"] / total_sev_acc * 100).round(2)

print("\n--- [A] Cross-Tabulation: Accident Severity Level vs Casualties (2024) ---")
print(crosstab_sev.to_string(index=False))

# B. Cross-tabulation of Police Jurisdiction vs Hit-and-Run Incidents
hnr_records = []
for _, row in df_hnr.iterrows():
    jurisdiction = str(row["Districts"]).strip()
    total_acc = int(row["Total Road Accidents - Incidence"])
    total_victims = int(row["Total Road Accidents - Victims"])
    hnr_acc = int(row["Hit and Run - I"])
    other_acc = int(row["Other Accidents - I"])
    hnr_rate = round((hnr_acc / total_acc) * 100, 2)
    hnr_records.append({
        "Jurisdiction": jurisdiction,
        "Total_Crashes": total_acc,
        "Hit_and_Run_Crashes": hnr_acc,
        "Other_Crashes": other_acc,
        "Hit_and_Run_Percentage_%": hnr_rate,
        "Total_Victims": total_victims
    })
crosstab_hnr = pd.DataFrame(hnr_records)

print("\n--- [B] Cross-Tabulation: Police Jurisdiction vs Hit-and-Run Incidents ---")
print(crosstab_hnr.to_string(index=False))

# ==============================================================================
# PART 4: MULTI-YEAR TREND & PERCENTAGE GROWTH ANALYSIS
# ==============================================================================
print("\n" + "#" * 80)
print("3. MULTI-YEAR TREND & PERCENTAGE GROWTH ANALYSIS (2021-2024)")
print("#" * 80)

trends_records = [
    {"Year": 2021, "Accidents": int(m_trends["Total Accidents 2021"]), "Fatalities": int(m_trends["Total Deaths 2021"])},
    {"Year": 2022, "Accidents": int(m_trends["Total Accidents 2022"]), "Fatalities": int(m_trends["Total Deaths 2022"])},
    {"Year": 2023, "Accidents": int(m_trends["Total Accidents 2023"]), "Fatalities": int(m_trends["Total Deaths 2023"])},
    {"Year": 2024, "Accidents": int(sev_row["Total_Accidents"]), "Fatalities": int(sev_row["Fatal_Persons_Killed"])},
]
df_multiyear = pd.DataFrame(trends_records)
df_multiyear["Severity_Index_%"] = (df_multiyear["Fatalities"] / df_multiyear["Accidents"] * 100).round(2)
df_multiyear["Accident_YoY_Growth_%"] = df_multiyear["Accidents"].pct_change().mul(100).round(2)
df_multiyear["Fatality_YoY_Growth_%"] = df_multiyear["Fatalities"].pct_change().mul(100).round(2)

# Format for display
df_display = df_multiyear.copy()
df_display["Accident_YoY_Growth_%"] = df_display["Accident_YoY_Growth_%"].map(lambda x: f"{x:.2f}%" if pd.notnull(x) else "-")
df_display["Fatality_YoY_Growth_%"] = df_display["Fatality_YoY_Growth_%"].map(lambda x: f"{x:.2f}%" if pd.notnull(x) else "-")
print("\n--- [A] 4-Year Longitudinal Trend & Percentage Growth ---")
print(df_display.to_string(index=False))

# ==============================================================================
# PART 5: MATPLOTLIB VISUALIZATIONS GENERATION
# ==============================================================================
print("\n" + "#" * 80)
print("4. GENERATING MATPLOTLIB VISUALIZATIONS")
print("#" * 80)

# Chart 1: Grouped Bar Chart - Road Infrastructure Comparison
fig, ax1 = plt.subplots(figsize=(10, 5.5))
bar_width = 0.38
x_indices = range(len(freq_road))

rects1 = ax1.bar([x - bar_width/2 for x in x_indices], freq_road["Accidents"], width=bar_width, label="Accidents (Q1 2025)", color="#2563eb", edgecolor="none")
rects2 = ax1.bar([x + bar_width/2 for x in x_indices], freq_road["Fatalities"], width=bar_width, label="Fatalities (Q1 2025)", color="#dc2626", edgecolor="none")

ax1.set_title("Madurai Road Infrastructure: Accident & Fatality Distribution (Pandas & Matplotlib)", fontsize=13, weight="bold", pad=15)
ax1.set_ylabel("Incident Frequency Count", fontsize=11, weight="bold")
ax1.set_xticks(x_indices)
ax1.set_xticklabels(freq_road["Category"], rotation=15, ha="right", fontsize=9.5)
ax1.legend(loc="upper right", frameon=True)
ax1.grid(axis='y', linestyle='--', alpha=0.6)

# Annotate values
for rect in rects1:
    h = rect.get_height()
    ax1.annotate(f"{h}", xy=(rect.get_x() + rect.get_width() / 2, h), xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', fontsize=9)
for rect in rects2:
    h = rect.get_height()
    ax1.annotate(f"{h}", xy=(rect.get_x() + rect.get_width() / 2, h), xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', fontsize=9, color="#991b1b", weight="bold")

plot_1_path = PLOTS_DIR / "01_road_category_distribution.png"
plt.savefig(plot_1_path, dpi=200, bbox_inches='tight')
plt.close()
print(f"[+] Saved Chart 1: {plot_1_path}")

# Chart 2: Horizontal Bar Chart - Collision Lethality Rate by Vehicle Type
fig, ax2 = plt.subplots(figsize=(9, 5))
sorted_vehicle = freq_vehicle.sort_values(by="Lethality_Rate_%", ascending=True)

bars = ax2.barh(sorted_vehicle["Vehicle_Type"], sorted_vehicle["Lethality_Rate_%"], color="#ea580c", height=0.55)
ax2.set_title("Collision Lethality Rate by Vehicle Type (%) in Madurai", fontsize=13, weight="bold", pad=15)
ax2.set_xlabel("Lethality Rate (Deaths per 100 Accidents %)", fontsize=11, weight="bold")
ax2.set_xlim(0, 45)
ax2.xaxis.set_major_formatter(mtick.PercentFormatter())
ax2.grid(axis='x', linestyle='--', alpha=0.6)

for bar in bars:
    w = bar.get_width()
    ax2.annotate(f"{w:.2f}%", xy=(w, bar.get_y() + bar.get_height() / 2), xytext=(5, 0), textcoords="offset points", ha='left', va='center', fontsize=9.5, weight="bold")

plot_2_path = PLOTS_DIR / "02_vehicle_vulnerability_lethality.png"
plt.savefig(plot_2_path, dpi=200, bbox_inches='tight')
plt.close()
print(f"[+] Saved Chart 2: {plot_2_path}")

# Chart 3: Donut Chart - Accident Severity Breakdown (2024)
fig, ax3 = plt.subplots(figsize=(7, 7))
colors = ["#dc2626", "#ea580c", "#f59e0b", "#10b981"]
wedges, texts, autotexts = ax3.pie(
    crosstab_sev["Accident_Frequency"],
    labels=crosstab_sev["Severity_Level"],
    autopct="%1.1f%%",
    startangle=140,
    colors=colors,
    pctdistance=0.8,
    textprops=dict(color="#1f2937", fontsize=10, weight="bold"),
    wedgeprops=dict(width=0.45, edgecolor='white', linewidth=2)
)
ax3.set_title("Madurai Accident Severity Breakdown (2024 - 2,497 Total Crashes)", fontsize=12.5, weight="bold", pad=15)

plot_3_path = PLOTS_DIR / "03_accident_severity_distribution.png"
plt.savefig(plot_3_path, dpi=200, bbox_inches='tight')
plt.close()
print(f"[+] Saved Chart 3: {plot_3_path}")

# Chart 4: Multi-Year Trends (2021-2024) Line Plot
fig, ax4 = plt.subplots(figsize=(9, 5))
ax5 = ax4.twinx()

line1 = ax4.plot(df_multiyear["Year"], df_multiyear["Accidents"], marker='o', linewidth=2.5, color='#2563eb', label="Accidents")
line2 = ax5.plot(df_multiyear["Year"], df_multiyear["Fatalities"], marker='s', linewidth=2.5, color='#dc2626', linestyle='--', label="Fatalities")

ax4.set_title("Longitudinal Road Safety Trends in Madurai (2021–2024)", fontsize=13, weight="bold", pad=15)
ax4.set_xlabel("Year", fontsize=11, weight="bold")
ax4.set_ylabel("Total Accidents", color='#2563eb', fontsize=11, weight="bold")
ax5.set_ylabel("Total Fatalities", color='#dc2626', fontsize=11, weight="bold")
ax4.set_xticks(df_multiyear["Year"])

lines = line1 + line2
labels = [l.get_label() for l in lines]
ax4.legend(lines, labels, loc="upper right", frameon=True)
ax4.grid(True, linestyle='--', alpha=0.5)

plot_4_path = PLOTS_DIR / "04_yearly_trends_2021_2024.png"
plt.savefig(plot_4_path, dpi=200, bbox_inches='tight')
plt.close()
print(f"[+] Saved Chart 4: {plot_4_path}")

print("\n" + "=" * 80)
print("SUCCESS: All frequency tables, cross-tabulations, percentages & Matplotlib plots completed!")
print("=" * 80)
