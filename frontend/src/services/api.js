import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Centralized API Services
export const api = {
  // 1. Dashboard
  getDashboardSummary: async () => {
    const res = await apiClient.get('/dashboard/summary');
    return res.data;
  },

  getDashboardKPIs: async () => {
    const res = await apiClient.get('/dashboard/kpis');
    return res.data;
  },

  // 2. Trends
  getYearWiseTrends: async () => {
    const res = await apiClient.get('/trends/year-wise');
    return res.data;
  },

  getDistrictsComparison: async (year = 2024) => {
    const res = await apiClient.get('/trends/districts-comparison', {
      params: { year },
    });
    return res.data;
  },

  // 3. Severity
  getSeverityBreakdown: async (period = '2024') => {
    const res = await apiClient.get('/severity/breakdown', {
      params: { period },
    });
    return res.data;
  },

  getCasualtyImpact: async () => {
    const res = await apiClient.get('/severity/casualty-impact');
    return res.data;
  },

  // 4. Roads
  getRoadDistribution: async () => {
    const res = await apiClient.get('/roads/distribution');
    return res.data;
  },

  getRoadLethality: async () => {
    const res = await apiClient.get('/roads/lethality');
    return res.data;
  },

  // 5. Vehicles
  getVehicleDistribution: async () => {
    const res = await apiClient.get('/vehicles/distribution');
    return res.data;
  },

  getVehicleVulnerability: async () => {
    const res = await apiClient.get('/vehicles/vulnerability');
    return res.data;
  },

  // 6. Hit and Run
  getHitAndRunComparison: async () => {
    const res = await apiClient.get('/hit-and-run/comparison');
    return res.data;
  },

  // 7. Explorer & Inventory
  getExplorerData: async (params = {}) => {
    const res = await apiClient.get('/reports/explorer', { params });
    return res.data;
  },

  getDatasetInventory: async () => {
    const res = await apiClient.get('/datasets/inventory');
    return res.data;
  },

  // 8. PDF Report Download
  downloadPDFReport: async () => {
    const res = await apiClient.get('/reports/pdf', {
      responseType: 'blob',
    });
    return res.data;
  },

  // 9. Citizen Safety Advisories
  getSafetyTips: async () => {
    const res = await apiClient.get('/safety-tips/');
    return res.data;
  },

  // 10. GIS Road Network Analytics
  getGISRoadNetwork: async () => {
    const res = await apiClient.get('/gis/road-network');
    return res.data;
  },

  getGISDistrictBoundary: async () => {
    const res = await apiClient.get('/gis/district-boundary');
    return res.data;
  },

  getGISOverview: async () => {
    const res = await apiClient.get('/gis/overview');
    return res.data;
  },

  // 11. Data Ingestion & Upload
  getUploadSchemas: async () => {
    const res = await apiClient.get('/upload/schemas');
    return res.data;
  },

  uploadDatasetFile: async (formData) => {
    // Native fetch guarantees browser auto-generates exact multipart boundary
    const response = await fetch(`${API_BASE_URL}/upload/file`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      let errorMsg = 'Dataset upload failed.';
      if (typeof data.detail === 'string') {
        errorMsg = data.detail;
      } else if (Array.isArray(data.detail)) {
        errorMsg = data.detail.map((d) => d.msg || JSON.stringify(d)).join(', ');
      } else if (data.message) {
        errorMsg = data.message;
      }
      throw new Error(errorMsg);
    }
    return data;
  },

  validateDatasetFile: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/upload/validate`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      let errorMsg = 'Validation request failed.';
      if (typeof data.detail === 'string') {
        errorMsg = data.detail;
      } else if (Array.isArray(data.detail)) {
        errorMsg = data.detail.map((d) => d.msg || JSON.stringify(d)).join(', ');
      } else if (data.message) {
        errorMsg = data.message;
      }
      throw new Error(errorMsg);
    }
    return data;
  },

  restoreDefaultDatasets: async () => {
    const res = await apiClient.post('/upload/restore-defaults');
    return res.data;
  },
};

export default api;
