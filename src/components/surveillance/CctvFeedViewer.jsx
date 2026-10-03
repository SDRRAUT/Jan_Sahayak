import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  AlertTriangle, 
  Camera, 
  ShieldAlert, 
  CheckCircle2, 
  Eye, 
  Crosshair, 
  Radio, 
  Sliders, 
  Maximize2, 
  Sparkles,
  Zap,
  Activity,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { SURVEILLANCE_HOTSPOTS } from '../../data/surveillanceData';

/**
 * CctvFeedViewer Component
 * Realistic municipal CCTV monitor with CRT scanlines, Wagholi Restricted Zone SVG rendering,
 * live HUD telemetry overlays, animated bounding box detection, and interactive demo controls.
 */
export default function CctvFeedViewer({ 
  onViolationDetected,
  onSimulationStep,
  selectedCameraId = 'CAM-WAG-04',
  onCameraChange,
  className = ''
}) {
  // Active Camera selection
  const [activeCamId, setActiveCamId] = useState(selectedCameraId);

  // Sync if prop changes externally
  useEffect(() => {
    if (selectedCameraId && selectedCameraId !== activeCamId) {
      setActiveCamId(selectedCameraId);
    }
  }, [selectedCameraId]);

  const handleCameraSelect = (camId) => {
    setActiveCamId(camId);
    if (onCameraChange) onCameraChange(camId);
  };

  // Camera specifications
  const cameras = [
    {
      id: 'CAM-WAG-04',
      code: 'CAM-WAG-04',
      name: 'CAM-WAG-04 (Arterial Main)',
      shortName: 'Arterial Main',
      location: 'WAGHOLI RESTRICTED CORRIDOR',
      sector: 'ARTERIAL ROAD SECTOR-B',
      restriction: 'Rule #09: Daytime Heavy Vehicle Ban (08:00 - 20:00)',
      targetVehicle: 'Dumper Truck #MH-12-Q-4029',
      defaultSpeed: '38 KM/H',
      confidence: '94%'
    },
    {
      id: 'CAM-WAG-02',
      code: 'CAM-WAG-02',
      name: 'CAM-WAG-02 (Junction West)',
      shortName: 'Junction West',
      location: 'KESNAND ROAD & IVY ESTATE JUNCTION',
      sector: 'JUNCTION PERIMETER SECTOR-A',
      restriction: 'Rule #09: Commercial Transport Entry Ban',
      targetVehicle: 'Carrier #MH-14-BT-8821',
      defaultSpeed: '42 KM/H',
      confidence: '91%'
    },
    {
      id: 'CAM-WAG-07',
      code: 'CAM-WAG-07',
      name: 'CAM-WAG-07 (School Gate)',
      shortName: 'School Gate',
      location: 'LEXICON SCHOOL PERIMETER BUFFER',
      sector: 'PEDESTRIAN SAFETY CORRIDOR',
      restriction: 'Rule #09 & School Buffer No-Heavy Entry',
      targetVehicle: 'Transit Mixer #MH-12-RN-6510',
      defaultSpeed: '28 KM/H',
      confidence: '96%'
    }
  ];

  const currentCam = cameras.find(c => c.id === activeCamId) || cameras[0];

  // Simulation Stages:
  // 0: Normal Activity (14:31:02)
  // 1: Vehicle Enters (14:31:08)
  // 2: Rule Breach (14:31:10)
  // 3: Potential Violation Detected (14:31:11)
  // 4: Ticket Generated (14:31:12)
  const [simStep, setSimStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isViolationActive, setIsViolationActive] = useState(false);
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);
  const [snapshotFlash, setSnapshotFlash] = useState(false);
  const [nightVisionMode, setNightVisionMode] = useState(false);
  const [showOpticalFlow, setShowOpticalFlow] = useState(true);

  // Live HUD ticking clock
  const [liveTime, setLiveTime] = useState(() => {
    const d = new Date();
    return d.toTimeString().split(' ')[0] + ' IST';
  });
  const [fps, setFps] = useState(29.97);

  // Interval for ticking clock & slight realistic micro-fps variance
  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setLiveTime(d.toTimeString().split(' ')[0] + ' IST');
      // Subtle realistic FPS flutter: 29.94 to 30.01
      setFps((29.94 + Math.random() * 0.08).toFixed(2));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulation execution timer
  const simTimerRef = useRef(null);

  const simulationStages = [
    { step: 0, time: '14:31:02', label: 'Normal Activity', desc: 'Corridor clear, normal traffic flow' },
    { step: 1, time: '14:31:08', label: 'Vehicle Enters', desc: 'HCV approaching Wagholi sector boundary' },
    { step: 2, time: '14:31:10', label: 'Rule Breach', desc: 'Vehicle crossed into restricted hazard geofence' },
    { step: 3, time: '14:31:11', label: 'Potential Violation Detected', desc: 'AI bounding box locked, 94% rule violation' },
    { step: 4, time: '14:31:12', label: 'Ticket Generated', desc: 'Dual snapshots captured, ticket INC-2026-PUNE-0042 generated' }
  ];

  // Handle simulation progression
  useEffect(() => {
    if (!isPlaying) {
      if (simTimerRef.current) clearTimeout(simTimerRef.current);
      return;
    }

    if (simStep === 0) {
      setIsViolationActive(false);
      setShowNotificationBanner(false);
      simTimerRef.current = setTimeout(() => {
        setSimStep(1);
        if (onSimulationStep) onSimulationStep(1, simulationStages[1]);
      }, 2000);
    } else if (simStep === 1) {
      simTimerRef.current = setTimeout(() => {
        setSimStep(2);
        if (onSimulationStep) onSimulationStep(2, simulationStages[2]);
      }, 2200);
    } else if (simStep === 2) {
      setIsViolationActive(true);
      simTimerRef.current = setTimeout(() => {
        setSimStep(3);
        if (onSimulationStep) onSimulationStep(3, simulationStages[3]);
      }, 2000);
    } else if (simStep === 3) {
      setIsViolationActive(true);
      setShowNotificationBanner(true);
      // Dual frame flash simulation
      setSnapshotFlash(true);
      setTimeout(() => setSnapshotFlash(false), 250);

      simTimerRef.current = setTimeout(() => {
        setSimStep(4);
        if (onSimulationStep) onSimulationStep(4, simulationStages[4]);
      }, 1800);
    } else if (simStep === 4) {
      setIsPlaying(false);
      // Trigger callback to parent pipeline
      if (onViolationDetected) {
        onViolationDetected({
          incidentId: 'INC-2026-PUNE-0042',
          hotspotId: 'HOTSPOT-WAG-01',
          camera: currentCam.code,
          cameraLocation: currentCam.location,
          vehicleDetails: currentCam.targetVehicle,
          licensePlate: 'MH-12-Q-4029',
          aiConfidence: 94,
          speed: currentCam.defaultSpeed,
          rule: currentCam.restriction,
          timestamp: 'Today, 14:32 IST',
          geofenceZone: currentCam.sector,
          status: 'Detected'
        });
      }
    }

    return () => {
      if (simTimerRef.current) clearTimeout(simTimerRef.current);
    };
  }, [isPlaying, simStep, currentCam]);

  const handleStartSimulation = () => {
    setSimStep(0);
    setIsViolationActive(false);
    setShowNotificationBanner(false);
    setIsPlaying(true);
    if (onSimulationStep) onSimulationStep(0, simulationStages[0]);
  };

  const handleTriggerInstantViolation = () => {
    setIsPlaying(false);
    setSimStep(3);
    setIsViolationActive(true);
    setShowNotificationBanner(true);
    setSnapshotFlash(true);
    setTimeout(() => setSnapshotFlash(false), 250);

    if (onViolationDetected) {
      onViolationDetected({
        incidentId: 'INC-2026-PUNE-0042',
        hotspotId: 'HOTSPOT-WAG-01',
        camera: currentCam.code,
        cameraLocation: currentCam.location,
        vehicleDetails: currentCam.targetVehicle,
        licensePlate: 'MH-12-Q-4029',
        aiConfidence: 94,
        speed: currentCam.defaultSpeed,
        rule: currentCam.restriction,
        timestamp: 'Today, 14:32 IST',
        geofenceZone: currentCam.sector,
        status: 'Detected'
      });
    }
  };

  const handleResetStream = () => {
    setIsPlaying(false);
    if (simTimerRef.current) clearTimeout(simTimerRef.current);
    setSimStep(0);
    setIsViolationActive(false);
    setShowNotificationBanner(false);
    setSnapshotFlash(false);
    if (onSimulationStep) onSimulationStep(0, simulationStages[0]);
  };

  // Determine vehicle position based on simStep
  // SimStep 0: Off-screen or distant
  // SimStep 1: Top of road entering (x: 480, y: 140)
  // SimStep 2: Inside hazard polygon (x: 420, y: 220)
  // SimStep 3 & 4: Deep in restricted geofence with bounding box locked (x: 370, y: 280)
  let truckPosition = { x: 580, y: 80, scale: 0.55, opacity: 0 };
  if (simStep === 1) {
    truckPosition = { x: 490, y: 150, scale: 0.72, opacity: 1 };
  } else if (simStep === 2) {
    truckPosition = { x: 420, y: 220, scale: 0.88, opacity: 1 };
  } else if (simStep >= 3) {
    truckPosition = { x: 360, y: 275, scale: 1.05, opacity: 1 };
  }

  return (
    <div 
      className={`cctv-viewer-container ${className}`}
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid rgba(15, 23, 42, 0.1)',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* CCTV Monitor Chassis & Screen Box */}
      <div 
        style={{
          position: 'relative',
          background: nightVisionMode ? '#021206' : '#070D0A',
          width: '100%',
          aspectRatio: '16 / 9.6',
          minHeight: '360px',
          maxHeight: '520px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'JetBrains Mono', monospace",
          color: '#E2E8F0',
          userSelect: 'none'
        }}
      >
        {/* CRT Scanline Filter Overlay */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 15,
            background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.28) 50%)',
            backgroundSize: '100% 3px',
            opacity: 0.85
          }}
        />

        {/* CRT Curved Glass Lens Distortion & Vignette */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 16,
            boxShadow: 'inset 0 0 90px rgba(0, 0, 0, 0.85), inset 0 0 25px rgba(0, 0, 0, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        />

        {/* Snapshot flash burst effect */}
        {snapshotFlash && (
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 30,
              backgroundColor: '#FFFFFF',
              opacity: 0.8,
              transition: 'opacity 0.25s ease-out',
              pointerEvents: 'none'
            }}
          />
        )}

        {/* SVG Realistic Road & Wagholi Restricted Corridor Rendering */}
        <svg 
          viewBox="0 0 800 450" 
          preserveAspectRatio="xMidYMid slice"
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            inset: 0,
            filter: nightVisionMode ? 'brightness(1.1) contrast(1.3) hue-rotate(85deg)' : 'none',
            transition: 'filter 0.3s ease'
          }}
        >
          <defs>
            {/* Diagonal Yellow Hazard Striping Pattern */}
            <pattern 
              id="hazardStripePattern" 
              width="24" 
              height="24" 
              patternUnits="userSpaceOnUse" 
              patternTransform="rotate(45)"
            >
              <rect width="12" height="24" fill="#F59E0B" />
              <rect x="12" width="12" height="24" fill="#1E293B" />
            </pattern>

            {/* Road Perspective Gradient */}
            <linearGradient id="roadSurface" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E2922" />
              <stop offset="50%" stopColor="#152119" />
              <stop offset="100%" stopColor="#0E1712" />
            </linearGradient>

            {/* Glowing Geofence Shadow */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Ambient Terrain / Pune Urban Horizon */}
          <rect x="0" y="0" width="800" height="450" fill="#0A110D" />
          
          {/* Distant skyline & tree silhouettes */}
          <path d="M0,130 L60,122 L110,126 L150,118 L210,124 L270,120 L350,125 L450,120 L550,126 L640,119 L720,123 L800,120 L800,140 L0,140 Z" fill="#111D16" />
          
          {/* Distant Pune PMC Streetlights */}
          <circle cx="180" cy="115" r="1.5" fill="#FEF08A" opacity="0.6" />
          <circle cx="340" cy="112" r="1.5" fill="#FEF08A" opacity="0.6" />
          <circle cx="580" cy="114" r="1.5" fill="#FEF08A" opacity="0.6" />

          {/* Main Wagholi Arterial Roadway (Perspective Trapezoid) */}
          <polygon points="260,130 540,130 760,450 40,450" fill="url(#roadSurface)" />

          {/* Left Concrete Sidewalk / Curb */}
          <polygon points="245,130 260,130 40,450 10,450" fill="#2A3830" />
          <line x1="260" y1="130" x2="40" y2="450" stroke="#475569" strokeWidth="2" />

          {/* Right Concrete Sidewalk / Curb */}
          <polygon points="540,130 555,130 790,450 760,450" fill="#2A3830" />
          <line x1="540" y1="130" x2="760" y2="450" stroke="#475569" strokeWidth="2" />

          {/* Center Dividing Line (Dashed White Markings) */}
          <line 
            x1="400" y1="130" x2="400" y2="450" 
            stroke="#94A3B8" 
            strokeWidth="3" 
            strokeDasharray="14 18" 
            opacity="0.85" 
          />

          {/* Right Lane Shoulder Line */}
          <line x1="470" y1="130" x2="580" y2="450" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.4" />
          
          {/* Left Lane Shoulder Line */}
          <line x1="330" y1="130" x2="220" y2="450" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.4" />

          {/* Wagholi Restricted Zone Entry Polygon (Hazard Pattern Zone) */}
          <g id="restrictedZoneGeofence">
            {/* Diagonal Hazard Fill */}
            <polygon 
              points="280,180 500,180 620,380 180,380" 
              fill="url(#hazardStripePattern)" 
              opacity={isViolationActive ? "0.45" : "0.22"} 
            />

            {/* Glowing Boundary Outline */}
            <polygon 
              points="280,180 500,180 620,380 180,380" 
              fill="none" 
              stroke={isViolationActive ? "#EF4444" : "#06B6D4"} 
              strokeWidth={isViolationActive ? "3.5" : "2"} 
              strokeDasharray={isViolationActive ? "8 4" : "6 4"} 
              filter="url(#neonGlow)"
            />

            {/* Ground Geofence Stencil Typography */}
            <text 
              x="400" 
              y="370" 
              textAnchor="middle" 
              fill={isViolationActive ? "#FCA5A5" : "#67E8F9"} 
              fontSize="11" 
              letterSpacing="2.5" 
              fontWeight="bold" 
              opacity="0.85"
            >
              ⚠ RESTRICTED ENTRY ZONE - NO HEAVY VEHICLES (PMC SEC-B) ⚠
            </text>
          </g>

          {/* Overhead Gantry Sign in Distance */}
          <g id="overheadGantry">
            <line x1="220" y1="150" x2="220" y2="120" stroke="#64748B" strokeWidth="2.5" />
            <line x1="580" y1="150" x2="580" y2="120" stroke="#64748B" strokeWidth="2.5" />
            <line x1="220" y1="125" x2="580" y2="125" stroke="#475569" strokeWidth="3" />
            <rect x="290" y="112" width="220" height="22" rx="3" fill="#1E293B" stroke="#0E5E3A" strokeWidth="1.5" />
            <text x="400" y="127" textAnchor="middle" fill="#86EFAC" fontSize="9" fontWeight="bold" letterSpacing="0.8">
              WAGHOLI CORRIDOR • CIVIC SURVEILLANCE
            </text>
          </g>

          {/* Ambient Commuter Traffic: Normal Small Car in Allowed Outer Lane */}
          <g id="normalCarSilhouette" transform="translate(180, 270) scale(0.65)" opacity="0.8">
            <ellipse cx="60" cy="55" rx="52" ry="18" fill="#000000" opacity="0.6" />
            <rect x="15" y="24" width="90" height="26" rx="8" fill="#334155" />
            <path d="M30,24 L45,6 L78,6 L92,24 Z" fill="#475569" />
            <rect x="46" y="8" width="28" height="14" fill="#94A3B8" opacity="0.5" />
            {/* Wheels */}
            <circle cx="35" cy="50" r="10" fill="#0F172A" />
            <circle cx="85" cy="50" r="10" fill="#0F172A" />
            {/* Headlights */}
            <circle cx="16" cy="36" r="3" fill="#FEF08A" opacity="0.8" />
          </g>

          {/* Ambient Auto-Rickshaw Passing on Right Side */}
          <g id="autorickshawSilhouette" transform="translate(630, 310) scale(0.6)" opacity="0.75">
            <ellipse cx="40" cy="50" rx="34" ry="14" fill="#000000" opacity="0.6" />
            <path d="M10,42 L25,12 L55,12 L65,42 Z" fill="#047857" />
            <rect x="15" y="15" width="45" height="15" fill="#FACC15" />
            <circle cx="20" cy="46" r="8" fill="#0F172A" />
            <circle cx="55" cy="46" r="8" fill="#0F172A" />
          </g>

          {/* Simulated Optical Flow Motion Vectors (Subtle AI Tracking Marks) */}
          {showOpticalFlow && (
            <g id="opticalFlowVectors" opacity="0.6">
              {/* Grid Points */}
              <circle cx="240" cy="300" r="1.5" fill="#10B981" />
              <line x1="240" y1="300" x2="236" y2="308" stroke="#10B981" strokeWidth="1" />

              <circle cx="650" cy="340" r="1.5" fill="#10B981" />
              <line x1="650" y1="340" x2="654" y2="352" stroke="#10B981" strokeWidth="1" />

              {simStep >= 1 && (
                <>
                  <circle cx={truckPosition.x + 30} cy={truckPosition.y + 40} r="2" fill="#F59E0B" />
                  <line 
                    x1={truckPosition.x + 30} 
                    y1={truckPosition.y + 40} 
                    x2={truckPosition.x + 22} 
                    y2={truckPosition.y + 65} 
                    stroke="#F59E0B" 
                    strokeWidth="1.5" 
                  />
                  <circle cx={truckPosition.x + 70} cy={truckPosition.y + 45} r="2" fill="#F59E0B" />
                  <line 
                    x1={truckPosition.x + 70} 
                    y1={truckPosition.y + 45} 
                    x2={truckPosition.x + 62} 
                    y2={truckPosition.y + 70} 
                    stroke="#F59E0B" 
                    strokeWidth="1.5" 
                  />
                </>
              )}
            </g>
          )}

          {/* Offending Heavy Commercial Truck (#MH-12-Q-4029) */}
          {truckPosition.opacity > 0 && (
            <g 
              id="violatingHeavyTruck"
              transform={`translate(${truckPosition.x}, ${truckPosition.y}) scale(${truckPosition.scale})`}
              style={{
                transition: isPlaying ? 'all 1.9s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'all 0.4s ease'
              }}
            >
              {/* Truck Ground Shadow */}
              <ellipse cx="55" cy="85" rx="55" ry="14" fill="#000000" opacity="0.75" />

              {/* Heavy Dumper Cargo Bed (Rear/Body) */}
              <rect x="15" y="10" width="80" height="48" rx="4" fill="#78350F" stroke="#92400E" strokeWidth="1.5" />
              {/* Cargo ribs */}
              <line x1="35" y1="10" x2="35" y2="58" stroke="#572207" strokeWidth="2" />
              <line x1="55" y1="10" x2="55" y2="58" stroke="#572207" strokeWidth="2" />
              <line x1="75" y1="10" x2="75" y2="58" stroke="#572207" strokeWidth="2" />

              {/* Truck Cabin (Front) */}
              <path d="M10,58 L10,80 L45,80 L55,58 Z" fill="#991B1B" stroke="#B91C1C" strokeWidth="1.5" />
              {/* Windshield */}
              <polygon points="14,60 48,60 42,70 14,70" fill="#38BDF8" opacity="0.6" />
              {/* Exhaust Stack */}
              <rect x="52" y="30" width="4" height="26" fill="#64748B" />

              {/* Heavy Wheels (Multi-Axle) */}
              <circle cx="24" cy="82" r="10" fill="#0F172A" stroke="#334155" strokeWidth="2" />
              <circle cx="42" cy="82" r="10" fill="#0F172A" stroke="#334155" strokeWidth="2" />
              <circle cx="78" cy="82" r="10" fill="#0F172A" stroke="#334155" strokeWidth="2" />

              {/* License Plate Stencil */}
              <rect x="14" y="74" width="28" height="6" fill="#FACC15" />
              <text x="28" y="79" textAnchor="middle" fill="#000000" fontSize="4.5" fontWeight="bold">
                MH-12-Q-4029
              </text>
            </g>
          )}

          {/* AI Dynamic Bounding Box Overlay (Neon Green/Amber/Red Reticle) */}
          {isViolationActive && truckPosition.opacity > 0 && (
            <g 
              id="aiBoundingBox"
              transform={`translate(${truckPosition.x - 14}, ${truckPosition.y - 12}) scale(${truckPosition.scale})`}
              style={{
                transition: 'all 0.3s ease'
              }}
            >
              {/* Main Reticle Box */}
              <rect 
                x="0" 
                y="0" 
                width="140" 
                height="115" 
                fill="rgba(239, 68, 68, 0.08)" 
                stroke="#EF4444" 
                strokeWidth="2" 
                strokeDasharray="6 3"
                filter="url(#neonGlow)"
              />

              {/* Corner Brackets ┌ ┐ └ ┘ */}
              <path d="M0,18 L0,0 L18,0" stroke="#F59E0B" strokeWidth="3.5" fill="none" />
              <path d="M122,0 L140,0 L140,18" stroke="#F59E0B" strokeWidth="3.5" fill="none" />
              <path d="M0,97 L0,115 L18,115" stroke="#F59E0B" strokeWidth="3.5" fill="none" />
              <path d="M122,115 L140,115 L140,97" stroke="#F59E0B" strokeWidth="3.5" fill="none" />

              {/* Reticle Target Crosshair */}
              <circle cx="70" cy="57" r="6" stroke="#EF4444" strokeWidth="1.5" fill="none" opacity="0.8" />
              <line x1="70" y1="46" x2="70" y2="68" stroke="#EF4444" strokeWidth="1" />
              <line x1="59" y1="57" x2="81" y2="57" stroke="#EF4444" strokeWidth="1" />

              {/* AI Detection Badge Pill Header */}
              <rect x="0" y="-22" width="140" height="20" rx="2" fill="#B91C1C" />
              <text x="70" y="-8" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" letterSpacing="0.4">
                [BREACH: TRUCK #MH-12-Q-4029] [CONF: 94%]
              </text>

              {/* Speed & Classification Sub-Pill */}
              <rect x="0" y="117" width="140" height="16" rx="2" fill="#18181B" stroke="#EF4444" strokeWidth="1" />
              <text x="70" y="129" textAnchor="middle" fill="#F87171" fontSize="7.5" fontWeight="600" letterSpacing="0.5">
                CLASS: HCV (16W) • SPEED: 38 KM/H • RULE #09
              </text>
            </g>
          )}

          {/* Optical Center Crosshair */}
          <g opacity="0.3" stroke="#FFFFFF" strokeWidth="0.8">
            <line x1="390" y1="225" x2="410" y2="225" />
            <line x1="400" y1="215" x2="400" y2="235" />
            <circle cx="400" cy="225" r="30" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="3 3" fill="none" />
          </g>

          {/* Watermark */}
          <text x="785" y="240" textAnchor="end" fill="#FFFFFF" opacity="0.18" fontSize="9" letterSpacing="2">
            PUNE MUNICIPAL CORP • CIVIC WATCH WARD 29
          </text>
        </svg>

        {/* Live HUD Overlays */}
        {/* Top-Left HUD */}
        <div 
          style={{
            position: 'absolute',
            top: 14,
            left: 16,
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.9)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '2px 7px',
                borderRadius: '4px',
                background: 'rgba(239, 68, 68, 0.25)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                color: '#F87171',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '1px'
              }}
            >
              <span 
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#EF4444',
                  boxShadow: '0 0 8px #EF4444',
                  animation: 'pulse 1.2s infinite'
                }} 
              />
              REC
            </span>
            <span 
              style={{
                color: '#38BDF8',
                fontWeight: 700,
                fontSize: '12px',
                letterSpacing: '1px'
              }}
            >
              {currentCam.code} [LIVE FEED]
            </span>
          </div>
          <div 
            style={{
              fontSize: '11px',
              color: '#94A3B8',
              letterSpacing: '0.8px',
              fontWeight: 500
            }}
          >
            {currentCam.location}
          </div>
        </div>

        {/* Top-Right HUD */}
        <div 
          style={{
            position: 'absolute',
            top: 14,
            right: 16,
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '3px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.9)'
          }}
        >
          <div 
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#F8FAFC',
              letterSpacing: '1.2px'
            }}
          >
            {liveTime}
          </div>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '10px',
              color: '#10B981',
              fontWeight: 600
            }}
          >
            <span>FPS: {fps}</span>
            <span style={{ color: '#64748B' }}>•</span>
            <span style={{ color: '#E2E8F0' }}>HD 1080P</span>
            <span style={{ color: '#64748B' }}>•</span>
            <span style={{ color: '#38BDF8' }}>H.265</span>
          </div>
        </div>

        {/* Bottom-Left HUD: Geofence Status */}
        <div 
          style={{
            position: 'absolute',
            bottom: 14,
            left: 16,
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.9)'
          }}
        >
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 8px',
              borderRadius: '4px',
              background: isViolationActive ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.2)',
              border: `1px solid ${isViolationActive ? 'rgba(239, 68, 68, 0.6)' : 'rgba(16, 185, 129, 0.4)'}`,
              color: isViolationActive ? '#FCA5A5' : '#6EE7B7',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.8px'
            }}
          >
            <span 
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: isViolationActive ? '#EF4444' : '#10B981',
                boxShadow: `0 0 6px ${isViolationActive ? '#EF4444' : '#10B981'}`
              }}
            />
            {isViolationActive 
              ? `[GEOFENCE: ${currentCam.sector} | BREACH DETECTED]` 
              : `[GEOFENCE: ${currentCam.sector} | ACTIVE]`}
          </div>
        </div>

        {/* Bottom-Right HUD: AI Model Badge */}
        <div 
          style={{
            position: 'absolute',
            bottom: 14,
            right: 16,
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.9)'
          }}
        >
          <div 
            style={{
              padding: '3px 8px',
              borderRadius: '4px',
              background: 'rgba(79, 70, 229, 0.25)',
              border: '1px solid rgba(79, 70, 229, 0.45)',
              color: '#A5B4FC',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.6px'
            }}
          >
            YOLO-Civic-v11 • Optical Flow OK
          </div>
        </div>

        {/* Unobtrusive Animated Violation Alert Banner */}
        {showNotificationBanner && (
          <div 
            style={{
              position: 'absolute',
              top: 48,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 25,
              width: '92%',
              maxWidth: '620px',
              background: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(239, 68, 68, 0.6)',
              borderRadius: '8px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 8px 24px rgba(239, 68, 68, 0.25)',
              animation: 'slideDown 0.3s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#EF4444'
                }}
              >
                <AlertTriangle size={18} />
              </span>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#F87171' }}>
                  🚨 Potential restricted-area violation detected in {currentCam.code}
                </div>
                <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '1px' }}>
                  {currentCam.targetVehicle} entered {currentCam.sector} ({currentCam.restriction})
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowNotificationBanner(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#94A3B8',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#FFFFFF'}
              onMouseLeave={(e) => e.target.style.color = '#94A3B8'}
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Interactive Demo Controls Bar */}
      <div 
        style={{
          padding: '16px 20px',
          background: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          borderTop: '1px solid rgba(15, 23, 42, 0.08)'
        }}
      >
        {/* Step Indicator Progress Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} color="#0E5E3A" />
              Live Simulation Sequence:
            </span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: isViolationActive ? '#B91C1C' : '#0E5E3A', background: isViolationActive ? '#FEF2F2' : '#E8F7F0', padding: '2px 8px', borderRadius: '4px' }}>
              Stage {simStep + 1}/5: {simulationStages[simStep].label}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
            {simulationStages.map((stage) => {
              const isPast = simStep > stage.step;
              const isCurrent = simStep === stage.step;
              return (
                <div 
                  key={stage.step}
                  onClick={() => {
                    setSimStep(stage.step);
                    if (stage.step >= 2) setIsViolationActive(true);
                    else setIsViolationActive(false);
                    if (stage.step >= 3) setShowNotificationBanner(true);
                    if (onSimulationStep) onSimulationStep(stage.step, stage);
                  }}
                  style={{
                    cursor: 'pointer',
                    borderRadius: '6px',
                    padding: '6px 8px',
                    fontSize: '11px',
                    background: isCurrent 
                      ? (stage.step >= 2 ? '#FEF2F2' : '#ECFDF5') 
                      : (isPast ? '#F8FAFC' : '#F1F5F9'),
                    border: isCurrent 
                      ? (stage.step >= 2 ? '1px solid #EF4444' : '1px solid #10B981') 
                      : '1px solid transparent',
                    color: isCurrent 
                      ? (stage.step >= 2 ? '#991B1B' : '#065F46') 
                      : (isPast ? '#334155' : '#64748B'),
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '10px', color: '#64748B' }}>{stage.time}</div>
                  <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {stage.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls & Camera Switcher Row */}
        <div 
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          {/* Main Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
            {/* Run Live Simulation Button */}
            <button
              onClick={isPlaying ? () => setIsPlaying(false) : handleStartSimulation}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                background: isPlaying ? '#0A472C' : '#0E5E3A',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(14, 94, 58, 0.25)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#0A472C'}
              onMouseLeave={(e) => e.target.style.background = isPlaying ? '#0A472C' : '#0E5E3A'}
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} fill="#FFFFFF" />}
              {isPlaying ? 'Pause Simulation' : '▶ Run Live Simulation'}
            </button>

            {/* Instant Trigger Violation Button */}
            <button
              onClick={handleTriggerInstantViolation}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                background: '#FEF2F2',
                color: '#991B1B',
                fontSize: '13px',
                fontWeight: 600,
                border: '1px solid rgba(239, 68, 68, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#FEE2E2'}
              onMouseLeave={(e) => e.target.style.background = '#FEF2F2'}
            >
              <AlertTriangle size={15} color="#DC2626" />
              🚨 Trigger Violation
            </button>

            {/* Reset Stream Button */}
            <button
              onClick={handleResetStream}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: '#F8FAFC',
                color: '#475569',
                fontSize: '13px',
                fontWeight: 600,
                border: '1px solid rgba(15, 23, 42, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = '#F1F5F9'}
              onMouseLeave={(e) => e.target.style.background = '#F8FAFC'}
            >
              <RotateCcw size={14} />
              Reset Stream
            </button>
          </div>

          {/* Camera Selectors */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', marginRight: '4px' }}>
              Feeds:
            </span>
            {cameras.map((cam) => {
              const isSelected = cam.id === activeCamId;
              return (
                <button
                  key={cam.id}
                  onClick={() => handleCameraSelect(cam.id)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: isSelected ? 700 : 500,
                    background: isSelected ? '#132A22' : '#F1F5F9',
                    color: isSelected ? '#FFFFFF' : '#475569',
                    border: '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cam.shortName}
                </button>
              );
            })}

            {/* Night Vision / Filter Mode Toggle */}
            <button
              onClick={() => setNightVisionMode(!nightVisionMode)}
              title={nightVisionMode ? "Switch to Standard Optical" : "Switch to Night-Vision / IR Mode"}
              style={{
                padding: '6px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                background: nightVisionMode ? '#064E3B' : '#F1F5F9',
                color: nightVisionMode ? '#6EE7B7' : '#64748B',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Eye size={14} />
              IR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
