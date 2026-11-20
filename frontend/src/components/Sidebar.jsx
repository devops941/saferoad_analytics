import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Dashboard', icon: 'bi-speedometer2' },
  { path: '/trends', label: 'Yearly Trends', icon: 'bi-graph-up' },
  { path: '/severity', label: 'Severity Analysis', icon: 'bi-pie-chart' },
  { path: '/roads', label: 'Road Analysis', icon: 'bi-signpost-2' },
  { path: '/vehicles', label: 'Vehicle Analysis', icon: 'bi-truck' },
  { path: '/hit-and-run', label: 'Hit & Run Analysis', icon: 'bi-shield-exclamation' },
  { path: '/explorer', label: 'Data Explorer', icon: 'bi-table' },
  { path: '/reports', label: 'Reports', icon: 'bi-file-earmark-pdf' },
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
        className={`bg-white border-end d-flex flex-column position-fixed position-lg-sticky top-0 start-0 h-100 sidebar-container ${
          isMobileOpen ? 'show' : ''
        }`}
        style={{
          width: '260px',
          zIndex: 1045,
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        {/* Brand Header */}
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-primary text-white rounded-3 p-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '38px', height: '38px' }}>
              <i className="bi bi-shield-check fs-5"></i>
            </div>
            <div>
              <h1 className="h6 fw-bold mb-0 text-primary" style={{ letterSpacing: '-0.3px' }}>SafeRoad Analytics</h1>
              <span className="text-secondary small" style={{ fontSize: '0.7rem' }}>Madurai District Road Safety</span>
            </div>
          </div>
          <button className="btn btn-sm btn-light d-lg-none" onClick={onCloseMobile}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-grow-1 overflow-auto py-3 px-2">
          <span className="px-3 text-uppercase text-secondary fw-bold small" style={{ fontSize: '0.65rem', letterSpacing: '0.8px' }}>
            Analytics Modules
          </span>
          <nav className="nav flex-column gap-1 mt-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-secondary fw-medium transition ${
                    isActive
                      ? 'active-nav-link text-primary fw-bold'
                      : 'hover-nav-link'
                  }`
                }
              >
                <i className={`bi ${item.icon} fs-5`}></i>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Meta */}
        <div className="p-3 border-top bg-light-subtle">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
              SCRB Data Verified
            </span>
          </div>
          <p className="text-muted small mt-2 mb-0" style={{ fontSize: '0.7rem' }}>
            Descriptive Exploration System<br />
            Commissionerate of Transport, TN
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
