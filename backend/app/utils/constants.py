"""
Constants and static configurations for SafeRoad Analytics.
"""

DISTRICT_FOCUS = "MADURAI"
STATE_FOCUS = "TAMIL NADU"

ROAD_CATEGORIES = [
    {"key": "NH_NHAI", "label": "National Highway (NHAI)"},
    {"key": "NH_StatePWD", "label": "National Highway (State PWD)"},
    {"key": "State_Highway", "label": "State Highway (SH)"},
    {"key": "District_Road", "label": "Major District Road (MDR)"},
    {"key": "Village_Road", "label": "Village / Rural Road"},
    {"key": "Other_Roads", "label": "Other / Municipal Roads"},
]

VEHICLE_CATEGORIES = [
    {"key": "Two_Wheeler", "label": "Two Wheeler (Motorcycle/Scooter)"},
    {"key": "Car_Jeep_Taxi_Van_LMV", "label": "Car / Jeep / Taxi / Van / LMV"},
    {"key": "Bus", "label": "Bus (Public & Private)"},
    {"key": "Truck_Lorry", "label": "Truck / Heavy Lorry"},
    {"key": "Auto_Rickshaw", "label": "Auto Rickshaw (3-Wheeler)"},
    {"key": "Other_Vehicles", "label": "Other Vehicles / Tractors"},
]

SEVERITY_CATEGORIES = [
    {"key": "Fatal", "label": "Fatal Crashes", "color": "#dc2626"},
    {"key": "Grievous", "label": "Grievous Injury Crashes", "color": "#ea580c"},
    {"key": "Minor", "label": "Minor Injury Crashes", "color": "#f59e0b"},
    {"key": "Non_Injury", "label": "Non-Injury Crashes", "color": "#10b981"},
]

JURISDICTIONS = {
    "RURAL": {
        "name": "Madurai District Police (Rural)",
        "type": "Superintendent of Police Jurisdiction",
        "description": "Covers rural and taluk areas outside Madurai City corporation"
    },
    "CITY": {
        "name": "Madurai City Police",
        "type": "Commissioner of Police Jurisdiction",
        "description": "Covers urban agglomeration and Madurai Municipal Corporation limits"
    }
}
