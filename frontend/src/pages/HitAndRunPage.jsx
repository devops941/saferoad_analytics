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
} from 'recharts';

const HitAndRunPage = () => {
  const [hnrData, setHnrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHnrData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getHitAndRunComparison();
      setHnrData(res);
    } catch (err) {
      console.error('Failed to load hit-and-run comparison:', err);
      setError('Unable to load hit-and-run data from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHnrData();
  }, []);

  if (loading) return <LoadingSpinner message="Comparing Hit-and-Run records between Rural and Urban jurisdictions..." />;
  if (error) return <ErrorAlert message={error} onRetry={fetchHnrData} />;
  if (!hnrData) return null;

  // Chart data
  const chartData = hnrData.comparison.map((item) => ({
    name: item.jurisdiction_name,
    total_accidents: item.total_accidents,
    hit_and_run: item.hit_and_run_accidents,
    other_accidents: item.other_accidents,
    hit_and_run_percentage: item.hit_and_run_percentage,
    incidence_rate: item.total_rate,
  }));

  return (
    <div className="d-flex flex-column gap-4">
      {/* Executive Scope Header */}
      <div className="executive-banner p-3 p-lg-3.5 d-flex justify-content-between align-items-center flex-wrap gap-3 animate-slide-up">
        <div className="d-flex align-items-center gap-3">
          <div className="icon-badge icon-badge-primary" style={{ width: '44px', height: '44px', fontSize: '1.25rem' }}>
            <i className="bi bi-shield-exclamation"></i>
          </div>
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h2 className="h6 fw-bold text-dark mb-0" style={{ letterSpacing: '-0.01em', fontSize: '1rem' }}>
                Hit-and-Run Jurisdictional Comparative Analysis
              </h2>
              <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill px-2.5 py-0.5" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                Jurisdictional Segregation
              </span>
            </div>
            <p className="text-secondary small mb-0" style={{ fontSize: '0.82rem' }}>
              Disaggregated evaluation of hit-and-run incidents between <b>Madurai District Police (Rural)</b> and <b>Madurai City Police Commissionerate</b>.
            </p>
          </div>
        </div>
        <span className="badge bg-light text-secondary border px-2.5 py-1.5 shadow-sm" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
          <i className="bi bi-shield-lock text-primary me-1"></i> Independent Police Jurisdictions
        </span>
      </div>

      {/* Strict Jurisdictional Rule Callout */}
      <div className="alert alert-warning border border-warning-subtle d-flex align-items-start gap-2 p-3 rounded-3 mb-0 animate-slide-up delay-1">
        <i className="bi bi-shield-exclamation text-warning fs-5 mt-1"></i>
        <div className="small text-secondary">
          <strong className="text-dark d-block mb-1">Strict Statistical Separation Rule:</strong>
          Madurai District Police (Rural) and Madurai City Police Commissionerate are distinct administrative policing entities with separate jurisdiction boundaries and population denominators. As instructed, these datasets are kept strictly independent and are never aggregated.
        </div>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div className="row g-4 animate-slide-up delay-2">
        {hnrData.comparison.map((item) => (
          <div className="col-12 col-lg-6" key={item.id}>
            <div className="card h-100 border-0 shadow-sm p-3.5 p-lg-4 bg-white hover-lift">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <span className="badge bg-light text-secondary border mb-1">{item.jurisdiction_type}</span>
                  <h4 className="h5 fw-bold text-dark mb-0">{item.jurisdiction_title}</h4>
                </div>
                <span className="badge bg-danger-subtle text-danger border border-danger-subtle fs-6 px-2 py-1">
                  {item.hit_and_run_percentage}% H&R Share
                </span>
              </div>

              <div className="row g-3 py-2 border-top border-bottom my-2">
                <div className="col-6">
                  <span className="text-muted small d-block">Total Accidents</span>
                  <span className="h4 fw-bold text-dark">{item.total_accidents}</span>
                  <span className="text-secondary small d-block">{item.total_victims} victims</span>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Hit & Run Incidents</span>
                  <span className="h4 fw-bold text-danger">{item.hit_and_run_accidents}</span>
                  <span className="text-danger small d-block">{item.hit_and_run_victims} victims</span>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center pt-2 small text-secondary">
                <span>Crime Incidence Rate: <b>{item.total_rate}</b></span>
                <span>Hit & Run Rate: <b>{item.hit_and_run_rate}</b></span>
              </div>
              <p className="text-muted small mt-2 mb-0" style={{ fontSize: '0.75rem' }}>
                {item.jurisdiction_description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Chart */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom py-3">
          <h4 className="h6 fw-bold mb-0 text-dark">Accident Volume vs. Hit-and-Run Incidents</h4>
          <span className="small text-muted">Comparative breakdown by policing jurisdiction</span>
        </div>
        <div className="card-body p-3 p-lg-4">
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_accidents" name="Total Accidents" fill="#1e40af" radius={[4, 4, 0, 0]} />
                <Bar dataKey="hit_and_run" name="Hit & Run Incidents" fill="#dc2626" radius={[4, 4, 0, 0]} />
                <Bar dataKey="other_accidents" name="Other Accidents" fill="#64748b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Comparative Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom py-3">
          <h4 className="h6 fw-bold mb-0 text-dark">Official Hit-and-Run Field Metrics Table</h4>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 custom-table">
              <thead>
                <tr>
                  <th>Jurisdiction</th>
                  <th>Total Accidents (I)</th>
                  <th>Total Victims (V)</th>
                  <th>Accident Rate (R)</th>
                  <th>Hit & Run (I)</th>
                  <th>Hit & Run Victims (V)</th>
                  <th>Hit & Run Rate (R)</th>
                  <th>Hit & Run %</th>
                </tr>
              </thead>
              <tbody>
                {hnrData.comparison.map((row) => (
                  <tr key={row.id}>
                    <td className="fw-bold">{row.jurisdiction_name}</td>
                    <td>{row.total_accidents}</td>
                    <td>{row.total_victims}</td>
                    <td>{row.total_rate}</td>
                    <td className="text-danger fw-bold">{row.hit_and_run_accidents}</td>
                    <td className="text-danger">{row.hit_and_run_victims}</td>
                    <td>{row.hit_and_run_rate}</td>
                    <td className="fw-bold text-danger">{row.hit_and_run_percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HitAndRunPage;
