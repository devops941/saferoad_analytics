import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';

const formatRoadLabel = (label) => {
  if (!label) return '';
  if (label.includes('NHAI')) return 'NHAI NH';
  if (label.includes('State PWD')) return 'State PWD NH';
  if (label.includes('State Highway')) return 'State Highway';
  if (label.includes('Major District')) return 'Major District (MDR)';
  if (label.includes('Village')) return 'Village Road';
  if (label.includes('Other')) return 'Other Roads';
  return label;
};

const RoadAnalysisPage = () => {
  const [roadData, setRoadData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getRoadDistribution();
      setRoadData(res);
    } catch (err) {
      console.error('Failed to load road category analysis:', err);
      setError('Unable to load road data from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadData();
  }, []);

  if (loading) return <LoadingSpinner message="Evaluating road infrastructure category risks for Madurai..." />;
  if (error) return <ErrorAlert message={error} onRetry={fetchRoadData} />;
  if (!roadData) return null;

  return (
    <div className="d-flex flex-column gap-4">
      {/* Executive Scope Header */}
      <div className="executive-banner p-3 p-lg-3.5 d-flex justify-content-between align-items-center flex-wrap gap-3 animate-slide-up">
        <div className="d-flex align-items-center gap-3">
          <div className="icon-badge icon-badge-warning" style={{ width: '44px', height: '44px', fontSize: '1.25rem' }}>
            <i className="bi bi-signpost-2"></i>
          </div>
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h2 className="h6 fw-bold text-dark mb-0" style={{ letterSpacing: '-0.01em', fontSize: '1rem' }}>
                Road Infrastructure Category Risk Analysis
              </h2>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-0.5" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                Corridor Risk
              </span>
            </div>
            <p className="text-secondary small mb-0" style={{ fontSize: '0.82rem' }}>
              Examining accident frequency and fatality lethality rates across road classifications in Madurai District (NHAI, State PWD NH, SH, MDR, Village Roads).
            </p>
          </div>
        </div>
        <span className="badge bg-light text-secondary border px-2.5 py-1.5 shadow-sm" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
          <i className="bi bi-clock-history text-primary me-1"></i> Period: {roadData.period}
        </span>
      </div>

      {/* Highest Risk Road Callout */}
      {roadData.highest_risk_road && (
        <div className="card border-0 shadow-sm border-start border-5 border-danger p-4 bg-white hover-lift animate-slide-up delay-1">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div className="d-flex align-items-center gap-3">
              <div className="icon-badge icon-badge-danger" style={{ width: '42px', height: '42px' }}>
                <i className="bi bi-signpost-split"></i>
              </div>
              <div>
                <span className="text-secondary small text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Highest Crash & Fatality Road Corridor</span>
                <h4 className="h5 fw-bold text-danger mb-0">{roadData.highest_risk_road.label}</h4>
              </div>
            </div>
            <div className="d-flex gap-4">
              <div>
                <span className="text-muted small d-block">Q1 Accidents</span>
                <span className="h6 fw-bold mb-0 text-dark">{roadData.highest_risk_road.accidents} ({roadData.highest_risk_road.accidents_share}%)</span>
              </div>
              <div>
                <span className="text-muted small d-block">Q1 Fatalities</span>
                <span className="h6 fw-bold text-danger mb-0">{roadData.highest_risk_road.fatalities} ({roadData.highest_risk_road.fatalities_share}%)</span>
              </div>
              <div>
                <span className="text-muted small d-block">Lethality Rate</span>
                <span className="h6 fw-bold text-dark mb-0">{roadData.highest_risk_road.lethality_rate}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="row g-4 animate-slide-up delay-2">
        {/* Accidents vs. Fatalities by Road Type */}
        <div className="col-12 col-xl-7">
          <div className="card h-100 border-0 shadow-sm hover-lift">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <div>
                <h4 className="h6 fw-bold mb-0 text-dark">Accident & Fatality Distribution by Road Category</h4>
                <span className="small text-secondary">2025 Q1 Provisional Data (Madurai District)</span>
              </div>
              <span className="badge bg-light text-secondary border px-2 py-1 small">Q1 2025</span>
            </div>
            <div className="card-body p-3 p-lg-4">
              <div style={{ height: '360px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roadData.categories} margin={{ top: 25, right: 25, left: 5, bottom: 55 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="label"
                      tickFormatter={formatRoadLabel}
                      stroke="#475569"
                      tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                      dy={6}
                    />
                    <YAxis stroke="#475569" tick={{ fill: '#334155', fontWeight: 600 }} />
                    <Tooltip
                      formatter={(value, name) => [value.toLocaleString(), name]}
                      labelFormatter={(label) => `Road Category: ${label}`}
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #cbd5e1', boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }}
                    />
                    <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '20px' }} />
                    <Bar dataKey="accidents" name="Total Accidents" fill="#2563eb" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="fatalities" name="Fatalities" fill="#dc2626" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Lethality Rate by Road Type */}
        <div className="col-12 col-xl-5">
          <div className="card h-100 border-0 shadow-sm hover-lift">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <div>
                <h4 className="h6 fw-bold mb-0 text-dark">Lethality Rate per Road Category (%)</h4>
                <span className="small text-secondary">Deaths per 100 crashes</span>
              </div>
              <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-0.5" style={{ fontSize: '0.7rem' }}>
                Lethality Index
              </span>
            </div>
            <div className="card-body p-3 p-lg-4">
              <div style={{ height: '360px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={roadData.categories}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" stroke="#475569" domain={[0, 40]} unit="%" tick={{ fill: '#334155', fontWeight: 600 }} />
                    <YAxis
                      dataKey="label"
                      type="category"
                      stroke="#475569"
                      tickFormatter={formatRoadLabel}
                      width={120}
                      tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Lethality Rate']}
                      labelFormatter={(label) => `Road Category: ${label}`}
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #cbd5e1', boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }}
                    />
                    <Bar dataKey="lethality_rate" name="Lethality (%)" fill="#ea580c" radius={[0, 6, 6, 0]}>
                      {roadData.categories.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.lethality_rate >= 30 ? '#dc2626' : entry.lethality_rate >= 25 ? '#ea580c' : '#10b981'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Road Infrastructure Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom py-3">
          <h4 className="h6 fw-bold mb-0 text-dark">Road Infrastructure Metrics Table</h4>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 custom-table">
              <thead>
                <tr>
                  <th>Road Classification</th>
                  <th>Accident Count</th>
                  <th>Share of Accidents (%)</th>
                  <th>Fatalities (Deaths)</th>
                  <th>Share of Fatalities (%)</th>
                  <th>Lethality Rate (%)</th>
                  <th>Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {roadData.categories.map((r) => (
                  <tr key={r.key}>
                    <td className="fw-semibold">{r.label}</td>
                    <td className="fw-bold">{r.accidents}</td>
                    <td>{r.accidents_share}%</td>
                    <td className="text-danger fw-bold">{r.fatalities}</td>
                    <td>{r.fatalities_share}%</td>
                    <td className="fw-bold">{r.lethality_rate}%</td>
                    <td>
                      <span
                        className={`badge ${
                          r.lethality_rate >= 30
                            ? 'bg-danger-subtle text-danger'
                            : r.lethality_rate >= 25
                            ? 'bg-warning-subtle text-warning-emphasis'
                            : 'bg-success-subtle text-success'
                        }`}
                      >
                        {r.lethality_rate >= 30 ? 'High Lethality' : r.lethality_rate >= 25 ? 'Moderate Risk' : 'Lower Lethality'}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="table-light fw-bold">
                  <td>Total</td>
                  <td>{roadData.total_accidents}</td>
                  <td>100.0%</td>
                  <td className="text-danger">{roadData.total_fatalities}</td>
                  <td>100.0%</td>
                  <td className="text-dark">
                    {((roadData.total_fatalities / roadData.total_accidents) * 100).toFixed(2)}%
                  </td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadAnalysisPage;
