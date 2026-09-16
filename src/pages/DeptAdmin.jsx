import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  BarChart3, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Search,
  Download,
  Star,
  MapPin,
  TrendingUp,
  AlertCircle,
  Plus,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function DeptAdmin() {
  const { user, grievances, clusters } = useApp();
  const [selectedTab, setSelectedTab] = useState('overview'); // 'overview' | 'trends' | 'feedback' | 'disputes' | 'users'
  const [reportExported, setReportExported] = useState(false);
  const [showAddOfficerModal, setShowAddOfficerModal] = useState(false);

  const deptName = user?.department || 'Delhi Jal Board (DJB)';
  const deptGrievances = grievances.filter(g => !user?.department || g.department === deptName || g.department.includes('Delhi Jal Board'));
  const criticalCases = deptGrievances.filter(g => g.urgency === 'CRITICAL' && g.status !== 'RESOLVED');
  const disputes = deptGrievances.filter(g => g.status === 'DISPUTE_REOPENED');

  const [officerRoster, setOfficerRoster] = useState([
    { name: 'Er. Sanjay Sharma', designation: 'AEE (Rohini Zone)', activeCases: 4, resolvedThisMonth: 38, avgResolutionHours: '14.2h', rating: 4.8, status: 'ON_DUTY' },
    { name: 'Er. Vivek Nambiar', designation: 'AEE (Civil Lines)', activeCases: 6, resolvedThisMonth: 44, avgResolutionHours: '18.1h', rating: 4.6, status: 'ON_DUTY' },
    { name: 'Er. Meenakshi Roy', designation: 'AEE (South Zone)', activeCases: 3, resolvedThisMonth: 52, avgResolutionHours: '12.4h', rating: 4.9, status: 'ON_DUTY' },
    { name: 'Er. Tariq Ahmad', designation: 'AEE (East Zone)', activeCases: 5, resolvedThisMonth: 31, avgResolutionHours: '19.5h', rating: 4.4, status: 'FIELD_INSPECTION' }
  ]);

  const [newOfficerName, setNewOfficerName] = useState('');
  const [newOfficerZone, setNewOfficerZone] = useState('');

  // Category trends data
  const categoryBreakdown = [
    { category: 'Drinking Water Contamination', count: 48, percentage: 42, slaTrend: '+4.2% faster' },
    { category: 'Main Pipeline Fracture / Burst', count: 32, percentage: 28, slaTrend: '+8.1% faster' },
    { category: 'Low Pressure in Supply Lines', count: 21, percentage: 18, slaTrend: 'On target' },
    { category: 'Billing / Meter Malfunction', count: 14, percentage: 12, slaTrend: '-2.1% delay' }
  ];

  // Recurring hotspots data
  const recurringHotspots = [
    { ward: 'Ward 14 (Rohini Sector 14)', issues: 18, primaryCause: '1988 Cast-Iron Supply Main degraded; capex replacement recommended', riskLevel: 'HIGH' },
    { ward: 'Ward 8 (Lajpat Nagar Ring Road)', issues: 9, primaryCause: 'Monsoon drainage backflow into secondary feeder', riskLevel: 'MEDIUM' },
    { ward: 'Ward 22 (Mayur Vihar Ph-1)', issues: 7, primaryCause: 'Commercial unauthorized suction pumps creating negative pressure', riskLevel: 'MEDIUM' }
  ];

  // Citizen feedback records
  const feedbackRecords = [
    { citizen: 'Aditya Verma', ward: 'Ward 14', rating: 5, comment: 'Quick emergency clamp response within 4 hours. Water chlorine test verified before restoring flow.', date: 'Today' },
    { citizen: 'Pooja Malhotra', ward: 'Ward 8', rating: 5, comment: 'Officer Sanjay Sharma called personally on WhatsApp with progress photos. Very transparent.', date: 'Yesterday' },
    { citizen: 'Harish Bansal', ward: 'Ward 14', rating: 4, comment: 'Repaired the leak fast, but trench filling on the road took an extra day.', date: '2 days ago' }
  ];

  // Dynamic citizen feedback from live grievances combined with baseline
  const realFeedbacks = deptGrievances
    .filter(g => g.citizenFeedback && g.citizenFeedback.rating)
    .map(g => ({
      citizen: g.citizenName || 'Citizen',
      ward: g.location?.ward || 'Municipal Ward',
      rating: Number(g.citizenFeedback.rating) || 5,
      comment: g.citizenFeedback.comment,
      date: g.citizenFeedback.submittedAt || 'Today'
    }));

  const allFeedbacks = [...realFeedbacks, ...feedbackRecords];
  const avgCitizenRating = (allFeedbacks.reduce((acc, f) => acc + f.rating, 0) / allFeedbacks.length).toFixed(1);
  const totalRatingCount = 142 + realFeedbacks.length;

  const handleExportReport = () => {
    setReportExported(true);
    setTimeout(() => setReportExported(false), 3000);
  };

  const handleAddOfficerSubmit = (e) => {
    e.preventDefault();
    if (!newOfficerName.trim()) return;
    setOfficerRoster(prev => [
      ...prev,
      {
        name: newOfficerName,
        designation: `AEE (${newOfficerZone || 'Central Zone'})`,
        activeCases: 0,
        resolvedThisMonth: 0,
        avgResolutionHours: '16.0h',
        rating: 5.0,
        status: 'ON_DUTY'
      }
    ]);
    setNewOfficerName('');
    setNewOfficerZone('');
    setShowAddOfficerModal(false);
  };

  const toggleOfficerStatus = (idx) => {
    setOfficerRoster(prev => prev.map((off, i) => {
      if (i === idx) {
        return {
          ...off,
          status: off.status === 'ON_DUTY' ? 'FIELD_INSPECTION' : 'ON_DUTY'
        };
      }
      return off;
    }));
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
              DEPARTMENT ADMINISTRATOR CONSOLE
            </div>
            <h1 style={{ fontSize: '32px', color: 'var(--color-text-primary)' }}>
              {deptName}
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              Logged in as: <strong>{user?.name || 'Er. Rajiv Malhotra'}</strong> ({user?.designation || 'Chief Engineer & Dept Admin'})
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleExportReport}
              className="btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Download style={{ width: '14px', height: '14px' }} />
              <span>{reportExported ? 'Report Downloaded ✓' : 'Export Municipal Report (PDF/CSV)'}</span>
            </button>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#059669', background: '#ECFDF5', padding: '6px 14px', borderRadius: '9999px', border: '1px solid #A7F3D0' }}>
              ● 94.8% SLA Compliance
            </span>
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
              Department Active Queue
            </span>
            <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', marginTop: '4px' }}>
              {deptGrievances.length}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Distributed across 4 sub-divisions</span>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
              Critical Hazard Cases
            </span>
            <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#EF4444', marginTop: '4px' }}>
              {criticalCases.length}
            </div>
            <span style={{ fontSize: '11px', color: '#EF4444' }}>Biological / Contamination priority</span>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
              Citizen Satisfaction Score
            </span>
            <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#F59E0B', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {avgCitizenRating} <Star style={{ width: '24px', height: '24px', fill: '#F59E0B', color: '#F59E0B' }} />
            </div>
            <span style={{ fontSize: '11px', color: '#059669' }}>Based on {totalRatingCount} verified citizen ratings</span>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
              Disputed Reopened Cases
            </span>
            <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#D97706', marginTop: '4px' }}>
              {disputes.length}
            </div>
            <span style={{ fontSize: '11px', color: '#D97706' }}>Requires Chief Engineer review</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--color-divider)', paddingBottom: '12px', flexWrap: 'wrap' }}>
          {[
            { id: 'overview', label: 'Officer Workload & Roster' },
            { id: 'trends', label: 'Category & Geographic Trends' },
            { id: 'feedback', label: 'Citizen Feedback & Quality' },
            { id: 'disputes', label: `Disputes & Reopened Audit (${disputes.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              style={{
                padding: '7px 18px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 600,
                background: selectedTab === tab.id ? 'var(--color-primary)' : '#F1F5F9',
                color: selectedTab === tab.id ? '#FFFFFF' : 'var(--color-text-secondary)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Officer Workload Table */}
        {selectedTab === 'overview' && (
          <div className="card" style={{ padding: '28px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px' }}>
                Sub-Divisional Officer Workload & Shift Allocation
              </h3>
              <button
                type="button"
                onClick={() => setShowAddOfficerModal(true)}
                className="btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus style={{ width: '14px', height: '14px' }} />
                <span>Add Officer to Roster</span>
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border-medium)' }}>
                    <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>OFFICER</th>
                    <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>JURISDICTION</th>
                    <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>ACTIVE CASES</th>
                    <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>RESOLVED (MTD)</th>
                    <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>AVG SPEED</th>
                    <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>SATISFACTION</th>
                    <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>SHIFT STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {officerRoster.map((off, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <td style={{ padding: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {off.name}
                      </td>
                      <td style={{ padding: '14px', color: 'var(--color-text-secondary)' }}>
                        {off.designation}
                      </td>
                      <td style={{ padding: '14px', fontWeight: 700, color: off.activeCases > 5 ? '#EF4444' : 'var(--color-text-primary)' }}>
                        {off.activeCases} Cases
                      </td>
                      <td style={{ padding: '14px', color: 'var(--color-text-primary)' }}>
                        {off.resolvedThisMonth}
                      </td>
                      <td style={{ padding: '14px', fontFamily: 'var(--font-mono)', color: '#059669', fontWeight: 600 }}>
                        {off.avgResolutionHours}
                      </td>
                      <td style={{ padding: '14px', fontWeight: 600, color: '#D97706' }}>
                        ★ {off.rating}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <button
                          type="button"
                          onClick={() => toggleOfficerStatus(i)}
                          style={{
                            fontSize: '11px',
                            padding: '4px 10px',
                            borderRadius: '9999px',
                            background: off.status === 'ON_DUTY' ? '#ECFDF5' : '#FFFBEB',
                            color: off.status === 'ON_DUTY' ? '#065F46' : '#92400E',
                            border: '1px solid rgba(15,23,42,0.08)',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          ● {off.status} (Toggle)
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Category & Geographic Trends */}
        {selectedTab === 'trends' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            
            {/* Category Breakdown */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <TrendingUp style={{ width: '18px', height: '18px', color: 'var(--color-primary)' }} />
                <h3 style={{ fontSize: '16px' }}>Category Volume & SLA Trend</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {categoryBreakdown.map((cat, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <strong>{cat.category}</strong>
                      <span style={{ color: 'var(--color-text-muted)' }}>{cat.count} cases ({cat.percentage}%)</span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div style={{ height: '8px', borderRadius: '4px', background: '#F1F5F9', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${cat.percentage}%`, background: 'var(--color-primary)', borderRadius: '4px' }} />
                    </div>
                    <span style={{ fontSize: '11px', color: '#059669', display: 'block', marginTop: '2px' }}>
                      SLA Performance: {cat.slaTrend}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recurring Geographic Hotspots */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <MapPin style={{ width: '18px', height: '18px', color: '#EF4444' }} />
                <h3 style={{ fontSize: '16px' }}>Recurring Geographic Hotspots (DBSCAN)</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recurringHotspots.map((hot, i) => (
                  <div key={i} style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: '#FFFDF5', border: '1px solid #FDE68A' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '13px', color: '#92400E' }}>{hot.ward}</strong>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#B45309' }}>{hot.issues} Corroborating Cases</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#78350F', margin: 0 }}>
                      <strong>Root Cause: </strong>{hot.primaryCause}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: Citizen Feedback & Quality */}
        {selectedTab === 'feedback' && (
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px' }}>Citizen Satisfaction & Field Quality Audits</h3>
              <span style={{ fontSize: '12px', color: '#059669', fontWeight: 700 }}>96.2% Favorable Feedback</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {allFeedbacks.map((f, i) => (
                <div key={i} style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: '#F8F9FA', border: '1px solid var(--color-border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong>{f.citizen}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>({f.ward})</span>
                      <span style={{ fontSize: '12px', color: '#D97706', fontWeight: 700 }}>
                        {'★'.repeat(f.rating)} ({f.rating}/5)
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{f.date}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-primary)', margin: 0, fontStyle: 'italic' }}>
                    "{f.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Reopened Citizen Disputes */}
        {selectedTab === 'disputes' && (
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>
              Citizen Disputed Closures Requiring Supervisory Adjudication
            </h3>
            {disputes.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                Zero active disputes in this department. All verified resolutions accepted by citizens.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {disputes.map(d => (
                  <div key={d.id} style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '14px', color: '#92400E' }}>Case #{d.id}: {d.title}</strong>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#B45309' }}>SUPERVISORY ESCALATION</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#78350F', marginBottom: '8px' }}>
                      <strong>Citizen Dispute Reason: </strong> "{d.reopenedDispute?.citizenReason || 'Resolved status contested.'}"
                    </p>
                    <div style={{ fontSize: '12px', color: '#92400E' }}>
                      Assigned Officer: <strong>{d.officerName}</strong> • Ward: {d.location.ward}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADD OFFICER MODAL */}
        {showAddOfficerModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 25, 20, 0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <form onSubmit={handleAddOfficerSubmit} className="card" style={{ maxWidth: '440px', width: '100%', padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px' }}>Add Field Officer to Department</h3>
                <button type="button" onClick={() => setShowAddOfficerModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                  <X style={{ width: '18px', height: '18px' }} />
                </button>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  Officer Full Name:
                </label>
                <input
                  type="text"
                  value={newOfficerName}
                  onChange={(e) => setNewOfficerName(e.target.value)}
                  placeholder="e.g. Er. Aarti Sharma"
                  style={{ width: '100%', height: '38px', borderRadius: '4px', border: '1px solid var(--color-border-medium)', padding: '0 8px', fontSize: '13px' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  Zone / Jurisdiction:
                </label>
                <input
                  type="text"
                  value={newOfficerZone}
                  onChange={(e) => setNewOfficerZone(e.target.value)}
                  placeholder="e.g. West Delhi Sub-Division 4"
                  style={{ width: '100%', height: '38px', borderRadius: '4px', border: '1px solid var(--color-border-medium)', padding: '0 8px', fontSize: '13px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowAddOfficerModal(false)} className="btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn-primary btn-sm">Add Officer</button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
