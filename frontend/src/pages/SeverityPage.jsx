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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const SeverityPage = () => {
  const [period, setPeriod] = useState('2024');
  const [severityData, setSeverityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSeverity = async (selectedPeriod = '2024') => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getSeverityBreakdown(selectedPeriod);
      setSeverityData(res);
    } catch (err) {
      console.error('Failed to load severity analysis:', err);
      setError('Unable to load severity data from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeverity(period);
  }, [period]);

  if (loading) return <LoadingSpinner message="Calculating accident severity and casualty classifications..." />;
  if (error) return <ErrorAlert message={error} onRetry={() => fetchSeverity(period)} />;
  if (!severityData) return null;

  // Chart data
  const pieData = severityData.categories.map((c) => ({
    name: c.label,
    value: c.accidents,
    color: c.color,
  }));

  const casualtyPieData = [
    { name: 'Fatalities (Killed)', value: severityData.casualty_distribution.fatalities, color: '#dc2626' },
    { name: 'Grievous Injuries', value: severityData.casualty_distribution.grievous_injuries, color: '#ea580c' },
    { name: 'Minor Injuries', value: severityData.casualty_distribution.minor_injuries, color: '#f59e0b' },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      {/* Period Selection Controls */}
      <div className="executive-banner p-3 p-lg-3.5 d-flex justify-content-between align-items-center flex-wrap gap-3 animate-slide-up">
        <div className="d-flex align-items-center gap-3">
          <div className="icon-badge icon-badge-danger" style={{ width: '44px', height: '44px', fontSize: '1.25rem' }}>
            <i className="bi bi-pie-chart"></i>
          </div>
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h2 className="h6 fw-bold text-dark mb-0" style={{ letterSpacing: '-0.01em', fontSize: '1rem' }}>
                Accident Severity & Injury Classification
              </h2>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-0.5" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                MoRTH Standard
              </span>
            </div>
            <p className="text-secondary small mb-0" style={{ fontSize: '0.82rem' }}>
              Analysis of road crashes segmented by injury severity and casualty outcomes in Madurai District.
            </p>
          </div>
        </div>
        <div className="btn-group shadow-sm" role="group">
          <button
            type="button"
            className={`btn btn-sm px-3.5 py-1.5 fw-semibold ${period === '2024' ? 'btn-primary' : 'btn-outline-secondary'}`}
            style={period === '2024' ? { background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)', border: 'none' } : {}}
            onClick={() => setPeriod('2024')}
          >
            2024 (Full Year)
          </button>
          <button
            type="button"
            className={`btn btn-sm px-3.5 py-1.5 fw-semibold ${period === '2025_q1' ? 'btn-primary' : 'btn-outline-secondary'}`}
            style={period === '2025_q1' ? { background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)', border: 'none' } : {}}
            onClick={() => setPeriod('2025_q1')}
          >
            2025 Q1 (Jan–Mar Provisional)
          </button>
        </div>
      </div>

      {/* Summary KPI Highlights */}
      <div className="row g-3 animate-slide-up delay-1">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm p-4 bg-white h-100 border-start border-5 border-danger hover-lift">
            <span className="text-secondary small text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Fatal Crashes</span>
            <h3 className="h3 fw-bold text-dark mt-1 mb-1">
              {severityData.categories.find((c) => c.category === 'Fatal')?.accidents.toLocaleString()}
            </h3>
            <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill px-2 py-0.5" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
              Caused {severityData.total_fatalities} deaths ({severityData.severity_rate}% Severity)
            </span>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm p-4 bg-white h-100 border-start border-5 border-warning hover-lift">
            <span className="text-secondary small text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Grievous Injuries</span>
            <h3 className="h4 fw-bold text-dark mt-1 mb-1">
              {severityData.categories.find((c) => c.category === 'Grievous_Injury')?.accidents.toLocaleString()}
            </h3>
            <span className="text-secondary small fw-medium">
              Severe injuries needing major hospitalization
            </span>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm p-4 bg-white h-100 border-start border-5 border-info hover-lift">
            <span className="text-secondary small text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Minor Injuries</span>
            <h3 className="h4 fw-bold text-dark mt-1 mb-1">
              {severityData.categories.find((c) => c.category === 'Minor_Injury')?.accidents.toLocaleString()}
            </h3>
            <span className="text-secondary small fw-medium">
              Resulted in {severityData.casualty_distribution.minor_injuries} injured persons
            </span>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm p-4 bg-white h-100 border-start border-5 border-success hover-lift">
            <span className="text-secondary small text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Non-Injury Crashes</span>
            <h3 className="h4 fw-bold text-dark mt-1 mb-1">
              {severityData.categories.find((c) => c.category === 'Non_Injury')?.accidents.toLocaleString()}
            </h3>
            <span className="text-secondary small fw-medium">Property damage only</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row g-4">
        {/* Crash Volume by Severity Category */}
        <div className="col-12 col-xl-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-white border-bottom py-3">
              <h4 className="h6 fw-bold mb-0 text-dark">Accident Volume by Severity Level</h4>
              <span className="small text-muted">{severityData.period}</span>
            </div>
            <div className="card-body p-3 p-lg-4">
              <div style={{ height: '280px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={severityData.categories} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11 }} interval={0} angle={-10} textAnchor="end" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Bar dataKey="accidents" name="Accidents" fill="#2563eb" radius={[4, 4, 0, 0]}>
                      {severityData.categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Casualty Impact Donut Chart */}
        <div className="col-12 col-xl-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-white border-bottom py-3">
              <h4 className="h6 fw-bold mb-0 text-dark">Casualties Impact Distribution</h4>
              <span className="small text-muted">Total Casualties: {severityData.total_casualties.toLocaleString()} persons</span>
            </div>
            <div className="card-body p-3 p-lg-4 d-flex flex-column justify-content-between">
              <div style={{ height: '220px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={casualtyPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {casualtyPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="d-flex flex-column gap-2 mt-2">
                {casualtyPieData.map((item) => (
                  <div key={item.name} className="d-flex justify-content-between align-items-center small">
                    <span className="d-flex align-items-center gap-2">
                      <span className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: item.color }} />
                      <span className="text-secondary">{item.name}</span>
                    </span>
                    <span className="fw-bold text-dark">
                      {item.value.toLocaleString()} ({((item.value / severityData.total_casualties) * 100).toFixed(1)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Severity Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
          <h4 className="h6 fw-bold mb-0 text-dark">Severity & Impact Classification Table</h4>
          <span className="badge bg-light text-secondary border">{severityData.period}</span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 custom-table">
              <thead>
                <tr>
                  <th>Severity Level</th>
                  <th>Accident Count</th>
                  <th>Share of Total (%)</th>
                  <th>Persons Killed</th>
                  <th>Persons Injured</th>
                  <th>Impact Ratio</th>
                </tr>
              </thead>
              <tbody>
                {severityData.categories.map((c) => (
                  <tr key={c.category}>
                    <td className="fw-semibold">
                      <span className="badge me-2" style={{ backgroundColor: c.color }}>&nbsp;</span>
                      {c.label}
                    </td>
                    <td className="fw-bold">{c.accidents.toLocaleString()}</td>
                    <td>{c.accidents_share}%</td>
                    <td className={c.fatalities > 0 ? 'text-danger fw-bold' : 'text-muted'}>
                      {c.fatalities > 0 ? c.fatalities.toLocaleString() : '-'}
                    </td>
                    <td className={c.injuries > 0 ? 'text-warning-emphasis fw-semibold' : 'text-muted'}>
                      {c.injuries > 0 ? c.injuries.toLocaleString() : '-'}
                    </td>
                    <td>
                      {c.fatalities > 0 && <span className="small text-danger fw-semibold">{c.fatalities_per_accident} deaths / fatal crash</span>}
                      {c.injuries > 0 && <span className="small text-secondary">{c.injuries_per_accident} injuries / crash</span>}
                      {c.fatalities === 0 && c.injuries === 0 && <span className="small text-muted">No casualties</span>}
                    </td>
                  </tr>
                ))}
                <tr className="table-light fw-bold">
                  <td>Total</td>
                  <td>{severityData.total_accidents.toLocaleString()}</td>
                  <td>100.0%</td>
                  <td className="text-danger">{severityData.total_fatalities.toLocaleString()}</td>
                  <td className="text-warning-emphasis">{severityData.total_injuries.toLocaleString()}</td>
                  <td className="text-dark">Severity: {severityData.severity_rate}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeverityPage;
