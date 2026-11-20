import React from 'react';
import { NavLink } from 'react-router-dom';

const navGroups = [
  {
    category: 'Portal & Overview',
    items: [
      { path: '/', label: 'Home & Overview', icon: 'bi-house-door-fill', themeColor: '#0284c7' },
      { path: '/dashboard', label: 'Executive Dashboard', icon: 'bi-speedometer2', themeColor: '#2563eb' },
      { path: '/trends', label: 'Yearly Trends & Benchmarks', icon: 'bi-graph-up-arrow', themeColor: '#0891b2' },
    ],
  },
  {
    category: 'Safety & Risk Profiling',
    items: [
      { path: '/severity', label: 'Accident Severity', icon: 'bi-pie-chart-fill', themeColor: '#dc2626' },
      { path: '/roads', label: 'Road Infrastructure', icon: 'bi-signpost-2-fill', themeColor: '#ea580c' },
      { path: '/gis-map', label: 'GIS Road Map', icon: 'bi-map-fill', themeColor: '#059669', badge: 'GIS' },
      { path: '/vehicles', label: 'Vehicle Vulnerability', icon: 'bi-truck-front-fill', themeColor: '#7c3aed' },
      { path: '/hit-and-run', label: 'Hit & Run Analysis', icon: 'bi-shield-exclamation', themeColor: '#b91c1c' },
    ],
  },
  {
    category: 'Citizen Safety & Guidance',
    items: [
      { path: '/safety-tips', label: 'Safety Advisories', icon: 'bi-shield-check', themeColor: '#16a34a' },
    ],
  },
  {
    category: 'Data & Reporting',
    items: [
      { path: '/explorer', label: 'Data Explorer', icon: 'bi-table', themeColor: '#4f46e5' },
      { path: '/reports', label: 'Audit Reports & PDF', icon: 'bi-file-earmark-pdf-fill', themeColor: '#e11d48' },
    ],
  },
];

const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
          style={{ zIndex: 1040 }}
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`bg-white border-end d-flex flex-column sidebar-container ${
          isMobileOpen ? 'show' : ''
        }`}
        style={{ width: '275px' }}
      >
        {/* Brand Header */}
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between" style={{ background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.8) 0%, rgba(255, 255, 255, 0.95) 100%)' }}>
          <div className="d-flex align-items-center gap-2.5">
            <div
              className="text-white rounded-3 p-2 d-flex align-items-center justify-content-center shadow-sm"
              style={{
                width: '42px',
                height: '42px',
                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #4f46e5 100%)',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.32)',
              }}
            >
              <i className="bi bi-shield-check fs-5"></i>
            </div>
            <div>
              <div className="d-flex align-items-center gap-1.5">
                <h1
                  className="h6 fw-bold mb-0 text-dark"
                  style={{ letterSpacing: '-0.025em', fontSize: '0.98rem' }}
                >
                  SafeRoad Analytics
                </h1>
              </div>
              <div className="d-flex align-items-center gap-1.5 mt-0.5">
                <span
                  className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-1.5 py-0.5"
                  style={{ fontSize: '0.65rem', fontWeight: 600 }}
                >
                  Madurai DSS
                </span>
                <span className="text-secondary small" style={{ fontSize: '0.72rem', fontWeight: 500 }}>
                  Decision Portal
                </span>
              </div>
            </div>
          </div>
          <button className="btn btn-sm btn-light border-0 d-lg-none" onClick={onCloseMobile}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Navigation Items (Categorized with Modern Icon Boxes) */}
        <div className="flex-grow-1 overflow-auto py-2.5 px-2.5">
          {navGroups.map((group, gIdx) => (
            <div key={group.category} className={gIdx > 0 ? 'mt-3 pt-1' : ''}>
              <div className="nav-category-header d-flex align-items-center justify-content-between mb-1">
                <span>{group.category}</span>
                <span style={{ height: '1px', flexGrow: 1, backgroundColor: 'rgba(226, 232, 240, 0.8)', marginLeft: '8px' }}></span>
              </div>
              <nav className="nav flex-column gap-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `nav-link d-flex align-items-center px-2.5 py-2 rounded-3 text-decoration-none transition-all ${
                        isActive
                          ? 'active-nav-link fw-bold'
                          : 'hover-nav-link text-secondary'
                      }`
                    }
                    style={{ fontSize: '0.84rem' }}
                  >
                    {({ isActive }) => (
                      <div className="d-flex align-items-center w-100 gap-2.5">
                        {/* Modern Rounded Icon Container Pill */}
                        <div
                          className="d-flex align-items-center justify-content-center rounded-2"
                          style={{
                            width: '32px',
                            height: '32px',
                            fontSize: '0.95rem',
                            backgroundColor: isActive ? item.themeColor : 'rgba(241, 245, 249, 0.95)',
                            color: isActive ? '#ffffff' : item.themeColor,
                            boxShadow: isActive ? `0 4px 10px ${item.themeColor}40` : 'none',
                            transition: 'all 0.25s ease',
                            flexShrink: 0,
                          }}
                        >
                          <i className={`bi ${item.icon}`}></i>
                        </div>

                        {/* Label */}
                        <span
                          className="flex-grow-1"
                          style={{
                            letterSpacing: '-0.01em',
                            fontSize: '0.84rem',
                            fontWeight: isActive ? 700 : 500,
                            color: isActive ? '#0f172a' : '#334155',
                          }}
                        >
                          {item.label}
                        </span>

                        {/* Optional Pill Badge */}
                        {item.badge && (
                          <span
                            className="badge rounded-pill bg-success text-white shadow-sm"
                            style={{ fontSize: '0.62rem', padding: '0.2rem 0.45rem', fontWeight: 600 }}
                          >
                            {item.badge}
                          </span>
                        )}

                        {/* Active Arrow Indicator */}
                        {isActive && (
                          <i className="bi bi-chevron-right text-primary small fw-bold ms-auto" style={{ fontSize: '0.75rem' }}></i>
                        )}
                      </div>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Modern Footer */}
        <div
          className="p-3 border-top"
          style={{
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, rgba(248, 250, 252, 0.95) 100%)',
          }}
        >
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span className="fw-bold text-dark" style={{ fontSize: '0.82rem', letterSpacing: '-0.01em' }}>
              SafeRoad Analytics @2026
            </span>
            <span
              className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2 py-0.5 d-inline-flex align-items-center gap-1 shadow-sm"
              style={{ fontSize: '0.68rem', fontWeight: 600 }}
            >
              <span className="pulse-dot"></span> Live
            </span>
          </div>
          <span className="text-secondary small d-block" style={{ fontSize: '0.72rem', fontWeight: 500 }}>
            Madurai Road Safety Intelligence
          </span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
