import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  Users, 
  Sliders, 
  FileText, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Cpu,
  Settings,
  X,
  RefreshCw,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function SuperAdmin() {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState('audit'); // 'audit' | 'departments' | 'users' | 'categories' | 'sla' | 'ai_config'

  // Departments State
  const [departments, setDepartments] = useState([
    { code: 'DJB', name: 'Delhi Jal Board (DJB)', officers: 280, activeCases: 142, sla: '94.8%', head: 'Er. Rajiv Malhotra', active: true },
    { code: 'PWD', name: 'Public Works Department (PWD)', officers: 340, activeCases: 189, sla: '88.2%', head: 'Er. Rajesh K. Meena', active: true },
    { code: 'MCD', name: 'Municipal Corporation of Delhi (MCD)', officers: 520, activeCases: 310, sla: '91.4%', head: 'Dr. K. S. Tyagi', active: true },
    { code: 'BSES', name: 'BSES Rajdhani Power Limited', officers: 190, activeCases: 64, sla: '99.1%', head: 'Er. Neeraj Bansal', active: true }
  ]);

  // Users State
  const [usersList, setUsersList] = useState([
    { id: 'USR-CITIZEN-01', name: 'Aditya Verma', email: 'aditya@citizen.in', role: 'citizen', status: 'Active', ward: 'Ward 14 (Rohini)' },
    { id: 'USR-OFFICER-01', name: 'Er. Sanjay Sharma', email: 'sanjay.sharma@djb.gov.in', role: 'officer', status: 'Active', department: 'DJB' },
    { id: 'USR-DEPTADMIN-01', name: 'Er. Rajiv Malhotra', email: 'admin.djb@delhi.gov.in', role: 'dept_admin', status: 'Active', department: 'DJB' },
    { id: 'USR-SUPERADMIN-01', name: 'Dr. Meenakshi Sundaram, IAS', email: 'superadmin@delhi.gov.in', role: 'super_admin', status: 'Active', department: 'Govt of NCT Delhi' }
  ]);

  // Categories & Grievance Types
  const [categories, setCategories] = useState([
    { id: 'CAT-01', name: 'Water Supply & Contamination', department: 'DJB', priority: 'CRITICAL', typesCount: 6 },
    { id: 'CAT-02', name: 'Roads & Infrastructure', department: 'PWD', priority: 'HIGH', typesCount: 8 },
    { id: 'CAT-03', name: 'Sanitation & Solid Waste', department: 'MCD', priority: 'HIGH', typesCount: 5 },
    { id: 'CAT-04', name: 'Electricity & Power Grid', department: 'BSES', priority: 'CRITICAL', typesCount: 4 }
  ]);

  // SLA Rules State
  const [slaRules, setSlaRules] = useState([
    { category: 'Water Supply & Contamination', criticalHours: 12, highHours: 24, normalHours: 48, escalationTarget: 'Chief Engineer (DJB)' },
    { category: 'Roads & Infrastructure', criticalHours: 6, highHours: 24, normalHours: 72, escalationTarget: 'Superintending Engineer (PWD)' },
    { category: 'Sanitation & Solid Waste', criticalHours: 12, highHours: 24, normalHours: 48, escalationTarget: 'Chief Sanitary Inspector (MCD)' },
    { category: 'Electricity & Power Grid', criticalHours: 2, highHours: 6, normalHours: 24, escalationTarget: 'Grid Safety Director (BSES)' }
  ]);

  // AI & System Configuration State
  const [aiConfig, setAiConfig] = useState({
    confidenceThreshold: 90,
    clusterRadiusMeters: 500,
    multilingualAutoTranslate: true,
    dpdpCryptographicChain: true,
    emergencyBroadcastLock: false
  });

  // Audit Logs
  const auditLogs = [
    { id: 'LOG-8841', timestamp: '2026-09-16 09:31 AM', actor: 'System AI Engine', action: 'GRIEVANCE_TRIAGED', target: 'DL-2026-W14-0892', details: 'Autoclassified as Critical Biological Hazard, routed to DJB' },
    { id: 'LOG-8842', timestamp: '2026-09-16 10:15 AM', actor: 'Er. Sanjay Sharma', action: 'DISPATCH_APPROVED', target: 'DL-2026-W14-0892', details: 'Emergency repair clamp squad DL-441 mobilized to Mother Dairy junction' },
    { id: 'LOG-8843', timestamp: '2026-09-16 11:21 AM', actor: 'System Vision AI', action: 'MEDIA_CLASSIFIED', target: 'DL-2026-W08-0419', details: 'Cavity detected on arterial road; depth ~40cm; severity 88%' },
    { id: 'LOG-8844', timestamp: '2026-09-16 01:12 PM', actor: 'System SCADA Gateway', action: 'AUTO_SIGNAL_TRIP', target: 'DL-2026-W05-0298', details: 'Automated arc hazard notification sent to Kalkaji 11kV Feeder Control' }
  ];

  // Modals
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptHead, setNewDeptHead] = useState('');

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('officer');

  const handleAddDept = (e) => {
    e.preventDefault();
    if (!newDeptCode.trim() || !newDeptName.trim()) return;
    setDepartments(prev => [
      ...prev,
      {
        code: newDeptCode.toUpperCase(),
        name: newDeptName,
        head: newDeptHead || 'Officer In-Charge',
        officers: 50,
        activeCases: 0,
        sla: '100%',
        active: true
      }
    ]);
    setNewDeptCode('');
    setNewDeptName('');
    setNewDeptHead('');
    setShowAddDeptModal(false);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUserEmail.trim() || !newUserName.trim()) return;
    setUsersList(prev => [
      ...prev,
      {
        id: `USR-${Date.now()}`,
        name: newUserName,
        email: newUserEmail,
        role: newUserRole,
        status: 'Active',
        department: newUserRole !== 'citizen' ? 'Delhi Jal Board (DJB)' : 'Public'
      }
    ]);
    setNewUserName('');
    setNewUserEmail('');
    setShowAddUserModal(false);
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
              SUPER ADMIN SECURITY CONSOLE
            </div>
            <h1 style={{ fontSize: '32px', color: 'var(--color-text-primary)' }}>
              National & Municipal Governance Control
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              Logged in as: <strong>{user?.name || 'Dr. Meenakshi Sundaram, IAS'}</strong> ({user?.designation || 'Principal Secretary - IT & Grievances'})
            </p>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '9999px', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', fontSize: '12px', fontWeight: 700 }}>
            <ShieldCheck style={{ width: '15px', height: '15px' }} />
            <span>DPDP Act & Cert-In Cryptographic Log Active</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--color-divider)', paddingBottom: '12px', flexWrap: 'wrap' }}>
          {[
            { id: 'audit', label: 'Cryptographic Audit Logs' },
            { id: 'departments', label: `Departments (${departments.length})` },
            { id: 'users', label: `Users & Roles (${usersList.length})` },
            { id: 'categories', label: `Categories (${categories.length})` },
            { id: 'sla', label: 'Dynamic SLA Rules' },
            { id: 'ai_config', label: 'AI Engine & System Config' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '7px 18px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 600,
                background: activeTab === tab.id ? 'var(--color-primary)' : '#F1F5F9',
                color: activeTab === tab.id ? '#FFFFFF' : 'var(--color-text-secondary)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Cryptographic Audit Logs */}
        {activeTab === 'audit' && (
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px' }}>Verifiable Platform-Wide Audit Trail</h3>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>SHA-256 Tamper-Proof Chain</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    background: '#F8F9FA',
                    border: '1px solid var(--color-border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="font-mono-numbers" style={{ fontSize: '11px', fontWeight: 700, background: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--color-border-subtle)' }}>
                      {log.id}
                    </span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>{log.action}</strong>
                        <span style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600 }}>Target: {log.target}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                        {log.details}
                      </p>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{log.actor}</span>
                    <span className="font-mono-numbers" style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Departments Management */}
        {activeTab === 'departments' && (
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px' }}>Connected Municipal Departments</h3>
              <button
                type="button"
                onClick={() => setShowAddDeptModal(true)}
                className="btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus style={{ width: '14px', height: '14px' }} />
                <span>Register Department</span>
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border-medium)' }}>
                    <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>CODE</th>
                    <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>DEPARTMENT NAME</th>
                    <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>HEAD OF DEPT</th>
                    <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>ACTIVE OFFICERS</th>
                    <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>OPEN CASES</th>
                    <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>SLA COMPLIANCE</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((d) => (
                    <tr key={d.code} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <td style={{ padding: '14px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{d.code}</td>
                      <td style={{ padding: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{d.name}</td>
                      <td style={{ padding: '14px', color: 'var(--color-text-secondary)' }}>{d.head}</td>
                      <td style={{ padding: '14px' }}>{d.officers}</td>
                      <td style={{ padding: '14px', fontWeight: 700 }}>{d.activeCases}</td>
                      <td style={{ padding: '14px', color: '#059669', fontWeight: 700 }}>{d.sla}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Users & Roles Management */}
        {activeTab === 'users' && (
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px' }}>User Identities & Role Access Control (RBAC)</h3>
              <button
                type="button"
                onClick={() => setShowAddUserModal(true)}
                className="btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus style={{ width: '14px', height: '14px' }} />
                <span>Create User</span>
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border-medium)' }}>
                    <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>USER ID</th>
                    <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>NAME</th>
                    <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>EMAIL</th>
                    <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>ROLE</th>
                    <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <td style={{ padding: '14px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{u.id}</td>
                      <td style={{ padding: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{u.name}</td>
                      <td style={{ padding: '14px', color: 'var(--color-text-secondary)' }}>{u.email}</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '9999px',
                          background: u.role === 'super_admin' ? '#FAF5FF' : (u.role === 'dept_admin' ? '#EFF6FF' : (u.role === 'officer' ? '#ECFDF5' : '#F1F5F9')),
                          color: u.role === 'super_admin' ? '#7E22CE' : (u.role === 'dept_admin' ? '#1D4ED8' : (u.role === 'officer' ? '#065F46' : 'var(--color-text-primary)'))
                        }}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '14px', color: '#059669', fontWeight: 600 }}>● {u.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Categories & Grievance Types */}
        {activeTab === 'categories' && (
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Master Grievance Categories & Routing Map</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border-medium)' }}>
                    <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>CATEGORY ID</th>
                    <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>CATEGORY NAME</th>
                    <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>PRIMARY ROUTE</th>
                    <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>DEFAULT PRIORITY</th>
                    <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>SUB-TYPES</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <td style={{ padding: '14px', fontFamily: 'var(--font-mono)' }}>{c.id}</td>
                      <td style={{ padding: '14px', fontWeight: 700 }}>{c.name}</td>
                      <td style={{ padding: '14px', color: 'var(--color-primary)', fontWeight: 600 }}>{c.department}</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: c.priority === 'CRITICAL' ? '#DC2626' : '#D97706' }}>
                          ● {c.priority}
                        </span>
                      </td>
                      <td style={{ padding: '14px' }}>{c.typesCount} Sub-types configured</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: SLA Rules */}
        {activeTab === 'sla' && (
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Configured Municipal SLA Protocols</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border-medium)' }}>
                    <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>CATEGORY</th>
                    <th style={{ padding: '10px 14px', color: '#EF4444' }}>CRITICAL SLA</th>
                    <th style={{ padding: '10px 14px', color: '#F59E0B' }}>HIGH SLA</th>
                    <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>NORMAL SLA</th>
                    <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>ESCALATION TARGET</th>
                  </tr>
                </thead>
                <tbody>
                  {slaRules.map((s, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <td style={{ padding: '14px', fontWeight: 700 }}>{s.category}</td>
                      <td style={{ padding: '14px', color: '#B91C1C', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{s.criticalHours} Hours</td>
                      <td style={{ padding: '14px', color: '#B45309', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{s.highHours} Hours</td>
                      <td style={{ padding: '14px', fontFamily: 'var(--font-mono)' }}>{s.normalHours} Hours</td>
                      <td style={{ padding: '14px', color: 'var(--color-primary)', fontWeight: 600 }}>{s.escalationTarget}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: AI Engine & System Configuration */}
        {activeTab === 'ai_config' && (
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Cpu style={{ width: '20px', height: '20px', color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: '18px' }}>Autonomous AI Engine & Security Rules</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              
              <div style={{ padding: '18px', borderRadius: 'var(--radius-md)', background: '#F8F9FA', border: '1px solid var(--color-border-subtle)' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Auto-Routing Confidence Threshold: {aiConfig.confidenceThreshold}%
                </label>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                  Grievances above this AI confidence score route straight to field engineers without human dispatch delay.
                </p>
                <input
                  type="range"
                  min="70"
                  max="99"
                  value={aiConfig.confidenceThreshold}
                  onChange={(e) => setAiConfig(prev => ({ ...prev, confidenceThreshold: Number(e.target.value) }))}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ padding: '18px', borderRadius: 'var(--radius-md)', background: '#F8F9FA', border: '1px solid var(--color-border-subtle)' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  DBSCAN Duplicate Clustering Radius: {aiConfig.clusterRadiusMeters} Meters
                </label>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                  Maximum geographic radius to bundle citizen complaints into systemic infrastructure root-cause clusters.
                </p>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="100"
                  value={aiConfig.clusterRadiusMeters}
                  onChange={(e) => setAiConfig(prev => ({ ...prev, clusterRadiusMeters: Number(e.target.value) }))}
                  style={{ width: '100%' }}
                />
              </div>

            </div>

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={aiConfig.multilingualAutoTranslate}
                  onChange={(e) => setAiConfig(prev => ({ ...prev, multilingualAutoTranslate: e.target.checked }))}
                />
                <span>Enable Real-time Indic Phonetic Transliteration (Hindi, Hinglish, Punjabi, Urdu, Bengali)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={aiConfig.dpdpCryptographicChain}
                  onChange={(e) => setAiConfig(prev => ({ ...prev, dpdpCryptographicChain: e.target.checked }))}
                />
                <span>Mandate DPDP Act 2023 Compliant Citizen PII Anonymization on Public Dashboards</span>
              </label>
            </div>
          </div>
        )}

        {/* MODAL: ADD DEPARTMENT */}
        {showAddDeptModal && (
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
            <form onSubmit={handleAddDept} className="card" style={{ maxWidth: '440px', width: '100%', padding: '28px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Register New Municipal Department</h3>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  Department Code (e.g. DDA, DTC):
                </label>
                <input
                  type="text"
                  value={newDeptCode}
                  onChange={(e) => setNewDeptCode(e.target.value)}
                  style={{ width: '100%', height: '38px', borderRadius: '4px', border: '1px solid var(--color-border-medium)', padding: '0 8px', fontSize: '13px' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  Full Department Name:
                </label>
                <input
                  type="text"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  style={{ width: '100%', height: '38px', borderRadius: '4px', border: '1px solid var(--color-border-medium)', padding: '0 8px', fontSize: '13px' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  Designated Head of Department:
                </label>
                <input
                  type="text"
                  value={newDeptHead}
                  onChange={(e) => setNewDeptHead(e.target.value)}
                  style={{ width: '100%', height: '38px', borderRadius: '4px', border: '1px solid var(--color-border-medium)', padding: '0 8px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowAddDeptModal(false)} className="btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn-primary btn-sm">Register Department</button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: ADD USER */}
        {showAddUserModal && (
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
            <form onSubmit={handleAddUser} className="card" style={{ maxWidth: '440px', width: '100%', padding: '28px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Provision New System User</h3>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>Full Name:</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  style={{ width: '100%', height: '38px', borderRadius: '4px', border: '1px solid var(--color-border-medium)', padding: '0 8px', fontSize: '13px' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>Email:</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  style={{ width: '100%', height: '38px', borderRadius: '4px', border: '1px solid var(--color-border-medium)', padding: '0 8px', fontSize: '13px' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>Assigned Role:</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  style={{ width: '100%', height: '38px', borderRadius: '4px', border: '1px solid var(--color-border-medium)', padding: '0 8px', fontSize: '13px' }}
                >
                  <option value="citizen">Citizen</option>
                  <option value="officer">Government Officer</option>
                  <option value="dept_admin">Department Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowAddUserModal(false)} className="btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn-primary btn-sm">Create User</button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
