import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';

const SafetyTipsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchSafetyData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getSafetyTips();
      setData(res);
    } catch (err) {
      console.error('Failed to load safety advisories:', err);
      setError('Unable to load citizen safety advisories from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSafetyData();
  }, []);

  if (loading) return <LoadingSpinner message="Assembling empirical citizen safety advisories for Madurai..." />;
  if (error) return <ErrorAlert message={error} onRetry={fetchSafetyData} />;
  if (!data) return null;

  const filteredAdvisories =
    selectedCategory === 'all'
      ? data.advisories
      : data.advisories.filter((a) => a.id === selectedCategory);

  return (
    <div className="d-flex flex-column gap-4">
      {/* Executive Scope Header */}
      <div className="executive-banner p-3 p-lg-3.5 d-flex justify-content-between align-items-center flex-wrap gap-3 animate-slide-up">
        <div className="d-flex align-items-center gap-3">
          <div className="icon-badge icon-badge-success" style={{ width: '44px', height: '44px', fontSize: '1.25rem' }}>
            <i className="bi bi-shield-check"></i>
          </div>
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h2 className="h6 fw-bold text-dark mb-0" style={{ letterSpacing: '-0.01em', fontSize: '1rem' }}>
                Citizen Safety Advisories & Commuter Guidelines
              </h2>
              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-0.5" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                Data-Grounded Public Guidance
              </span>
            </div>
            <p className="text-secondary small mb-0" style={{ fontSize: '0.82rem' }}>
              Empirical, evidence-based defensive driving and commuting guidelines rooted in actual road accident casualty patterns in Madurai District.
            </p>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1.5 shadow-sm px-3 py-1.5 rounded-3 hover-lift fw-medium"
            onClick={() => window.print()}
            style={{ fontSize: '0.82rem' }}
          >
            <i className="bi bi-printer"></i> Print Safety Guide
          </button>
        </div>
      </div>

      {/* Quick Context Metric Badges */}
      <div className="row g-3 animate-slide-up delay-1">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm p-4 bg-white h-100 border-start border-5 border-danger hover-lift">
            <span className="text-secondary small text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>
              Primary Casualty Group
            </span>
            <h3 className="h4 fw-bold text-dark mt-1.5 mb-1">Two-Wheelers (41.51%)</h3>
            <span className="text-danger small fw-medium" style={{ fontSize: '0.78rem' }}>
              Account for 66 of 159 road deaths in Q1 2025
            </span>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm p-4 bg-white h-100 border-start border-5 border-warning hover-lift">
            <span className="text-secondary small text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>
              Highest Risk Infrastructure
            </span>
            <h3 className="h4 fw-bold text-dark mt-1.5 mb-1">State Highways (35.85%)</h3>
            <span className="text-warning-emphasis small fw-medium" style={{ fontSize: '0.78rem' }}>
              57 deaths, 188 crashes on two-lane undivided corridors
            </span>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm p-4 bg-white h-100 border-start border-5 border-primary hover-lift">
            <span className="text-secondary small text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>
              Highest Collision Lethality
            </span>
            <h3 className="h4 fw-bold text-dark mt-1.5 mb-1">Truck Collisions (35.90%)</h3>
            <span className="text-primary small fw-medium" style={{ fontSize: '0.78rem' }}>
              More than 1 in every 3 truck collisions turns fatal
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="d-flex align-items-center flex-wrap gap-2">
        <span className="small text-secondary fw-semibold me-1" style={{ fontSize: '0.8rem' }}>
          Filter by Focus Area:
        </span>
        <button
          className={`btn btn-sm rounded-pill px-3 py-1 ${
            selectedCategory === 'all' ? 'btn-primary' : 'btn-outline-secondary bg-white'
          }`}
          onClick={() => setSelectedCategory('all')}
          style={{ fontSize: '0.8rem' }}
        >
          All Guidelines ({data.advisories.length})
        </button>
        <button
          className={`btn btn-sm rounded-pill px-3 py-1 ${
            selectedCategory === 'two_wheelers' ? 'btn-danger text-white' : 'btn-outline-danger bg-white'
          }`}
          onClick={() => setSelectedCategory('two_wheelers')}
          style={{ fontSize: '0.8rem' }}
        >
          <i className="bi bi-bicycle me-1"></i> Two-Wheelers
        </button>
        <button
          className={`btn btn-sm rounded-pill px-3 py-1 ${
            selectedCategory === 'state_highways' ? 'btn-warning text-dark' : 'btn-outline-warning text-dark bg-white'
          }`}
          onClick={() => setSelectedCategory('state_highways')}
          style={{ fontSize: '0.8rem' }}
        >
          <i className="bi bi-signpost-split me-1"></i> State Highways
        </button>
        <button
          className={`btn btn-sm rounded-pill px-3 py-1 ${
            selectedCategory === 'heavy_vehicles' ? 'btn-dark text-white' : 'btn-outline-dark bg-white'
          }`}
          onClick={() => setSelectedCategory('heavy_vehicles')}
          style={{ fontSize: '0.8rem' }}
        >
          <i className="bi bi-truck me-1"></i> Heavy Vehicles
        </button>
        <button
          className={`btn btn-sm rounded-pill px-3 py-1 ${
            selectedCategory === 'urban_pedestrians' ? 'btn-info text-white' : 'btn-outline-info bg-white'
          }`}
          onClick={() => setSelectedCategory('urban_pedestrians')}
          style={{ fontSize: '0.8rem' }}
        >
          <i className="bi bi-person-walking me-1"></i> Pedestrians & City
        </button>
      </div>

      {/* Advisory Cards Grid */}
      <div className="row g-4">
        {filteredAdvisories.map((advisory) => (
          <div className="col-12 col-xl-6" key={advisory.id}>
            <div className="card border-0 shadow-sm h-100 bg-white">
              {/* Card Header */}
              <div className="card-header bg-white border-bottom p-3 p-lg-3.5 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div className="d-flex align-items-center gap-2.5">
                  <div
                    className="p-2 rounded-3 d-flex align-items-center justify-content-center shadow-sm"
                    style={{
                      backgroundColor: `${advisory.risk_color}15`,
                      color: advisory.risk_color,
                      width: '40px',
                      height: '40px',
                    }}
                  >
                    <i className={`bi ${advisory.icon} fs-5`}></i>
                  </div>
                  <div>
                    <span className="badge rounded-pill bg-light text-secondary border px-2 py-0.5" style={{ fontSize: '0.68rem' }}>
                      {advisory.target_group}
                    </span>
                    <h3 className="h6 fw-bold text-dark mb-0 mt-1" style={{ letterSpacing: '-0.01em' }}>
                      {advisory.category}
                    </h3>
                  </div>
                </div>
                <span
                  className="badge px-2.5 py-1 rounded-pill"
                  style={{
                    backgroundColor: advisory.risk_color,
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                  }}
                >
                  {advisory.key_stat}
                </span>
              </div>

              {/* Card Body */}
              <div className="card-body p-3 p-lg-4 d-flex flex-column gap-3">
                {/* Headline & Empirical Basis Alert */}
                <div
                  className="p-2.5 rounded-2 border"
                  style={{
                    backgroundColor: `${advisory.risk_color}08`,
                    borderColor: `${advisory.risk_color}25`,
                  }}
                >
                  <h4 className="fw-bold mb-1 text-dark" style={{ fontSize: '0.88rem' }}>
                    {advisory.headline}
                  </h4>
                  <p className="text-secondary small mb-0" style={{ fontSize: '0.78rem', lineHeight: '1.4' }}>
                    <i className="bi bi-bar-chart-fill me-1" style={{ color: advisory.risk_color }}></i>
                    <b>Official Finding:</b> {advisory.empirical_basis}
                  </p>
                </div>

                {/* Concrete Guidelines */}
                <div>
                  <span className="text-muted small text-uppercase fw-semibold d-block mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.04em' }}>
                    Essential Defensive Driving Measures:
                  </span>
                  <div className="d-flex flex-column gap-2">
                    {advisory.actionable_rules.map((item, rIdx) => (
                      <div key={rIdx} className="d-flex align-items-start gap-2 bg-light p-2.5 rounded-2">
                        <i className="bi bi-shield-check text-success fs-6 mt-0.5 flex-shrink-0"></i>
                        <div>
                          <span className="fw-semibold text-dark d-block" style={{ fontSize: '0.82rem' }}>
                            {item.rule}
                          </span>
                          <span className="text-secondary small" style={{ fontSize: '0.75rem', lineHeight: '1.3' }}>
                            {item.details}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Helplines Section */}
      <div className="card border-0 shadow-sm bg-white p-3 p-lg-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <div className="bg-danger-subtle text-danger p-2 rounded-2">
            <i className="bi bi-telephone-outbound-fill fs-5"></i>
          </div>
          <div>
            <h3 className="h6 fw-bold text-dark mb-0">Emergency Helplines for Madurai Commuters</h3>
            <span className="text-secondary small" style={{ fontSize: '0.75rem' }}>
              Instant toll-free contacts for highway breakdown, medical trauma, and accident reporting
            </span>
          </div>
        </div>

        <div className="row g-3">
          {data.emergency_helplines.map((hp, idx) => (
            <div className="col-12 col-sm-6 col-lg-3" key={idx}>
              <div className="p-3 rounded-3 border bg-light-subtle h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <i className={`bi ${hp.icon} fs-5 text-primary`}></i>
                    <span className="badge bg-white text-secondary border small" style={{ fontSize: '0.65rem' }}>
                      {hp.availability}
                    </span>
                  </div>
                  <span className="text-secondary small d-block mb-1" style={{ fontSize: '0.75rem' }}>
                    {hp.service}
                  </span>
                </div>
                <a
                  href={`tel:${hp.number.split('/')[0].trim()}`}
                  className="btn btn-outline-primary btn-sm fw-bold d-flex align-items-center justify-content-center gap-1.5 mt-2 shadow-sm"
                  style={{ fontSize: '0.85rem' }}
                >
                  <i className="bi bi-telephone-fill"></i> {hp.number}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Good Samaritan Law Protection Banner */}
      <div className="card border-0 shadow-sm p-3 p-lg-4 bg-white border-start border-4 border-success">
        <div className="d-flex align-items-start gap-3">
          <div className="bg-success-subtle text-success p-2.5 rounded-3 flex-shrink-0">
            <i className="bi bi-shield-lock-fill fs-3"></i>
          </div>
          <div>
            <h3 className="h6 fw-bold text-success mb-1">
              {data.good_samaritan_rules.title}
            </h3>
            <p className="text-secondary small mb-3" style={{ fontSize: '0.8rem' }}>
              {data.good_samaritan_rules.subtitle}
            </p>
            <div className="row g-2">
              {data.good_samaritan_rules.provisions.map((prov, pIdx) => (
                <div className="col-12 col-md-6" key={pIdx}>
                  <div className="d-flex align-items-start gap-2 bg-light p-2 rounded-2">
                    <i className="bi bi-check-circle-fill text-success fs-6 mt-0.5 flex-shrink-0"></i>
                    <span className="text-dark small" style={{ fontSize: '0.78rem', lineHeight: '1.3' }}>
                      {prov}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyTipsPage;
