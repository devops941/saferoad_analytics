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

const formatVehicleLabel = (label) => {
  if (!label) return '';
  if (label.includes('Two')) return 'Two-Wheeler';
  if (label.includes('Car')) return 'Car / LMV';
  if (label.includes('Auto')) return 'Auto-Rickshaw';
  if (label.includes('Truck')) return 'Truck / Lorry';
  if (label.includes('Bus')) return 'Bus';
  if (label.includes('Other')) return 'Other Vehicles';
  return label;
};

const VehicleAnalysisPage = () => {
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVehicleData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getVehicleDistribution();
      setVehicleData(res);
    } catch (err) {
      console.error('Failed to load vehicle category analysis:', err);
      setError('Unable to load vehicle data from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleData();
  }, []);

  if (loading) return <LoadingSpinner message="Analyzing vehicular risk and user vulnerability distributions..." />;
  if (error) return <ErrorAlert message={error} onRetry={fetchVehicleData} />;
  if (!vehicleData) return null;

  return (
    <div className="d-flex flex-column gap-4">
      {/* Executive Scope Header */}
      <div className="executive-banner p-3 p-lg-3.5 d-flex justify-content-between align-items-center flex-wrap gap-3 animate-slide-up">
        <div className="d-flex align-items-center gap-3">
          <div className="icon-badge icon-badge-purple" style={{ width: '44px', height: '44px', fontSize: '1.25rem' }}>
            <i className="bi bi-truck"></i>
          </div>
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h2 className="h6 fw-bold text-dark mb-0" style={{ letterSpacing: '-0.01em', fontSize: '1rem' }}>
                Vehicle Classification & User Vulnerability Analysis
              </h2>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-0.5" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                Modal Dynamics
              </span>
            </div>
            <p className="text-secondary small mb-0" style={{ fontSize: '0.82rem' }}>
              Examining crash frequency, fatality burden, and lethality per collision across motorized vehicle categories in Madurai District.
            </p>
          </div>
        </div>
        <span className="badge bg-light text-secondary border px-2.5 py-1.5 shadow-sm" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
          <i className="bi bi-clock-history text-primary me-1"></i> Period: {vehicleData.period}
        </span>
      </div>

      {/* Highlights: Most Vulnerable vs. Most Lethal */}
      <div className="row g-3 animate-slide-up delay-1">
        {vehicleData.highest_vulnerable_vehicle && (
          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm border-start border-5 border-danger p-4 bg-white h-100 hover-lift">
              <div className="d-flex align-items-center gap-3">
                <div className="icon-badge icon-badge-danger" style={{ width: '42px', height: '42px' }}>
                  <i className="bi bi-bicycle"></i>
                </div>
                <div>
                  <span className="text-secondary small text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Most Vulnerable Road User Class</span>
                  <h4 className="h5 fw-bold text-danger mb-1">{vehicleData.highest_vulnerable_vehicle.label}</h4>
                  <p className="text-secondary small mb-0" style={{ fontSize: '0.82rem' }}>
                    Accounts for <b className="text-dark">{vehicleData.highest_vulnerable_vehicle.accidents} crashes ({vehicleData.highest_vulnerable_vehicle.accidents_share}%)</b> and <b className="text-danger">{vehicleData.highest_vulnerable_vehicle.fatalities} deaths ({vehicleData.highest_vulnerable_vehicle.fatalities_share}%)</b>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {vehicleData.highest_lethal_vehicle && (
          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm border-start border-5 border-warning p-4 bg-white h-100 hover-lift">
              <div className="d-flex align-items-center gap-3">
                <div className="icon-badge icon-badge-warning" style={{ width: '42px', height: '42px' }}>
                  <i className="bi bi-truck"></i>
                </div>
                <div>
                  <span className="text-secondary small text-uppercase fw-bold" style={{ fontSize: '0.72rem' }}>Highest Collision Lethality Class</span>
                  <h4 className="h5 fw-bold text-dark mb-1">{vehicleData.highest_lethal_vehicle.label}</h4>
                  <p className="text-secondary small mb-0" style={{ fontSize: '0.82rem' }}>
                    Highest fatality rate per crash at <b className="text-danger">{vehicleData.highest_lethal_vehicle.fatality_rate_per_crash}%</b> ({vehicleData.highest_lethal_vehicle.fatalities} fatalities from {vehicleData.highest_lethal_vehicle.accidents} crashes).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Charts Row */}
      <div className="row g-4 animate-slide-up delay-2">
        {/* Accidents vs. Fatalities by Vehicle Type */}
        <div className="col-12 col-xl-7">
          <div className="card h-100 border-0 shadow-sm hover-lift">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <div>
                <h4 className="h6 fw-bold mb-0 text-dark">Crash Volume & Fatalities by Vehicle Class</h4>
                <span className="small text-secondary">2025 Q1 Provisional (Madurai District)</span>
              </div>
              <span className="badge bg-light text-secondary border px-2 py-1 small">Q1 2025</span>
            </div>
            <div className="card-body p-3 p-lg-4">
              <div style={{ height: '360px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vehicleData.categories} margin={{ top: 25, right: 25, left: 5, bottom: 55 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="label"
                      tickFormatter={formatVehicleLabel}
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
                      labelFormatter={(label) => `Vehicle Class: ${label}`}
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

        {/* Lethality per Crash by Vehicle Class */}
        <div className="col-12 col-xl-5">
          <div className="card h-100 border-0 shadow-sm hover-lift">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <div>
                <h4 className="h6 fw-bold mb-0 text-dark">Fatality Rate per Collision (%)</h4>
                <span className="small text-secondary">Deaths per 100 collisions by vehicle category</span>
              </div>
              <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-0.5" style={{ fontSize: '0.7rem' }}>
                Lethality Index
              </span>
            </div>
            <div className="card-body p-3 p-lg-4">
              <div style={{ height: '360px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={vehicleData.categories}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" stroke="#475569" domain={[0, 45]} unit="%" tick={{ fill: '#334155', fontWeight: 600 }} />
                    <YAxis
                      dataKey="label"
                      type="category"
                      stroke="#475569"
                      tickFormatter={formatVehicleLabel}
                      width={115}
                      tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Fatality Rate']}
                      labelFormatter={(label) => `Vehicle Class: ${label}`}
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #cbd5e1', boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }}
                    />
                    <Bar dataKey="fatality_rate_per_crash" name="Fatality Rate (%)" fill="#ea580c" radius={[0, 6, 6, 0]}>
                      {vehicleData.categories.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.fatality_rate_per_crash >= 35 ? '#dc2626' : entry.fatality_rate_per_crash >= 25 ? '#ea580c' : '#10b981'}
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

      {/* Detailed Vehicle Risk Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom py-3">
          <h4 className="h6 fw-bold mb-0 text-dark">Vehicular Impact Metrics Table</h4>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 custom-table">
              <thead>
                <tr>
                  <th>Vehicle Category</th>
                  <th>Crash Count</th>
                  <th>Share of Crashes (%)</th>
                  <th>Fatalities (Deaths)</th>
                  <th>Share of Fatalities (%)</th>
                  <th>Fatality Rate / Crash (%)</th>
                  <th>Risk Assessment</th>
                </tr>
              </thead>
              <tbody>
                {vehicleData.categories.map((v) => (
                  <tr key={v.key}>
                    <td className="fw-semibold">{v.label}</td>
                    <td className="fw-bold">{v.accidents}</td>
                    <td>{v.accidents_share}%</td>
                    <td className="text-danger fw-bold">{v.fatalities}</td>
                    <td>{v.fatalities_share}%</td>
                    <td className="fw-bold">{v.fatality_rate_per_crash}%</td>
                    <td>
                      <span
                        className={`badge ${
                          v.fatality_rate_per_crash >= 35
                            ? 'bg-danger-subtle text-danger'
                            : v.accidents_share >= 40
                            ? 'bg-warning-subtle text-warning-emphasis'
                            : 'bg-primary-subtle text-primary'
                        }`}
                      >
                        {v.fatality_rate_per_crash >= 35
                          ? 'High Collision Lethality'
                          : v.accidents_share >= 40
                          ? 'High Volume Vulnerability'
                          : 'Moderate Risk'}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="table-light fw-bold">
                  <td>Total</td>
                  <td>{vehicleData.total_accidents}</td>
                  <td>100.0%</td>
                  <td className="text-danger">{vehicleData.total_fatalities}</td>
                  <td>100.0%</td>
                  <td className="text-dark">
                    {((vehicleData.total_fatalities / vehicleData.total_accidents) * 100).toFixed(2)}%
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

export default VehicleAnalysisPage;
