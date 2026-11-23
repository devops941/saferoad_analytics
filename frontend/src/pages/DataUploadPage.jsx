import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const DataUploadPage = () => {
  const [schemas, setSchemas] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetDataset, setTargetDataset] = useState('auto');
  const [isValidating, setIsValidating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [activeSchemaTab, setActiveSchemaTab] = useState(0);

  useEffect(() => {
    loadSchemas();
  }, []);

  const loadSchemas = async () => {
    try {
      const data = await api.getUploadSchemas();
      if (data && data.schemas) {
        setSchemas(data.schemas);
      }
    } catch (err) {
      console.error('Failed to load dataset schemas:', err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.csv')) {
        setErrorMessage('Only .csv files are supported.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setErrorMessage(null);
      setSuccessMessage(null);
      setValidationResult(null);
      setUploadResult(null);

      // Intelligent Auto-Selection: match target dataset to filename
      const name = file.name.toLowerCase();
      if (name.includes('severity_2025') || (name.includes('severity') && name.includes('q1'))) {
        setTargetDataset('severity_2025_q1');
      } else if (name.includes('severity_2024') || (name.includes('severity') && name.includes('2024'))) {
        setTargetDataset('severity_2024');
      } else if (name.includes('road_wise') || name.includes('road')) {
        setTargetDataset('road_wise_2025_q1');
      } else if (name.includes('vehicle_wise') || name.includes('vehicle')) {
        setTargetDataset('vehicle_wise_2025_q1');
      } else if (name.includes('hit_and_run') || name.includes('hit')) {
        setTargetDataset('hit_and_run');
      } else if (name.includes('2021_2023') || name.includes('trend')) {
        setTargetDataset('districts_2021_2023');
      } else {
        setTargetDataset('auto');
      }
    }
  };

  const handleValidate = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a CSV file first.');
      return;
    }
    setIsValidating(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('target_dataset', targetDataset);

    try {
      const res = await api.validateDatasetFile(formData);
      setValidationResult(res);
      if (res.is_valid) {
        setSuccessMessage(`File validated successfully! Detected as '${res.detected_key}' with ${res.rows} rows.`);
      } else {
        setErrorMessage(`Validation failed: ${res.errors?.join(', ') || 'Schema mismatch'}`);
      }
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Validation request failed.';
      setErrorMessage(msg);
    } finally {
      setIsValidating(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a CSV file to upload.');
      return;
    }
    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('target_dataset', targetDataset);

    try {
      const res = await api.uploadDatasetFile(formData);
      setUploadResult(res);
      setValidationResult(null);
      setSuccessMessage(
        `Dataset successfully ingested! ${res.rows_ingested} records processed. Dashboard and charts are now updated.`
      );
      // Refresh schemas if preview changed
      loadSchemas();
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Dataset upload failed.';
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRestoreDefaults = async () => {
    if (
      !window.confirm(
        'Are you sure you want to revert all datasets back to the official government SCRB baseline? Any custom uploads will be replaced with official records.'
      )
    ) {
      return;
    }
    setIsRestoring(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await api.restoreDefaultDatasets();
      setSuccessMessage(res.message || 'Successfully restored official baseline datasets!');
      setUploadResult(null);
      setValidationResult(null);
      loadSchemas();
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Restore operation failed.';
      setErrorMessage(msg);
    } finally {
      setIsRestoring(false);
    }
  };

  const downloadSampleTemplate = (schema) => {
    if (!schema) return;
    const headerRow = schema.all_columns.join(',');
    let csvContent = 'data:text/csv;charset=utf-8,' + headerRow + '\n';
    if (schema.sample_preview && schema.sample_preview.length > 0) {
      schema.sample_preview.forEach((row) => {
        const rowVals = schema.all_columns.map((col) => {
          const val = row[col] !== undefined ? String(row[col]) : '';
          return val.includes(',') ? `"${val}"` : val;
        });
        csvContent += rowVals.join(',') + '\n';
      });
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `template_${schema.target_filename}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container-fluid px-0">
      {/* Top Hero Banner */}
      <div
        className="card border-0 rounded-4 shadow-sm text-white mb-4 p-4 position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 55%, #059669 100%)',
          boxShadow: '0 8px 24px rgba(5, 150, 105, 0.25)',
        }}
      >
        <div className="position-relative" style={{ zIndex: 2 }}>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="badge bg-white text-success px-3 py-1.5 rounded-pill fw-bold text-uppercase" style={{ fontSize: '0.75rem' }}>
              Data Pipeline & Ingestion
            </span>
            <span className="badge bg-success bg-opacity-75 text-white px-2.5 py-1 rounded-pill" style={{ fontSize: '0.75rem' }}>
              Hot Reload Enabled
            </span>
          </div>
          <h2 className="fw-bold mb-1 fs-3">Dataset Upload & Ingestion Engine</h2>
          <p className="text-light mb-0 fs-6" style={{ opacity: 0.9, maxWidth: '780px' }}>
            Upload new or updated official accident records (CSV) for Madurai District. The system validates schema
            compliance, checks arithmetic totals, creates an automatic backup, and immediately updates live dashboard
            visualizations.
          </p>
        </div>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show rounded-3 shadow-sm d-flex align-items-center gap-2 p-3 mb-4" role="alert">
          <i className="bi bi-check-circle-fill fs-4 text-success flex-shrink-0"></i>
          <div className="flex-grow-1">
            <div className="fw-bold">Success!</div>
            <div className="small">{successMessage}</div>
          </div>
          <button type="button" className="btn-close" onClick={() => setSuccessMessage(null)}></button>
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger alert-dismissible fade show rounded-3 shadow-sm d-flex align-items-center gap-2 p-3 mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill fs-4 text-danger flex-shrink-0"></i>
          <div className="flex-grow-1">
            <div className="fw-bold">Ingestion Warning / Error</div>
            <div className="small">{errorMessage}</div>
          </div>
          <button type="button" className="btn-close" onClick={() => setErrorMessage(null)}></button>
        </div>
      )}

      {/* Upload & Controls Grid */}
      <div className="row g-4 mb-4">
        {/* Upload Form Card */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 rounded-4 shadow-sm h-100 p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-cloud-arrow-up text-success fs-4"></i>
                Upload CSV Dataset
              </h5>
              <span className="badge bg-light text-secondary border px-2.5 py-1 rounded-pill">
                Format: .CSV Only
              </span>
            </div>

            {/* Target Dataset Selection */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted mb-1">
                Target Dataset Category
              </label>
              <select
                className="form-select rounded-3 py-2"
                value={targetDataset}
                onChange={(e) => setTargetDataset(e.target.value)}
              >
                <option value="auto">⚡ Auto-Detect Category from Columns (Recommended)</option>
                {schemas.map((s) => (
                  <option key={s.dataset_key} value={s.dataset_key}>
                    {s.title} ({s.target_filename})
                  </option>
                ))}
              </select>
              <div className="form-text small text-muted">
                Leave on Auto-Detect to automatically identify whether the file is severity, road, vehicle, or trends data.
              </div>
            </div>

            {/* File Dropzone */}
            <div
              className="border border-2 border-dashed rounded-4 p-4 text-center mb-3 position-relative"
              style={{
                borderColor: selectedFile ? '#10b981' : '#cbd5e1',
                backgroundColor: selectedFile ? '#f0fdf4' : '#f8fafc',
                transition: 'all 0.2s ease',
              }}
            >
              <input
                type="file"
                accept=".csv"
                id="datasetFileInput"
                className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
                style={{ cursor: 'pointer' }}
                onChange={handleFileChange}
              />
              <div className="d-flex flex-column align-items-center justify-content-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-2"
                  style={{
                    width: '54px',
                    height: '54px',
                    background: selectedFile ? '#dcfce7' : '#e2e8f0',
                    color: selectedFile ? '#16a34a' : '#64748b',
                  }}
                >
                  <i className={`bi ${selectedFile ? 'bi-file-earmark-check-fill' : 'bi-upload'} fs-3`}></i>
                </div>
                {selectedFile ? (
                  <div>
                    <div className="fw-bold text-dark fs-6">{selectedFile.name}</div>
                    <div className="small text-muted">
                      {(selectedFile.size / 1024).toFixed(1)} KB &bull; Ready for validation
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="fw-bold text-dark">Click to select or drag & drop CSV file</div>
                    <div className="small text-muted">Supports official SCRB annual & quarterly tables</div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-auto pt-2 border-top">
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-3 py-2 rounded-3 small fw-semibold"
                  onClick={handleValidate}
                  disabled={!selectedFile || isValidating || isUploading}
                >
                  {isValidating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1.5" role="status"></span>
                      Validating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-check me-1.5"></i>
                      Validate Only
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-success px-4 py-2 rounded-3 small fw-semibold shadow-sm"
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading || isValidating}
                  style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', border: 'none' }}
                >
                  {isUploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1.5" role="status"></span>
                      Ingesting Dataset...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-cloud-arrow-up-fill me-1.5"></i>
                      Upload & Ingest Dataset
                    </>
                  )}
                </button>
              </div>

              {selectedFile && (
                <button
                  type="button"
                  className="btn btn-link text-danger text-decoration-none small p-0"
                  onClick={() => {
                    setSelectedFile(null);
                    setValidationResult(null);
                    setUploadResult(null);
                  }}
                >
                  Clear Selection
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Safety & Integrity Sidebar Card */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 rounded-4 shadow-sm h-100 p-4 bg-light">
            <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-shield-lock-fill text-primary fs-5"></i>
              Data Integrity & Safety Protocols
            </h6>

            <ul className="list-unstyled small mb-4 d-flex flex-column gap-2 text-muted">
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-check2-circle text-success mt-0.5 flex-shrink-0"></i>
                <span><strong>Pre-Flight Validation:</strong> Missing required columns and data anomalies are trapped before saving.</span>
              </li>
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-check2-circle text-success mt-0.5 flex-shrink-0"></i>
                <span><strong>Automatic Backup:</strong> The previous version of the CSV is automatically archived with a timestamp.</span>
              </li>
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-check2-circle text-success mt-0.5 flex-shrink-0"></i>
                <span><strong>Madurai Synchronization:</strong> If a state-wide dataset is uploaded, Madurai-specific subsets are automatically extracted and synced.</span>
              </li>
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-check2-circle text-success mt-0.5 flex-shrink-0"></i>
                <span><strong>Live Hot-Reload:</strong> In-memory caches update instantly; no server restart required.</span>
              </li>
            </ul>

            {/* Revert / Reset Action */}
            <div className="mt-auto pt-3 border-top">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="fw-bold text-dark small">Restore Baseline Data</div>
                  <div className="small text-muted" style={{ fontSize: '0.75rem' }}>
                    Reverts all files to official SCRB baseline
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm rounded-pill px-3 py-1 fw-semibold"
                  onClick={handleRestoreDefaults}
                  disabled={isRestoring}
                >
                  {isRestoring ? 'Restoring...' : 'Restore Defaults'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Validation / Ingestion Live Preview Panel */}
      {(validationResult || uploadResult) && (
        <div className="card border-0 rounded-4 shadow-sm mb-4 p-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
              <i className="bi bi-clipboard-data text-primary fs-4"></i>
              {uploadResult ? 'Ingested Dataset Summary' : 'Pre-Validation Results'}
            </h5>
            <span
              className={`badge px-3 py-1.5 rounded-pill ${
                (uploadResult?.status === 'success' || validationResult?.is_valid)
                  ? 'bg-success bg-opacity-10 text-success border border-success'
                  : 'bg-warning bg-opacity-10 text-warning border border-warning'
              }`}
            >
              {uploadResult ? 'INGESTED' : validationResult?.is_valid ? 'SCHEMA VALID' : 'ACTION REQUIRED'}
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="row g-3 mb-3">
            <div className="col-6 col-md-3">
              <div className="border rounded-3 p-3 bg-light">
                <div className="small text-muted">Rows Detected</div>
                <div className="fs-5 fw-bold text-dark">
                  {uploadResult?.rows_ingested || validationResult?.rows || 0}
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="border rounded-3 p-3 bg-light">
                <div className="small text-muted">Columns Count</div>
                <div className="fs-5 fw-bold text-dark">
                  {uploadResult?.columns?.length || validationResult?.columns?.length || 0}
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="border rounded-3 p-3 bg-light">
                <div className="small text-muted">Target Dataset</div>
                <div className="fs-6 fw-bold text-primary text-truncate">
                  {uploadResult?.dataset_key || validationResult?.detected_key || 'Unknown'}
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="border rounded-3 p-3 bg-light">
                <div className="small text-muted">Backup Created</div>
                <div className="small fw-semibold text-secondary text-truncate">
                  {uploadResult?.backup_created || 'Dry-run (No backup)'}
                </div>
              </div>
            </div>
          </div>

          {/* Warnings list if any */}
          {((uploadResult?.warnings && uploadResult.warnings.length > 0) ||
            (validationResult?.warnings && validationResult.warnings.length > 0)) && (
            <div className="alert alert-warning p-2.5 rounded-3 mb-3 small">
              <div className="fw-bold mb-1">Notice:</div>
              <ul className="mb-0 ps-3">
                {(uploadResult?.warnings || validationResult?.warnings).map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Data Table Preview */}
          {(uploadResult?.preview || validationResult?.preview) && (
            <div>
              <div className="small fw-bold text-muted mb-2">Parsed Row Preview (First 5 Rows):</div>
              <div className="table-responsive border rounded-3" style={{ maxHeight: '240px' }}>
                <table className="table table-hover table-sm mb-0 align-middle small">
                  <thead className="table-light">
                    <tr>
                      {Object.keys((uploadResult?.preview || validationResult?.preview)[0] || {}).map((col) => (
                        <th key={col} className="px-3 py-2 text-nowrap fw-bold text-secondary">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(uploadResult?.preview || validationResult?.preview).map((row, rIdx) => (
                      <tr key={rIdx}>
                        {Object.values(row).map((val, cIdx) => (
                          <td key={cIdx} className="px-3 py-1.5 text-nowrap">
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Schema Reference & CSV Templates Section */}
      <div className="card border-0 rounded-4 shadow-sm p-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
          <div>
            <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
              <i className="bi bi-file-earmark-spreadsheet text-info fs-4"></i>
              Supported CSV Schemas & Format Templates
            </h5>
            <div className="small text-muted">
              Refer to these column structures when preparing CSV files for ingestion.
            </div>
          </div>
          {schemas[activeSchemaTab] && (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm rounded-pill px-3 py-1.5 d-flex align-items-center gap-1.5 small fw-semibold"
              onClick={() => downloadSampleTemplate(schemas[activeSchemaTab])}
            >
              <i className="bi bi-download"></i>
              Download Sample CSV Template
            </button>
          )}
        </div>

        {/* Schema Tabs */}
        <div className="d-flex flex-wrap gap-1.5 mb-3 border-bottom pb-2">
          {schemas.map((schema, index) => (
            <button
              key={schema.dataset_key}
              type="button"
              className={`btn btn-sm rounded-pill px-3 py-1 small fw-semibold ${
                activeSchemaTab === index
                  ? 'btn-primary shadow-sm text-white'
                  : 'btn-light text-secondary border'
              }`}
              onClick={() => setActiveSchemaTab(index)}
            >
              {schema.category}
            </button>
          ))}
        </div>

        {/* Selected Schema Content */}
        {schemas[activeSchemaTab] && (
          <div className="bg-light rounded-3 p-3 border">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
              <div>
                <h6 className="fw-bold text-dark mb-0">{schemas[activeSchemaTab].title}</h6>
                <span className="small text-muted">Target File: <code>{schemas[activeSchemaTab].target_filename}</code></span>
              </div>
              <span className="badge bg-secondary rounded-pill px-2.5 py-1 small">
                {schemas[activeSchemaTab].required_columns.length} Required Columns
              </span>
            </div>

            <div className="small fw-semibold text-secondary mb-1">Required Headers:</div>
            <div className="d-flex flex-wrap gap-1.5 mb-2">
              {schemas[activeSchemaTab].required_columns.map((col) => (
                <span key={col} className="badge bg-white text-dark border px-2 py-1 font-monospace" style={{ fontSize: '0.75rem' }}>
                  {col}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataUploadPage;
