import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Cpu, 
  Sparkles, 
  Layers, 
  Database, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Code, 
  Activity, 
  CheckCircle2 
} from 'lucide-react';
import { analyzeGrievanceInput } from '../services/aiEngine';
import GrievanceDnaCard from '../components/common/GrievanceDnaCard';
import IntelligenceLoop from '../components/common/IntelligenceLoop';

export default function Platform() {
  const [testText, setTestText] = useState('Bhai pichle 3 din se hamare Sector 14, Pocket 2 mein naali ka ganda badbudaar paani supply mein mix hoke aa raha hai. Bacche bimaar pad rahe hain please jaldi theek karwao.');
  const [analysisResult, setAnalysisResult] = useState(() => analyzeGrievanceInput(testText));

  const handleAnalyze = () => {
    const res = analyzeGrievanceInput(testText);
    setAnalysisResult(res);
  };

  return (
    <div className="section-spacing" style={{ paddingTop: '32px' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header center" style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
            <span className="category-pill">PLATFORM ARCHITECTURE</span>
            <span className="pilot-tag" style={{ background: '#F1F5F9', color: '#475569' }}>
              Prototype Environment
            </span>
          </div>
          <h2>Civic Intelligence Architecture</h2>
          <p>
            An inside look at how JanSahayak processes everyday citizen voices, connects spatial evidence, and suggests resolution paths for municipal officers.
          </p>
        </div>

        {/* The 4 Architectural Layers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '56px'
        }}>
          <div className="card" style={{ padding: '24px' }}>
            <div className="icon-squircle" style={{ marginBottom: '16px' }}>
              <Zap style={{ width: '22px', height: '22px' }} />
            </div>
            <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>1. Multilingual Audio Engine</h4>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Acoustic speech-to-text models trained on 22 Indian languages and mixed colloquial Hinglish, handling phoneme variations across rural and urban accents.
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div className="icon-squircle" style={{ marginBottom: '16px' }}>
              <Cpu style={{ width: '22px', height: '22px' }} />
            </div>
            <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>2. Grievance DNA™ Synthesizer</h4>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Extracts spatial landmarks, physical assets (e.g. 100mm cast-iron valve), severity level, and public health risk flags in sub-200ms.
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div className="icon-squircle" style={{ marginBottom: '16px' }}>
              <Layers style={{ width: '22px', height: '22px' }} />
            </div>
            <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>3. DBSCAN Geospatial Clustering</h4>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Spatial density-based clustering algorithm groups nearby temporal micro-complaints into actionable macro infrastructure anomalies.
            </p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div className="icon-squircle" style={{ marginBottom: '16px' }}>
              <Database style={{ width: '22px', height: '22px' }} />
            </div>
            <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>4. RAG Precedent Retrieval</h4>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Vector similarity search across historical municipal resolutions matching standard operating procedures (SOPs) and required field equipment.
            </p>
          </div>
        </div>

        {/* The 14-Stage Closed Intelligence Loop */}
        <div style={{ marginBottom: '56px' }}>
          <IntelligenceLoop />
        </div>

        {/* Live Interactive AI Pipeline Sandbox */}
        <div className="inset-dark-container" style={{ marginBottom: '56px' }}>
          <div style={{ marginBottom: '24px' }}>
            <span className="category-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              INTERACTIVE SANDBOX
            </span>
            <h3 style={{ fontSize: '28px', color: '#FFFFFF', marginTop: '10px' }}>
              Live Grievance DNA™ Playground
            </h3>
            <p style={{ color: 'var(--color-text-inverse-muted)', fontSize: '14px', marginTop: '4px' }}>
              Test any custom raw input (Hindi, Hinglish, English) to see how the system structures intelligence.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '24px',
            alignItems: 'start'
          }}>
            {/* Input Side (6 cols) */}
            <div style={{ gridColumn: 'span 6' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-inverse-muted)', marginBottom: '8px' }}>
                Raw Citizen Submission:
              </label>
              <textarea
                rows={5}
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                style={{
                  width: '100%',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface-inset-card)',
                  color: '#FFFFFF',
                  border: '1px solid var(--color-border-dark)',
                  padding: '14px',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  resize: 'vertical'
                }}
              />
              <div style={{ marginTop: '12px', display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  className="btn-primary btn-sm"
                  style={{ background: 'var(--color-accent)', color: '#0B1914', fontWeight: 700 }}
                >
                  <span>Analyze Understanding</span>
                  <ArrowRight className="btn-arrow" style={{ width: '14px', height: '14px' }} />
                </button>
              </div>
            </div>

            {/* Output Side (6 cols) */}
            <div style={{ gridColumn: 'span 6' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-accent)', marginBottom: '8px' }}>
                Generated Grievance DNA™ Object:
              </label>
              <GrievanceDnaCard dna={analysisResult} isDark={true} compact={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
