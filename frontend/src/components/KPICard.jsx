import React from 'react';

const KPICard = ({
  title,
  value,
  subtitle,
  changePercentage,
  isPositiveChange,
  trendDirection,
  badge,
  icon,
  variant = 'primary',
}) => {
  return (
    <div className="card h-100 border-0 shadow-sm kpi-card">
      <div className="card-body p-3 p-lg-4">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
            {title}
          </span>
          {badge && (
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2 py-1" style={{ fontSize: '0.7rem' }}>
              {badge}
            </span>
          )}
        </div>

        <div className="d-flex align-items-baseline mb-2">
          <h2 className="display-6 fw-bold mb-0 text-dark" style={{ letterSpacing: '-0.5px' }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h2>
          {icon && (
            <i className={`bi ${icon} ms-auto text-primary opacity-50`} style={{ fontSize: '1.5rem' }}></i>
          )}
        </div>

        <div className="d-flex align-items-center flex-wrap gap-2 pt-1 border-top border-light-subtle">
          {changePercentage !== undefined && changePercentage !== null && (
            <span
              className={`badge d-inline-flex align-items-center gap-1 ${
                isPositiveChange
                  ? 'bg-success-subtle text-success border border-success-subtle'
                  : 'bg-danger-subtle text-danger border border-danger-subtle'
              }`}
              style={{ fontSize: '0.75rem' }}
            >
              <i className={`bi ${trendDirection === 'down' ? 'bi-arrow-down-right' : 'bi-arrow-up-right'}`}></i>
              {Math.abs(changePercentage)}% YoY
            </span>
          )}
          {subtitle && (
            <span className="text-secondary small" style={{ fontSize: '0.8rem' }}>
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default KPICard;
