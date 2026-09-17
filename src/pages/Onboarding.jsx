import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import OnboardingFlow from '../components/onboarding/OnboardingFlow';

export default function Onboarding() {
  return (
    <div className="section-spacing" style={{ paddingTop: '28px', paddingBottom: '64px', minHeight: 'calc(100vh - 72px)', background: 'var(--color-bg-base)' }}>
      <div className="container">
        {/* Top return link & header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Link to="/overview" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 600, textDecoration: 'none' }}>
            <ArrowLeft style={{ width: '15px', height: '15px' }} />
            <span>View Public Platform Overview</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="category-pill" style={{ background: '#E8F7F0', color: '#0E5E3A', borderColor: 'rgba(14, 94, 58, 0.2)' }}>
              <Sparkles style={{ width: '12px', height: '12px' }} />
              <span>INTERACTIVE PRODUCT TOUR</span>
            </span>
          </div>
        </div>

        {/* The 4-Step Interactive Onboarding Flow */}
        <OnboardingFlow />
      </div>
    </div>
  );
}
