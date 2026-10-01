import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Radio, AlertTriangle, Layers, RotateCcw, MapPin, Flame, ShieldAlert, Sparkles, Building2 } from 'lucide-react';

// Tile providers (Esri Satellite & Esri/OSM Street maps)
const SPREAD_TILES = {
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  dark: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
  },
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Wagholi, Pune'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS'
  }
};

// Sub-component to smoothly pan map camera ONLY when user switches day or clicks a hotspot
function SpreadMapController({ targetLat, targetLng, zoom = 15, triggerKey }) {
  const map = useMap();
  const lastKeyRef = React.useRef(triggerKey);
  const isMountedRef = React.useRef(false);

  // Invalidate map size once after layout settles to guarantee clear, non-jittery tiles
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        map.invalidateSize();
      } catch (e) {
        // ignore
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    // Skip animation on initial mount so map starts completely static and calm
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      lastKeyRef.current = triggerKey;
      return;
    }

    if (!targetLat || !targetLng) return;
    if (lastKeyRef.current === triggerKey) return;
    lastKeyRef.current = triggerKey;

    const currentCenter = map.getCenter();
    const dist = Math.hypot(currentCenter.lat - targetLat, currentCenter.lng - targetLng);

    // Only pan if distance is non-trivial (avoids microscopic jitter)
    if (dist > 0.0003) {
      map.panTo([targetLat, targetLng], { animate: true, duration: 0.5 });
    }
  }, [targetLat, targetLng, zoom, triggerKey, map]);

  return null;
}

// Custom DivIcon for contamination epicenters (Day 1, 3, 5 progression)
const createEpicenterIcon = (point, isCurrent) => {
  const size = isCurrent ? 36 : 28;
  const html = `
    <div style="
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: ${size}px;
    ">
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${point.color};
        border: 2.5px solid #FFFFFF;
        box-shadow: 0 0 ${isCurrent ? '18px' : '8px'} ${point.color}, 0 4px 10px rgba(0,0,0,0.5);
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
        padding: 2px 7px;
        background: rgba(11, 21, 32, 0.95);
        color: #FFFFFF;
        border: 1px solid rgba(255,255,255,0.3);
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
    iconSize: [size, size + 22],
    iconAnchor: [size / 2, size / 2]
  });
};

// Custom DivIcon for citizen report signal pins
const createSignalIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #38BDF8;
        border: 2px solid #FFFFFF;
        box-shadow: 0 0 8px #38BDF8, 0 2px 6px rgba(0,0,0,0.4);
      "></div>
    `,
    className: 'custom-signal-icon',
    iconSize: [10, 10],
    iconAnchor: [5, 5]
  });
};

// Custom DivIcon for AI Problem Hotspots
const createHotspotIcon = (hotspot, isSelected) => {
  const size = isSelected ? 38 : 30;
  const html = `
    <div style="
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 140px;
      margin-left: -70px;
      cursor: pointer;
    ">
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${hotspot.color};
        border: 2.5px solid #FFFFFF;
        box-shadow: 0 0 14px ${hotspot.color}, 0 4px 12px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${isSelected ? '15px' : '12px'};
        z-index: 2;
      ">
        ${hotspot.icon || '🔥'}
      </div>
      <div style="
        margin-top: 3px;
        padding: 2px 8px;
        background: rgba(15, 23, 42, 0.94);
        color: #FFFFFF;
        border: 1px solid rgba(255,255,255,0.25);
        border-radius: 999px;
        font-size: 9.5px;
        font-weight: 800;
        white-space: nowrap;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        z-index: 2;
      ">
        ${hotspot.name}
      </div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-hotspot-icon',
    iconSize: [0, 0],
    iconAnchor: [0, size / 2]
  });
};

// REAL WAGHOLI, PUNE AI CLUSTER HOTSPOTS
export const WAGHOLI_AI_HOTSPOTS = [
  {
    id: 'HOTSPOT-WAG-01',
    name: 'Ivy Estate Pipeline Rupture',
    category: 'Water Supply & Contamination',
    ward: 'Wagholi Ward 29 (Ivy Estate & Kesnand Rd)',
    lat: 18.5760,
    lng: 73.9810,
    radiusMeters: 450,
    activeComplaints: 37,
    severity: 'CRITICAL',
    color: '#EF4444',
    icon: '💧',
    dept: 'PMC Water Supply Department',
    action: 'Feeder isolation & 200mm HDPE coupling underway',
    slaRisk: 'High (12h overdue)'
  },
  {
    id: 'HOTSPOT-WAG-02',
    name: 'Baif Road SWM Overflow',
    category: 'Sanitation & Solid Waste',
    ward: 'Wagholi Ward 28 (Baif Road Market)',
    lat: 18.5815,
    lng: 73.9840,
    radiusMeters: 320,
    activeComplaints: 22,
    severity: 'EMERGING',
    color: '#F59E0B',
    icon: '🗑️',
    dept: 'PMC Solid Waste Management',
    action: 'Compactor deployment & stormwater culvert clearing',
    slaRisk: 'Medium (Within 24h SLA)'
  },
  {
    id: 'HOTSPOT-WAG-03',
    name: 'Raisoni Chowk 11kV Arcing',
    category: 'Electricity & Power Grid',
    ward: 'Wagholi Ward 27 (Nagar Road & Raisoni)',
    lat: 18.5802,
    lng: 73.9785,
    radiusMeters: 220,
    activeComplaints: 11,
    severity: 'HIGH_ALERT',
    color: '#8B5CF6',
    icon: '⚡',
    dept: 'MSEDCL Wagholi Sub-Division',
    action: 'Transformer load rebalancing & bushing replacement',
    slaRisk: 'Critical (Fire Hazard)'
  },
  {
    id: 'HOTSPOT-WAG-04',
    name: 'Lexicon School Highway Potholes',
    category: 'Roads & Infrastructure',
    ward: 'Wagholi Ward 27 (Pune-Nagar Highway)',
    lat: 18.5780,
    lng: 73.9790,
    radiusMeters: 380,
    activeComplaints: 19,
    severity: 'GROWING',
    color: '#F97316',
    icon: '🚧',
    dept: 'Public Works Department (PWD Pune)',
    action: 'Mastic asphalt patching & highway shoulder leveling',
    slaRisk: 'Medium (In Progress)'
  },
  {
    id: 'HOTSPOT-WAG-05',
    name: 'Domkhel Road Sewerage Backflow',
    category: 'Drainage & Waterlogging',
    ward: 'Wagholi Ward 30 (Domkhel Road)',
    lat: 18.5770,
    lng: 73.9860,
    radiusMeters: 260,
    activeComplaints: 14,
    severity: 'GROWING',
    color: '#06B6D4',
    icon: '🌊',
    dept: 'PMC Water Supply & Drainage',
    action: 'Suction jetting machine dispatched to clear blockage',
    slaRisk: 'Low (Within 48h SLA)'
  },
  {
    id: 'HOTSPOT-WAG-06',
    name: 'Bakori Road Surface Cavities',
    category: 'Roads & Infrastructure',
    ward: 'Wagholi Ward 31 (Bakori Road)',
    lat: 18.5835,
    lng: 73.9890,
    radiusMeters: 300,
    activeComplaints: 16,
    severity: 'NORMAL',
    color: '#64748B',
    icon: '🛣️',
    dept: 'PWD Pune Division',
    action: 'Grading and aggregate leveling scheduled',
    slaRisk: 'Normal'
  }
];

// REAL WAGHOLI SPREAD TIMELINE POINTS
export const WAGHOLI_SPREAD_POINTS = [
  {
    step: 'Day 1 (Sep 28)',
    ward: 'Wagholi Ward 29 (Origin: Kesnand Road)',
    lat: 18.5760,
    lng: 73.9810,
    radiusMeters: 140,
    signalCount: 2,
    label: 'Origin: Subterranean valve fracture near Kesnand Road valve pit',
    color: '#10B981'
  },
  {
    step: 'Day 3 (Sep 30)',
    ward: 'Wagholi Ward 29 (Ivy Estate Loop)',
    lat: 18.5768,
    lng: 73.9818,
    radiusMeters: 420,
    signalCount: 18,
    label: 'Subsurface seep along Kesnand utility corridor to Ivy Estate towers',
    color: '#F59E0B'
  },
  {
    step: 'Day 5 (Oct 01)',
    ward: 'Corridor: Wagholi Wards 27, 28 & 29',
    lat: 18.5785,
    lng: 73.9830,
    radiusMeters: 850,
    signalCount: 37,
    label: 'Critical multi-ward impact across Wagholi distribution line & Highway',
    color: '#EF4444'
  }
];

// Coordinate sanitization: ensure coordinates fall within Wagholi, Pune bounds
const sanitizeCoord = (pt, fallbackLat = 18.5785, fallbackLng = 73.9820) => {
  if (!pt) return { lat: fallbackLat, lng: fallbackLng };
  const lat = Number(pt.lat);
  const lng = Number(pt.lng);
  if (isNaN(lat) || isNaN(lng) || lat > 20 || lat < 17 || lng < 72 || lng > 76) {
    return { ...pt, lat: fallbackLat, lng: fallbackLng };
  }
  return { ...pt, lat, lng };
};

export default function LeafletSpreadMap({
  dataPoints = [],
  selectedDay = 0,
  activeLayer = 'spread', // 'spread' | 'signals' | 'cluster' | 'hotspots' | 'affected'
  mapMode = 'satellite',
  defaultTile,
  height = '420px',
  region = 'wagholi'
}) {
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const initialCenter = React.useMemo(() => [18.5785, 73.9820], []);

  // Clean dataPoints with Wagholi coordinates (memoized to prevent re-render loops)
  const rawPoints = (dataPoints && dataPoints.length > 0) ? dataPoints : WAGHOLI_SPREAD_POINTS;
  const points = React.useMemo(() => {
    return rawPoints.map((pt, idx) => {
      const fallback = WAGHOLI_SPREAD_POINTS[idx] || WAGHOLI_SPREAD_POINTS[0];
      return sanitizeCoord(pt, fallback.lat, fallback.lng);
    });
  }, [rawPoints]);

  const currentPoint = points[selectedDay] || points[points.length - 1] || WAGHOLI_SPREAD_POINTS[0];

  // Camera targets calculated from selection without triggering state render loops
  const targetLat = selectedHotspot ? selectedHotspot.lat : (currentPoint?.lat || 18.5785);
  const targetLng = selectedHotspot ? selectedHotspot.lng : (currentPoint?.lng || 73.9820);
  const cameraTriggerKey = selectedHotspot ? `hotspot-${selectedHotspot.id}` : `day-${selectedDay}`;

  // Pipeline path coordinates along Wagholi Kesnand Road, Ivy Estate & Raisoni Chowk corridor
  const pipelinePath = React.useMemo(() => [
    [18.5802, 73.9785], // Raisoni Chowk
    [18.5780, 73.9790], // Lexicon School
    [18.5760, 73.9810], // Ivy Estate Gate #1
    [18.5770, 73.9860], // Domkhel Road
    [18.5815, 73.9840]  // Baif Road Market
  ], []);

  // Derived citizen signal GPS locations distributed along actual Wagholi streets
  const signalCoords = React.useMemo(() => [
    { id: 'SIG-WAG-01', pos: [18.5762, 73.9808], title: 'Continuous drinking water leakage at Ivy Estate Gate #1', time: '10 min ago', citizen: 'Rahul R.', ward: 'Ward 29', dept: 'PMC Water' },
    { id: 'SIG-WAG-02', pos: [18.5766, 73.9815], title: 'Tap water smells foul like drainage in Ivy Estate Tower B', time: '25 min ago', citizen: 'Priya K.', ward: 'Ward 29', dept: 'PMC Water' },
    { id: 'SIG-WAG-03', pos: [18.5772, 73.9822], title: 'Water pressure collapse on 1st & 2nd floors along Kesnand road', time: '1 hr ago', citizen: 'Amit S.', ward: 'Ward 29', dept: 'PMC Water' },
    { id: 'SIG-WAG-04', pos: [18.5812, 73.9838], title: 'Sunken road asphalt near Baif Road entry junction', time: '2 hrs ago', citizen: 'Kavita M.', ward: 'Ward 28', dept: 'PWD Pune' },
    { id: 'SIG-WAG-05', pos: [18.5756, 73.9788], title: 'Water pooling near Lexicon Kids school boundary', time: '3 hrs ago', citizen: 'Suresh D.', ward: 'Ward 27', dept: 'PMC Water' },
    { id: 'SIG-WAG-06', pos: [18.5818, 73.9842], title: 'Baif Road vegetable market corner has massive open garbage dump', time: '4 hrs ago', citizen: 'Sunil J.', ward: 'Ward 28', dept: 'PMC SWM' },
    { id: 'SIG-WAG-07', pos: [18.5803, 73.9783], title: 'Transformer near Raisoni College gate making loud sparking noise', time: '5 hrs ago', citizen: 'Vikas N.', ward: 'Ward 27', dept: 'MSEDCL' },
    { id: 'SIG-WAG-08', pos: [18.5770, 73.9860], title: 'Sewer manhole overflowing onto Domkhel road', time: '6 hrs ago', citizen: 'Anjali P.', ward: 'Ward 30', dept: 'PMC Drainage' }
  ], []);

  const effectiveTileKey = defaultTile || mapMode;
  const tile = SPREAD_TILES[effectiveTileKey] || SPREAD_TILES.satellite;

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
        center={initialCenter}
        zoom={15}
        minZoom={13}
        maxZoom={18}
        zoomControl={false}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', background: '#0B1520' }}
      >
        <TileLayer
          key={effectiveTileKey}
          url={tile.url}
          attribution={tile.attribution}
          maxZoom={19}
        />

        <SpreadMapController
          targetLat={targetLat}
          targetLng={targetLng}
          zoom={15}
          triggerKey={cameraTriggerKey}
        />

        {/* Real Geodetic Pipeline Trace */}
        <Polyline
          positions={pipelinePath}
          pathOptions={{
            color: '#38BDF8',
            weight: 4,
            dashArray: '8, 6',
            opacity: 0.95
          }}
        />

        {/* Real Metric Radius Contamination Spread Zone */}
        {currentPoint && (
          <Circle
            center={[currentPoint.lat, currentPoint.lng]}
            radius={currentPoint.radiusMeters || 450}
            pathOptions={{
              color: currentPoint.color || '#EF4444',
              fillColor: currentPoint.color || '#EF4444',
              fillOpacity: 0.24,
              weight: 2.5
            }}
          />
        )}

        {/* AI HOTSPOTS LAYER (Interactive hotspots across Wagholi) */}
        {(activeLayer === 'hotspots' || activeLayer === 'cluster' || activeLayer === 'spread') && WAGHOLI_AI_HOTSPOTS.map((hotspot) => {
          const isSelected = selectedHotspot?.id === hotspot.id;
          return (
            <React.Fragment key={hotspot.id}>
              {/* Hotspot Impact Radius */}
              <Circle
                center={[hotspot.lat, hotspot.lng]}
                radius={hotspot.radiusMeters}
                pathOptions={{
                  color: hotspot.color,
                  fillColor: hotspot.color,
                  fillOpacity: isSelected ? 0.28 : 0.14,
                  weight: isSelected ? 2.5 : 1.5,
                  dashArray: '4, 4'
                }}
              />
              <Marker
                position={[hotspot.lat, hotspot.lng]}
                icon={createHotspotIcon(hotspot, isSelected)}
                eventHandlers={{
                  click: () => {
                    setSelectedHotspot(prev => prev?.id === hotspot.id ? null : hotspot);
                  }
                }}
              >
                <Popup autoPan={false}>
                  <div style={{ minWidth: '220px', padding: '4px', color: '#0F172A', fontFamily: 'sans-serif' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
                      <span style={{ 
                        fontSize: '10px', 
                        fontWeight: 800, 
                        background: `${hotspot.color}22`, 
                        color: hotspot.color, 
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        border: `1px solid ${hotspot.color}44`
                      }}>
                        {hotspot.severity} HOTSPOT
                      </span>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B' }}>
                        🔥 {hotspot.activeComplaints} Active
                      </span>
                    </div>

                    <div style={{ fontWeight: 800, fontSize: '13px', color: '#0F172A', marginBottom: '2px' }}>
                      {hotspot.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#0284C7', fontWeight: 600, marginBottom: '6px' }}>
                      📍 {hotspot.ward}
                    </div>

                    <div style={{ fontSize: '11px', background: '#F8FAFC', padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0', marginBottom: '6px' }}>
                      <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>DEPARTMENT IN CHARGE:</div>
                      <strong style={{ fontSize: '11px', color: '#0F172A' }}>{hotspot.dept}</strong>
                      <div style={{ fontSize: '10px', color: '#059669', marginTop: '3px' }}>
                        ✓ {hotspot.action}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748B' }}>
                      <span>SLA Status: <strong>{hotspot.slaRisk}</strong></span>
                      <span>Radius: <strong>{hotspot.radiusMeters}m</strong></span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}

        {/* Epicenter Data Points (Temporal Progression) */}
        {points.map((pt, idx) => {
          const isCurrent = idx === selectedDay;
          return (
            <Marker
              key={pt.step || idx}
              position={[pt.lat, pt.lng]}
              icon={createEpicenterIcon(pt, isCurrent)}
            >
              <Popup autoPan={false}>
                <div style={{ minWidth: '200px', padding: '3px', color: '#0F172A', fontFamily: 'sans-serif' }}>
                  <div style={{ fontWeight: 800, fontSize: '13px', color: pt.color, marginBottom: '4px' }}>
                    {pt.step}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '11px', marginBottom: '4px' }}>
                    {pt.ward}
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569', marginBottom: '6px', lineHeight: 1.35 }}>
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
        {(activeLayer === 'signals' || activeLayer === 'all') && signalCoords.map(sig => (
          <Marker
            key={sig.id}
            position={sig.pos}
            icon={createSignalIcon()}
          >
            <Popup autoPan={false}>
              <div style={{ padding: '3px', color: '#0F172A', fontSize: '11.5px', minWidth: '180px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, color: '#0284C7' }}>{sig.id}</span>
                  <span style={{ fontSize: '10px', color: '#64748B' }}>{sig.time}</span>
                </div>
                <div style={{ marginTop: '3px', color: '#1E293B', fontWeight: 600 }}>{sig.title}</div>
                <div style={{ marginTop: '4px', fontSize: '10.5px', color: '#0E5E3A', background: '#DCFCE7', padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}>
                  📍 {sig.ward} · {sig.dept}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Top Floating Hotspot Indicator Badge */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.94)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '999px',
        padding: '5px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '11px',
        fontWeight: 700,
        color: '#FFFFFF',
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
      }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: currentPoint?.color || '#EF4444', boxShadow: `0 0 8px ${currentPoint?.color || '#EF4444'}` }} />
        <span>📍 Wagholi Pune · Corridor Radius: {currentPoint?.radiusMeters}m ({currentPoint?.step})</span>
      </div>

      {/* Bottom Quick Jump Bar for Wagholi Hotspots */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        right: '10px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        overflowX: 'auto',
        padding: '6px 8px',
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.18)',
        scrollbarWidth: 'none'
      }}>
        <span style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', whiteSpace: 'nowrap', marginRight: '2px' }}>
          🔥 Wagholi Hotspots:
        </span>
        {WAGHOLI_AI_HOTSPOTS.map(h => {
          const isSelected = selectedHotspot?.id === h.id;
          return (
            <button
              key={h.id}
              type="button"
              onClick={() => {
                setSelectedHotspot(prev => prev?.id === h.id ? null : h);
              }}
              style={{
                fontSize: '10.5px',
                fontWeight: 700,
                padding: '3px 9px',
                borderRadius: '6px',
                border: isSelected ? `1.5px solid ${h.color}` : '1px solid rgba(255,255,255,0.15)',
                background: isSelected ? `${h.color}33` : 'rgba(255,255,255,0.06)',
                color: isSelected ? '#FFFFFF' : '#CBD5E1',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 120ms ease'
              }}
            >
              <span>{h.icon}</span>
              <span>{h.name.split(' ')[0]}</span>
              <span style={{ fontSize: '9px', opacity: 0.8 }}>({h.activeComplaints})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
