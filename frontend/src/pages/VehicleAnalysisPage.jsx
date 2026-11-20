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
      {/* Information Header */}
      <div className="card border-0 shadow-sm bg-white p-3 p-lg-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h3 className="h6 fw-bold text-primary mb-1">Vehicle Classification & User Vulnerability Analysis</h3>
            <p className="text-secondary small mb-0">
              Examining crash frequency, fatality burden, and lethality per collision across motorized vehicle categories in Madurai District.
            </p>
          </div>
          <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-2">
            Reporting Period: {vehicleData.period}
          </span>
        </div>
      </div>

      {/* Highlights: Most Vulnerable vs. Most Lethal */}
      <div className="row g-3">
        {vehicleData.highest_vulnerable_vehicle && (
          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm border-start border-4 border-danger p-3 bg-white h-100">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-danger-subtle text-danger p-2 rounded-3">
                  <i className="bi bi-bicycle fs-4"></i>
                </div>
                <div>
                  <span className="text-muted small text-uppercase fw-semibold">Most Vulnerable Road User Class</span>
                  <h4 className="h5 fw-bold text-danger mb-1">{vehicleData.highest_vulnerable_vehicle.label}</h4>
                  <p className="text-secondary small mb-0">
                    Accounts for <b>{vehicleData.highest_vulnerable_vehicle.accidents} crashes ({vehicleData.highest_vulnerable_vehicle.accidents_share}%)</b> and <b>{vehicleData.highest_vulnerable_vehicle.fatalities} deaths ({vehicleData.highest_vulnerable_vehicle.fatalities_share}%)</b>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {vehicleData.highest_lethal_vehicle && (
          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm border-start border-4 border-warning p-3 bg-white h-100">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-warning-subtle text-warning-emphasis p-2 rounded-3">
                  <i className="bi bi-truck fs-4"></i>
                </div>
                <div>
                  <span className="text-muted small text-uppercase fw-semibold">Highest Collision Lethality Class</span>
                  <h4 className="h5 fw-bold text-dark mb-1">{vehicleData.highest_lethal_vehicle.label}</h4>
                  <p className="text-secondary small mb-0">
                    Highest fatality rate per crash at <b>{vehicleData.highest_lethal_vehicle.fatality_rate_per_crash}%</b> ({vehicleData.highest_lethal_vehicle.fatalities} fatalities from {vehicleData.highest_lethal_vehicle.accidents} crashes).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Charts Row */}
      <div className="row g-4">
        {/* Accidents vs. Fatalities by Vehicle Type */}
        <div className="col-12 col-xl-7">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-white border-bottom py-3">
              <h4 className="h6 fw-bold mb-0 text-dark">Crash Volume & Fatalities by Vehicle Class</h4>
              <span className="small text-muted">2025 Q1 Provisional (Madurai District)</span>
            </div>
            <div className="card-body p-3 p-lg-4">
              <div style={{ height: '320px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vehicleData.categories} margin={{ top: 10, right: 30, left: 10, bottom: 35 }}>
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
                    <Legend />
                    <Bar dataKey="accidents" name="Total Accidents" fill="#1e40af" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="fatalities" name="Fatalities" fill="#dc2626" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Lethality per Crash by Vehicle Class */}
        <div className="col-12 col-xl-5">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-white border-bottom py-3">
              <h4 className="h6 fw-bold mb-0 text-dark">Fatality Rate per Collision (%)</h4>
              <span className="small text-muted">Deaths per 100 collisions by vehicle category</span>
            </div>
            <div className="card-body p-3 p-lg-4">
              <div style={{ height: '320px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={vehicleData.categories}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 60, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" stroke="#64748b" domain={[0, 45]} />
                    <YAxis dataKey="label" type="category" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="fatality_rate_per_crash" name="Fatality Rate (%)" fill="#ea580c" radius={[0, 4, 4, 0]}>
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
