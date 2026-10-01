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
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
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

export const WAGHOLI_SPREAD_POINTS = [
  {
    step: 'Day 1 (Oct 1)',
    ward: 'Wagholi Ward 28 (Baif Road Market)',
    lat: 18.5815,
    lng: 73.9840,
    radiusMeters: 180,
    signalCount: 4,
    label: 'Open dump yard accumulation at Baif Road market junction',
    color: '#EF4444'
  },
  {
    step: 'Day 3 (Oct 3)',
    ward: 'Wagholi Ward 29 (Ivy Estate & Kesnand Rd)',
    lat: 18.5760,
    lng: 73.9810,
    radiusMeters: 450,
    signalCount: 18,
    label: 'Feeder pipe rupture under Kesnand Road; water pressure collapse',
    color: '#F59E0B'
  },
  {
    step: 'Day 5 (Oct 5)',
    ward: 'Wagholi Ward 27 (Nagar Road Corridor)',
    lat: 18.5780,
    lng: 73.9790,
    radiusMeters: 850,
    signalCount: 32,
    label: 'Highway asphalt cratering & waterlogging near Lexicon School',
    color: '#10B981'
  }
];

export default function LeafletSpreadMap({
  dataPoints = [],
  selectedDay = 0,
  activeLayer = 'spread',
  mapMode = 'dark',
  height = '420px',
  region = 'wagholi'
}) {
  const points = dataPoints && dataPoints.length > 0 ? dataPoints : WAGHOLI_SPREAD_POINTS;
  const currentPoint = points[selectedDay] || points[0];
  const centerCoord = currentPoint ? [currentPoint.lat, currentPoint.lng] : [18.5793, 73.9820];

  // Pipeline path coordinates along Wagholi Kesnand Road & Raisoni Chowk corridor
  const pipelinePath = [
    [18.5793, 73.9785],
    [18.5760, 73.9810],
    [18.5740, 73.9920]
  ];

  // Derived citizen signal GPS locations distributed along the Wagholi corridor
  const signalCoords = [
    { id: 'SIG-1', pos: [18.5790, 73.9780], title: 'Low pressure & chlorine smell', time: 'Day 1' },
    { id: 'SIG-2', pos: [18.5795, 73.9788], title: 'Valve pit seeping water', time: 'Day 1' },
    { id: 'SIG-3', pos: [18.5780, 73.9795], title: 'Road dampness on Nagar Road Highway', time: 'Day 2' },
    { id: 'SIG-4', pos: [18.5765, 73.9815], title: 'Turbid tap water in Ivy Estate', time: 'Day 3' },
    { id: 'SIG-5', pos: [18.5755, 73.9830], title: 'Drain backflow near community center', time: 'Day 3' },
    { id: 'SIG-6', pos: [18.5748, 73.9860], title: 'Water puddle on Kesnand road', time: 'Day 4' },
    { id: 'SIG-7', pos: [18.5742, 73.9900], title: 'Contaminated supply in school zone', time: 'Day 5' },
    { id: 'SIG-8', pos: [18.5738, 73.9930], title: 'Road cavity near Wagheshwar chowk', time: 'Day 5' }
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
        {points.map((pt, idx) => {
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
