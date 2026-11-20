import React from 'react';

const variantConfig = {
  primary: {
    borderClass: 'kpi-variant-primary',
    iconBadgeClass: 'icon-badge-blue',
    badgeClass: 'bg-primary-subtle text-primary border-primary-subtle',
  },
  danger: {
    borderClass: 'kpi-variant-danger',
    iconBadgeClass: 'icon-badge-danger',
    badgeClass: 'bg-danger-subtle text-danger border-danger-subtle',
  },
  warning: {
    borderClass: 'kpi-variant-warning',
    iconBadgeClass: 'icon-badge-warning',
    badgeClass: 'bg-warning-subtle text-warning border-warning-subtle',
  },
  success: {
    borderClass: 'kpi-variant-success',
    iconBadgeClass: 'icon-badge-success',
    badgeClass: 'bg-success-subtle text-success border-success-subtle',
  },
  purple: {
    borderClass: 'kpi-variant-purple',
    iconBadgeClass: 'icon-badge-purple',
    badgeClass: 'bg-purple-subtle text-purple border-purple-subtle',
  },
  cyan: {
    borderClass: 'kpi-variant-cyan',
    iconBadgeClass: 'icon-badge-cyan',
    badgeClass: 'bg-info-subtle text-info border-info-subtle',
  },
};

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
  const config = variantConfig[variant] || variantConfig.primary;

  return (
    <div className={`card h-100 border-0 shadow-sm kpi-card ${config.borderClass} hover-lift animate-slide-up`}>
      <div className="card-body p-3 p-lg-4 d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex justify-content-between align-items-start mb-2.5">
            <span
              className="text-secondary text-uppercase fw-bold"
              style={{ fontSize: '0.72rem', letterSpacing: '0.06em' }}
            >
              {title}
            </span>
            {badge && (
              <span className={`badge border rounded-pill px-2.5 py-1 ${config.badgeClass}`} style={{ fontSize: '0.68rem', fontWeight: 600 }}>
                {badge}
              </span>
            )}
          </div>

          <div className="d-flex align-items-center justify-content-between mb-2">
            <h2
              className="display-6 fw-bold mb-0 text-dark"
              style={{ letterSpacing: '-0.03em', fontSize: '1.95rem' }}
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </h2>
            {icon && (
              <div className={`icon-badge ${config.iconBadgeClass}`} style={{ width: '38px', height: '38px', fontSize: '1.1rem' }}>
                <i className={`bi ${icon}`}></i>
              </div>
            )}
          </div>
        </div>

        <div className="d-flex align-items-center flex-wrap gap-2 pt-2 border-top border-light-subtle">
          {changePercentage !== undefined && changePercentage !== null && (
            <span
              className={`badge d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill ${
                isPositiveChange
                  ? 'bg-success-subtle text-success border border-success-subtle'
                  : 'bg-danger-subtle text-danger border border-danger-subtle'
              }`}
              style={{ fontSize: '0.74rem', fontWeight: 600 }}
            >
              <i className={`bi ${trendDirection === 'down' ? 'bi-arrow-down-right' : 'bi-arrow-up-right'}`}></i>
              {Math.abs(changePercentage)}% YoY
            </span>
          )}
          {subtitle && (
            <span className="text-secondary small fw-medium" style={{ fontSize: '0.78rem' }}>
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default KPICard;
