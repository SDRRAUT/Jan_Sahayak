import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Radio, AlertTriangle, Layers, RotateCcw } from 'lucide-react';

// Tile providers
const SPREAD_TILES = {
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS'
  }
};

// Sub-component to control map camera when selectedDay or data changes
function SpreadMapController({ center, zoom, resetTrigger }) {
  const map = useMap();

  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || 15, { duration: 0.8 });
    }
  }, [center, zoom, map]);

  useEffect(() => {
    if (resetTrigger > 0 && center) {
      map.flyTo(center, 15, { duration: 0.6 });
    }
  }, [resetTrigger, center, map]);

  return null;
}

// Custom DivIcon for contamination epicenters
const createEpicenterIcon = (point, isCurrent) => {
  const size = isCurrent ? 36 : 28;
  const html = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      transform: translate(-50%, -50%);
    ">
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${point.color};
        border: 2.5px solid #FFFFFF;
        box-shadow: 0 0 ${isCurrent ? '22px' : '10px'} ${point.color}, 0 4px 10px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFFFFF;
        font-weight: 800;
        font-size: 11px;
      ">
        ${point.signalCount}
      </div>
      <div style="
        margin-top: 3px;
        padding: 2px 6px;
        background: rgba(11, 21, 32, 0.92);
        color: #FFFFFF;
        border: 1px solid rgba(255,255,255,0.25);
        border-radius: 4px;
        font-size: 9.5px;
        font-weight: 700;
        white-space: nowrap;
        pointer-events: none;
      ">
        ${point.step.split(' ')[0]}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-epicenter-icon',
    iconSize: [0, 0]
  });
};

// Custom DivIcon for citizen report signal pins
const createSignalIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #38BDF8;
        border: 2px solid #FFFFFF;
        box-shadow: 0 0 8px #38BDF8, 0 2px 6px rgba(0,0,0,0.4);
        transform: translate(-50%, -50%);
      "></div>
    `,
    className: 'custom-signal-icon',
    iconSize: [0, 0]
  });
};

export default function LeafletSpreadMap({
  dataPoints = [],
  selectedDay = 0,
  activeLayer = 'spread',
  mapMode = 'dark',
  height = '420px'
}) {
  const currentPoint = dataPoints[selectedDay] || dataPoints[0];
  const centerCoord = currentPoint ? [currentPoint.lat, currentPoint.lng] : [28.7175, 77.1248];

  // Pipeline path coordinates along Rohini Sec 14 & Pitampura corridor
  const pipelinePath = [
    [28.7160, 77.1230],
    [28.7175, 77.1248],
    [28.7190, 77.1270]
  ];

  // Derived citizen signal GPS locations distributed along the corridor
  const signalCoords = [
    { id: 'SIG-1', pos: [28.7158, 77.1228], title: 'Low pressure & chlorine smell', time: 'Day 1' },
    { id: 'SIG-2', pos: [28.7163, 77.1234], title: 'Valve pit seeping water', time: 'Day 1' },
    { id: 'SIG-3', pos: [28.7169, 77.1240], title: 'Road dampness on Katju Marg', time: 'Day 2' },
    { id: 'SIG-4', pos: [28.7176, 77.1249], title: 'Turbid tap water in Pocket 1', time: 'Day 3' },
    { id: 'SIG-5', pos: [28.7180, 77.1256], title: 'Drain backflow near community center', time: 'Day 3' },
    { id: 'SIG-6', pos: [28.7185, 77.1262], title: 'Water puddle on arterial road', time: 'Day 4' },
    { id: 'SIG-7', pos: [28.7189, 77.1268], title: 'Contaminated supply in school zone', time: 'Day 5' },
    { id: 'SIG-8', pos: [28.7194, 77.1275], title: 'Road cavity under bus corridor', time: 'Day 5' }
  ];

  const tile = SPREAD_TILES[mapMode] || SPREAD_TILES.dark;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: height,
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1.5px solid #1E293B',
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
    }}>
      <MapContainer
        center={centerCoord}
        zoom={15}
        minZoom={12}
        maxZoom={18}
        zoomControl={false}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', background: '#0B1520' }}
      >
        <TileLayer
          key={mapMode}
          url={tile.url}
          attribution={tile.attribution}
          maxZoom={19}
        />

        <SpreadMapController
          center={centerCoord}
          zoom={15}
          resetTrigger={selectedDay}
        />

        {/* Real Geodetic Pipeline Trace */}
        <Polyline
          positions={pipelinePath}
          pathOptions={{
            color: '#38BDF8',
            weight: 4,
            dashArray: '8, 6',
            opacity: 0.9
          }}
        />

        {/* Real Metric Radius Contamination Spread Zone */}
        {currentPoint && (
          <Circle
            center={[currentPoint.lat, currentPoint.lng]}
            radius={currentPoint.radiusMeters}
            pathOptions={{
              color: currentPoint.color,
              fillColor: currentPoint.color,
              fillOpacity: 0.22,
              weight: 2
            }}
          />
        )}

        {/* Epicenter Data Points */}
        {dataPoints.map((pt, idx) => {
          const isCurrent = idx === selectedDay;
          return (
            <Marker
              key={pt.step}
              position={[pt.lat, pt.lng]}
              icon={createEpicenterIcon(pt, isCurrent)}
            >
              <Popup autoPan={false}>
                <div style={{ minWidth: '190px', padding: '2px', color: '#0F172A' }}>
                  <div style={{ fontWeight: 800, fontSize: '13px', color: pt.color, marginBottom: '4px' }}>
                    {pt.step}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '11px', marginBottom: '4px' }}>
                    {pt.ward}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#475569', marginBottom: '6px' }}>
                    {pt.label}
                  </div>
                  <div style={{ fontSize: '10px', background: '#F1F5F9', padding: '4px 6px', borderRadius: '4px' }}>
                    <strong>Geographic Radius:</strong> {pt.radiusMeters}m | <strong>Signals:</strong> {pt.signalCount}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Individual Citizen Report Signals */}
        {activeLayer === 'signals' && signalCoords.map(sig => (
          <Marker
            key={sig.id}
            position={sig.pos}
            icon={createSignalIcon()}
          >
            <Popup autoPan={false}>
              <div style={{ padding: '2px', color: '#0F172A', fontSize: '11px' }}>
                <span style={{ fontWeight: 800, color: '#0284C7' }}>{sig.id} ({sig.time})</span>
                <div style={{ marginTop: '2px', color: '#334155' }}>{sig.title}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating Indicator */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        borderRadius: '999px',
        padding: '4px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '11px',
        fontWeight: 700,
        color: '#FFFFFF'
      }}>
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: currentPoint?.color || '#10B981' }} />
        <span>Corridor Radius: {currentPoint?.radiusMeters}m ({currentPoint?.step})</span>
      </div>
    </div>
  );
}
