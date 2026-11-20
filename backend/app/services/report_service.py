"""
Report Generation Service using ReportLab.
Generates an executive PDF report: SafeRoad Analytics - Madurai Road Safety Exploration.
"""
import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)
from app.services.analytics_service import analytics_service

class ReportService:
    @staticmethod
    def generate_pdf_report() -> io.BytesIO:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()

        # Custom Palette
        primary_color = colors.HexColor("#1e3a8a")     # Navy Blue
        secondary_color = colors.HexColor("#2563eb")   # Blue Accent
        text_dark = colors.HexColor("#0f172a")         # Dark Slate
        bg_light = colors.HexColor("#f8fafc")          # Light Gray
        border_color = colors.HexColor("#cbd5e1")      # Border Slate
        highlight_red = colors.HexColor("#b91c1c")

        # Custom Styles
        title_style = ParagraphStyle(
            "DocTitle",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=18,
            leading=22,
            textColor=primary_color,
            spaceAfter=4
        )
        subtitle_style = ParagraphStyle(
            "DocSubTitle",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=10,
            leading=13,
            textColor=colors.HexColor("#475569"),
            spaceAfter=12
        )
        h1_style = ParagraphStyle(
            "Heading1_Custom",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=15,
            textColor=primary_color,
            spaceBefore=10,
            spaceAfter=6
        )
        body_style = ParagraphStyle(
            "Body_Custom",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8.5,
            leading=11,
            textColor=text_dark
        )
        body_bold = ParagraphStyle(
            "Body_Bold",
            parent=body_style,
            fontName="Helvetica-Bold"
        )
        meta_style = ParagraphStyle(
            "MetaText",
            parent=styles["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=7.5,
            leading=9,
            textColor=colors.HexColor("#64748b")
        )

        story = []

        # ==========================================
        # HEADER BLOCK
        # ==========================================
        story.append(Paragraph("SafeRoad Analytics – Road Accident Data Exploration", title_style))
        story.append(Paragraph(
            "Historical Accident Exploration & Severity Audit: <b>Madurai District, Tamil Nadu, India</b>",
            subtitle_style
        ))
        
        meta_text = (
            f"<b>Generated:</b> {datetime.now().strftime('%d %B %Y, %H:%M:%S')} | "
            f"<b>Source Authority:</b> Commissionerate of Transport & Road Safety, Govt. of Tamil Nadu | "
            f"<b>Mode:</b> Descriptive Data Exploration"
        )
        story.append(Paragraph(meta_text, meta_style))
        story.append(HRFlowable(width="100%", thickness=1.5, color=secondary_color, spaceBefore=4, spaceAfter=10))

        # Fetch Data
        dash = analytics_service.get_dashboard_summary()
        trends = analytics_service.get_trends_analysis()
        sev24 = analytics_service.get_severity_analysis("2024")
        road25 = analytics_service.get_road_analysis()
        veh25 = analytics_service.get_vehicle_analysis()
        hnr = analytics_service.get_hit_and_run_analysis()

        # ==========================================
        # SECTION 1: KEY PERFORMANCE INDICATORS
        # ==========================================
        story.append(Paragraph("1. Executive Summary & Key Indicators", h1_style))
        
        kpi_data = [
            [
                Paragraph("<b>Metric (2024 Full Year)</b>", body_bold),
                Paragraph("<b>Madurai Value</b>", body_bold),
                Paragraph("<b>YoY Change (vs 2023)</b>", body_bold),
                Paragraph("<b>State Benchmark / Rank</b>", body_bold)
            ],
            [
                Paragraph("Total Road Accidents", body_style),
                Paragraph(f"{dash['kpis_2024'][0]['value']:,}", body_bold),
                Paragraph(f"{dash['kpis_2024'][0]['change_percentage']}%", body_style),
                Paragraph(f"{dash['kpis_2024'][0]['badge']}", body_style)
            ],
            [
                Paragraph("Total Road Fatalities", body_style),
                Paragraph(f"{dash['kpis_2024'][1]['value']:,}", body_bold),
                Paragraph(f"{dash['kpis_2024'][1]['change_percentage']}%", body_style),
                Paragraph(f"{dash['kpis_2024'][1]['badge']}", body_style)
            ],
            [
                Paragraph("Persons Injured", body_style),
                Paragraph(f"{dash['kpis_2024'][2]['value']:,}", body_bold),
                Paragraph("633 Grievous, 1,632 Minor", meta_style),
                Paragraph("Total Casualties: 3,028", body_style)
            ],
            [
                Paragraph("Severity Rate (Deaths/100 Crashes)", body_style),
                Paragraph(f"{dash['kpis_2024'][3]['value']}", body_bold),
                Paragraph(f"{dash['kpis_2024'][3]['change_percentage']}% pts", body_style),
                Paragraph("TN State Avg: 26.90%", body_style)
            ],
            [
                Paragraph("Q1 2025 Provisional Snapshot", body_style),
                Paragraph(f"{dash['kpis_2025_q1'][0]['value']} Acc, {dash['kpis_2025_q1'][1]['value']} Deaths", body_bold),
                Paragraph("Jan – Mar 2025 (3 Months)", meta_style),
                Paragraph(f"Q1 Severity: {dash['kpis_2025_q1'][3]['value']}", body_style)
            ]
        ]

        t_kpi = Table(kpi_data, colWidths=[150, 100, 120, 170])
        t_kpi.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), bg_light),
            ('TEXTCOLOR', (0, 0), (-1, 0), primary_color),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 0.5, border_color),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ]))
        story.append(t_kpi)
        story.append(Spacer(1, 10))

        # ==========================================
        # SECTION 2: MULTI-YEAR TRENDS
        # ==========================================
        story.append(Paragraph("2. Multi-Year Accident & Fatality Trends (2021 – 2024)", h1_style))

        trend_data = [
            [
                Paragraph("<b>Year</b>", body_bold),
                Paragraph("<b>Madurai Accidents</b>", body_bold),
                Paragraph("<b>YoY Acc %</b>", body_bold),
                Paragraph("<b>Madurai Deaths</b>", body_bold),
                Paragraph("<b>YoY Death %</b>", body_bold),
                Paragraph("<b>Severity Rate</b>", body_bold),
                Paragraph("<b>TN State Severity</b>", body_bold),
            ]
        ]
        for idx, row in enumerate(trends["series"]):
            y_acc = f"{row['yoy_accident_growth']:+.1f}%" if row['yoy_accident_growth'] is not None else "-"
            y_fat = f"{row['yoy_fatality_growth']:+.1f}%" if row['yoy_fatality_growth'] is not None else "-"
            st_sev = f"{trends['state_benchmark_series'][idx]['state_severity_rate']}%"
            trend_data.append([
                Paragraph(str(row["year"]), body_bold),
                Paragraph(f"{row['accidents']:,}", body_style),
                Paragraph(y_acc, body_style),
                Paragraph(f"{row['fatalities']:,}", body_style),
                Paragraph(y_fat, body_style),
                Paragraph(f"{row['severity_rate']}%", body_bold),
                Paragraph(st_sev, body_style),
            ])

        t_trend = Table(trend_data, colWidths=[55, 95, 70, 85, 75, 80, 80])
        t_trend.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), bg_light),
            ('GRID', (0, 0), (-1, -1), 0.5, border_color),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ]))
        story.append(t_trend)
        story.append(Spacer(1, 10))

        # ==========================================
        # SECTION 3: ACCIDENT SEVERITY BREAKDOWN (2024)
        # ==========================================
        story.append(Paragraph("3. 2024 Accident Severity & Casualty Classification", h1_style))

        sev_data = [
            [
                Paragraph("<b>Classification Category</b>", body_bold),
                Paragraph("<b>Accident Count</b>", body_bold),
                Paragraph("<b>Share (%)</b>", body_bold),
                Paragraph("<b>Persons Killed</b>", body_bold),
                Paragraph("<b>Persons Injured</b>", body_bold),
                Paragraph("<b>Lethality / Impact</b>", body_bold),
            ]
        ]
        for c in sev24["categories"]:
            impact = f"{c['fatalities_per_accident']:.2f} deaths/crash" if c['fatalities'] > 0 else f"{c['injuries_per_accident']:.2f} inj/crash"
            sev_data.append([
                Paragraph(c["label"], body_style),
                Paragraph(f"{c['accidents']:,}", body_bold),
                Paragraph(f"{c['accidents_share']}%", body_style),
                Paragraph(f"{c['fatalities']:,}", body_style),
                Paragraph(f"{c['injuries']:,}", body_style),
                Paragraph(impact, meta_style),
            ])
        sev_data.append([
            Paragraph("<b>Total (2024 Full Year)</b>", body_bold),
            Paragraph(f"<b>{sev24['total_accidents']:,}</b>", body_bold),
            Paragraph("<b>100.0%</b>", body_bold),
            Paragraph(f"<b>{sev24['total_fatalities']:,}</b>", body_bold),
            Paragraph(f"<b>{sev24['total_injuries']:,}</b>", body_bold),
            Paragraph(f"<b>Severity: {sev24['severity_rate']}%</b>", body_bold),
        ])

        t_sev = Table(sev_data, colWidths=[140, 80, 60, 80, 80, 100])
        t_sev.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), bg_light),
            ('GRID', (0, 0), (-1, -1), 0.5, border_color),
            ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor("#f1f5f9")),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ]))
        story.append(t_sev)
        story.append(Spacer(1, 10))

        # ==========================================
        # SECTION 4 & 5: ROAD & VEHICLE DISTRIBUTION (2025 Q1)
        # ==========================================
        story.append(Paragraph("4. Road Infrastructure & Vehicular Risk Analysis (2025 Q1)", h1_style))

        road_veh_data = [
            [
                Paragraph("<b>Road Classification</b>", body_bold),
                Paragraph("<b>Accidents (%)</b>", body_bold),
                Paragraph("<b>Deaths (Lethality)</b>", body_bold),
                Paragraph("<b>Vehicle Type</b>", body_bold),
                Paragraph("<b>Accidents (%)</b>", body_bold),
                Paragraph("<b>Deaths (Lethality)</b>", body_bold),
            ]
        ]
        roads = road25["categories"]
        vehs = veh25["categories"]
        max_rows = max(len(roads), len(vehs))

        for r_i in range(max_rows):
            r = roads[r_i] if r_i < len(roads) else None
            v = vehs[r_i] if r_i < len(vehs) else None

            r_col1 = Paragraph(r["label"], body_style) if r else ""
            r_col2 = Paragraph(f"{r['accidents']} ({r['accidents_share']}%)", body_style) if r else ""
            r_col3 = Paragraph(f"{r['fatalities']} ({r['lethality_rate']}%)", body_bold if r and r['lethality_rate'] > 30 else body_style) if r else ""

            v_col1 = Paragraph(v["label"], body_style) if v else ""
            v_col2 = Paragraph(f"{v['accidents']} ({v['accidents_share']}%)", body_style) if v else ""
            v_col3 = Paragraph(f"{v['fatalities']} ({v['fatality_rate_per_crash']}%)", body_bold if v and v['fatality_rate_per_crash'] > 30 else body_style) if v else ""

            road_veh_data.append([r_col1, r_col2, r_col3, v_col1, v_col2, v_col3])

        t_rv = Table(road_veh_data, colWidths=[110, 75, 85, 110, 75, 85])
        t_rv.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), bg_light),
            ('GRID', (0, 0), (-1, -1), 0.5, border_color),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ]))
        story.append(t_rv)
        story.append(Spacer(1, 10))

        # ==========================================
        # SECTION 6: HIT AND RUN ANALYSIS
        # ==========================================
        story.append(Paragraph("5. Hit-and-Run Analysis: Madurai District (Rural) vs Madurai City", h1_style))

        hnr_data = [
            [
                Paragraph("<b>Administrative Jurisdiction</b>", body_bold),
                Paragraph("<b>Total Accidents</b>", body_bold),
                Paragraph("<b>Total Victims</b>", body_bold),
                Paragraph("<b>Hit & Run Cases</b>", body_bold),
                Paragraph("<b>H&R Victims</b>", body_bold),
                Paragraph("<b>H&R Share (%)</b>", body_bold),
                Paragraph("<b>Incidence Rate</b>", body_bold),
            ]
        ]
        for h in hnr["comparison"]:
            hnr_data.append([
                Paragraph(f"<b>{h['jurisdiction_title']}</b><br/><font color='#64748b' size='6.5'>{h['jurisdiction_type']}</font>", body_style),
                Paragraph(f"{h['total_accidents']:,}", body_style),
                Paragraph(f"{h['total_victims']:,}", body_style),
                Paragraph(f"{h['hit_and_run_accidents']:,}", body_bold),
                Paragraph(f"{h['hit_and_run_victims']:,}", body_style),
                Paragraph(f"{h['hit_and_run_percentage']}%", body_bold),
                Paragraph(f"{h['total_rate']} (H&R: {h['hit_and_run_rate']})", meta_style),
            ])

        t_hnr = Table(hnr_data, colWidths=[140, 65, 65, 75, 65, 65, 65])
        t_hnr.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), bg_light),
            ('GRID', (0, 0), (-1, -1), 0.5, border_color),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ]))
        story.append(t_hnr)
        story.append(Spacer(1, 10))

        # ==========================================
        # SECTION 7: METHODOLOGICAL NOTES & DISCLAIMER
        # ==========================================
        disclaimer_text = (
            "<b>Methodological & Analytical Compliance Notice:</b><br/>"
            "1. <b>Preservation of Source Ground Truth:</b> All data points correspond strictly to official publications from the State Crime Records Bureau (SCRB) and the Commissionerate of Transport & Road Safety, Government of Tamil Nadu.<br/>"
            "2. <b>Non-Equivalence of Reporting Periods:</b> Annual records (2021–2024) and Quarterly records (2025 Q1) are segregated to prevent statistical distortion.<br/>"
            "3. <b>Jurisdiction Segregation:</b> Madurai District Police (Rural) and Madurai City Police Commissionerate are distinct policing units with separate demographic denominators and must not be aggregated.<br/>"
            "4. <b>Accident vs. Victim Distinctions:</b> Crash counts represent incident occurrences; victim counts reflect casualties (persons killed or injured).<br/>"
            "5. <b>Descriptive Nature:</b> This report is purely descriptive. No predictive modeling or synthetic extrapolation has been performed."
        )
        story.append(Paragraph(disclaimer_text, meta_style))

        # Build document
        doc.build(story)
        buffer.seek(0)
        return buffer

report_service = ReportService()
