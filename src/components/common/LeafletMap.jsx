import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, ZoomIn, ZoomOut, RotateCcw, Shield, AlertTriangle, CheckCircle2, Eye, Compass } from 'lucide-react';

// Fix Leaflet default icon paths in Vite/Webpack bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Tile layer providers
const TILE_LAYERS = {
  osm: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
    maxZoom: 19
  },
  dark: {
    name: 'Dark Canvas',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18
  }
};

// Sub-component to handle map camera movements and programmatic zoom
function MapController({ selectedWardCoord, resetTrigger, defaultCenter, defaultZoom }) {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        map.invalidateSize();
      } catch (e) {}
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (selectedWardCoord && selectedWardCoord.lat && selectedWardCoord.lng) {
      map.flyTo([selectedWardCoord.lat, selectedWardCoord.lng], 13, {
        duration: 0.8,
        easeLinearity: 0.25
      });
    }
  }, [selectedWardCoord, map]);

  useEffect(() => {
    if (resetTrigger > 0) {
      map.flyTo(defaultCenter, defaultZoom, { duration: 0.8 });
    }
  }, [resetTrigger, defaultCenter, defaultZoom, map]);

  return null;
}

// Custom Leaflet DivIcon creator for modern pulsing ward markers
const createWardIcon = (ward, isSelected) => {
  const isCritical = ward.critical > 0;
  const isHighActive = ward.active > 10;
  const color = isCritical ? '#EF4444' : isHighActive ? '#F59E0B' : '#10B981';
  const pulseClass = isCritical ? 'pulse-critical' : isHighActive ? 'pulse-warning' : 'pulse-normal';
  const badgeSize = isSelected ? 34 : 28;

  const html = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      transform: translate(-50%, -50%);
      cursor: pointer;
    ">
      <div style="
        position: relative;
        width: ${badgeSize}px;
        height: ${badgeSize}px;
        border-radius: 50%;
        background: ${color};
        border: 2.5px solid #FFFFFF;
        box-shadow: 0 0 ${isSelected ? '22px' : '12px'} ${color}99, 0 4px 10px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFFFFF;
        font-family: inherit;
        font-weight: 800;
        font-size: ${isSelected ? '12px' : '11px'};
        transition: transform 150ms ease;
      ">
        ${ward.active}
      </div>
      <div style="
        margin-top: 4px;
        padding: 2px 8px;
        background: rgba(11, 25, 20, 0.92);
        color: ${isSelected ? '#34D399' : '#FFFFFF'};
        border: 1px solid ${isSelected ? '#10B981' : 'rgba(255,255,255,0.2)'};
        border-radius: 999px;
        font-size: 10px;
        font-weight: 700;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        pointer-events: none;
      ">
        ${ward.ward.split(' (')[0]}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-ward-leaflet-icon',
    iconSize: [0, 0]
  });
};

export const WAGHOLI_PUNE_WARDS = [
  {
    id: 'wagholi-28',
    ward: 'Wagholi Ward 28 (Baif Road Market)',
    lat: 18.5815,
    lng: 73.9840,
    active: 18,
    resolved: 42,
    critical: 1,
    issue: 'Garbage Dumping & Trash Overflow at Baif Road Market'
  },
  {
    id: 'wagholi-29',
    ward: 'Wagholi Ward 29 (Ivy Estate & Kesnand Rd)',
    lat: 18.5760,
    lng: 73.9810,
    active: 24,
    resolved: 38,
    critical: 1,
    issue: 'Water Pipeline Ruptures & Tanker Dependency'
  },
  {
    id: 'wagholi-27',
    ward: 'Wagholi Ward 27 (Nagar Road Corridor)',
    lat: 18.5780,
    lng: 73.9790,
    active: 14,
    resolved: 51,
    critical: 0,
    issue: 'Deep Asphalt Potholes on Nagar Road Highway'
  },
  {
    id: 'wagholi-30',
    ward: 'Wagholi Ward 30 (Ubale Nagar)',
    lat: 18.5830,
    lng: 73.9860,
    active: 9,
    resolved: 29,
    critical: 0,
    issue: 'Stormwater Drain Overflow & Sewage Waterlogging'
  }
];

export default function LeafletMap({
  wards = [],
  selectedWard = '',
  onSelectWard = () => {},
  height = '520px',
  initialLayer = 'dark', // 'osm' | 'dark' | 'satellite'
  defaultRegion = 'wagholi' // 'wagholi'
}) {
  const [activeLayer, setActiveLayer] = useState(initialLayer);
  const [resetCount, setResetCount] = useState(0);
  const [region, setRegion] = useState(defaultRegion);

  // Region center coordinates
  const regionCenters = {
    wagholi: { center: [18.5793, 73.9820], zoom: 13.5, name: 'Wagholi, Pune' }
  };

  const currentRegionConfig = regionCenters[region] || regionCenters.wagholi;
  const defaultCenter = currentRegionConfig.center;
  const defaultZoom = currentRegionConfig.zoom;

  const displayWards = useMemo(() => {
    if (wards && wards.length > 0) return wards;
    return region === 'wagholi' ? WAGHOLI_PUNE_WARDS : [];
  }, [wards, region]);

  // Find coordinates of currently selected ward
  const selectedWardCoord = useMemo(() => {
    if (!selectedWard) return null;
    const ward = displayWards.find(w => selectedWard.includes(w.ward.split(' ')[1]) || selectedWard === w.ward);
    return ward && ward.lat && ward.lng ? { lat: ward.lat, lng: ward.lng } : null;
  }, [selectedWard, displayWards]);

  const currentTile = TILE_LAYERS[activeLayer] || TILE_LAYERS.dark;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: height,
      borderRadius: 'var(--radius-md, 12px)',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.12)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.18)'
    }}>
      {/* Real Interactive Leaflet Slippy Map */}
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        minZoom={9}
        maxZoom={18}
        zoomControl={false}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', background: '#0F172A' }}
      >
        <TileLayer
          key={activeLayer}
          url={currentTile.url}
          attribution={currentTile.attribution}
          maxZoom={currentTile.maxZoom}
        />

        <MapController
          selectedWardCoord={selectedWardCoord}
          resetTrigger={resetCount}
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
        />

        {/* Real Wards Geo Markers and Coverage Radii */}
        {displayWards.map((w) => {
          if (!w.lat || !w.lng) return null;

          const isSelected = selectedWard && (selectedWard.includes(w.ward.split(' ')[1]) || selectedWard === w.ward);
          const isCritical = w.critical > 0;
          const color = isCritical ? '#EF4444' : w.active > 10 ? '#F59E0B' : '#10B981';
          const icon = createWardIcon(w, isSelected);

          return (
            <React.Fragment key={w.ward}>
              {/* Coverage radius circle */}
              <Circle
                center={[w.lat, w.lng]}
                radius={isSelected ? 1100 : 850}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: isSelected ? 0.28 : 0.16,
                  weight: isSelected ? 2.5 : 1.5,
                  dashArray: isSelected ? '4, 4' : undefined
                }}
                eventHandlers={{
                  click: () => onSelectWard(w.ward)
                }}
              />

              {/* Interactive Ward Marker */}
              <Marker
                position={[w.lat, w.lng]}
                icon={icon}
                eventHandlers={{
                  click: () => onSelectWard(w.ward)
                }}
              >
                <Popup className="custom-leaflet-popup" autoPan={false}>
                  <div style={{
                    minWidth: '180px',
                    padding: '4px',
                    fontFamily: 'inherit',
                    color: '#0F172A'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid #E2E8F0',
                      paddingBottom: '6px',
                      marginBottom: '8px'
                    }}>
                      <span style={{ fontWeight: 800, fontSize: '13px' }}>{w.ward}</span>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '999px',
                        background: isCritical ? '#FEE2E2' : '#FEF3C7',
                        color: isCritical ? '#DC2626' : '#D97706'
                      }}>
                        {w.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748B' }}>Primary Domain:</span>
                        <strong style={{ color: '#0F172A' }}>{w.category}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748B' }}>Active Cases:</span>
                        <strong style={{ color: '#DC2626' }}>{w.active}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748B' }}>Resolved:</span>
                        <strong style={{ color: '#16A34A' }}>{w.resolved}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748B' }}>7-Day Trend:</span>
                        <strong style={{ color: w.trend.includes('+') ? '#DC2626' : '#16A34A' }}>{w.trend}</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectWard(w.ward)}
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        background: '#0B1914',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Eye style={{ width: '12px', height: '12px', color: '#10B981' }} />
                      Focus Ward in Command Center
                    </button>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Layer Switcher (Top Left) */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '999px',
        padding: '3px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        gap: '2px'
      }}>
        {Object.keys(TILE_LAYERS).map(layerKey => {
          const isSelected = activeLayer === layerKey;
          return (
            <button
              key={layerKey}
              type="button"
              onClick={() => setActiveLayer(layerKey)}
              style={{
                padding: '5px 11px',
                borderRadius: '999px',
                border: 'none',
                background: isSelected ? 'var(--color-primary, #10B981)' : 'transparent',
                color: isSelected ? '#FFFFFF' : '#CBD5E1',
                fontSize: '11px',
                fontWeight: isSelected ? 800 : 600,
                cursor: 'pointer',
                transition: 'all 150ms ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {layerKey === 'osm' && 'OSM Map'}
              {layerKey === 'dark' && 'Dark GIS'}
              {layerKey === 'satellite' && 'Satellite'}
            </button>
          );
        })}
      </div>

      {/* Top Right Zoom and Reset Controls */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <button
          type="button"
          onClick={() => setResetCount(prev => prev + 1)}
          title="Reset to Wagholi View"
          aria-label="Reset to Wagholi view"
          style={{
            minWidth: '36px',
            minHeight: '36px',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.35)'
          }}
        >
          <RotateCcw style={{ width: '15px', height: '15px' }} />
        </button>
      </div>

      {/* Real Map Verification Pill (Bottom Right) */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(6px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        padding: '4px 10px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '10px',
        fontWeight: 700,
        color: '#E2E8F0',
        pointerEvents: 'none'
      }}>
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
        <span>LIVE LEAFLET / OSM • WAGHOLI PUNE GIS</span>
      </div>
    </div>
  );
}
