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
      {/* Information Header */}
      <div className="card border-0 shadow-sm bg-white p-3 p-lg-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h3 className="h6 fw-bold text-primary mb-1">Road Infrastructure Category Risk Analysis</h3>
            <p className="text-secondary small mb-0">
              Examining accident frequency and fatality lethality rates across road classifications in Madurai District (NHAI, State PWD NH, SH, MDR, Village Roads).
            </p>
          </div>
          <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-2">
            Reporting Period: {roadData.period}
          </span>
        </div>
      </div>

      {/* Highest Risk Road Callout */}
      {roadData.highest_risk_road && (
        <div className="card border-0 shadow-sm border-start border-4 border-danger p-3 bg-white">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-danger-subtle text-danger p-2 rounded-3">
                <i className="bi bi-signpost-split fs-4"></i>
              </div>
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Highest Crash & Fatality Road Corridor</span>
                <h4 className="h5 fw-bold text-danger mb-0">{roadData.highest_risk_road.label}</h4>
              </div>
            </div>
            <div className="d-flex gap-4">
              <div>
                <span className="text-muted small d-block">Q1 Accidents</span>
                <span className="h6 fw-bold mb-0">{roadData.highest_risk_road.accidents} ({roadData.highest_risk_road.accidents_share}%)</span>
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
      <div className="row g-4">
        {/* Accidents vs. Fatalities by Road Type */}
        <div className="col-12 col-xl-7">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-white border-bottom py-3">
              <h4 className="h6 fw-bold mb-0 text-dark">Accident & Fatality Distribution by Road Category</h4>
              <span className="small text-muted">2025 Q1 Provisional Data (Madurai District)</span>
            </div>
            <div className="card-body p-3 p-lg-4">
              <div style={{ height: '320px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roadData.categories} margin={{ top: 10, right: 30, left: 10, bottom: 35 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="label"
                      stroke="#64748b"
                      tick={{ fontSize: 11 }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="accidents" name="Total Accidents" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="fatalities" name="Fatalities" fill="#dc2626" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Lethality Rate by Road Type */}
        <div className="col-12 col-xl-5">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-white border-bottom py-3">
              <h4 className="h6 fw-bold mb-0 text-dark">Lethality Rate per Road Category (%)</h4>
              <span className="small text-muted">Deaths per 100 crashes</span>
            </div>
            <div className="card-body p-3 p-lg-4">
              <div style={{ height: '320px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={roadData.categories}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 50, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" stroke="#64748b" domain={[0, 40]} />
                    <YAxis dataKey="label" type="category" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="lethality_rate" name="Lethality (%)" fill="#ea580c" radius={[0, 4, 4, 0]}>
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
