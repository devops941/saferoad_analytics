import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';
import UnavailableNotice from '../components/UnavailableNotice.jsx';

const DATASETS = [
  { key: 'districts_2021_2023', label: 'TN District-Wise Accidents & Deaths (2021–2023)', period: '2021–2023 Annual' },
  { key: 'madurai_severity_2024', label: 'Madurai Accident Severity (2024 Full Year)', period: '2024 (Full Year)' },
  { key: 'severity_2024', label: 'TN All Districts Accident Severity (2024 Full Year)', period: '2024 (Full Year)' },
  { key: 'madurai_severity_2025_q1', label: 'Madurai Accident Severity (2025 Q1)', period: 'Jan–Mar 2025' },
  { key: 'severity_2025_q1', label: 'TN All Districts Severity (2025 Q1)', period: 'Jan–Mar 2025' },
  { key: 'madurai_road_wise_2025_q1', label: 'Madurai Road-Wise Accidents & Fatalities (2025 Q1)', period: 'Jan–Mar 2025' },
  { key: 'road_wise_2025_q1', label: 'TN All Districts Road-Wise (2025 Q1)', period: 'Jan–Mar 2025' },
  { key: 'madurai_vehicle_wise_2025_q1', label: 'Madurai Vehicle-Wise Accidents & Fatalities (2025 Q1)', period: 'Jan–Mar 2025' },
  { key: 'vehicle_wise_2025_q1', label: 'TN All Districts Vehicle-Wise (2025 Q1)', period: 'Jan–Mar 2025' },
  { key: 'hit_and_run', label: 'Madurai Hit-and-Run (District vs. City Police)', period: 'Crime Records Series' },
];

const DataExplorerPage = () => {
  const [selectedDataset, setSelectedDataset] = useState('districts_2021_2023');
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [explorerData, setExplorerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExplorerData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getExplorerData({
        dataset: selectedDataset,
        search: search.trim() || undefined,
        district: selectedDistrict || undefined,
        page,
        page_size: pageSize,
      });
      setExplorerData(res);
    } catch (err) {
      console.error('Failed to query explorer dataset:', err);
      setError('Unable to fetch dataset records from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1); // Reset page on dataset or filter change
  }, [selectedDataset, search, selectedDistrict, pageSize]);

  useEffect(() => {
    fetchExplorerData();
  }, [selectedDataset, search, selectedDistrict, page, pageSize]);

  // Client-side CSV export of currently loaded records
  const handleExportCSV = () => {
    if (!explorerData || !explorerData.records || explorerData.records.length === 0) return;
    const columns = explorerData.columns;
    const csvRows = [
      columns.join(','),
      ...explorerData.records.map((r) =>
        columns.map((col) => `"${String(r[col] ?? '').replace(/"/g, '""')}"`).join(',')
      ),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDataset}_export.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const currentDatasetMeta = DATASETS.find((d) => d.key === selectedDataset);

  return (
    <div className="d-flex flex-column gap-4">
      {/* Information Header */}
      <div className="card border-0 shadow-sm bg-white p-3 p-lg-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h3 className="h6 fw-bold text-primary mb-1">Official Dataset Explorer & Filter Engine</h3>
            <p className="text-secondary small mb-0">
              Interactive tabular inspection of all 10 verified road accident and casualty datasets.
            </p>
          </div>
          <span className="badge bg-light text-secondary border px-3 py-2">
            10 Official Datasets Available
          </span>
        </div>
      </div>

      {/* Unavailable Notice */}
      <UnavailableNotice feature="GPS coordinates, live weather correlations, and hourly time-of-day attributes" />

      {/* Filter Toolbar */}
      <div className="card border-0 shadow-sm bg-white p-3 p-lg-4">
        <div className="row g-3 align-items-end">
          {/* Dataset Selector */}
          <div className="col-12 col-md-5">
            <label className="form-label small text-secondary fw-semibold">Select Government Dataset</label>
            <select
              className="form-select form-select-sm"
              value={selectedDataset}
              onChange={(e) => {
                setSelectedDataset(e.target.value);
                setSelectedDistrict('');
                setSearch('');
              }}
            >
              {DATASETS.map((d) => (
                <option key={d.key} value={d.key}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div className="col-12 col-sm-6 col-md-3">
            <label className="form-label small text-secondary fw-semibold">Filter by District</label>
            <select
              className="form-select form-select-sm"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={selectedDataset.startsWith('madurai_') || selectedDataset === 'hit_and_run'}
            >
              <option value="">All Districts ({explorerData?.available_districts?.length || 38})</option>
              {explorerData?.available_districts?.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          {/* Live Search */}
          <div className="col-12 col-sm-6 col-md-4">
            <label className="form-label small text-secondary fw-semibold">Search Keywords</label>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-secondary"></i>
              </span>
              <input
                type="text"
                className="form-control form-control-sm border-start-0"
                placeholder="Search values..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="btn btn-outline-secondary" onClick={() => setSearch('')}>
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dataset Meta Bar */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3 pt-3 border-top small text-secondary">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
              Period: {currentDatasetMeta?.period}
            </span>
            <span>
              Total Matching Records: <b>{explorerData?.total_records || 0}</b>
            </span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-outline-primary btn-sm" onClick={handleExportCSV}>
              <i className="bi bi-download me-1"></i> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <LoadingSpinner message="Querying dataset records..." />
      ) : error ? (
        <ErrorAlert message={error} onRetry={fetchExplorerData} />
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive" style={{ minHeight: '300px' }}>
              <table className="table table-hover align-middle mb-0 custom-table">
                <thead>
                  <tr>
                    <th>#</th>
                    {explorerData?.columns?.map((col) => (
                      <th key={col}>{col.replace(/_/g, ' ')}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {explorerData?.records?.length > 0 ? (
                    explorerData.records.map((row, idx) => {
                      const rowNum = (page - 1) * pageSize + idx + 1;
                      const isMadurai = Object.values(row).some(
                        (val) => typeof val === 'string' && val.toUpperCase().includes('MADURAI')
                      );
                      return (
                        <tr key={idx} className={isMadurai ? 'table-primary fw-medium' : ''}>
                          <td className="text-muted small">{rowNum}</td>
                          {explorerData.columns.map((col) => (
                            <td key={col}>{row[col] !== null && row[col] !== undefined ? String(row[col]) : '-'}</td>
                          ))}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={explorerData?.columns?.length + 1 || 5} className="text-center py-4 text-secondary">
                        No records match your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="card-footer bg-white border-top py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="small text-secondary">
              Showing Page <b>{explorerData?.page}</b> of <b>{explorerData?.total_pages}</b> ({explorerData?.total_records} records)
            </div>
            <div className="d-flex align-items-center gap-2">
              <select
                className="form-select form-select-sm"
                style={{ width: '85px' }}
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                <option value={10}>10 / page</option>
                <option value={15}>15 / page</option>
                <option value={25}>25 / page</option>
                <option value={50}>50 / page</option>
              </select>
              <div className="btn-group btn-group-sm">
                <button
                  className="btn btn-outline-secondary"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <i className="bi bi-chevron-left"></i> Previous
                </button>
                <button
                  className="btn btn-outline-secondary"
                  disabled={page >= (explorerData?.total_pages || 1)}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataExplorerPage;
