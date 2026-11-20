import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

const Layout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="d-flex min-vh-100 bg-light-subtle">
      <Sidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />
      <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0 }}>
        <Header onOpenMobile={() => setIsMobileOpen(true)} />
        <main className="flex-grow-1 p-3 p-lg-4 overflow-auto d-flex flex-column">
          <div className="container-fluid px-0 mb-4" style={{ maxWidth: '1400px' }}>
            <Outlet />
          </div>
          <footer className="mt-auto py-3 px-3 px-lg-4 glass-footer border-top text-center" style={{ borderRadius: '0.75rem' }}>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 container-fluid px-0" style={{ maxWidth: '1400px' }}>
              <span className="fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>
                SafeRoad Analytics @2026
              </span>
              <span className="text-secondary small" style={{ fontSize: '0.78rem' }}>
                Madurai District Road Safety Intelligence
              </span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Layout;
