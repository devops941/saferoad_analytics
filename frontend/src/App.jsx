import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import TrendsPage from './pages/TrendsPage.jsx';
import SeverityPage from './pages/SeverityPage.jsx';
import RoadAnalysisPage from './pages/RoadAnalysisPage.jsx';
import VehicleAnalysisPage from './pages/VehicleAnalysisPage.jsx';
import HitAndRunPage from './pages/HitAndRunPage.jsx';
import DataExplorerPage from './pages/DataExplorerPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="trends" element={<TrendsPage />} />
          <Route path="severity" element={<SeverityPage />} />
          <Route path="roads" element={<RoadAnalysisPage />} />
          <Route path="vehicles" element={<VehicleAnalysisPage />} />
          <Route path="hit-and-run" element={<HitAndRunPage />} />
          <Route path="explorer" element={<DataExplorerPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
