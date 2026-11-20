import React from 'react';

const ErrorAlert = ({ message, onRetry }) => {
  return (
    <div className="alert alert-danger d-flex align-items-center justify-content-between p-3 rounded-3 shadow-sm my-4" role="alert">
      <div className="d-flex align-items-center">
        <i className="bi bi-exclamation-triangle-fill fs-4 me-3 text-danger"></i>
        <div>
          <h6 className="alert-heading mb-1 fw-bold">Data Service Encountered an Error</h6>
          <p className="mb-0 text-secondary small">
            {message || 'Unable to connect to the SafeRoad Analytics backend. Please verify the server is running.'}
          </p>
        </div>
      </div>
      {onRetry && (
        <button className="btn btn-outline-danger btn-sm px-3 ms-3" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise me-1"></i> Retry
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;
