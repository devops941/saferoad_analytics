import React, { useState } from 'react';
import { api } from '../services/api.js';

const ReportsPage = () => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError(null);
      setDownloadSuccess(false);

      const blob = await api.downloadPDFReport();
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `SafeRoad_Analytics_Madurai_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setDownloadSuccess(true);
    } catch (err) {
      console.error('Failed to download PDF report:', err);
      setError('Unable to download PDF report. Ensure the FastAPI backend server is running.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Executive Scope Header */}
      <div className="executive-banner p-3 p-lg-3.5 d-flex justify-content-between align-items-center flex-wrap gap-3 animate-slide-up">
        <div className="d-flex align-items-center gap-3">
          <div className="icon-badge icon-badge-blue" style={{ width: '44px', height: '44px', fontSize: '1.25rem' }}>
            <i className="bi bi-file-earmark-pdf"></i>
          </div>
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h2 className="h6 fw-bold text-dark mb-0" style={{ letterSpacing: '-0.01em', fontSize: '1rem' }}>
                Official Executive Road Safety Audit & Report Generator
              </h2>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-0.5" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                ReportLab Engine
              </span>
            </div>
            <p className="text-secondary small mb-0" style={{ fontSize: '0.82rem' }}>
              Generate and stream formal, publication-ready road accident exploration reports for Madurai District, Tamil Nadu.
            </p>
          </div>
        </div>
        <span className="badge bg-light text-secondary border px-2.5 py-1.5 shadow-sm" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
          <i className="bi bi-file-earmark-check text-success me-1"></i> SCRB Verified Synthesis
        </span>
      </div>

      {/* Main Download Card */}
      <div className="card border-0 shadow-sm p-4 p-lg-5 bg-white text-center hover-lift animate-slide-up delay-1">
        <div className="mx-auto icon-badge icon-badge-blue p-3 rounded-circle d-flex align-items-center justify-content-center mb-3 shadow" style={{ width: '70px', height: '70px', fontSize: '2rem' }}>
          <i className="bi bi-file-earmark-pdf"></i>
        </div>
        <h4 className="h5 fw-bold text-dark mb-1">SafeRoad Analytics – Road Accident Exploration & Severity Audit</h4>
        <p className="text-secondary small max-w-lg mx-auto mb-4" style={{ maxWidth: '620px', fontSize: '0.88rem', lineHeight: '1.5' }}>
          Comprehensive executive document containing official multi-year trends (2021–2024), 2024 accident severity breakdown, 2025 Q1 road category analysis, vehicle vulnerability distribution, and rural vs. city hit-and-run comparative findings.
        </p>

        {error && (
          <div className="alert alert-danger py-2 small mb-3 max-w-lg mx-auto" style={{ maxWidth: '500px' }}>
            <i className="bi bi-exclamation-triangle me-1"></i> {error}
          </div>
        )}

        {downloadSuccess && (
          <div className="alert alert-success py-2 small mb-3 max-w-lg mx-auto fw-medium" style={{ maxWidth: '500px' }}>
            <i className="bi bi-check-circle me-1"></i> PDF report downloaded successfully!
          </div>
        )}

        <div>
          <button
            className="btn btn-primary btn-lg px-4 py-2.5 shadow d-inline-flex align-items-center gap-2 hover-lift fw-bold"
            style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              border: 'none',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
              fontSize: '0.95rem',
            }}
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                <span>Compiling Official PDF...</span>
              </>
            ) : (
              <>
                <i className="bi bi-cloud-arrow-down-fill fs-5"></i>
                <span>Download Executive PDF Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Document Metadata Grid */}
      <div className="card border-0 shadow-sm bg-white p-3 p-lg-4">
        <h4 className="h6 fw-bold mb-3 text-dark">Document Specifications & Audit Metadata</h4>
        <div className="row g-3">
          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-3 bg-light rounded-3 h-100">
              <span className="text-muted small d-block">Geographic Scope</span>
              <strong className="text-dark">Madurai District, Tamil Nadu</strong>
              <span className="text-secondary small d-block mt-1">Includes Rural & City police jurisdictional breakdowns</span>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-3 bg-light rounded-3 h-100">
              <span className="text-muted small d-block">Reporting Timeframes</span>
              <strong className="text-dark">2021 – 2024 (Annual) & 2025 Q1</strong>
              <span className="text-secondary small d-block mt-1">Quarterly records kept segregated from annual series</span>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-3 bg-light rounded-3 h-100">
              <span className="text-muted small d-block">Source Authorities</span>
              <strong className="text-dark">SCRB & Transport Dept</strong>
              <span className="text-secondary small d-block mt-1">Govt. of Tamil Nadu Monthly Booklet (March 2025)</span>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-3 bg-light rounded-3 h-100">
              <span className="text-muted small d-block">Methodology</span>
              <strong className="text-dark">Descriptive Analytics Only</strong>
              <span className="text-secondary small d-block mt-1">Strictly non-predictive; zero synthetic values</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
