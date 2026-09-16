import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Building2, 
  Radio, 
  Send,
  Eye,
  Shield
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

export default function AdminHeatmap() {
  const { grievances, clusters, metrics } = useApp();
  const [selectedWard, setSelectedWard] = useState('Ward 14 (Rohini Sector 14)');
  const [selectedCluster, setSelectedCluster] = useState(clusters[0]);
  const [broadcastSent, setBroadcastSent] = useState(false);

  const wardStats = [
    { ward: 'Ward 14 (Rohini)', active: 18, critical: 1, resolved: 14, status: 'HIGH_ALERT' },
    { ward: 'Ward 8 (Lajpat Nagar)', active: 7, critical: 0, resolved: 22, status: 'NORMAL' },
    { ward: 'Ward 22 (Mayur Vihar)', active: 11, critical: 0, resolved: 31, status: 'NORMAL' },
    { ward: 'Ward 5 (Kalkaji)', active: 9, critical: 1, resolved: 19, status: 'HIGH_ALERT' },
    { ward: 'Ward 19 (Karol Bagh)', active: 4, critical: 0, resolved: 28, status: 'RESOLVED' }
  ];

  const handleBroadcast = () => {
    setBroadcastSent(true);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } catch(e) {}
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  return (
    <div className="section-spacing" style={{ paddingTop: '28px' }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--color-divider)'
        }}>
          <div>
            <div className="category-pill" style={{ marginBottom: '8px' }}>
              MUNICIPAL COMMAND CENTER • GEOSPATIAL INTELLIGENCE
            </div>
            <h1 style={{ fontSize: '32px', color: 'var(--color-text-primary)' }}>
              Delhi NCR Public Grievance Heatmap & Root-Cause Matrix
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              Real-time clustering across 272 municipal wards with automated root-cause detection.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '9999px', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', fontSize: '12px', fontWeight: 700 }}>
              <span className="status-dot active"></span>
              <span>SCADA & GIS Feed Online</span>
            </div>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div className="card" style={{ padding: '20px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
              Active Macro Clusters
            </span>
            <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', marginTop: '4px' }}>
              {clusters.length}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-accent)' }}>Grouping 36 Individual Cases</span>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
              Cluster Deduplication Rate
            </span>
            <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#059669', marginTop: '4px' }}>
              64.2%
            </div>
            <span style={{ fontSize: '11px', color: '#059669' }}>Eliminated Redundant Dispatches</span>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
              Predicted SLA Breaches
            </span>
            <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#EF4444', marginTop: '4px' }}>
              2 Wards
            </div>
            <span style={{ fontSize: '11px', color: '#EF4444' }}>Ward 14 (DJB) & Ward 5 (BSES)</span>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
              Citizen Satisfaction Index
            </span>
            <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', marginTop: '4px' }}>
              91.6%
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-primary)' }}>Based on 4,200 Verified Reviews</span>
          </div>
        </div>

        {/* Geospatial Map Visualizer & Ward Selection */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px',
          alignItems: 'start',
          marginBottom: '32px'
        }}>
          {/* Map Surface (7 Cols) */}
          <div style={{ gridColumn: 'span 7' }} className="hero-left-col">
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                  Interactive Geospatial Grid (Delhi NCR Zone Map)
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 600 }}>
                  Click Ward Pin to Filter Clusters
                </span>
              </div>

              {/* Graphical Ward Map Simulator */}
              <div style={{
                height: '360px',
                borderRadius: 'var(--radius-md)',
                background: '#0B1914',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Background gridlines */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'radial-gradient(rgba(16, 185, 129, 0.2) 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }} />

                {/* Simulated Ward Zones */}
                {wardStats.map((w, idx) => {
                  const positions = [
                    { top: '25%', left: '30%' }, // Ward 14 Rohini
                    { top: '65%', left: '60%' }, // Ward 8 Lajpat Nagar
                    { top: '45%', left: '75%' }, // Ward 22 Mayur Vihar
                    { top: '75%', left: '45%' }, // Ward 5 Kalkaji
                    { top: '40%', left: '45%' }  // Ward 19 Karol Bagh
                  ];
                  const pos = positions[idx];
                  const isSelected = selectedWard.includes(w.ward.split(' ')[1]);

                  return (
                    <button
                      key={w.ward}
                      onClick={() => setSelectedWard(w.ward)}
                      style={{
                        position: 'absolute',
                        top: pos.top,
                        left: pos.left,
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        zIndex: 10
                      }}
                    >
                      {/* Pulse circle pin */}
                      <div style={{
                        width: isSelected ? '28px' : '22px',
                        height: isSelected ? '28px' : '22px',
                        borderRadius: '50%',
                        background: w.critical > 0 ? '#EF4444' : (w.active > 10 ? '#F59E0B' : '#10B981'),
                        border: '3px solid #FFFFFF',
                        boxShadow: '0 0 16px rgba(16, 185, 129, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        fontSize: '10px',
                        fontWeight: 800,
                        transition: 'all 200ms ease'
                      }}>
                        {w.active}
                      </div>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: isSelected ? '#10B981' : '#F8FAFC',
                        background: 'rgba(11, 25, 20, 0.85)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        {w.ward}
                      </span>
                    </button>
                  );
                })}

                {/* Map legend */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  background: 'rgba(11, 25, 20, 0.9)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '11px',
                  color: '#F8FAFC',
                  display: 'flex',
                  gap: '12px'
                }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} /> Critical Hazard
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }} /> Elevated Cluster
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} /> Normal Resolution
                  </span>
                </div>
              </div>

              {/* Ward breakdown list */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginTop: '16px' }}>
                {wardStats.map((w) => (
                  <button
                    key={w.ward}
                    onClick={() => setSelectedWard(w.ward)}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-sm)',
                      background: selectedWard.includes(w.ward.split(' ')[1]) ? 'var(--color-accent-tint)' : '#F8F9FA',
                      border: selectedWard.includes(w.ward.split(' ')[1]) ? '1px solid var(--color-primary)' : '1px solid var(--color-border-subtle)',
                      textAlign: 'left',
                      transition: 'all 150ms ease'
                    }}
                  >
                    <span style={{ fontSize: '11px', fontWeight: 700, display: 'block', color: 'var(--color-text-primary)' }}>
                      {w.ward}
                    </span>
                    <span style={{ fontSize: '12px', color: w.critical > 0 ? '#EF4444' : 'var(--color-text-secondary)' }}>
                      {w.active} Active Cases
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Root Cause Cluster Inspector (5 Cols) */}
          <div style={{ gridColumn: 'span 5' }} className="hero-right-col">
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-muted)' }}>
                  Active Root-Cause Cluster
                </span>
                <span className="category-pill" style={{ height: '22px', fontSize: '10px' }}>
                  {selectedCluster.clusterCount || 18} Reports Merged
                </span>
              </div>

              <h3 style={{ fontSize: '20px', lineHeight: 1.3, marginBottom: '8px' }}>
                {selectedCluster.title}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: '#FEF2F2', color: '#991B1B' }}>
                  {selectedCluster.severity}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  {selectedCluster.department}
                </span>
              </div>

              {/* Pinpointed Root Cause */}
              <div style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: '#F8F9FA',
                border: '1px solid var(--color-border-subtle)',
                marginBottom: '16px'
              }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', display: 'block', marginBottom: '4px' }}>
                  Identified Root Cause:
                </span>
                <p style={{ fontSize: '13px', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
                  "{selectedCluster.rootCause}"
                </p>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                  Impact Area: <strong>{selectedCluster.impactRadius}</strong>
                </div>
              </div>

              {/* Bulk Citizen Notification Action */}
              <div style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Send style={{ width: '14px', height: '14px', color: '#15803D' }} />
                  <strong style={{ fontSize: '12px', color: '#15803D' }}>
                    Bulk Broadcast to All {selectedCluster.clusterCount || 18} Linked Citizens
                  </strong>
                </div>
                <p style={{ fontSize: '12px', color: '#166534', lineHeight: 1.4, marginBottom: '12px' }}>
                  Sends simultaneous WhatsApp status updates in regional dialects to all households who filed reports in this cluster.
                </p>
                <button
                  type="button"
                  onClick={handleBroadcast}
                  className="btn-primary btn-sm"
                  style={{ width: '100%', background: 'var(--color-primary)' }}
                >
                  Broadcast Emergency Update
                </button>
              </div>

              {broadcastSent && (
                <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: '#ECFDF5', color: '#065F46', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 style={{ width: '14px', height: '14px' }} />
                  <span>Broadcast successfully transmitted to 18 phone numbers via JanSahayk Gateway.</span>
                </div>
              )}
            </div>

            {/* Stage 14: Systemic Root Cause & Proactive Capital Insight */}
            <div className="card" style={{ padding: '24px', background: '#FFFFFF', border: '1px solid #E2E8F0', marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span className="category-pill" style={{ background: '#FEF3C7', color: '#92400E', borderColor: '#FDE68A' }}>
                  SYSTEMIC POLICY INSIGHT (STAGE 14)
                </span>
              </div>
              <h4 style={{ fontSize: '16px', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                Proactive Capital Infrastructure Replacement
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
                Telemetry indicates 4 separate pipeline fractures along Rohini Sector 14's 35-year-old cast-iron conduit in the last 6 months.
              </p>
              <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: '#F8F9FA', border: '1px solid #E2E8F0', fontSize: '12px', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--color-primary)', display: 'block', marginBottom: '4px' }}>
                  Algorithmic Recommendation for Municipal Budget:
                </strong>
                Replace 4.2 km aging Cast-Iron trunk line with high-density polyethylene (HDPE) piping. Estimated Capex: <strong>₹42 Lakhs</strong>. Eliminates estimated recurring emergency excavation losses of <strong>₹18.4 Lakhs/year</strong>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
