import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
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
  BarChart,
  Bar,
} from 'recharts';

const TrendsPage = () => {
  const [trends, setTrends] = useState(null);
  const [districtRankings, setDistrictRankings] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrendsData = async (year = 2024) => {
    try {
      setLoading(true);
      setError(null);
      const [trendRes, rankingRes] = await Promise.all([
        api.getYearWiseTrends(),
        api.getDistrictsComparison(year),
      ]);
      setTrends(trendRes);
      setDistrictRankings(rankingRes);
    } catch (err) {
      console.error('Failed to load trends data:', err);
      setError('Failed to fetch trend data from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendsData(selectedYear);
  }, [selectedYear]);

  if (loading) return <LoadingSpinner message="Calculating multi-year accident trends and benchmarks..." />;
  if (error) return <ErrorAlert message={error} onRetry={() => fetchTrendsData(selectedYear)} />;
  if (!trends) return null;

  // Combine trend series with state benchmark for dual chart
  const combinedSeries = trends.series.map((item, idx) => {
    const st = trends.state_benchmark_series[idx];
    return {
      year: item.year,
      accidents: item.accidents,
      fatalities: item.fatalities,
      severity_rate: item.severity_rate,
      state_severity_rate: st ? st.state_severity_rate : 0,
      madurai_accident_share: st ? st.madurai_accident_share : 0,
    };
  });

  return (
    <div className="d-flex flex-column gap-4">
      {/* Overview Info Callout */}
      <div className="executive-banner p-3 p-lg-3.5 d-flex justify-content-between align-items-center flex-wrap gap-3 animate-slide-up">
        <div className="d-flex align-items-center gap-3">
          <div className="icon-badge icon-badge-cyan" style={{ width: '44px', height: '44px', fontSize: '1.25rem' }}>
            <i className="bi bi-graph-up"></i>
          </div>
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h2 className="h6 fw-bold text-dark mb-0" style={{ letterSpacing: '-0.01em', fontSize: '1rem' }}>
                Multi-Year Longitudinal Trajectory (2021 – 2024)
              </h2>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-0.5" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                Annual Series
              </span>
            </div>
            <p className="text-secondary small mb-0" style={{ fontSize: '0.82rem' }}>
              Tracking annual shifts in road crashes, fatalities, and the lethality index in Madurai District compared to Tamil Nadu state averages.
            </p>
          </div>
        </div>
        <span className="badge bg-light text-secondary border px-2.5 py-1.5 shadow-sm" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
          <i className="bi bi-shield-check text-success me-1"></i> SCRB Official Records
        </span>
      </div>

      {/* Main Charts Row */}
      <div className="row g-4 animate-slide-up delay-1">
        {/* Trend of Accidents and Deaths */}
        <div className="col-12 col-xl-6">
          <div className="card h-100 border-0 shadow-sm hover-lift">
            <div className="card-header bg-white border-bottom py-3">
              <h4 className="h6 fw-bold mb-0 text-dark">Accidents vs. Fatalities (2021 – 2024)</h4>
              <span className="small text-secondary">Annual accident and mortality counts</span>
            </div>
            <div className="card-body p-3 p-lg-4">
              <div style={{ height: '320px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={combinedSeries} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="year" stroke="#475569" tick={{ fill: '#334155', fontWeight: 600 }} />
                    <YAxis stroke="#475569" tick={{ fill: '#334155', fontWeight: 600 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #cbd5e1', boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="accidents" name="Total Accidents" stroke="#2563eb" strokeWidth={3.5} dot={{ r: 5, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="fatalities" name="Fatalities" stroke="#dc2626" strokeWidth={3.5} dot={{ r: 5, fill: '#dc2626', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Severity Rate Comparison Chart */}
        <div className="col-12 col-xl-6">
          <div className="card h-100 border-0 shadow-sm hover-lift">
            <div className="card-header bg-white border-bottom py-3">
              <h4 className="h6 fw-bold mb-0 text-dark">Severity Rate Comparison (%)</h4>
              <span className="small text-secondary">Deaths per 100 accidents (Madurai vs. Tamil Nadu State Total)</span>
            </div>
            <div className="card-body p-3 p-lg-4">
              <div style={{ height: '320px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={combinedSeries} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="year" stroke="#475569" tick={{ fill: '#334155', fontWeight: 600 }} />
                    <YAxis stroke="#475569" domain={[20, 40]} tick={{ fill: '#334155', fontWeight: 600 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #cbd5e1', boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="severity_rate" name="Madurai Severity %" stroke="#d97706" strokeWidth={3.5} dot={{ r: 5, fill: '#d97706', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="state_severity_rate" name="Tamil Nadu Avg %" stroke="#64748b" strokeWidth={2.5} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Year Data Table */}
      <div className="card border-0 shadow-sm hover-lift animate-slide-up delay-2">
        <div className="card-header bg-white border-bottom py-3">
          <h4 className="h6 fw-bold mb-0 text-dark">Multi-Year Annual Metrics Table (Madurai District)</h4>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 custom-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Total Accidents</th>
                  <th>YoY Acc Growth</th>
                  <th>Fatalities (Deaths)</th>
                  <th>YoY Death Growth</th>
                  <th>Severity Rate (%)</th>
                  <th>TN State Severity (%)</th>
                  <th>Madurai Share of TN (%)</th>
                </tr>
              </thead>
              <tbody>
                {trends.series.map((row, idx) => {
                  const bench = trends.state_benchmark_series[idx];
                  return (
                    <tr key={row.year}>
                      <td className="fw-bold text-primary">{row.year}</td>
                      <td className="fw-semibold text-dark">{row.accidents.toLocaleString()}</td>
                      <td>
                        {row.yoy_accident_growth !== null ? (
                          <span className={`badge px-2 py-1 rounded-pill ${row.yoy_accident_growth < 0 ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'}`} style={{ fontWeight: 600 }}>
                            {row.yoy_accident_growth > 0 ? `+${row.yoy_accident_growth}%` : `${row.yoy_accident_growth}%`}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="fw-bold text-danger">{row.fatalities.toLocaleString()}</td>
                      <td>
                        {row.yoy_fatality_growth !== null ? (
                          <span className={`badge px-2 py-1 rounded-pill ${row.yoy_fatality_growth < 0 ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'}`} style={{ fontWeight: 600 }}>
                            {row.yoy_fatality_growth > 0 ? `+${row.yoy_fatality_growth}%` : `${row.yoy_fatality_growth}%`}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="fw-bold text-dark">{row.severity_rate}%</td>
                      <td className="text-secondary fw-semibold">{bench?.state_severity_rate}%</td>
                      <td className="text-secondary fw-semibold">{bench?.madurai_accident_share}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* District Comparison & Ranking Section */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h4 className="h6 fw-bold mb-0 text-dark">Tamil Nadu District Rankings Comparison</h4>
            <span className="small text-muted">Comparative position of Madurai among all 38 districts</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="small text-secondary fw-semibold">Select Year:</span>
            {[2021, 2022, 2023, 2024].map((y) => (
              <button
                key={y}
                className={`btn btn-sm ${selectedYear === y ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setSelectedYear(y)}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive" style={{ maxHeight: '350px' }}>
            <table className="table table-hover align-middle mb-0 custom-table">
              <thead className="sticky-top bg-light">
                <tr>
                  <th>Rank</th>
                  <th>District Name</th>
                  <th>Total Accidents</th>
                  <th>Fatalities</th>
                  <th>Severity Rate (%)</th>
                </tr>
              </thead>
              <tbody>
                {districtRankings?.rankings?.map((r, index) => {
                  const isMadurai = r.district.toUpperCase().includes('MADURAI') && !r.district.toUpperCase().includes('CITY');
                  return (
                    <tr key={r.district} className={isMadurai ? 'table-primary fw-bold' : ''}>
                      <td>#{index + 1}</td>
                      <td>
                        {r.district}
                        {isMadurai && <span className="badge bg-primary text-white ms-2">Focus District</span>}
                      </td>
                      <td>{r.accidents.toLocaleString()}</td>
                      <td className="text-danger">{r.fatalities.toLocaleString()}</td>
                      <td>{r.severity_rate}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendsPage;
