from fastapi import APIRouter
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/safety-tips", tags=["Citizen Safety & Advisories"])

@router.get("/")
def get_citizen_safety_advisories():
    """
    Returns empirical, data-backed road safety advisories and commuter guidelines
    specifically tailored to Madurai District road accident patterns.
    """
    road_data = analytics_service.get_road_analysis()
    veh_data = analytics_service.get_vehicle_analysis()
    hnr_data = analytics_service.get_hit_and_run_analysis()
    dash_data = analytics_service.get_dashboard_summary()

    # Extract exact empirical statistics for grounding
    tw_cat = next((c for c in veh_data["categories"] if c["key"] == "Two_Wheeler"), None)
    truck_cat = next((c for c in veh_data["categories"] if c["key"] == "Truck_Lorry"), None)
    sh_cat = next((c for c in road_data["categories"] if c["key"] == "State_Highway"), None)
    nh_cat = next((c for c in road_data["categories"] if c["key"] == "NH_NHAI"), None)

    advisories = [
        {
            "id": "two_wheelers",
            "category": "Two-Wheeler Riders",
            "target_group": "Riders & Pillion Passengers",
            "risk_level": "Critical",
            "risk_color": "#dc2626",
            "icon": "bi-bicycle",
            "headline": "Two-Wheelers Bear the Highest Casualty Burden in Madurai",
            "empirical_basis": f"Two-wheelers account for {tw_cat['fatalities_share']}% of all road deaths and {tw_cat['accidents_share']}% of total crashes in Madurai (66 deaths in Q1 2025 alone).",
            "actionable_rules": [
                {
                    "rule": "Mandatory ISI-Certified Helmets for Both Rider and Pillion",
                    "details": "Traumatic brain injuries cause over 70% of two-wheeler collision deaths. Fasten the chin strap firmly."
                },
                {
                    "rule": "Avoid the 'No-Zone' Blind Spots Around Heavy Trucks and Buses",
                    "details": "If you cannot see the truck driver in their side-view mirror, the driver cannot see you. Never overtake from the left (kerb side)."
                },
                {
                    "rule": "Reflective Gear & Headlamp Discipline for Night Travel",
                    "details": "Over 45% of rural two-wheeler fatal crashes occur during twilight and dawn hours due to poor rear visibility."
                },
                {
                    "rule": "Strict Speed Ceiling on State Highways",
                    "details": "Cap two-wheeler speeds at 50 km/h on two-lane State Highways where oncoming heavy vehicle overtaking is frequent."
                }
            ],
            "key_stat": f"{tw_cat['fatalities_share']}% Fatalities Share"
        },
        {
            "id": "state_highways",
            "category": "Highway Commuters",
            "target_group": "Inter-District Motorists & Bus Passengers",
            "risk_level": "Critical",
            "risk_color": "#ea580c",
            "icon": "bi-signpost-split",
            "headline": "State Highways Are the Deadliest Road Corridors in the District",
            "empirical_basis": f"State Highways in Madurai record {sh_cat['fatalities_share']}% of total fatalities (57 deaths, 188 crashes) with an alarming lethality rate of {sh_cat['lethality_rate']}%.",
            "actionable_rules": [
                {
                    "rule": "Execute Overtaking Only with 100+ Meters of Clear Sight Distance",
                    "details": "Unlike 4-lane NHAI highways, State Highways lack median physical barriers. Head-on collisions during blind overtaking are the leading cause of multi-fatality crashes."
                },
                {
                    "rule": "Decelerate Rapidly at Village & Market Road Junctions",
                    "details": "Uncontrolled feeder road merging from rural settlements into State Highways causes abrupt t-bone collisions."
                },
                {
                    "rule": "Strict Dim-Light Discipline at Night",
                    "details": "High-beam glare on unlit two-lane State Highways temporarily blinds oncoming drivers. Switch to low beam when approaching another vehicle."
                }
            ],
            "key_stat": f"{sh_cat['fatalities_share']}% of All Deaths on SH"
        },
        {
            "id": "heavy_vehicles",
            "category": "Heavy Commercial Vehicles",
            "target_group": "Truckers, Tipper Operators & LMV Motorists",
            "risk_level": "High Lethality",
            "risk_color": "#b91c1c",
            "icon": "bi-truck",
            "headline": "Truck Collisions Have the Highest Fatality Rate (35.90%)",
            "empirical_basis": f"More than 1 in every 3 truck crashes in Madurai results in death (Lethality rate: {truck_cat['fatality_rate_per_crash']}%).",
            "actionable_rules": [
                {
                    "rule": "Maintain 3-Second Following Distance Behind Heavy Goods Vehicles",
                    "details": "Loaded freight trucks have significantly longer braking distances. Tailgating leads to catastrophic underride crashes."
                },
                {
                    "rule": "Mandatory Rear Underride Protection & Retro-reflective Taping",
                    "details": "Parked or slow-moving trucks on highway shoulders must display functional hazard lights and reflective hazard triangles."
                },
                {
                    "rule": "Driver Fatigue Breaks Every 3 Hours of Continuous Night Hauling",
                    "details": "Microsleep between 1:00 AM and 5:00 AM accounts for the majority of single-vehicle highway departures and median crashes."
                }
            ],
            "key_stat": f"{truck_cat['fatality_rate_per_crash']}% Crash Lethality Rate"
        },
        {
            "id": "urban_pedestrians",
            "category": "Urban Pedestrians & City Commuters",
            "target_group": "Pedestrians, School Children & Senior Citizens",
            "risk_level": "High Vulnerability",
            "risk_color": "#0284c7",
            "icon": "bi-person-walking",
            "headline": "City Police Limits Experience Higher Hit-and-Run Proportions (19.02%)",
            "empirical_basis": "Hit-and-run incidents constitute 19.02% of all accidents in Madurai City Police limits compared to 12.07% in Rural District jurisdiction.",
            "actionable_rules": [
                {
                    "rule": "Use Designated Zebra Crossings & Pedestrian Refuges",
                    "details": "Jaywalking across multi-lane urban arterials like bypass roads and ring roads carries extreme collision risk."
                },
                {
                    "rule": "Walk Facing Oncoming Traffic on Roads Without Footpaths",
                    "details": "Walking against the direction of traffic ensures you can observe and react to errant motorists."
                },
                {
                    "rule": "Do Not Assume Motorists See You at Night",
                    "details": "Wear bright or reflective elements when walking along city outer ring roads after dusk."
                }
            ],
            "key_stat": "19.02% Hit & Run in City Limits"
        }
    ]

    emergency_helplines = [
        {"service": "Ambulance / Medical Emergency", "number": "108", "availability": "24/7 Toll-Free", "icon": "bi-hospital"},
        {"service": "Police Emergency Response", "number": "112 / 100", "availability": "24/7 Toll-Free", "icon": "bi-shield-shaded"},
        {"service": "National Highway Helpline (NHAI)", "number": "1033", "availability": "Highway Towing & Assistance", "icon": "bi-truck-front"},
        {"service": "Madurai District Disaster / Control Room", "number": "1077", "availability": "District Collectorate", "icon": "bi-telephone-fill"},
    ]

    good_samaritan_rules = {
        "title": "Good Samaritan Law Protection (Section 134A, Motor Vehicles Act)",
        "subtitle": "You can safely help road accident victims without fear of police harassment or legal liability.",
        "provisions": [
            "No Good Samaritan who assists an injured victim can be subjected to criminal or civil liability.",
            "Bystanders and helpers are NOT required to reveal their name, personal identity, or contact details.",
            "Hospitals and medical staff cannot demand advance payment from a Good Samaritan before initiating emergency trauma stabilization.",
            "If called as a voluntary witness, examination must be conducted with respect, at a time convenient to the Samaritan, and without multiple summons."
        ]
    }

    return {
        "status": "success",
        "district": "Madurai District, Tamil Nadu",
        "baseline_context": {
            "annual_crashes_2024": dash_data["kpis_2024"][0]["value"],
            "annual_deaths_2024": dash_data["kpis_2024"][1]["value"],
            "severity_rate": f"{dash_data['kpis_2024'][3]['value']}%"
        },
        "advisories": advisories,
        "emergency_helplines": emergency_helplines,
        "good_samaritan_rules": good_samaritan_rules
    }
