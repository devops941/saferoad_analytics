import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const pageTitles = {
  '/': { title: 'Executive Dashboard', period: '2024 Full Year & 2025 Q1' },
  '/trends': { title: 'Yearly Accident & Death Trends', period: '2021 – 2024 (Annual Series)' },
  '/severity': { title: 'Accident Severity & Impact Analysis', period: '2024 & 2025 Q1' },
  '/roads': { title: 'Road Infrastructure Category Analysis', period: '2025 Q1 (Provisional)' },
  '/vehicles': { title: 'Vehicle Type & Vulnerability Analysis', period: '2025 Q1 (Provisional)' },
  '/hit-and-run': { title: 'Hit & Run Jurisdictional Comparison', period: 'District vs. City Police' },
  '/explorer': { title: 'Multi-Dataset Explorer & Filters', period: 'All 10 Government Datasets' },
  '/reports': { title: 'Official PDF Audit Report', period: 'Formal Executive Summary' },
};

const Header = ({ onOpenMobile }) => {
  const location = useLocation();
  const current = pageTitles[location.pathname] || { title: 'Analytics', period: 'Madurai District' };

  return (
    <header className="bg-white border-bottom sticky-top top-nav px-3 px-lg-4 py-2 d-flex align-items-center justify-content-between shadow-sm">
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-outline-secondary btn-sm d-lg-none" onClick={onOpenMobile}>
          <i className="bi bi-list fs-5"></i>
        </button>

        <div>
          <div className="d-flex align-items-center gap-2">
            <h2 className="h5 fw-bold mb-0 text-dark">{current.title}</h2>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2 py-1 small">
              <i className="bi bi-geo-alt-fill me-1"></i> Madurai District, Tamil Nadu
            </span>
          </div>
          <span className="text-secondary small d-none d-sm-inline" style={{ fontSize: '0.75rem' }}>
            Reporting Scope: <b>{current.period}</b>
          </span>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2">
        <Link to="/reports" className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1 shadow-sm">
          <i className="bi bi-file-earmark-pdf"></i>
          <span className="d-none d-md-inline">Download PDF</span>
        </Link>
        <span className="badge bg-light text-secondary border px-2 py-1 small">
          v1.0.0
        </span>
      </div>
    </header>
  );
};

export default Header;
