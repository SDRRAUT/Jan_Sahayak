import React from 'react';
import { Network, Droplets, Wrench, Building2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CrossDepartmentMatrix({ crossDeptData, incidentTitle = 'Water Infrastructure Crisis' }) {
  const data = crossDeptData || {
    primaryDepartment: "Delhi Jal Board (DJB)",
    sharedProblemSummary: "A broken underground water pipe is softening the road foundation and causing the street drain to overflow. 3 departments need to work together to fix this completely.",
    departments: [
      {
        dept: "Delhi Jal Board (DJB)",
        cases: 24,
        icon: "Droplets",
        badgeColor: "#0E5E3A",
        impactSummary: "Clean drinking water pressure is weak and dirty water is reaching 650 homes."
      },
      {
        dept: "Public Works Department (PWD)",
        cases: 9,
        icon: "Wrench",
        badgeColor: "#D97706",
        impactSummary: "Road has sunken by 35 cm due to wet soil. Dangerous for two-wheelers and cars."
      },
      {
        dept: "Municipal Corporation of Delhi (MCD)",
        cases: 4,
        icon: "Building2",
        badgeColor: "#7C3AED",
        impactSummary: "Street drain is clogged with mud. Dirty water is pooling near the market."
      }
    ],
    coordinationRecommendation: "Step 1: DJB turns off water pipe at 11:00 AM → Step 2: PWD checks the underground road base before paving → Step 3: MCD unblocks and flushes the drain."
  };

  const getDeptIcon = (iconName) => {
    if (iconName === 'Wrench') return <Wrench style={{ width: '16px', height: '16px' }} />;
    if (iconName === 'Building2') return <Building2 style={{ width: '16px', height: '16px' }} />;
    return <Droplets style={{ width: '16px', height: '16px' }} />;
  };

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border-subtle)',
      padding: '20px',
      boxShadow: 'var(--shadow-card)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Network style={{ width: '18px', height: '18px' }} />
          </div>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em', display: 'block' }}>
              🤝 TEAMS WORKING TOGETHER
            </span>
            <h3 style={{ fontSize: '18px', color: 'var(--color-text-primary)' }}>
              Which Departments Need To Coordinate?
            </h3>
          </div>
        </div>

        <span style={{
          fontSize: '11px',
          fontWeight: 700,
          padding: '3px 10px',
          borderRadius: 'var(--radius-full)',
          background: '#F0FDF4',
          color: '#065F46',
          border: '1px solid #BBF7D0'
        }}>
          3 Departments Linked
        </span>
      </div>

      {/* Central Shared Problem Card */}
      <div style={{
        padding: '14px 16px',
        borderRadius: 'var(--radius-md)',
        background: '#F8FAFC',
        border: '1px solid var(--color-border-subtle)',
        marginBottom: '16px'
      }}>
        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
          Why Multiple Teams Are Needed:
        </span>
        <p style={{ fontSize: '13.5px', color: 'var(--color-text-primary)', fontWeight: 600, lineHeight: 1.4 }}>
          {data.sharedProblemSummary}
        </p>
      </div>

      {/* 3 Department Columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '12px',
        marginBottom: '16px'
      }}>
        {data.departments.map((dept) => (
          <div
            key={dept.dept}
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              background: '#FFFFFF',
              border: '1px solid var(--color-border-subtle)',
              boxShadow: 'var(--shadow-xs)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: dept.badgeColor }}>
                    {getDeptIcon(dept.icon)}
                  </div>
                  <strong style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>
                    {dept.dept.split('(')[0].trim()}
                  </strong>
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: `${dept.badgeColor}15`,
                  color: dept.badgeColor
                }}>
                  {dept.cases} Citizen Reports
                </span>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                {dept.impactSummary}
              </p>
            </div>

            <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--color-divider)', fontSize: '11px', color: 'var(--color-text-muted)' }}>
              Location: <strong>Ward 12 & 14</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended Joint Coordination Protocol */}
      <div style={{
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        background: '#EEF2FF',
        border: '1px solid #C7D2FE',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px'
      }}>
        <CheckCircle2 style={{ width: '16px', height: '16px', color: '#4F46E5', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '12px', color: '#312E81', lineHeight: 1.4 }}>
          <strong>⭐ Suggested Step-by-Step Joint Plan:</strong> {data.coordinationRecommendation}
        </div>
      </div>
    </div>
  );
}
