import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Crosshair } from 'lucide-react';

// Custom Pin SVG Icon for Leaflet
const createCustomPinIcon = (color = '#0E5E3A') => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        position: relative;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translate(-50%, -100%);
      ">
        <div style="
          width: 36px;
          height: 36px;
          background: ${color};
          border: 3px solid #FFFFFF;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 12px;
            height: 12px;
            background: #FFFFFF;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

export default function RealMap({
  latitude = 28.7189,
  longitude = 77.1265,
  accuracy = 15,
  address = '',
  ward = '',
  area = '',
  source = 'gps',
  draggable = true,
  height = '320px',
  onLocationChange = () => {},
  markers = [] // Optional array of extra markers for heatmap / clusters
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet map
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: 16,
        zoomControl: true,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;

      // Handle map clicks to place/move pin
      if (draggable) {
        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          onLocationChange(lat, lng, 'manual');
        });
      }
    }

    const map = mapInstanceRef.current;
    map.setView([latitude, longitude]);

    // Update or create main pin marker
    const pinIcon = createCustomPinIcon(source === 'gps' ? '#0E5E3A' : '#D97706');
    if (markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
      markerRef.current.setIcon(pinIcon);
    } else {
      const marker = L.marker([latitude, longitude], {
        icon: pinIcon,
        draggable: draggable
      }).addTo(map);

      if (draggable) {
        marker.on('dragend', (e) => {
          const pos = e.target.getLatLng();
          onLocationChange(pos.lat, pos.lng, 'manual');
        });
      }
      markerRef.current = marker;
    }

    // Bind rich popup
    const popupContent = `
      <div style="font-family: inherit; font-size: 12px; line-height: 1.4; min-width: 180px; padding: 4px;">
        <strong style="color: #0E5E3A; display: block; margin-bottom: 4px; font-size: 13px;">
          ${source === 'gps' ? '📍 GPS Verified Location' : '📍 Manually Adjusted Pin'}
        </strong>
        <div><strong>Coords:</strong> ${latitude.toFixed(5)}°, ${longitude.toFixed(5)}°</div>
        ${accuracy ? `<div><strong>Accuracy:</strong> ±${Math.round(accuracy)} meters</div>` : ''}
        ${area ? `<div><strong>Area:</strong> ${area}</div>` : ''}
        ${ward ? `<div><strong>Ward:</strong> ${ward}</div>` : ''}
        <div style="margin-top: 6px; font-size: 11px; color: #64748B;">Drag pin or tap map to adjust</div>
      </div>
    `;
    markerRef.current.bindPopup(popupContent);

    // Update accuracy radius circle if source is GPS
    if (circleRef.current) {
      map.removeLayer(circleRef.current);
      circleRef.current = null;
    }
    if (source === 'gps' && accuracy && accuracy > 0) {
      circleRef.current = L.circle([latitude, longitude], {
        radius: Math.min(accuracy, 100),
        color: '#10B981',
        fillColor: '#10B981',
        fillOpacity: 0.12,
        weight: 1.5
      }).addTo(map);
    }

    // Additional extra markers (e.g. cluster points)
    if (markers && markers.length > 0) {
      markers.forEach(m => {
        if (m.lat && m.lng) {
          const extraIcon = createCustomPinIcon(m.color || '#2563EB');
          L.marker([m.lat, m.lng], { icon: extraIcon })
            .addTo(map)
            .bindPopup(`<strong>${m.title || 'Civic Ticket'}</strong><br/>${m.ward || ''}`);
        }
      });
    }

    // Invalidate size in case of tab/modal switch
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {};
  }, [latitude, longitude, accuracy, source, draggable]);

  const handleCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([latitude, longitude], 17);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border-medium)', boxShadow: 'var(--shadow-sm)' }}>
      {/* Map Surface */}
      <div ref={mapContainerRef} style={{ width: '100%', height }} />

      {/* Map Floating Control Overlay */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <button
          type="button"
          onClick={handleCenter}
          title="Recenter on Pin"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#FFFFFF',
            border: '1px solid rgba(15,23,42,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            color: 'var(--color-primary)'
          }}
        >
          <Crosshair style={{ width: '18px', height: '18px' }} />
        </button>
      </div>

      {/* Location Metadata Bar at bottom */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        left: '8px',
        right: '8px',
        zIndex: 500,
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(8px)',
        borderRadius: 'var(--radius-md)',
        padding: '8px 12px',
        border: '1px solid rgba(15,23,42,0.08)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '6px',
        fontSize: '11px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-primary)' }}>
          <MapPin style={{ width: '14px', height: '14px', color: source === 'gps' ? '#0E5E3A' : '#D97706', flexShrink: 0 }} />
          <span>
            <strong>{source === 'gps' ? 'GPS Locked:' : 'Manual Pin:'}</strong>{' '}
            {latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E
            {accuracy ? ` (±${Math.round(accuracy)}m)` : ''}
          </span>
        </div>
        <div style={{
          padding: '2px 8px',
          borderRadius: '9999px',
          background: source === 'gps' ? '#ECFDF5' : '#FEF3C7',
          color: source === 'gps' ? '#065F46' : '#92400E',
          fontWeight: 700,
          fontSize: '10px'
        }}>
          {source === 'gps' ? 'High-Accuracy GPS' : 'Manual Pin Adjust'}
        </div>
      </div>
    </div>
  );
}
