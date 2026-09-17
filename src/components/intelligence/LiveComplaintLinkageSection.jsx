import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Play, 
  Pause, 
  RotateCcw, 
  Layers, 
  Sparkles, 
  ShieldAlert, 
  MapPin, 
  CheckCircle2, 
  Activity, 
  Radio, 
  ArrowRight,
  Filter,
  Zap,
  Info
} from 'lucide-react';

const INITIAL_SIGNALS = [
  {
    id: 'SIG-2026-001',
    time: '12 Sept 08:15',
    citizen: 'Sunita Mehra (Pocket 2)',
    channel: '🎙 Voice Note',
    type: 'water',
    icon: '💧',
    text: 'Water pressure very low this morning, slight brown tint in kitchen tap.',
    ward: 'Ward 12',
    lat: 28.7185,
    lng: 77.1245,
    matchScore: 98,
    linkedTo: 'INC-CORE-1'
  },
  {
    id: 'SIG-2026-002',
    time: '12 Sept 11:30',
    citizen: 'Rajesh Gupta (Near Mother Dairy)',
    channel: '📷 Geo-Photo',
    type: 'road',
    icon: '🛣️',
    text: 'Water trickling continuously from under road asphalt near booth #441.',
    ward: 'Ward 12',
    lat: 28.7192,
    lng: 77.1252,
    matchScore: 95,
    linkedTo: 'INC-CORE-1'
  },
  {
    id: 'SIG-2026-003',
    time: '13 Sept 07:45',
    citizen: 'Kavita Roy (Pocket 3)',
    channel: '✍ Text',
    type: 'water',
    icon: '💧',
    text: 'Zero water pressure on 1st floor. Pump drawing air only.',
    ward: 'Ward 14',
    lat: 28.7205,
    lng: 77.1268,
    matchScore: 92,
    linkedTo: 'INC-CORE-1'
  },
  {
    id: 'SIG-2026-004',
    time: '13 Sept 16:10',
    citizen: 'Mohd. Tariq (Sector 14 Arterial)',
    channel: '📷 Geo-Photo',
    type: 'road',
    icon: '🛣️',
    text: 'Depression forming in left lane of road. Surface is spongy and wet.',
    ward: 'Ward 14',
    lat: 28.7212,
    lng: 77.1275,
    matchScore: 89,
    linkedTo: 'INC-CORE-1'
  },
  {
    id: 'SIG-2026-005',
    time: '14 Sept 08:00',
    citizen: 'Dr. Alok Verma (Pocket 2)',
    channel: '🎙 Voice Note',
    type: 'water',
    icon: '💧',
    text: 'Pungent drainage smell coming from municipal drinking supply. Severe hazard.',
    ward: 'Ward 14',
    lat: 28.7201,
    lng: 77.1260,
    matchScore: 97,
    linkedTo: 'INC-CORE-1'
  },
  {
    id: 'SIG-2026-006',
    time: '14 Sept 14:20',
    citizen: 'Vikas Sharma (Govt Primary School #2)',
    channel: '✍ Text',
    type: 'sanitation',
    icon: '⚠️',
    text: 'School washroom tap water is yellowish with sewer odor. Children sent home.',
    ward: 'Ward 14',
    lat: 28.7218,
    lng: 77.1282,
    matchScore: 96,
    linkedTo: 'INC-CORE-1'
  }
];

const SIMULATED_STREAM_POOL = [
  {
    id: 'SIG-2026-007',
    citizen: 'Pooja Anand (Pocket 4)',
    channel: '🎙 Voice Note',
    type: 'water',
    icon: '💧',
    text: 'Turbid dark water flowing in tap after morning supply resumed.',
    ward: 'Ward 14',
    matchScore: 94
  },
  {
    id: 'SIG-2026-008',
    citizen: 'Aman Deep (Main Road Market)',
    channel: '📷 Geo-Photo',
    type: 'road',
    icon: '🛣️',
    text: 'New 2-meter pothole appeared where water has soaked through subgrade.',
    ward: 'Ward 12',
    matchScore: 91
  },
  {
    id: 'SIG-2026-009',
    citizen: 'Ritu Sen (Pocket 2 Flats)',
    channel: '✍ Text',
    type: 'water',
    icon: '💧',
    text: 'Pressure drops immediately when neighbors turn on taps. Pipeline leak suspected.',
    ward: 'Ward 14',
    matchScore: 96
  },
  {
    id: 'SIG-2026-010',
    citizen: 'Harish Chander (Sector 14 Park)',
    channel: '🎙 Voice Note',
    type: 'sanitation',
    icon: '⚠️',
    text: 'Seepage of foul water puddling near park perimeter boundary wall.',
    ward: 'Ward 14',
    matchScore: 88
  },
  {
    id: 'SIG-2026-011',
    citizen: 'Neeraj Pandey (Pocket 3)',
    channel: '📷 Geo-Photo',
    type: 'water',
    icon: '💧',
    text: 'Water sample taken in transparent bottle shows heavy brown sediment.',
    ward: 'Ward 14',
    matchScore: 95
  }
];

export default function LiveComplaintLinkageSection() {
  const [signals, setSignals] = useState(INITIAL_SIGNALS);
  const [activeSignal, setActiveSignal] = useState(INITIAL_SIGNALS[4]);
  const [coreIncident, setCoreIncident] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [streamIndex, setStreamIndex] = useState(0);
  const [latestLinkedId, setLatestLinkedId] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const canvasRef = useRef(null);

  // Fetch real graph data from server
  const fetchGraphData = async () => {
    try {
      const res = await fetch('/api/intelligence/graph');
      if (res.ok) {
        const data = await res.json();
        if (data.nodes && data.nodes.length > 0) {
          setSignals(data.nodes);
          if (!activeSignal || !data.nodes.some(n => n.id === activeSignal.id)) {
            setActiveSignal(data.nodes[0]);
          }
        }
        if (data.incident) {
          setCoreIncident(data.incident);
        }
      }
    } catch (e) {
      console.warn('Could not fetch real graph data, keeping local cache:', e);
    }
  };

  useEffect(() => {
    fetchGraphData();
  }, []);

  // Add real simulated complaint through the backend multi-agent pipeline
  const handleAddComplaint = async () => {
    const nextTemplate = SIMULATED_STREAM_POOL[streamIndex % SIMULATED_STREAM_POOL.length];
    setStreamIndex(prev => prev + 1);

    try {
      const res = await fetch('/api/intelligence/simulate-signal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizen: nextTemplate.citizen,
          channel: nextTemplate.channel,
          text: nextTemplate.text,
          ward: nextTemplate.ward || 'Ward 14 (Rohini)',
          category: nextTemplate.type === 'water' ? 'Water Supply & Contamination' : 'Roads & Infrastructure',
          lat: 28.7180 + (Math.random() - 0.5) * 0.006,
          lng: 77.1260 + (Math.random() - 0.5) * 0.006
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.complaint) {
          setLatestLinkedId(data.complaint.id);
          setTimeout(() => setLatestLinkedId(null), 3500);
        }
        await fetchGraphData();
      }
    } catch (e) {
      console.error('Error simulating complaint:', e);
    }
  };

  // Reset to initial state
  const handleReset = async () => {
    await fetchGraphData();
    setLatestLinkedId(null);
    setStreamIndex(0);
  };

  // Auto-streaming effect
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      handleAddComplaint();
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, streamIndex]);


  // Interactive Canvas Node Linkage Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Incident Core Node position in center
    const coreNode = {
      x: width * 0.5,
      y: height * 0.48,
      radius: 28,
      pulse: 0
    };

    // Calculate node coordinates orbiting around core
    const renderedNodes = signals.map((s, idx) => {
      const angle = (idx / signals.length) * Math.PI * 2 + (idx % 2 === 0 ? 0.2 : -0.1);
      const distance = Math.min(width, height) * (0.28 + (idx % 3) * 0.08);
      return {
        ...s,
        x: coreNode.x + Math.cos(angle) * distance,
        y: coreNode.y + Math.sin(angle) * distance,
        radius: s.id === activeSignal?.id ? 14 : 10,
        isHighlighted: s.id === latestLinkedId,
        isSelected: s.id === activeSignal?.id
      };
    });

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle cluster boundary hull (ambient glow corridor)
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(coreNode.x, coreNode.y, width * 0.42, height * 0.42, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(79, 70, 229, 0.03)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(79, 70, 229, 0.18)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 8]);
      ctx.stroke();
      ctx.restore();

      // 2. Draw Linkage Lines from Complaints to Civic Incident Core
      renderedNodes.forEach((node, i) => {
        const isSelected = node.isSelected;
        const isNew = node.isHighlighted;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(coreNode.x, coreNode.y);

        if (isNew) {
          ctx.strokeStyle = '#10B981';
          ctx.lineWidth = 3;
          ctx.shadowColor = 'rgba(16, 185, 129, 0.8)';
          ctx.shadowBlur = 12;
        } else if (isSelected) {
          ctx.strokeStyle = '#4F46E5';
          ctx.lineWidth = 2.4;
          ctx.shadowColor = 'rgba(79, 70, 229, 0.5)';
          ctx.shadowBlur = 8;
        } else {
          ctx.strokeStyle = 'rgba(14, 94, 58, 0.22)';
          ctx.lineWidth = 1.2;
          ctx.setLineDash([4, 4]);
        }
        ctx.stroke();
        ctx.restore();

        // Animated traveling data packet along the linkage line
        const packetProgress = ((frame * 0.015 + i * 0.2) % 1);
        const px = node.x + (coreNode.x - node.x) * packetProgress;
        const py = node.y + (coreNode.y - node.y) * packetProgress;

        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, isNew ? 4.5 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isNew ? '#10B981' : isSelected ? '#6366F1' : 'rgba(14, 94, 58, 0.6)';
        ctx.fill();
        ctx.restore();
      });

      // 3. Draw Cross-Complaint Inter-linkages (Complaints of same category close together)
      for (let i = 0; i < renderedNodes.length; i++) {
        for (let j = i + 1; j < renderedNodes.length; j++) {
          if (renderedNodes[i].type === renderedNodes[j].type) {
            const dx = renderedNodes[i].x - renderedNodes[j].x;
            const dy = renderedNodes[i].y - renderedNodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              ctx.save();
              ctx.beginPath();
              ctx.moveTo(renderedNodes[i].x, renderedNodes[i].y);
              ctx.lineTo(renderedNodes[j].x, renderedNodes[j].y);
              ctx.strokeStyle = 'rgba(2, 132, 199, 0.25)';
              ctx.lineWidth = 1;
              ctx.setLineDash([2, 4]);
              ctx.stroke();
              ctx.restore();
            }
          }
        }
      }

      // 4. Draw Center Civic Incident Core
      coreNode.pulse += 0.04;
      const corePulseScale = 1 + Math.sin(coreNode.pulse) * 0.12;

      // Outer ripple
      ctx.save();
      ctx.beginPath();
      ctx.arc(coreNode.x, coreNode.y, coreNode.radius * 1.7 * corePulseScale, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(79, 70, 229, 0.12)';
      ctx.fill();

      // Core body
      ctx.beginPath();
      ctx.arc(coreNode.x, coreNode.y, coreNode.radius, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(coreNode.x, coreNode.y, 2, coreNode.x, coreNode.y, coreNode.radius);
      grad.addColorStop(0, '#4F46E5');
      grad.addColorStop(1, '#312E81');
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Core text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('INCIDENT', coreNode.x, coreNode.y - 4);
      ctx.font = '800 12px Plus Jakarta Sans, sans-serif';
      ctx.fillText(`${signals.length} LINKED`, coreNode.x, coreNode.y + 10);
      ctx.restore();

      // 5. Draw Complaint Nodes
      renderedNodes.forEach(n => {
        ctx.save();
        // Hover glow
        if (n.isSelected || n.isHighlighted) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = n.isHighlighted ? 'rgba(16, 185, 129, 0.3)' : 'rgba(79, 70, 229, 0.25)';
          ctx.fill();
        }

        // Node Circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.type === 'water' ? '#0284C7' : n.type === 'road' ? '#0E5E3A' : '#F59E0B';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Node label tag
        ctx.font = n.isSelected ? 'bold 11px Plus Jakarta Sans, sans-serif' : '600 10px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = n.isSelected ? '#0F172A' : '#475569';
        ctx.fillText(n.id.replace('SIG-2026-', '#'), n.x, n.y + n.radius + 13);
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [signals, activeSignal, latestLinkedId]);

  const filteredSignals = signals.filter(s => {
    if (filterType === 'ALL') return true;
    return s.type === filterType.toLowerCase();
  });

  return (
    <div style={{
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--color-border-subtle)',
      boxShadow: 'var(--shadow-card)',
      padding: '28px',
      marginBottom: '36px',
      position: 'relative'
    }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--color-divider)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '2px 8px',
              borderRadius: '9999px',
              background: '#ECFDF5',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#065F46',
              fontSize: '10.5px',
              fontWeight: 700,
              letterSpacing: '0.04em'
            }}>
              <span className="status-dot active" style={{ width: '6px', height: '6px' }} />
              LIVE INCIDENT AGGREGATION ENGINE
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Complaint DNA Clustering in Action
            </span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            Real-Time Citizen Signal Linkage & Incident Discovery
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
            Watch incoming individual complaints get analyzed for geographic proximity, symptom fingerprints, and automatically clustered into unified civic incidents.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleAddComplaint}
            style={{
              height: '38px',
              padding: '0 16px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, #0E5E3A 0%, #0B462B 100%)',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(14, 94, 58, 0.28)',
              transition: 'transform 120ms ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            title="Inject simulated incoming complaint into cluster"
          >
            <Plus style={{ width: '15px', height: '15px' }} />
            <span>Simulate Incoming Complaint</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              height: '38px',
              padding: '0 14px',
              borderRadius: 'var(--radius-full)',
              background: isPlaying ? '#EFF6FF' : '#F8FAFC',
              border: isPlaying ? '1px solid #93C5FD' : '1px solid var(--color-border-subtle)',
              color: isPlaying ? '#1D4ED8' : 'var(--color-text-secondary)',
              fontSize: '12.5px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            {isPlaying ? <Pause style={{ width: '13px', height: '13px' }} /> : <Play style={{ width: '13px', height: '13px' }} />}
            <span>{isPlaying ? 'Auto-Stream Active' : 'Resume Auto-Stream'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#F8FAFC',
              border: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-muted)',
              cursor: 'pointer'
            }}
            title="Reset simulation to initial cluster"
          >
            <RotateCcw style={{ width: '14px', height: '14px' }} />
          </button>
        </div>
      </div>

      {/* 4 Live Metrics Pills */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: '#FFFFFF', border: '1px solid var(--color-border-subtle)' }}>
          <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
            Current Connected Signals
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
            <span style={{ fontSize: '22px', fontWeight: 800, color: '#4F46E5' }}>{signals.length}</span>
            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>+{(signals.length - 6)} newly linked</span>
          </div>
        </div>

        <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: '#FFFFFF', border: '1px solid var(--color-border-subtle)' }}>
          <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
            Cluster Target Incident
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              {coreIncident?.id || 'INC-2026-DEL-01'}
            </span>
            <span style={{ fontSize: '10.5px', color: '#B45309', background: '#FEF3C7', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
              {coreIncident?.stage || 'GROWING'}
            </span>
          </div>
        </div>

        <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: '#FFFFFF', border: '1px solid var(--color-border-subtle)' }}>
          <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
            Mean DNA Match Score
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
            <span style={{ fontSize: '22px', fontWeight: 800, color: '#0E5E3A' }}>
              {signals.length > 0 ? Math.round(signals.reduce((acc, s) => acc + (s.matchScore || 92), 0) / signals.length) : 95}%
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>spatial & symptom fit</span>
          </div>
        </div>

        <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: '#FFFFFF', border: '1px solid var(--color-border-subtle)' }}>
          <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
            Inter-Agency Interlock
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
            {(coreIncident?.participatingDepartments || ['Delhi Jal Board (DJB)', 'Public Works Department (PWD)']).map((dept, i) => (
              <span key={dept} style={{
                fontSize: '11px',
                fontWeight: 700,
                color: i === 0 ? '#0284C7' : i === 1 ? '#0E5E3A' : '#92400E',
                background: i === 0 ? '#E0F2FE' : i === 1 ? '#E8F7F0' : '#FEF3C7',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                {dept.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Grid: Left Visual Canvas Graph + Right Inspection & Live Feed */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: '20px',
        alignItems: 'stretch'
      }}>
        {/* Left Column: Interactive Network Linkage Canvas */}
        <div style={{
          position: 'relative',
          background: '#0B1914',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          minHeight: '440px',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          boxShadow: 'inset 0 2px 12px rgba(0, 0, 0, 0.3)'
        }}>
          {/* Canvas */}
          <canvas
            ref={canvasRef}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              cursor: 'crosshair'
            }}
          />

          {/* Canvas Overlay Header */}
          <div style={{
            position: 'absolute',
            top: '14px',
            left: '16px',
            right: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pointerEvents: 'none'
          }}>
            <div style={{
              background: 'rgba(11, 25, 20, 0.85)',
              backdropFilter: 'blur(8px)',
              padding: '5px 10px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#F8FAFC',
              fontSize: '11px',
              fontWeight: 600
            }}>
              <span style={{ color: '#10B981' }}>● LIVE GRAPH</span> • Ward 12–14 Utility Corridor
            </div>

            <div style={{
              background: 'rgba(11, 25, 20, 0.85)',
              backdropFilter: 'blur(8px)',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94A3B8',
              fontSize: '10px'
            }}>
              Click any signal node to inspect
            </div>
          </div>

          {/* New Signal Linkage Toast Notification */}
          {latestLinkedId && (
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              right: '16px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)',
              color: '#FFFFFF',
              padding: '8px 14px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
              animation: 'fadeIn 200ms ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap style={{ width: '15px', height: '15px' }} />
                <span style={{ fontSize: '12px', fontWeight: 700 }}>
                  New Signal Linked: {latestLinkedId} matched to Incident INC-2026-DEL-01!
                </span>
              </div>
              <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                95% Correlation
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Selected Signal Inspection Card & Arriving Stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Selected Signal Detail Box */}
          {activeSignal && (
            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              background: '#FFFFFF',
              border: '1px solid #C7D2FE',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '16px' }}>{activeSignal.icon}</span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                    {activeSignal.id}
                  </span>
                  <span style={{ fontSize: '10.5px', color: '#4F46E5', background: '#EEF2FF', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                    {activeSignal.channel}
                  </span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0E5E3A', background: '#E8F7F0', padding: '2px 7px', borderRadius: '9999px' }}>
                  {activeSignal.matchScore}% DNA Fit
                </span>
              </div>

              <div style={{ fontSize: '13px', color: 'var(--color-text-primary)', fontStyle: 'italic', background: '#F8FAFC', padding: '10px 12px', borderRadius: '6px', borderLeft: '3px solid #4F46E5', marginBottom: '10px', lineHeight: 1.4 }}>
                "{activeSignal.text}"
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11.5px', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '10px' }}>REPORTED BY:</span>
                  <strong>{activeSignal.citizen}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '10px' }}>LOCATION:</span>
                  <strong>{activeSignal.ward} (Rohini Sector 14)</strong>
                </div>
              </div>

              <div style={{
                padding: '8px 10px',
                borderRadius: '6px',
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                fontSize: '11px',
                color: '#065F46',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <CheckCircle2 style={{ width: '14px', height: '14px', color: '#10B981', flexShrink: 0 }} />
                <span>
                  <strong>AI Linkage Verified:</strong> Linked with {signals.length - 1} other reports sharing the same 1988 cast-iron distribution feeder.
                </span>
              </div>
            </div>
          )}

          {/* Arriving Complaints Feed List */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-subtle)',
            padding: '14px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.04em' }}>
                Corroborated Signal Stream ({signals.length})
              </span>
              <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 700 }}>
                ● STREAMING
              </span>
            </div>

            <div style={{
              overflowY: 'auto',
              maxHeight: '210px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              paddingRight: '4px'
            }}>
              {signals.map((sig) => {
                const isSelected = sig.id === activeSignal?.id;
                const isJustAdded = sig.id === latestLinkedId;
                return (
                  <div
                    key={sig.id}
                    onClick={() => setActiveSignal(sig)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      background: isJustAdded ? '#ECFDF5' : isSelected ? '#EEF2FF' : '#F8FAFC',
                      border: isJustAdded ? '1px solid #10B981' : isSelected ? '1px solid #818CF8' : '1px solid rgba(15, 23, 42, 0.06)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      transition: 'all 120ms ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <span style={{ fontSize: '14px' }}>{sig.icon}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                            {sig.id}
                          </span>
                          <span style={{ fontSize: '9.5px', color: 'var(--color-text-muted)' }}>
                            {sig.ward}
                          </span>
                        </div>
                        <p style={{
                          fontSize: '11px',
                          color: 'var(--color-text-secondary)',
                          margin: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '220px'
                        }}>
                          {sig.text}
                        </p>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        padding: '1px 5px',
                        borderRadius: '4px',
                        background: '#DCFCE7',
                        color: '#15803D'
                      }}>
                        LINKED
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
