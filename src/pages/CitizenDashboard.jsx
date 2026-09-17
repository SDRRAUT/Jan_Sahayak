import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  MapPin, 
  Clock, 
  ThumbsUp, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Filter,
  User,
  Shield,
  Radio,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import WhyExplainer from '../components/common/WhyExplainer';
import CivicSignalModal from '../components/intelligence/CivicSignalModal';
import citizenBg from '../assets/citizen-bg.jpg';

export default function CitizenDashboard() {
  const { grievances = [], upvoteGrievance, user, currentCitizen: contextCitizen, civicIncidents = [] } = useApp();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSignalModal, setShowSignalModal] = useState(false);

  const citizen = user || contextCitizen || {
    name: 'Aditya Verma',
    ward: 'Ward 14 (Rohini Sector 14)',
    pincode: '110085',
    phone: '+91 98712-88210'
  };

  const activeWardIncident = civicIncidents[0]; // Ward 14 water incident

  const filteredGrievances = (grievances || []).filter(g => {
    const title = g?.title || '';
    const desc = g?.descriptionRaw || '';
    const id = g?.id || '';
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeTab === 'resolved') return g?.status === 'RESOLVED';
    if (activeTab === 'active') return g?.status !== 'RESOLVED';
    return true;
  });

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 72px)', background: 'var(--color-bg-base)' }}>
      {/* Background civic problems montage with low opacity */}
      <div 
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${citizenBg})`,
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          opacity: 0.14,
          pointerEvents: 'none',
          zIndex: 0,
          filter: 'contrast(105%) saturate(110%)'
        }}
      />
      {/* Soft gradient wash ensuring high legibility for cards and text */}
      <div 
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.45) 0%, rgba(241, 245, 249, 0.65) 100%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div className="section-spacing" style={{ paddingTop: '32px', position: 'relative', zIndex: 1 }}>
        <div className="container">
        {/* Profile and Action Top Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--color-divider)'
        }}>
          <div>
            <div className="category-pill" style={{ marginBottom: '8px' }}>
              CITIZEN ACCESS PORTAL
            </div>
            <h1 style={{ fontSize: '32px', color: 'var(--color-text-primary)' }}>
              Namaste, {citizen.name || 'Citizen'}
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <MapPin style={{ width: '14px', height: '14px', color: 'var(--color-primary)' }} />
              Registered in: <strong>{citizen.ward || 'Ward 14'}</strong> • PIN: {citizen.pincode || '110085'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setShowSignalModal(true)}
              style={{
                height: '42px',
                fontSize: '13px',
                padding: '0 16px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border-medium)',
                background: '#FFFFFF',
                color: 'var(--color-text-primary)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Radio style={{ width: '15px', height: '15px', color: 'var(--color-primary)' }} />
              <span>Report Civic Signal</span>
            </button>

            <Link to="/citizen/submit" className="btn-primary" style={{ height: '42px', fontSize: '13px' }}>
              <Plus style={{ width: '16px', height: '16px' }} />
              <span>File Formal Grievance</span>
            </Link>
          </div>
        </div>

        {/* Neighborhood Coordinated Investigation Alert Banner */}
        {activeWardIncident && (
          <div style={{
            padding: '14px 18px',
            borderRadius: 'var(--radius-lg)',
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles style={{ width: '18px', height: '18px', color: 'var(--color-primary)', flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '13.5px', color: '#065F46', display: 'block' }}>
                  Neighborhood Intelligence Notice: Active Coordinated Investigation
                </strong>
                <span style={{ fontSize: '12px', color: '#047857' }}>
                  {activeWardIncident.title} • {activeWardIncident.signalCount} signals correlated across your sector. Authorities are taking unified action.
                </span>
              </div>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              background: '#DCFCE7',
              color: '#166534',
              fontSize: '11.5px',
              fontWeight: 700
            }}>
              <CheckCircle2 style={{ width: '13px', height: '13px' }} />
              <span>Coordinated Dispatch Mobilized</span>
            </div>
          </div>
        )}

        {/* Quick Metric Tiles */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div className="card" style={{ padding: '20px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Total Complaints
            </span>
            <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', marginTop: '6px' }}>
              {grievances.length}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-primary)' }}>In Active Ward Area</span>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              In Progress / Triaged
            </span>
            <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#D97706', marginTop: '6px' }}>
              {grievances.filter(g => g.status !== 'RESOLVED').length}
            </div>
            <span style={{ fontSize: '11px', color: '#D97706' }}>Under SLA Tracking</span>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Resolved Cases
            </span>
            <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#059669', marginTop: '6px' }}>
              {grievances.filter(g => g.status === 'RESOLVED').length}
            </div>
            <span style={{ fontSize: '11px', color: '#059669' }}>Quality Verified</span>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Community Upvotes
            </span>
            <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', marginTop: '6px' }}>
              {grievances.reduce((acc, g) => acc + (g.upvotes || 0), 0)}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Collective Civic Momentum</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {/* Tab buttons */}
          <div style={{
            display: 'flex',
            background: '#F1F5F9',
            padding: '4px',
            borderRadius: '9999px',
            gap: '4px'
          }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                padding: '6px 16px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 600,
                background: activeTab === 'all' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'all' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                boxShadow: activeTab === 'all' ? 'var(--shadow-xs)' : 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              All Grievances ({grievances.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              style={{
                padding: '6px 16px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 600,
                background: activeTab === 'active' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'active' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                boxShadow: activeTab === 'active' ? 'var(--shadow-xs)' : 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              Active ({grievances.filter(g => g.status !== 'RESOLVED').length})
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              style={{
                padding: '6px 16px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 600,
                background: activeTab === 'resolved' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'resolved' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                boxShadow: activeTab === 'resolved' ? 'var(--shadow-xs)' : 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              Resolved ({grievances.filter(g => g.status === 'RESOLVED').length})
            </button>
          </div>

          {/* Search input */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '12px', width: '16px', height: '16px', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search grievances, ID, keyword..."
              style={{
                width: '100%',
                height: '40px',
                borderRadius: '9999px',
                border: '1px solid var(--color-border-medium)',
                paddingLeft: '36px',
                paddingRight: '16px',
                fontSize: '13px',
                background: '#FFFFFF'
              }}
            />
          </div>
        </div>

        {/* Grievances List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredGrievances.length === 0 ? (
            <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>No grievances match the selected criteria.</p>
            </div>
          ) : (
            filteredGrievances.map((item) => (
              <div
                key={item.id}
                className="card card-interactive"
                style={{
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '20px'
                }}
              >
                {/* Info block */}
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span className="font-mono-numbers" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', background: '#F1F5F9', padding: '2px 8px', borderRadius: '4px' }}>
                      {item.id}
                    </span>
                    <span className="category-pill" style={{ height: '22px', fontSize: '10px' }}>
                      {item.department || 'Civic Services'}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      background: item.status === 'RESOLVED' ? '#ECFDF5' : (item.urgency === 'CRITICAL' ? '#FEF2F2' : '#FFFBEB'),
                      color: item.status === 'RESOLVED' ? '#065F46' : (item.urgency === 'CRITICAL' ? '#991B1B' : '#92400E')
                    }}>
                      ● {(item.status || 'IN_PROGRESS').replace('_', ' ')}
                    </span>
                    <WhyExplainer
                      label="Why?"
                      title="Why this Priority?"
                      reasons={[
                        'Severity classified from citizen report',
                        `Ward: ${item.location?.ward || 'Ward Area'}`,
                        'Municipal SLA monitoring active'
                      ]}
                      align="left"
                    />
                    {item.clusterCount > 1 && (
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-primary)', background: 'var(--color-accent-tint)', padding: '2px 8px', borderRadius: '9999px' }}>
                        Cluster: {item.clusterCount} linked reports
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>
                    <Link to={`/citizen/complaints/${item.id}`} style={{ color: 'inherit' }}>
                      {item.title}
                    </Link>
                  </h3>

                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '10px', maxWidth: '680px' }}>
                    "{(item.descriptionRaw || item.title || '').substring(0, 140)}..."
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin style={{ width: '13px', height: '13px' }} />
                      {item.location?.area || 'Ward Area'}, {item.location?.ward || ''}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Clock style={{ width: '13px', height: '13px' }} />
                      SLA: {item.slaDeadline || '12h'}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={() => upvoteGrievance(item.id)}
                    className="btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    title="Endorse this issue in your ward"
                  >
                    <ThumbsUp style={{ width: '14px', height: '14px' }} />
                    <span>Upvote ({item.upvotes || 1})</span>
                  </button>

                  <Link
                    to={`/citizen/complaints/${item.id}`}
                    className="btn-primary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span>Track Status</span>
                    <ArrowRight className="btn-arrow" style={{ width: '14px', height: '14px' }} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  </div>
  );
}
