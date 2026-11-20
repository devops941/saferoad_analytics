import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import KPICard from '../components/KPICard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

const SEVERITY_COLORS = ['#dc2626', '#ea580c', '#f59e0b', '#10b981'];

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [trends, setTrends] = useState(null);
  const [roadData, setRoadData] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [summaryRes, trendsRes, roadRes, vehicleRes] = await Promise.all([
        api.getDashboardSummary(),
        api.getYearWiseTrends(),
        api.getRoadDistribution(),
        api.getVehicleDistribution(),
      ]);
      setData(summaryRes);
      setTrends(trendsRes);
      setRoadData(roadRes);
      setVehicleData(vehicleRes);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to connect to SafeRoad Analytics backend. Please check the API service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner message="Aggregating official road accident analytics for Madurai..." />;
  if (error) return <ErrorAlert message={error} onRetry={fetchDashboardData} />;
  if (!data) return null;

  // Prepare severity donut data
  const severityDonutData = [
    { name: 'Fatal', value: data.quick_severity_2024.fatal_accidents, color: '#dc2626' },
    { name: 'Grievous Injury', value: data.quick_severity_2024.grievous_accidents, color: '#ea580c' },
    { name: 'Minor Injury', value: data.quick_severity_2024.minor_accidents, color: '#f59e0b' },
    { name: 'Non-Injury', value: data.quick_severity_2024.non_injury_accidents, color: '#10b981' },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      {/* Executive Scope Banner */}
      <div className="executive-banner p-3 p-lg-3.5 d-flex align-items-center justify-content-between flex-wrap gap-3 animate-slide-up">
        <div className="d-flex align-items-center gap-3">
          <div className="icon-badge icon-badge-blue" style={{ width: '44px', height: '44px', fontSize: '1.25rem' }}>
            <i className="bi bi-shield-check"></i>
          </div>
          <div>
            <div className="d-flex align-items-center flex-wrap gap-2">
              <span className="fw-bold text-dark" style={{ letterSpacing: '-0.01em', fontSize: '1rem' }}>
                Madurai Road Safety Intelligence & Decision Support System
              </span>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-0.5" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                SCRB Verified
              </span>
            </div>
            <div className="text-secondary mt-0.5" style={{ fontSize: '0.82rem' }}>
              Descriptive analytical monitoring for <b>Madurai District & Tamil Nadu State Benchmarks</b> (2021–2024 Annual & 2025 Q1 Provisional).
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-light text-secondary border px-2.5 py-1.5 shadow-sm" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
            <i className="bi bi-database-check text-success me-1"></i> 10 Official Datasets
          </span>
          <span className="badge bg-primary text-white px-2.5 py-1.5 shadow-sm" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
            Descriptive Mode
          </span>
        </div>
      </div>

      {/* 2024 Annual KPIs */}
      <div className="animate-slide-up delay-1">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="h6 fw-bold text-uppercase text-secondary mb-0" style={{ letterSpacing: '0.05em' }}>
            2024 Full-Year Key Performance Indicators
          </h3>
          <span className="badge bg-secondary-subtle text-secondary small fw-semibold">12 Months (Jan – Dec 2024)</span>
        </div>
        <div className="row g-3">
          {data.kpis_2024.map((kpi, idx) => {
            const variantMap = {
              accidents_2024: { variant: 'primary', icon: 'bi-activity' },
              deaths_2024: { variant: 'danger', icon: 'bi-heart-pulse-fill' },
              injuries_2024: { variant: 'warning', icon: 'bi-bandaid-fill' },
              severity_rate_2024: { variant: 'purple', icon: 'bi-percent' },
            };
            const itemConfig = variantMap[kpi.id] || { variant: 'primary', icon: 'bi-activity' };
            return (
              <div className="col-12 col-sm-6 col-xl-3" key={kpi.id}>
                <KPICard
                  title={kpi.title}
                  value={kpi.value}
                  subtitle={kpi.subtitle}
                  changePercentage={kpi.change_percentage}
                  isPositiveChange={kpi.is_positive_change}
                  trendDirection={kpi.trend_direction}
                  badge={kpi.badge}
                  icon={itemConfig.icon}
                  variant={itemConfig.variant}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 2025 Q1 Provisional KPIs */}
      <div className="animate-slide-up delay-2">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="h6 fw-bold text-uppercase text-secondary mb-0" style={{ letterSpacing: '0.05em' }}>
            2025 Q1 Provisional Baseline (First Quarter)
          </h3>
          <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle small fw-semibold">
            Provisional Quarter (Jan – Mar 2025)
          </span>
        </div>
        <div className="row g-3">
          {data.kpis_2025_q1.map((kpi, idx) => {
            const q1Variants = ['primary', 'danger', 'warning', 'purple'];
            const q1Icons = ['bi-speedometer2', 'bi-heart-pulse', 'bi-bandaid', 'bi-percent'];
            return (
              <div className="col-12 col-sm-6 col-xl-3" key={kpi.id}>
                <KPICard
                  title={kpi.title}
                  value={kpi.value}
                  subtitle={kpi.subtitle}
                  badge={kpi.badge}
                  icon={q1Icons[idx % q1Icons.length]}
                  variant={q1Variants[idx % q1Variants.length]}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts Row: Multi-Year Trend & Severity Overview */}
      <div className="row g-4 animate-slide-up delay-3">
        {/* Trend Line Chart */}
        <div className="col-12 col-xl-8">
          <div className="card h-100 border-0 shadow-sm hover-lift">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <div>
                <h4 className="h6 fw-bold mb-0 text-dark">Multi-Year Accident & Fatality Trend</h4>
                <span className="small text-secondary">Annual comparison: 2021 to 2024 (Madurai District)</span>
              </div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1 fw-semibold">2021 – 2024</span>
            </div>
            <div className="card-body p-3 p-lg-4">
              <div style={{ height: '320px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trends?.series || []} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="year" stroke="#475569" tick={{ fill: '#334155', fontWeight: 600 }} />
                    <YAxis stroke="#475569" tick={{ fill: '#334155', fontWeight: 600 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #cbd5e1', boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="accidents"
                      name="Total Accidents"
                      stroke="#2563eb"
                      strokeWidth={3.5}
                      dot={{ r: 5, fill: '#2563eb', strokeWidth: 2, stroke: '#ffffff' }}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="fatalities"
                      name="Fatalities (Deaths)"
                      stroke="#dc2626"
                      strokeWidth={3.5}
                      dot={{ r: 5, fill: '#dc2626', strokeWidth: 2, stroke: '#ffffff' }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top small text-secondary">
                <span>
                  <i className="bi bi-info-circle-fill text-primary me-1"></i> 2024 observed a <b className="text-dark">6.13% drop</b> in total accidents and a <b className="text-dark">14.27% drop</b> in fatalities.
                </span>
                <span className="badge bg-light text-secondary border">Source: SCRB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Severity Donut Chart */}
        <div className="col-12 col-xl-4">
          <div className="card h-100 border-0 shadow-sm hover-lift">
            <div className="card-header bg-white border-bottom py-3">
              <h4 className="h6 fw-bold mb-0 text-dark">2024 Crash Severity Breakdown</h4>
              <span className="small text-secondary">Total 2,497 Accidents</span>
            </div>
            <div className="card-body p-3 p-lg-4 d-flex flex-column justify-content-between">
              <div style={{ height: '220px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityDonutData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {severityDonutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="d-flex flex-column gap-2 mt-2">
                {severityDonutData.map((item) => (
                  <div key={item.name} className="d-flex justify-content-between align-items-center small">
                    <span className="d-flex align-items-center gap-2">
                      <span className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: item.color }} />
                      <span className="text-secondary">{item.name}</span>
                    </span>
                    <span className="fw-bold text-dark">{item.value.toLocaleString()} ({((item.value / 2497) * 100).toFixed(1)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Summary Widgets: Road Types & Vehicle Types */}
      <div className="row g-4">
        {/* Road Distribution Summary */}
        <div className="col-12 col-lg-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <div>
                <h4 className="h6 fw-bold mb-0 text-dark">Road Category Risk (2025 Q1)</h4>
                <span className="small text-muted">Accidents by Road Infrastructure</span>
              </div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle">Jan – Mar 2025</span>
            </div>
            <div className="card-body p-3">
              <div style={{ height: '220px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roadData?.categories || []} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="label"
                      stroke="#64748b"
                      tick={{ fontSize: 10 }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Bar dataKey="accidents" name="Accidents" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="fatalities" name="Fatalities" fill="#dc2626" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="small text-secondary mb-0 mt-2">
                <i className="bi bi-exclamation-circle text-danger me-1"></i>
                <b>State Highways</b> account for the highest toll in Madurai (188 accidents, 57 deaths in Q1).
              </p>
            </div>
          </div>
        </div>

        {/* Vehicle Distribution Summary */}
        <div className="col-12 col-lg-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <div>
                <h4 className="h6 fw-bold mb-0 text-dark">Vehicle Class Risk (2025 Q1)</h4>
                <span className="small text-muted">Crash Volume vs. Vulnerability</span>
              </div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle">Jan – Mar 2025</span>
            </div>
            <div className="card-body p-3">
              <div style={{ height: '220px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vehicleData?.categories || []} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="label"
                      stroke="#64748b"
                      tick={{ fontSize: 10 }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Bar dataKey="accidents" name="Accidents" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="fatalities" name="Fatalities" fill="#b91c1c" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="small text-secondary mb-0 mt-2">
                <i className="bi bi-shield-exclamation text-warning me-1"></i>
                <b>Two-Wheelers</b> represent 41.1% of crashes and 41.5% of fatalities (66 deaths in Q1).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
