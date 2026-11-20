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
      {/* Header Card */}
      <div className="card border-0 shadow-sm bg-white p-3 p-lg-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h3 className="h6 fw-bold text-primary mb-1">Official Executive Road Safety Audit Report</h3>
            <p className="text-secondary small mb-0">
              Download formal road accident exploration report for Madurai District, Tamil Nadu.
            </p>
          </div>
          <span className="badge bg-primary text-white px-3 py-2">ReportLab Engine</span>
        </div>
      </div>

      {/* Main Download Card */}
      <div className="card border-0 shadow-sm p-4 p-lg-5 bg-white text-center">
        <div className="mx-auto bg-primary-subtle text-primary p-3 rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
          <i className="bi bi-file-earmark-pdf fs-2"></i>
        </div>
        <h4 className="h5 fw-bold text-dark mb-1">SafeRoad Analytics – Road Accident Exploration & Severity Audit</h4>
        <p className="text-secondary small max-w-lg mx-auto mb-4" style={{ maxWidth: '600px' }}>
          Comprehensive executive document containing official multi-year trends (2021–2024), 2024 accident severity breakdown, 2025 Q1 road category analysis, vehicle vulnerability distribution, and rural vs. city hit-and-run comparative findings.
        </p>

        {error && (
          <div className="alert alert-danger py-2 small mb-3 max-w-lg mx-auto" style={{ maxWidth: '500px' }}>
            <i className="bi bi-exclamation-triangle me-1"></i> {error}
          </div>
        )}

        {downloadSuccess && (
          <div className="alert alert-success py-2 small mb-3 max-w-lg mx-auto" style={{ maxWidth: '500px' }}>
            <i className="bi bi-check-circle me-1"></i> PDF report downloaded successfully!
          </div>
        )}

        <div>
          <button
            className="btn btn-primary btn-lg px-4 py-2 shadow-sm d-inline-flex align-items-center gap-2"
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
