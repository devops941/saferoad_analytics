import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { api } from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';

// Helper component to programmatic fly to center
const MapViewController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && zoom) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
};

// Color coding mapping by road category
const CATEGORY_COLORS = {
  nh_nhai: '#dc2626',      // Crimson Red for NHAI National Highways
  nh_state_pwd: '#ea580c',  // Deep Orange for State PWD National Highways
  state_highway: '#d97706', // Amber for State Highways
  district_road: '#2563eb', // Royal Blue for Major District Roads
  village_road: '#059669',  // Emerald for Village Roads
  other_roads: '#64748b',   // Slate for Other Roads
};

const CATEGORY_WEIGHTS = {
  nh_nhai: 5,
  nh_state_pwd: 4.5,
  state_highway: 4,
  district_road: 3,
  village_road: 2.2,
  other_roads: 2,
};

const GISRoadMapPage = () => {
  const [roadGeoJSON, setRoadGeoJSON] = useState(null);
  const [boundaryGeoJSON, setBoundaryGeoJSON] = useState(null);
  const [gisOverview, setGisOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Layer Visibility Toggles
  const [visibleLayers, setVisibleLayers] = useState({
    boundary: true,
    nh_nhai: true,
    nh_state_pwd: true,
    state_highway: true,
    district_road: true,
    village_road: true,
    other_roads: true,
  });

  // Selected road corridor on map click
  const [selectedRoad, setSelectedRoad] = useState(null);

  // Map state
  const defaultCenter = [9.9252, 78.1198];
  const defaultZoom = 10;
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(defaultZoom);

  useEffect(() => {
    const fetchGISData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [roadsRes, boundaryRes, overviewRes] = await Promise.all([
          api.getGISRoadNetwork(),
          api.getGISDistrictBoundary(),
          api.getGISOverview(),
        ]);
        setRoadGeoJSON(roadsRes);
        setBoundaryGeoJSON(boundaryRes);
        setGisOverview(overviewRes);
      } catch (err) {
        console.error('Failed to load GIS road network data:', err);
        setError('Unable to load GIS road network layers and verified statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchGISData();
  }, []);

  // Filter features based on layer visibility toggles
  const filteredRoadFeatures = useMemo(() => {
    if (!roadGeoJSON) return [];
    return roadGeoJSON.features.filter((f) => {
      const catKey = f.properties.category_key;
      return visibleLayers[catKey] ?? true;
    });
  }, [roadGeoJSON, visibleLayers]);

  const toggleLayer = (layerKey) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  };

  const handleResetView = () => {
    setSelectedRoad(null);
    setMapCenter([...defaultCenter]);
    setMapZoom(defaultZoom);
  };

  if (loading) return <LoadingSpinner message="Rendering Madurai GIS road network and layers..." />;
  if (error) return <ErrorAlert message={error} onRetry={() => window.location.reload()} />;

  // Style function for road lines
  const getRoadStyle = (feature) => {
    const catKey = feature.properties.category_key || 'other_roads';
    const isSelected = selectedRoad && selectedRoad.id === feature.properties.id;
    return {
      color: isSelected ? '#10b981' : (CATEGORY_COLORS[catKey] || '#2563eb'),
      weight: isSelected ? (CATEGORY_WEIGHTS[catKey] || 3) + 3 : (CATEGORY_WEIGHTS[catKey] || 3),
      opacity: isSelected ? 1 : 0.9,
      dashArray: catKey === 'village_road' || catKey === 'other_roads' ? '6, 6' : undefined,
    };
  };

  // Boundary style
  const boundaryStyle = {
    color: '#4f46e5',
    weight: 2,
    dashArray: '5, 5',
    fillColor: '#6366f1',
    fillOpacity: 0.05,
  };

  // Road interaction onEachFeature
  const onEachRoad = (feature, layer) => {
    const props = feature.properties;
    layer.on({
      click: () => {
        setSelectedRoad(props);
      },
      mouseover: (e) => {
        const target = e.target;
        target.setStyle({
          weight: (CATEGORY_WEIGHTS[props.category_key] || 3) + 2,
          opacity: 1,
        });
      },
      mouseout: (e) => {
        const target = e.target;
        const isSelected = selectedRoad && selectedRoad.id === props.id;
        if (!isSelected) {
          target.setStyle(getRoadStyle(feature));
        }
      },
    });

    layer.bindTooltip(
      `<strong>${props.ref || props.name}</strong><br/>${props.category} (${props.length_in_district_km || ''} km)`,
      { sticky: true }
    );
  };

  return (
    <div className="d-flex flex-column gap-4 pb-3">
      {/* 1. Header & Context Banner */}
      <div className="executive-banner p-3 p-lg-3.5 d-flex justify-content-between align-items-center flex-wrap gap-3 animate-slide-up">
        <div className="d-flex align-items-center gap-3">
          <div className="icon-badge icon-badge-cyan" style={{ width: '46px', height: '46px', fontSize: '1.3rem' }}>
            <i className="bi bi-map-fill"></i>
          </div>
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h2 className="h6 fw-bold text-dark mb-0" style={{ letterSpacing: '-0.01em', fontSize: '1.05rem' }}>
                Madurai GIS Road Network Analytics & Corridor Geometry
              </h2>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-0.5" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                Phase 6 Verified GIS
              </span>
            </div>
            <p className="text-secondary small mb-0" style={{ fontSize: '0.82rem' }}>
              Spatial inspection of verified National Highways, State Highways, Major District Roads, and Rural connectors in Madurai District.
            </p>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-light text-secondary border px-2.5 py-1.5 shadow-sm" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
            <i className="bi bi-bezier2 text-primary me-1"></i> {gisOverview?.total_mapped_corridors} Corridors ({gisOverview?.total_mapped_corridors_km} km)
          </span>
          <button
            className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1.5 shadow-sm px-3 py-1.5 rounded-3 hover-lift fw-medium"
            onClick={handleResetView}
            style={{ fontSize: '0.82rem' }}
          >
            <i className="bi bi-arrow-counterclockwise"></i> Reset View
          </button>
        </div>
      </div>

      {/* 2. Strict Data Integrity Notice Callout */}
      <div className="alert alert-info border border-info-subtle d-flex align-items-start gap-3 p-3.5 rounded-3 mb-0 shadow-sm animate-slide-up delay-1">
        <div className="icon-badge icon-badge-blue mt-0.5" style={{ width: '36px', height: '36px', fontSize: '1.1rem' }}>
          <i className="bi bi-shield-check"></i>
        </div>
        <div>
          <strong className="text-dark d-block mb-1" style={{ fontSize: '0.88rem' }}>
            Data Integrity & Spatial Representation Statement:
          </strong>
          <span className="text-secondary small d-block" style={{ fontSize: '0.82rem', lineHeight: '1.5' }}>
            In strict compliance with <strong>DATA_AVAILABILITY_REPORT.md</strong>, mapped vector lines illustrate <strong>verified administrative road alignments</strong>.
            Individual crash coordinates (lat/long points) are <strong>NOT fabricated or placed at random locations</strong> because official published SCRB/MoRTH reports provide aggregate district totals. Mapped road geometry is strictly decoupled from individual accident occurrences.
          </span>
        </div>
      </div>

      {/* 3. Main GIS Layout (Map + Side Analytics Panel) */}
      <div className="row g-4 animate-slide-up delay-2">
        {/* Left: Interactive Map Container */}
        <div className="col-12 col-xl-8">
          <div className="card border-0 shadow-sm overflow-hidden h-100 d-flex flex-column" style={{ minHeight: '620px' }}>
            {/* Map Top Toolbar & Layer Toggles */}
            <div className="p-3 bg-white border-bottom d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="d-flex align-items-center flex-wrap gap-2">
                <span className="small text-secondary fw-bold text-uppercase me-1" style={{ fontSize: '0.72rem' }}>
                  <i className="bi bi-layers-fill me-1 text-primary"></i> Road Layers:
                </span>

                <button
                  className={`btn btn-sm px-2.5 py-1 rounded-pill d-inline-flex align-items-center gap-1.5 fw-semibold ${
                    visibleLayers.nh_nhai ? 'btn-danger' : 'btn-outline-secondary'
                  }`}
                  style={{ fontSize: '0.74rem' }}
                  onClick={() => toggleLayer('nh_nhai')}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dc2626', display: 'inline-block' }}></span>
                  NHAI NH
                </button>

                <button
                  className={`btn btn-sm px-2.5 py-1 rounded-pill d-inline-flex align-items-center gap-1.5 fw-semibold ${
                    visibleLayers.nh_state_pwd ? 'btn-warning text-dark' : 'btn-outline-secondary'
                  }`}
                  style={{ fontSize: '0.74rem' }}
                  onClick={() => toggleLayer('nh_state_pwd')}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ea580c', display: 'inline-block' }}></span>
                  State PWD NH
                </button>

                <button
                  className={`btn btn-sm px-2.5 py-1 rounded-pill d-inline-flex align-items-center gap-1.5 fw-semibold ${
                    visibleLayers.state_highway ? 'btn-warning' : 'btn-outline-secondary'
                  }`}
                  style={{ fontSize: '0.74rem', backgroundColor: visibleLayers.state_highway ? '#d97706' : undefined, color: visibleLayers.state_highway ? '#fff' : undefined }}
                  onClick={() => toggleLayer('state_highway')}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d97706', display: 'inline-block' }}></span>
                  State Highways (SH)
                </button>

                <button
                  className={`btn btn-sm px-2.5 py-1 rounded-pill d-inline-flex align-items-center gap-1.5 fw-semibold ${
                    visibleLayers.district_road ? 'btn-primary' : 'btn-outline-secondary'
                  }`}
                  style={{ fontSize: '0.74rem' }}
                  onClick={() => toggleLayer('district_road')}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb', display: 'inline-block' }}></span>
                  District Roads (MDR)
                </button>

                <button
                  className={`btn btn-sm px-2.5 py-1 rounded-pill d-inline-flex align-items-center gap-1.5 fw-semibold ${
                    visibleLayers.village_road ? 'btn-success' : 'btn-outline-secondary'
                  }`}
                  style={{ fontSize: '0.74rem' }}
                  onClick={() => toggleLayer('village_road')}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#059669', display: 'inline-block' }}></span>
                  Village Roads
                </button>

                <button
                  className={`btn btn-sm px-2.5 py-1 rounded-pill d-inline-flex align-items-center gap-1.5 fw-semibold ${
                    visibleLayers.boundary ? 'btn-dark' : 'btn-outline-secondary'
                  }`}
                  style={{ fontSize: '0.74rem' }}
                  onClick={() => toggleLayer('boundary')}
                >
                  <i className="bi bi-bounding-box"></i> Boundary
                </button>
              </div>

              <span className="badge bg-light text-secondary border small px-2 py-1">
                Click road to inspect
              </span>
            </div>

            {/* Map Container */}
            <div className="flex-grow-1 position-relative" style={{ height: '560px', width: '100%', zIndex: 1 }}>
              <MapContainer
                center={defaultCenter}
                zoom={defaultZoom}
                zoomControl={false}
                style={{ height: '100%', width: '100%' }}
              >
                <ZoomControl position="topright" />
                <MapViewController center={mapCenter} zoom={mapZoom} />

                {/* Base OpenStreetMap Tile Layer */}
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  maxZoom={18}
                />

                {/* Madurai District Boundary Polygon Layer */}
                {visibleLayers.boundary && boundaryGeoJSON && (
                  <GeoJSON
                    key="madurai-boundary-layer"
                    data={boundaryGeoJSON}
                    style={boundaryStyle}
                  />
                )}

                {/* Classified Road Network Layers */}
                {filteredRoadFeatures.length > 0 && (
                  <GeoJSON
                    key={`roads-${filteredRoadFeatures.length}-${selectedRoad?.id || 'none'}`}
                    data={{
                      type: 'FeatureCollection',
                      features: filteredRoadFeatures,
                    }}
                    style={getRoadStyle}
                    onEachFeature={onEachRoad}
                  />
                )}
              </MapContainer>
            </div>

            {/* Map Bottom Legend Footer */}
            <div className="p-2.5 bg-light border-top d-flex align-items-center justify-content-between flex-wrap gap-2 small text-secondary" style={{ fontSize: '0.75rem' }}>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <span className="d-inline-flex align-items-center gap-1">
                  <span style={{ width: '14px', height: '4px', backgroundColor: '#dc2626', display: 'inline-block', borderRadius: '2px' }}></span>
                  NHAI NH
                </span>
                <span className="d-inline-flex align-items-center gap-1">
                  <span style={{ width: '14px', height: '4px', backgroundColor: '#ea580c', display: 'inline-block', borderRadius: '2px' }}></span>
                  State PWD NH
                </span>
                <span className="d-inline-flex align-items-center gap-1">
                  <span style={{ width: '14px', height: '4px', backgroundColor: '#d97706', display: 'inline-block', borderRadius: '2px' }}></span>
                  State Highway (SH)
                </span>
                <span className="d-inline-flex align-items-center gap-1">
                  <span style={{ width: '14px', height: '3px', backgroundColor: '#2563eb', display: 'inline-block', borderRadius: '2px' }}></span>
                  District Road (MDR)
                </span>
                <span className="d-inline-flex align-items-center gap-1">
                  <span style={{ width: '14px', height: '2px', backgroundColor: '#059669', display: 'inline-block', borderTop: '2px dashed #059669' }}></span>
                  Village Road
                </span>
              </div>
              <span className="text-muted">
                <i className="bi bi-geo-alt me-1"></i> Madurai District: 9.9252° N, 78.1198° E
              </span>
            </div>
          </div>
        </div>

        {/* Right: Side Analytics & Corridor Inspector Panel */}
        <div className="col-12 col-xl-4 d-flex flex-column gap-3">
          {/* Selected Corridor Inspector */}
          {selectedRoad ? (
            <div className="card border-0 shadow-sm border-start border-5 border-success p-3.5 bg-white hover-lift">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-0.5" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                  Selected Corridor
                </span>
                <button className="btn btn-sm btn-link text-muted p-0" onClick={() => setSelectedRoad(null)}>
                  <i className="bi bi-x-circle fs-5"></i>
                </button>
              </div>

              <h4 className="h6 fw-bold text-dark mb-1" style={{ fontSize: '0.98rem' }}>
                {selectedRoad.ref ? `${selectedRoad.ref}: ` : ''}{selectedRoad.name}
              </h4>
              <span className="badge rounded-pill bg-light text-secondary border mb-2 d-inline-block" style={{ fontSize: '0.72rem' }}>
                {selectedRoad.category}
              </span>

              <p className="text-secondary small mb-3" style={{ fontSize: '0.8rem', lineHeight: '1.45' }}>
                {selectedRoad.description}
              </p>

              <div className="row g-2 pt-2 border-top">
                <div className="col-6">
                  <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>Mapped Length</span>
                  <span className="fw-bold text-dark small">{selectedRoad.length_in_district_km} km</span>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>Design Speed</span>
                  <span className="fw-bold text-dark small">{selectedRoad.speed_limit_kmh} km/h</span>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>Configuration</span>
                  <span className="fw-bold text-dark small">{selectedRoad.lanes}</span>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>Jurisdiction</span>
                  <span className="fw-bold text-dark small" style={{ fontSize: '0.75rem' }}>{selectedRoad.jurisdiction}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm p-3.5 bg-white text-center">
              <div className="icon-badge icon-badge-cyan mx-auto mb-2" style={{ width: '38px', height: '38px', fontSize: '1.1rem' }}>
                <i className="bi bi-cursor-fill"></i>
              </div>
              <h5 className="h6 fw-bold text-dark mb-1">Interactive Corridor Inspector</h5>
              <p className="text-secondary small mb-0" style={{ fontSize: '0.8rem' }}>
                Click any colored road segment on the map to inspect its corridor alignment, jurisdiction, and official classification.
              </p>
            </div>
          )}

          {/* District Road Category Statistics Table */}
          <div className="card border-0 shadow-sm bg-white overflow-hidden">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <div>
                <h4 className="h6 fw-bold mb-0 text-dark">Road Category Casualty Statistics</h4>
                <span className="small text-secondary" style={{ fontSize: '0.74rem' }}>
                  Period: {gisOverview?.reporting_period}
                </span>
              </div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2 py-0.5" style={{ fontSize: '0.7rem' }}>
                SCRB Verified
              </span>
            </div>

            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 custom-table">
                  <thead>
                    <tr>
                      <th>Road Category</th>
                      <th>Crashes</th>
                      <th>Deaths</th>
                      <th>Lethality</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gisOverview?.road_statistics?.map((item) => {
                      const isHighRisk = item.key === gisOverview?.highest_risk_road?.key;
                      return (
                        <tr key={item.key} className={isHighRisk ? 'table-warning' : ''}>
                          <td>
                            <div className="d-flex align-items-center gap-1.5">
                              <span
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  backgroundColor: CATEGORY_COLORS[item.key] || '#64748b',
                                  display: 'inline-block',
                                }}
                              ></span>
                              <span className="fw-semibold text-dark" style={{ fontSize: '0.8rem' }}>
                                {item.label}
                              </span>
                            </div>
                            {isHighRisk && (
                              <span className="badge bg-danger text-white mt-0.5" style={{ fontSize: '0.62rem' }}>
                                Highest Fatalities
                              </span>
                            )}
                          </td>
                          <td className="fw-bold text-dark">{item.accidents}</td>
                          <td className="fw-bold text-danger">{item.fatalities}</td>
                          <td>
                            <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill px-2 py-0.5" style={{ fontSize: '0.7rem', fontWeight: 600 }}>
                              {item.lethality_rate}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-3 bg-light border-top">
              <div className="d-flex justify-content-between align-items-center small text-secondary">
                <span>Total Mapped Network:</span>
                <strong className="text-dark">{gisOverview?.total_mapped_corridors_km} km</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center small text-secondary mt-1">
                <span>District Total Crashes (Q1):</span>
                <strong className="text-dark">649 accidents</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center small text-secondary mt-1">
                <span>District Total Fatalities (Q1):</span>
                <strong className="text-danger">198 deaths</strong>
              </div>
            </div>
          </div>

          {/* Highest Lethality Callout Card */}
          {gisOverview?.highest_risk_road && (
            <div className="card border-0 shadow-sm border-start border-4 border-danger p-3 bg-white">
              <span className="text-muted small text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>
                Corridor Risk Priority
              </span>
              <h5 className="h6 fw-bold text-danger mb-1 mt-0.5">
                {gisOverview.highest_risk_road.label}
              </h5>
              <p className="text-secondary small mb-0" style={{ fontSize: '0.78rem', lineHeight: '1.45' }}>
                Accounts for <b>{gisOverview.highest_risk_road.fatalities} of 198 district deaths ({gisOverview.highest_risk_road.fatalities_share}%)</b> with a lethality rate of <b>{gisOverview.highest_risk_road.lethality_rate}%</b>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GISRoadMapPage;
