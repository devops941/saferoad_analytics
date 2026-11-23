import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const pageMeta = {
  '/': {
    title: 'SafeRoad Analytics Portal',
    subtitle: 'Madurai District road accident intelligence, descriptive analytics, and commuter safety portal',
    category: 'Welcome Portal',
    period: 'Empirical Records',
    badge: 'Official Portal',
  },
  '/dashboard': {
    title: 'Executive Road Safety Dashboard',
    subtitle: 'Macro crash metrics, casualty distribution, and multi-year trajectory for Madurai District',
    category: 'Executive Overview',
    period: '2024 Full Year & 2025 Q1',
    badge: 'Consolidated Analytics',
  },
  '/trends': {
    title: 'Multi-Year Accident & Fatality Trends',
    subtitle: 'Longitudinal analysis (2021–2024), YoY growth rates, and Tamil Nadu state benchmarking',
    category: 'Historical Trends',
    period: '2021 – 2024 (Annual Series)',
    badge: 'Longitudinal Data',
  },
  '/severity': {
    title: 'Crash Severity & Casualty Impact Analysis',
    subtitle: 'Severity rate (deaths per 100 crashes), injury classifications, and casualty distributions',
    category: 'Severity Profiling',
    period: '2024 & 2025 Q1',
    badge: 'MoRTH Severity Index',
  },
  '/roads': {
    title: 'Road Infrastructure & Corridor Risk Analysis',
    subtitle: 'Crash density and fatality lethality across National Highways, State Highways, and Rural roads',
    category: 'Infrastructure Risk',
    period: '2025 Q1 (Provisional)',
    badge: 'Corridor Analysis',
  },
  '/gis-map': {
    title: 'Madurai GIS Road Network Map',
    subtitle: 'Interactive geospatial visualization of verified National Highways, State Highways, and district connectors',
    category: 'Geospatial Analytics',
    period: 'Verified Corridors',
    badge: 'OpenStreetMap GIS',
  },
  '/vehicles': {
    title: 'Vehicle Vulnerability & Modal Crash Share',
    subtitle: 'Modal vulnerability profiling, two-wheeler casualty burden, and heavy vehicle collision lethality',
    category: 'Vehicle Dynamics',
    period: '2025 Q1 (Provisional)',
    badge: 'Modal Profiling',
  },
  '/hit-and-run': {
    title: 'Hit & Run Jurisdictional Comparison',
    subtitle: 'Empirical comparison between Madurai District (Rural Police) and Madurai City Police Commissionerate',
    category: 'Enforcement & Crime',
    period: 'District vs. City Police',
    badge: 'Jurisdiction Disparity',
  },
  '/explorer': {
    title: 'Government Tabular Data Explorer',
    subtitle: 'Multi-dataset filtering, district cross-comparison, search indexing, and CSV data extraction',
    category: 'Open Data Sandbox',
    period: 'All 10 Government Datasets',
    badge: 'Tabular Repository',
  },
  '/reports': {
    title: 'Executive Road Safety Audit & Reports',
    subtitle: 'Methodology documentation, official analytical findings, and formal PDF generation engine',
    category: 'Compliance & Reports',
    period: 'Formal Executive Summary',
    badge: 'ReportLab PDF Stream',
  },
  '/upload': {
    title: 'Data Ingestion & Dataset Upload',
    subtitle: 'Upload, validate, and hot-reload updated CSV accident records and road datasets for Madurai District',
    category: 'Data Management',
    period: 'CSV Ingestion Engine',
    badge: 'Upload & Validate',
  },
  '/safety-tips': {
    title: 'Citizen Road Safety Advisories & Guidelines',
    subtitle: 'Evidence-based defensive driving and commuting guidelines rooted in empirical Madurai crash patterns',
    category: 'Citizen Awareness',
    period: 'Madurai Commuters',
    badge: 'Public Guidance',
  },
};

const Header = ({ onOpenMobile }) => {
  const location = useLocation();
  const current = pageMeta[location.pathname] || {
    title: 'Road Accident Intelligence',
    subtitle: 'Descriptive road safety exploration for Madurai District, Tamil Nadu',
    category: 'Analytics',
    period: 'Madurai District',
    badge: 'SCRB Data',
  };

  return (
    <header
      className="top-nav px-3 px-lg-4 d-flex align-items-center justify-content-between"
      style={{
        minHeight: '70px',
        paddingTop: '10px',
        paddingBottom: '10px',
      }}
    >
      {/* Left: Mobile Toggle & Page Title */}
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-outline-secondary btn-sm d-lg-none shadow-sm"
          onClick={onOpenMobile}
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list fs-5"></i>
        </button>

        <div className="d-flex flex-column justify-content-center">
          {/* Main Page Title and Location Badge */}
          <div className="d-flex align-items-center flex-wrap gap-2">
            <h1
              className="h5 fw-bold mb-0 text-dark"
              style={{ letterSpacing: '-0.02em', fontSize: '1.15rem' }}
            >
              {current.title}
            </h1>
            <span
              className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle px-2 py-0.5 d-inline-flex align-items-center gap-1"
              style={{ fontSize: '0.72rem' }}
            >
              <i className="bi bi-geo-alt-fill text-primary"></i> Madurai, Tamil Nadu
            </span>
          </div>

          {/* Subtitle Description */}
          <p
            className="text-secondary small mb-0 d-none d-md-block"
            style={{ fontSize: '0.78rem', marginTop: '2px' }}
          >
            {current.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="d-flex align-items-center gap-2 flex-shrink-0">
        <span
          className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5 d-none d-sm-inline-flex align-items-center shadow-sm"
          style={{ fontSize: '0.74rem', fontWeight: 600 }}
        >
          <span className="pulse-dot"></span>
          Live Analytics
        </span>

        <Link
          to="/reports"
          className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1.5 shadow-sm px-3 py-1.5 rounded-3 hover-lift"
          style={{
            fontSize: '0.82rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
            border: 'none',
          }}
        >
          <i className="bi bi-file-earmark-pdf fs-6"></i>
          <span className="d-none d-md-inline">PDF Report</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
