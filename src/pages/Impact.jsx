import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Award, 
  ShieldAlert, 
  Users, 
  Clock, 
  ArrowRight,
  FileText
} from 'lucide-react';
import { SYSTEM_METRICS } from '../data/mockGrievances';

export default function Impact() {
  const comparisons = [
    {
      dimension: 'Department Routing',
      legacy: 'Citizen must guess from 60+ departments (58% misrouting rate)',
      jansahayk: 'AI auto-routes via dialect NLP with 94.8% validated accuracy',
      highlight: true
    },
    {
      dimension: 'Duplicate Handling',
      legacy: 'Each caller creates a new isolated ticket (200+ duplicates per water pipe leak)',
      jansahayk: 'Geospatial DBSCAN engine groups all nearby reports into 1 Root-Cause Cluster',
      highlight: true
    },
    {
      dimension: 'Officer Experience',
      legacy: 'Must read unstructured 4-page letters in mixed dialects with missing facts',
      jansahayk: 'Instant 3-Bullet AI Executive Brief + RAG-recommended SOP & required gear',
      highlight: true
    },
    {
      dimension: 'Citizen Feedback Loop',
      legacy: 'Cryptic status: "Under Process / Disposed" with zero context or transparency',
      jansahayk: 'Plain-language SMS & WhatsApp notifications in Hindi/English with named officer',
      highlight: false
    },
    {
      dimension: 'Root Cause Resolution',
      legacy: 'Reactive symptom patching without municipal infrastructure tracking',
      jansahayk: 'Ward-level heatmaps detect recurring systemic hardware defects',
      highlight: false
    }
  ];

  return (
    <div className="section-spacing" style={{ paddingTop: '32px' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header center" style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
            <span className="category-pill">PUBLIC TRANSPARENCY</span>
            <span className="pilot-tag" style={{ background: '#F1F5F9', color: '#475569' }}>
              Prototype Pilot Dataset
            </span>
          </div>
          <h2>Transforming Public Grievance Governance</h2>
          <p>
            Field benchmarks proving how JanSahayak turns everyday citizen grievances into structured evidence, faster municipal resolution, and verified outcomes.
          </p>
        </div>

        {/* Top 3 Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          marginBottom: '56px'
        }}>
          <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
              Avg. Resolution Window
            </span>
            <div style={{ fontSize: '48px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', margin: '8px 0' }}>
              3.2 Days
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              Down from <strong>18.4 Days</strong> baseline on legacy citizen portals.
            </p>
          </div>

          <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
              Duplicate Work Reduction
            </span>
            <div style={{ fontSize: '48px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-accent)', margin: '8px 0' }}>
              64.2%
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              Engineers fix the primary failure point once instead of fielding 50 calls.
            </p>
          </div>

          <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
              Verified Citizen Trust
            </span>
            <div style={{ fontSize: '48px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', margin: '8px 0' }}>
              91.6%
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              Post-repair satisfaction rating across 4,200+ surveyed citizens.
            </p>
          </div>
        </div>

        {/* Detailed Comparison Table (Section 11 & 12 of Product Discovery) */}
        <div className="card" style={{ padding: '36px', marginBottom: '56px' }}>
          <div style={{ marginBottom: '24px' }}>
            <span className="category-pill" style={{ marginBottom: '8px' }}>ARCHITECTURAL COMPARISON</span>
            <h3 style={{ fontSize: '24px' }}>Legacy Portals vs. JanSahayak Platform</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
              A side-by-side analysis of traditional grievance intake systems versus evidence-backed resolution intelligence.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border-medium)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-text-muted)', width: '22%' }}>DIMENSION</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: '#991B1B', width: '39%' }}>TRADITIONAL PORTAL (CPGRAMS / STATE)</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--color-primary)', width: '39%' }}>JANSAHAYAK PLATFORM</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)', background: idx % 2 === 0 ? 'transparent' : '#F8F9FA' }}>
                    <td style={{ padding: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                      {row.dimension}
                    </td>
                    <td style={{ padding: '16px', color: '#7F1D1D', lineHeight: 1.5 }}>
                      <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                        <XCircle style={{ width: '16px', height: '16px', color: '#EF4444', flexShrink: 0, marginTop: '2px' }} />
                        <span>{row.legacy}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--color-text-primary)', lineHeight: 1.5, background: row.highlight ? 'var(--color-accent-tint)' : 'transparent' }}>
                      <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                        <CheckCircle2 style={{ width: '16px', height: '16px', color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                        <strong>{row.jansahayk}</strong>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Featured Case Study: Rohini Sector 14 Water Line Recovery */}
        <div className="inset-dark-container" style={{ padding: '48px 36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <span className="category-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              VERIFIED FIELD STUDY
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-inverse-muted)' }}>
              Resolution Time: 14 Hours • Delhi Jal Board
            </span>
          </div>

          <h3 style={{ fontSize: '26px', color: '#FFFFFF', marginBottom: '14px' }}>
            Rohini Ward 14: Cross-Contamination Pipeline Isolation
          </h3>

          <p style={{ color: 'var(--color-text-inverse-muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px', maxWidth: '720px' }}>
            When a burst 100mm underground valve allowed storm drain water into drinking conduits across Sector 14, 18 separate households submitted complaints in Hinglish. JanSahayak grouped them into Cluster #CL-W14-WATER-03 in 2 minutes, dispatched emergency excavation crews with replacement gaskets, and cleared the biohazard within 14 hours.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/officer/complaints/DL-2026-W14-0892" className="btn-primary btn-sm" style={{ background: 'var(--color-accent)', color: '#0B1914', fontWeight: 700 }}>
              <span>Inspect Live Case Record</span>
              <ArrowRight className="btn-arrow" style={{ width: '14px', height: '14px' }} />
            </Link>
            <Link to="/citizen?fileGrievance=true" className="btn-secondary btn-sm" style={{ background: 'rgba(255,255,255,0.08)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.15)' }}>
              <span>File a New Issue (Popup)</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
