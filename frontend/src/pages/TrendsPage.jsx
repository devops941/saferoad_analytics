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
      <div className="card border-0 shadow-sm bg-white p-3 p-lg-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h3 className="h6 fw-bold text-primary mb-1">Multi-Year Trajectory Analysis (2021 – 2024)</h3>
            <p className="text-secondary small mb-0">
              Examining annual changes in road crashes, fatalities, and lethality index in Madurai District compared to Tamil Nadu state averages.
            </p>
          </div>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2">
            SCRB Official Records
          </span>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="row g-4">
        {/* Trend of Accidents and Deaths */}
        <div className="col-12 col-xl-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-white border-bottom py-3">
              <h4 className="h6 fw-bold mb-0 text-dark">Accidents vs. Fatalities (2021 – 2024)</h4>
              <span className="small text-muted">Annual accident and mortality counts</span>
            </div>
            <div className="card-body p-3 p-lg-4">
              <div style={{ height: '320px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={combinedSeries} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="year" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="accidents" name="Accidents" stroke="#1e40af" strokeWidth={3} activeDot={{ r: 7 }} />
                    <Line type="monotone" dataKey="fatalities" name="Fatalities" stroke="#dc2626" strokeWidth={3} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Severity Rate Comparison Chart */}
        <div className="col-12 col-xl-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-white border-bottom py-3">
              <h4 className="h6 fw-bold mb-0 text-dark">Severity Rate Comparison (%)</h4>
              <span className="small text-muted">Deaths per 100 accidents (Madurai vs. Tamil Nadu State Total)</span>
            </div>
            <div className="card-body p-3 p-lg-4">
              <div style={{ height: '320px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={combinedSeries} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="year" stroke="#64748b" />
                    <YAxis stroke="#64748b" domain={[20, 40]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="severity_rate" name="Madurai Severity %" stroke="#b91c1c" strokeWidth={3} activeDot={{ r: 7 }} />
                    <Line type="monotone" dataKey="state_severity_rate" name="Tamil Nadu Avg %" stroke="#64748b" strokeWidth={2} strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Year Data Table */}
      <div className="card border-0 shadow-sm">
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
                      <td className="fw-bold">{row.year}</td>
                      <td>{row.accidents.toLocaleString()}</td>
                      <td>
                        {row.yoy_accident_growth !== null ? (
                          <span className={`badge ${row.yoy_accident_growth < 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                            {row.yoy_accident_growth > 0 ? `+${row.yoy_accident_growth}%` : `${row.yoy_accident_growth}%`}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="fw-semibold text-danger">{row.fatalities.toLocaleString()}</td>
                      <td>
                        {row.yoy_fatality_growth !== null ? (
                          <span className={`badge ${row.yoy_fatality_growth < 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                            {row.yoy_fatality_growth > 0 ? `+${row.yoy_fatality_growth}%` : `${row.yoy_fatality_growth}%`}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="fw-bold text-dark">{row.severity_rate}%</td>
                      <td>{bench?.state_severity_rate}%</td>
                      <td>{bench?.madurai_accident_share}%</td>
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
