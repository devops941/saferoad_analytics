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
      <div className="d-flex flex-column flex-grow-1 w-100 overflow-hidden">
        <Header onOpenMobile={() => setIsMobileOpen(true)} />
        <main className="flex-grow-1 p-3 p-lg-4 overflow-auto">
          <div className="container-fluid px-0" style={{ maxWidth: '1400px' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
