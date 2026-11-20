import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';

const LandingPage = () => {
  const [summary, setSummary] = useState(null);
  const [safetyData, setSafetyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [dashRes, tipsRes] = await Promise.all([
          api.getDashboardSummary(),
          api.getSafetyTips(),
        ]);
        setSummary(dashRes);
        setSafetyData(tipsRes);
      } catch (err) {
        console.error('Failed to load landing page data:', err);
        setError('Unable to connect to SafeRoad Analytics backend services.');
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading SafeRoad Analytics portal and safety intelligence..." />;
  if (error) return <ErrorAlert message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="d-flex flex-column gap-4 pb-3">
      {/* 1. Hero Section (Dedicated Vibrant Dark Glassmorphic Banner) */}
      <div className="hero-banner p-4 p-lg-5 animate-slide-up">
        {/* Floating Ambient Glowing Orbs */}
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>

        <div className="position-relative" style={{ maxWidth: '820px', zIndex: 2 }}>
          <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
            <span
              className="badge rounded-pill bg-white text-dark fw-bold px-3 py-1.5 shadow-sm d-inline-flex align-items-center gap-1.5"
              style={{ fontSize: '0.78rem' }}
            >
              <i className="bi bi-geo-alt-fill text-danger"></i> Madurai District, Tamil Nadu
            </span>
            <span
              className="badge rounded-pill bg-success text-white px-3 py-1.5 d-inline-flex align-items-center gap-1.5 shadow-sm"
              style={{ fontSize: '0.78rem', fontWeight: 600 }}
            >
              <span className="pulse-dot"></span> Live SCRB Analytics
            </span>
          </div>

          <h1
            className="display-5 fw-bold mb-2 text-white"
            style={{ letterSpacing: '-0.025em', textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}
          >
            SafeRoad Analytics
          </h1>
          <h2
            className="h5 hero-subheading mb-3"
            style={{ fontSize: '1.2rem', letterSpacing: '-0.01em' }}
          >
            Road Accident Intelligence & Decision Support System
          </h2>

          <p
            className="hero-description mb-4 lead"
            style={{ fontSize: '0.98rem', maxWidth: '720px' }}
          >
            Explore empirical road safety trends, high-risk highway corridors, and vehicle vulnerability patterns in Madurai. Dedicated to evidence-based policy, accident reduction, and commuter safety.
          </p>

          <div className="d-flex align-items-center flex-wrap gap-3 pt-1">
            <Link
              to="/dashboard"
              className="btn btn-primary btn-lg fw-bold px-4 py-2.5 rounded-3 shadow d-inline-flex align-items-center gap-2 hover-lift"
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                border: 'none',
                fontSize: '0.95rem',
              }}
            >
              <i className="bi bi-speedometer2 fs-5"></i> Executive Dashboard
            </Link>
            <Link
              to="/safety-tips"
              className="btn btn-outline-light btn-lg fw-semibold px-4 py-2.5 rounded-3 d-inline-flex align-items-center gap-2 hover-lift"
              style={{
                backdropFilter: 'blur(10px)',
                borderWidth: '1.5px',
                fontSize: '0.95rem',
                color: '#ffffff',
              }}
            >
              <i className="bi bi-shield-check fs-5 text-warning"></i> Safety Advisories
            </Link>
            <Link
              to="/reports"
              className="btn btn-link text-white text-decoration-none px-3 py-2.5 d-inline-flex align-items-center gap-2 hover-lift"
              style={{ fontSize: '0.92rem' }}
            >
              <i className="bi bi-file-earmark-pdf fs-5 text-info"></i> Official PDF Report
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Ribbon (Colorful Glowing Cards) */}
      <div className="row g-3">
        <div className="col-6 col-lg-3">
          <div className="kpi-card kpi-variant-primary p-3 p-lg-3.5 h-100 hover-lift animate-slide-up delay-1">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-secondary small text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>
                2024 Total Accidents
              </span>
              <div className="icon-badge icon-badge-blue" style={{ width: '32px', height: '32px', fontSize: '0.95rem' }}>
                <i className="bi bi-activity"></i>
              </div>
            </div>
            <h3 className="h3 fw-bold text-dark mb-1" style={{ letterSpacing: '-0.02em' }}>2,497</h3>
            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-0.5" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
              <i className="bi bi-arrow-down-right me-0.5"></i> -6.13% vs 2023
            </span>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="kpi-card kpi-variant-danger p-3 p-lg-3.5 h-100 hover-lift animate-slide-up delay-2">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-secondary small text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>
                2024 Fatalities
              </span>
              <div className="icon-badge icon-badge-danger" style={{ width: '32px', height: '32px', fontSize: '0.95rem' }}>
                <i className="bi bi-heart-pulse-fill"></i>
              </div>
            </div>
            <h3 className="h3 fw-bold text-danger mb-1" style={{ letterSpacing: '-0.02em' }}>763</h3>
            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-0.5" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
              <i className="bi bi-arrow-down-right me-0.5"></i> -14.27% vs 2023
            </span>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="kpi-card kpi-variant-warning p-3 p-lg-3.5 h-100 hover-lift animate-slide-up delay-3">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-secondary small text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>
                Severity Index
              </span>
              <div className="icon-badge icon-badge-warning" style={{ width: '32px', height: '32px', fontSize: '0.95rem' }}>
                <i className="bi bi-percent"></i>
              </div>
            </div>
            <h3 className="h3 fw-bold text-dark mb-1" style={{ letterSpacing: '-0.02em' }}>30.56%</h3>
            <span className="text-secondary small" style={{ fontSize: '0.75rem', fontWeight: 500 }}>
              Deaths per 100 crashes
            </span>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="kpi-card kpi-variant-success p-3 p-lg-3.5 h-100 hover-lift animate-slide-up delay-4">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-secondary small text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>
                District Ranking
              </span>
              <div className="icon-badge icon-badge-success" style={{ width: '32px', height: '32px', fontSize: '0.95rem' }}>
                <i className="bi bi-trophy-fill"></i>
              </div>
            </div>
            <h3 className="h3 fw-bold text-success mb-1" style={{ letterSpacing: '-0.02em' }}>Rank #7</h3>
            <span className="text-secondary small" style={{ fontSize: '0.75rem', fontWeight: 500 }}>
              In Tamil Nadu (38 Districts)
            </span>
          </div>
        </div>
      </div>

      {/* 3. Featured Safety Advisories */}
      <div className="glass-card p-4 animate-slide-up delay-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <div className="d-flex align-items-center gap-3">
            <div className="icon-badge icon-badge-danger" style={{ width: '42px', height: '42px', fontSize: '1.2rem' }}>
              <i className="bi bi-shield-fill-exclamation"></i>
            </div>
            <div>
              <h3 className="h6 fw-bold text-dark mb-0">Citizen Road Safety Advisories</h3>
              <span className="text-secondary small" style={{ fontSize: '0.8rem' }}>
                Key defensive driving rules grounded in official crash data
              </span>
            </div>
          </div>
          <Link to="/safety-tips" className="btn btn-outline-primary btn-sm fw-semibold shadow-sm px-3 py-1.5 hover-lift">
            View All Advisories <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        {/* Advisory Cards Grid */}
        <div className="row g-3">
          {safetyData?.advisories?.slice(0, 4).map((advisory) => (
            <div className="col-12 col-md-6" key={advisory.id}>
              <div
                className="p-3.5 rounded-3 border h-100 d-flex flex-column justify-content-between hover-lift"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderLeft: `4px solid ${advisory.risk_color}`,
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
                }}
              >
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge rounded-pill bg-light text-secondary border px-2.5 py-1" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                      <i className={`bi ${advisory.icon} me-1 text-primary`}></i> {advisory.target_group}
                    </span>
                    <span
                      className="badge px-2.5 py-1 rounded-pill fw-bold"
                      style={{ backgroundColor: advisory.risk_color, color: '#fff', fontSize: '0.72rem' }}
                    >
                      {advisory.key_stat}
                    </span>
                  </div>
                  <h4 className="fw-bold text-dark mb-1" style={{ fontSize: '0.92rem' }}>
                    {advisory.headline}
                  </h4>
                  <p className="text-secondary small mb-2" style={{ fontSize: '0.8rem', lineHeight: '1.45' }}>
                    {advisory.empirical_basis}
                  </p>
                </div>
                <div className="pt-2 border-top border-light-subtle">
                  <span className="text-dark small fw-semibold d-block" style={{ fontSize: '0.8rem' }}>
                    <i className="bi bi-check-circle-fill text-success me-1.5"></i>
                    {advisory.actionable_rules[0]?.rule}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Analytics Modules Grid (Colorful Distinct Cards) */}
      <div className="animate-slide-up delay-4">
        <div className="mb-3 d-flex align-items-center justify-content-between">
          <h3 className="h6 fw-bold text-uppercase text-secondary mb-0" style={{ letterSpacing: '0.05em' }}>
            Decision Support & Intelligence Modules
          </h3>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1" style={{ fontSize: '0.72rem' }}>
            6 Core Modules
          </span>
        </div>

        <div className="row g-3">
          {/* Module 1: Dashboard */}
          <div className="col-12 col-md-6 col-xl-4">
            <div className="glass-card h-100 p-3.5 d-flex flex-column justify-content-between hover-lift">
              <div>
                <div className="d-flex align-items-center gap-2.5 mb-2.5">
                  <div className="icon-badge icon-badge-blue">
                    <i className="bi bi-speedometer2"></i>
                  </div>
                  <div>
                    <h4 className="h6 fw-bold text-dark mb-0">Executive Dashboard</h4>
                    <span className="text-muted small" style={{ fontSize: '0.72rem' }}>Macro Overview</span>
                  </div>
                </div>
                <p className="text-secondary small mb-3" style={{ fontSize: '0.82rem', lineHeight: '1.5' }}>
                  Macro KPIs, multi-year trend charts, crash severity breakdowns, and high-risk road corridors.
                </p>
              </div>
              <Link to="/dashboard" className="btn btn-outline-primary btn-sm fw-semibold w-100 d-flex align-items-center justify-content-center gap-1">
                Open Dashboard <i className="bi bi-chevron-right"></i>
              </Link>
            </div>
          </div>

          {/* Module 2: Trends */}
          <div className="col-12 col-md-6 col-xl-4">
            <div className="glass-card h-100 p-3.5 d-flex flex-column justify-content-between hover-lift">
              <div>
                <div className="d-flex align-items-center gap-2.5 mb-2.5">
                  <div className="icon-badge icon-badge-cyan">
                    <i className="bi bi-graph-up"></i>
                  </div>
                  <div>
                    <h4 className="h6 fw-bold text-dark mb-0">Yearly Trends & Benchmarks</h4>
                    <span className="text-muted small" style={{ fontSize: '0.72rem' }}>Longitudinal Data</span>
                  </div>
                </div>
                <p className="text-secondary small mb-3" style={{ fontSize: '0.82rem', lineHeight: '1.5' }}>
                  2021–2024 longitudinal comparisons, Year-over-Year changes, and 38-district rankings.
                </p>
              </div>
              <Link to="/trends" className="btn btn-outline-info text-dark btn-sm fw-semibold w-100 d-flex align-items-center justify-content-center gap-1">
                View Trends <i className="bi bi-chevron-right"></i>
              </Link>
            </div>
          </div>

          {/* Module 3: Severity */}
          <div className="col-12 col-md-6 col-xl-4">
            <div className="glass-card h-100 p-3.5 d-flex flex-column justify-content-between hover-lift">
              <div>
                <div className="d-flex align-items-center gap-2.5 mb-2.5">
                  <div className="icon-badge icon-badge-danger">
                    <i className="bi bi-pie-chart"></i>
                  </div>
                  <div>
                    <h4 className="h6 fw-bold text-dark mb-0">Severity & Casualty Impact</h4>
                    <span className="text-muted small" style={{ fontSize: '0.72rem' }}>MoRTH Standard</span>
                  </div>
                </div>
                <p className="text-secondary small mb-3" style={{ fontSize: '0.82rem', lineHeight: '1.5' }}>
                  Fatal vs. Grievous injury proportions, casualty distributions, and quarterly shifts.
                </p>
              </div>
              <Link to="/severity" className="btn btn-outline-danger btn-sm fw-semibold w-100 d-flex align-items-center justify-content-center gap-1">
                Inspect Severity <i className="bi bi-chevron-right"></i>
              </Link>
            </div>
          </div>

          {/* Module 4: Road Infrastructure */}
          <div className="col-12 col-md-6 col-xl-4">
            <div className="glass-card h-100 p-3.5 d-flex flex-column justify-content-between hover-lift">
              <div>
                <div className="d-flex align-items-center gap-2.5 mb-2.5">
                  <div className="icon-badge icon-badge-warning">
                    <i className="bi bi-signpost-2"></i>
                  </div>
                  <div>
                    <h4 className="h6 fw-bold text-dark mb-0">Road Infrastructure</h4>
                    <span className="text-muted small" style={{ fontSize: '0.72rem' }}>Corridor Lethality</span>
                  </div>
                </div>
                <p className="text-secondary small mb-3" style={{ fontSize: '0.82rem', lineHeight: '1.5' }}>
                  Lethality rates across National Highways, State Highways (35.85% deaths), and Rural roads.
                </p>
              </div>
              <Link to="/roads" className="btn btn-outline-warning text-dark btn-sm fw-semibold w-100 d-flex align-items-center justify-content-center gap-1">
                Inspect Roads <i className="bi bi-chevron-right"></i>
              </Link>
            </div>
          </div>

          {/* Module: GIS Road Map */}
          <div className="col-12 col-md-6 col-xl-4">
            <div className="glass-card h-100 p-3.5 d-flex flex-column justify-content-between hover-lift border-start border-4 border-info">
              <div>
                <div className="d-flex align-items-center gap-2.5 mb-2.5">
                  <div className="icon-badge icon-badge-cyan">
                    <i className="bi bi-map-fill"></i>
                  </div>
                  <div>
                    <h4 className="h6 fw-bold text-dark mb-0">GIS Road Map</h4>
                    <span className="badge bg-info-subtle text-info border border-info-subtle" style={{ fontSize: '0.68rem' }}>Phase 6 GIS</span>
                  </div>
                </div>
                <p className="text-secondary small mb-3" style={{ fontSize: '0.82rem', lineHeight: '1.5' }}>
                  Interactive OpenStreetMap geospatial layer displaying verified NH, SH, and MDR corridors in Madurai.
                </p>
              </div>
              <Link to="/gis-map" className="btn btn-outline-info text-dark btn-sm fw-semibold w-100 d-flex align-items-center justify-content-center gap-1">
                Open GIS Map <i className="bi bi-chevron-right"></i>
              </Link>
            </div>
          </div>

          {/* Module 5: Vehicle Vulnerability */}
          <div className="col-12 col-md-6 col-xl-4">
            <div className="glass-card h-100 p-3.5 d-flex flex-column justify-content-between hover-lift">
              <div>
                <div className="d-flex align-items-center gap-2.5 mb-2.5">
                  <div className="icon-badge icon-badge-purple">
                    <i className="bi bi-truck"></i>
                  </div>
                  <div>
                    <h4 className="h6 fw-bold text-dark mb-0">Vehicle Vulnerability</h4>
                    <span className="text-muted small" style={{ fontSize: '0.72rem' }}>Modal Share</span>
                  </div>
                </div>
                <p className="text-secondary small mb-3" style={{ fontSize: '0.82rem', lineHeight: '1.5' }}>
                  Casualty risk for Two-Wheelers (41.51% deaths), Heavy Trucks (35.90% lethality), and LMVs.
                </p>
              </div>
              <Link to="/vehicles" className="btn btn-outline-secondary btn-sm fw-semibold w-100 d-flex align-items-center justify-content-center gap-1">
                Explore Vehicles <i className="bi bi-chevron-right"></i>
              </Link>
            </div>
          </div>

          {/* Module 6: Hit & Run */}
          <div className="col-12 col-md-6 col-xl-4">
            <div className="glass-card h-100 p-3.5 d-flex flex-column justify-content-between hover-lift">
              <div>
                <div className="d-flex align-items-center gap-2.5 mb-2.5">
                  <div className="icon-badge icon-badge-primary">
                    <i className="bi bi-shield-exclamation"></i>
                  </div>
                  <div>
                    <h4 className="h6 fw-bold text-dark mb-0">Hit & Run Disparity</h4>
                    <span className="text-muted small" style={{ fontSize: '0.72rem' }}>Rural vs City</span>
                  </div>
                </div>
                <p className="text-secondary small mb-3" style={{ fontSize: '0.82rem', lineHeight: '1.5' }}>
                  Comparison between Madurai District (Rural) and Madurai City Police limits (19.02% vs 12.07%).
                </p>
              </div>
              <Link to="/hit-and-run" className="btn btn-outline-primary btn-sm fw-semibold w-100 d-flex align-items-center justify-content-center gap-1">
                Compare Data <i className="bi bi-chevron-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Emergency Helplines (Vibrant Action Badges) */}
      <div className="glass-card p-4 animate-slide-up delay-5">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="icon-badge icon-badge-blue" style={{ width: '42px', height: '42px' }}>
            <i className="bi bi-telephone-fill"></i>
          </div>
          <div>
            <h3 className="h6 fw-bold text-dark mb-0">Emergency Road Helplines</h3>
            <span className="text-secondary small" style={{ fontSize: '0.8rem' }}>
              Instant toll-free emergency contacts for Madurai commuters
            </span>
          </div>
        </div>

        <div className="row g-3">
          {safetyData?.emergency_helplines?.map((hp, idx) => {
            const colors = [
              'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)', // 108 Ambulance
              'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', // 103 Traffic Police
              'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)', // 112 National
              'linear-gradient(135deg, #059669 0%, #10b981 100%)', // Highway patrol
            ];
            const btnBg = colors[idx % colors.length];

            return (
              <div className="col-6 col-md-3" key={idx}>
                <div className="p-3.5 rounded-3 border bg-white h-100 text-center shadow-sm hover-lift">
                  <span className="badge bg-light text-secondary border small mb-1" style={{ fontSize: '0.68rem', fontWeight: 600 }}>
                    {hp.availability}
                  </span>
                  <span className="d-block text-secondary small fw-bold mt-1" style={{ fontSize: '0.8rem' }}>
                    {hp.service}
                  </span>
                  <a
                    href={`tel:${hp.number.split('/')[0].trim()}`}
                    className="btn btn-sm text-white fw-bold w-100 mt-2.5 shadow-sm d-inline-flex align-items-center justify-content-center gap-1.5"
                    style={{ background: btnBg, border: 'none', fontSize: '0.85rem' }}
                  >
                    <i className="bi bi-telephone-fill"></i> {hp.number}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Legal Protection Callout */}
      <div className="glass-card p-4 d-flex align-items-center justify-content-between flex-wrap gap-2 border-start border-5 border-success hover-lift animate-slide-up delay-6">
        <div className="d-flex align-items-center gap-3">
          <div className="icon-badge icon-badge-success" style={{ width: '42px', height: '42px', fontSize: '1.25rem' }}>
            <i className="bi bi-shield-check"></i>
          </div>
          <div>
            <span className="fw-bold text-dark d-block" style={{ fontSize: '0.92rem' }}>
              Good Samaritan Law (Motor Vehicles Act Section 134A)
            </span>
            <span className="text-secondary small" style={{ fontSize: '0.8rem' }}>
              Citizens rendering emergency aid to road crash victims are legally immune from civil, criminal liability, and police harassment.
            </span>
          </div>
        </div>
        <Link to="/safety-tips" className="btn btn-outline-success btn-sm fw-bold shadow-sm px-3.5 py-1.5">
          Read Protection Rights <i className="bi bi-arrow-right ms-1"></i>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
