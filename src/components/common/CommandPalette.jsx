import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  FileText, 
  Sparkles, 
  MapPin, 
  PlusCircle, 
  Radio, 
  ArrowRight, 
  X, 
  Clock, 
  UserCheck, 
  Globe,
  Briefcase,
  Building2,
  ShieldCheck,
  User
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CommandPalette({ isOpen, onClose, onOpenSignalModal }) {
  const navigate = useNavigate();
  const { grievances = [], civicIncidents = [], switchDemoRole, user, role } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(true); // Toggle
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Build items list
  const recentComplaints = (grievances || []).slice(0, 3).map(g => ({
    id: g.id,
    type: 'COMPLAINT',
    title: `${g.id} — ${g.category}`,
    subtitle: `${g.ward} • Priority: ${g.priority || 'High'}`,
    icon: FileText,
    action: () => {
      navigate(`/citizen/complaints/${g.id}`);
      onClose();
    }
  }));

  const activeIncidents = (civicIncidents || []).slice(0, 2).map(inc => ({
    id: inc.id,
    type: 'INCIDENT',
    title: `${inc.id} — ${inc.title}`,
    subtitle: `${inc.corridor} • ${inc.signalCount} signals`,
    icon: Sparkles,
    badge: 'Civic Incident',
    action: () => {
      navigate(`/intelligence/incidents/${inc.id}`);
      onClose();
    }
  }));

  // Role-Segregated Quick Actions
  let quickActions = [];

  if (role === 'citizen') {
    quickActions = [
      {
        id: 'act-new-complaint',
        type: 'ACTION',
        title: 'Report a Grievance',
        subtitle: 'Voice, photo, or conversational guided form',
        icon: PlusCircle,
        action: () => {
          navigate('/citizen?fileGrievance=true');
          onClose();
        }
      },
      {
        id: 'act-my-complaints',
        type: 'ACTION',
        title: 'My Grievance Dashboard',
        subtitle: 'View status and track ongoing tickets',
        icon: User,
        action: () => {
          navigate('/citizen');
          onClose();
        }
      },
      {
        id: 'act-signal',
        type: 'ACTION',
        title: 'Log Ambient Civic Signal',
        subtitle: 'Quick observation without formal complaint',
        icon: Radio,
        badge: 'Fast',
        action: () => {
          onClose();
          if (onOpenSignalModal) onOpenSignalModal();
        }
      }
    ];
  } else if (role === 'officer') {
    quickActions = [
      {
        id: 'act-officer-triage',
        type: 'ACTION',
        title: 'Officer Triage Workspace',
        subtitle: 'Inspect tickets, AI SOPs & dispatch work orders',
        icon: Briefcase,
        action: () => {
          navigate('/officer');
          onClose();
        }
      },
      {
        id: 'act-heatmap',
        type: 'ACTION',
        title: 'Geospatial Ward Heatmap',
        subtitle: 'Live density and cross-department incident cluster map',
        icon: MapPin,
        action: () => {
          navigate('/admin');
          onClose();
        }
      },
      {
        id: 'act-intelligence',
        type: 'ACTION',
        title: 'Civic Intelligence Suite',
        subtitle: 'Corridor progression maps & root cause analysis',
        icon: Sparkles,
        action: () => {
          navigate('/intelligence');
          onClose();
        }
      }
    ];
  } else if (role === 'dept_admin') {
    quickActions = [
      {
        id: 'act-dept-console',
        type: 'ACTION',
        title: 'Department Admin Console',
        subtitle: 'SLA compliance, queue health & reports',
        icon: Building2,
        action: () => {
          navigate('/admin/department');
          onClose();
        }
      },
      {
        id: 'act-officer-queue',
        type: 'ACTION',
        title: 'Officer Roster & Triage Queue',
        subtitle: 'Manage duty rosters and active case loads',
        icon: Briefcase,
        action: () => {
          navigate('/officer');
          onClose();
        }
      },
      {
        id: 'act-heatmap',
        type: 'ACTION',
        title: 'Geospatial Ward Heatmap',
        subtitle: 'Live density and cross-department incident cluster map',
        icon: MapPin,
        action: () => {
          navigate('/admin');
          onClose();
        }
      }
    ];
  } else if (role === 'super_admin') {
    quickActions = [
      {
        id: 'act-super-console',
        type: 'ACTION',
        title: 'Super Admin Console',
        subtitle: 'Municipal directory, SLA rules & audit trail',
        icon: ShieldCheck,
        action: () => {
          navigate('/admin/super');
          onClose();
        }
      },
      {
        id: 'act-dept-directory',
        type: 'ACTION',
        title: 'Department Directory',
        subtitle: 'Oversight across DJB, PWD, MCD, BSES',
        icon: Building2,
        action: () => {
          navigate('/admin/department');
          onClose();
        }
      },
      {
        id: 'act-officer-queue',
        type: 'ACTION',
        title: 'Field Officer Workspace',
        subtitle: 'Review triage decisions & field squad dispatches',
        icon: Briefcase,
        action: () => {
          navigate('/officer');
          onClose();
        }
      }
    ];
  } else {
    quickActions = [
      {
        id: 'act-new-complaint',
        type: 'ACTION',
        title: 'Report a Grievance',
        subtitle: 'Voice, photo, or conversational guided form',
        icon: PlusCircle,
        action: () => {
          navigate('/citizen?fileGrievance=true');
          onClose();
        }
      },
      {
        id: 'act-impact',
        type: 'ACTION',
        title: 'View Platform Impact',
        subtitle: 'Public transparency & resolution metrics',
        icon: Globe,
        action: () => {
          navigate('/impact');
          onClose();
        }
      }
    ];
  }

  // Active Incidents are only visible to officers and administrators
  const canViewIncidents = role && role !== 'citizen';
  const allItems = [
    ...(canViewIncidents ? activeIncidents : []),
    ...recentComplaints,
    ...quickActions
  ];

  const filteredItems = query.trim()
    ? allItems.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        item.id.toLowerCase().includes(query.toLowerCase())
      )
    : allItems;

  const handleKeyDownList = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.48)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        paddingLeft: '16px',
        paddingRight: '16px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '620px',
          background: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.28), 0 0 0 1px rgba(15, 23, 42, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '75vh',
          animation: 'fadeIn 120ms ease-out'
        }}
      >
        {/* Search Input Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 18px',
          borderBottom: '1px solid #E5E7EB',
          background: '#FAFBFC'
        }}>
          <Search style={{ width: '18px', height: '18px', color: '#0F52BA', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownList}
            placeholder="Search complaints, wards, incidents, or quick actions..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '15px',
              fontWeight: 500,
              color: '#111827'
            }}
          />
          <button 
            type="button" 
            onClick={() => onClose()}
            style={{ 
              padding: '4px', 
              borderRadius: '6px', 
              color: '#9CA3AF', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>

        {/* List Results */}
        <div style={{
          overflowY: 'auto',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
              No complaints or actions match "{query}"
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: isSelected ? '#F0F5FF' : 'transparent',
                    border: isSelected ? '1px solid #D9E4FF' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 80ms ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: isSelected ? '#0F52BA' : '#F1F5F9',
                      color: isSelected ? '#FFFFFF' : '#4B5563',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Icon style={{ width: '16px', height: '16px' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontSize: '13.5px',
                          fontWeight: 600,
                          color: isSelected ? '#0F52BA' : '#111827',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {item.title}
                        </span>
                        {item.badge && (
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '9999px',
                            background: item.badge === 'Civic Incident' ? '#EEF2FF' : '#FFF7ED',
                            color: item.badge === 'Civic Incident' ? '#4338CA' : '#C2410C'
                          }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span style={{
                        fontSize: '11.5px',
                        color: '#6B7280',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  <ArrowRight style={{
                    width: '14px',
                    height: '14px',
                    color: isSelected ? '#0F52BA' : '#D1D5DB',
                    opacity: isSelected ? 1 : 0.5,
                    flexShrink: 0
                  }} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div style={{
          padding: '8px 16px',
          background: '#F8FAFC',
          borderTop: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#6B7280'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span><kbd style={{ padding: '1px 4px', background: '#E5E7EB', borderRadius: '4px', fontSize: '10px' }}>↑↓</kbd> to navigate</span>
            <span><kbd style={{ padding: '1px 4px', background: '#E5E7EB', borderRadius: '4px', fontSize: '10px' }}>Enter</kbd> to select</span>
            <span><kbd style={{ padding: '1px 4px', background: '#E5E7EB', borderRadius: '4px', fontSize: '10px' }}>Esc</kbd> to close</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <img src="/logo.png" alt="JanSahayak" style={{ height: '16px', width: 'auto', objectFit: 'contain' }} />
            <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>JanSahayak Quick Launcher</span>
          </div>
        </div>
      </div>
    </div>
  );
}
