import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  ThumbsUp, 
  ArrowRight, 
  Clock, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Eye, 
  UserCheck, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const CATEGORY_IMAGES = {
  'Water Supply & Contamination': '/civic-problems/water_pipe_leak.jpg',
  'Roads & Infrastructure': '/civic-problems/pothole_broken_drain_grate.jpg',
  'Sanitation & Solid Waste': '/civic-problems/roadside_garbage_heap.jpg',
  'Electricity & Power Grid': '/civic-problems/monsoon_waterlogging_flood.jpg',
  'Drainage & Waterlogging': '/civic-problems/open_sewage_nullah_garbage.jpg',
  'Other Civic Issue': '/civic-problems/construction_dust_pollution.jpg'
};

export const PROBLEM_CATEGORIES = [
  { key: 'Water Supply & Contamination', label: 'Water Supply',       emoji: '💧', color: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD' },
  { key: 'Roads & Infrastructure',       label: 'Roads & Potholes',   emoji: '🛣️', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  { key: 'Sanitation & Solid Waste',     label: 'Garbage & Waste',    emoji: '🗑️', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  { key: 'Electricity & Power Grid',     label: 'Power & Lights',     emoji: '⚡', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
  { key: 'Drainage & Waterlogging',      label: 'Drainage & Sewage',  emoji: '🌊', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  { key: 'Other Civic Issue',            label: 'Other Civic Issue',  emoji: '🏛️', color: '#4F46E5', bg: '#EEF2FF', border: '#C7D2FE' },
];

export const STATUS_STEPS = [
  { key: 'SUBMITTED',          label: 'Submitted',   icon: '📝', desc: 'Received & digitally stamped on municipal ledger' },
  { key: 'TRIAGED',            label: 'AI Triaged',  icon: '🤖', desc: 'Categorized & urgency calculated by AI engine' },
  { key: 'ASSIGNED',           label: 'Assigned',    icon: '👷', desc: 'Dispatched to ward field engineering officer' },
  { key: 'IN_PROGRESS',        label: 'In Progress', icon: '⚡', desc: 'Active remediation & crew mobilized on ground' },
  { key: 'RESOLVED',           label: 'Resolved',    icon: '✅', desc: 'Work completed; geo-tagged resolution proof uploaded' },
  { key: 'RESOLVED_CONFIRMED', label: 'Verified',    icon: '🎉', desc: 'Citizen confirmed the fix on ground' },
];

export function getStepIndex(status) {
  const s = (status || '').toUpperCase();
  if (s === 'RESOLVED_CONFIRMED' || s === 'CLOSED') return 4;
  if (s === 'RESOLVED') return 3;
  if (s === 'IN_PROGRESS') return 2;
  if (s === 'ASSIGNED') return 1;
  return 0;
}

export function getCatConfig(g) {
  const cat = (g.category || g.department || '').toLowerCase();
  return PROBLEM_CATEGORIES.find(c => 
    cat.includes(c.key.split(' ')[0].toLowerCase()) || 
    c.key.toLowerCase().split(' ')[0].includes(cat.split(' ')[0])
  ) || PROBLEM_CATEGORIES[5];
}

/**
 * Editorial Reference-2 Style Grievance Card
 * Unified across Citizen, Officer, Civic Officer, Dept Admin, Super Admin
 */
export default function EditorialComplaintCard({
  item,
  role = 'citizen',
  currentUser,
  onOpen,
  onInspect,
  onResolve,
  onReassign,
  onUpvote,
  customAction
}) {
  if (!item) return null;

  const catCfg = getCatConfig(item);
  const stepIdx = getStepIndex(item.status);
  const isMine = currentUser && (
    item.citizenId === currentUser.id ||
    (item.citizenName && currentUser.name && item.citizenName.toLowerCase() === currentUser.name.toLowerCase()) ||
    (item.officerName && currentUser.name && item.officerName.toLowerCase().includes(currentUser.name.toLowerCase()))
  );

  const displayImage = item.evidence?.photoUrl || item.photoPreview || item.photoUrl || CATEGORY_IMAGES[catCfg.key] || CATEGORY_IMAGES['Other Civic Issue'];

  const deptShort = (item.department || 'Civic Services')
    .replace('Delhi Jal Board (DJB)', 'DJB')
    .replace('Public Works Department (PWD)', 'PWD')
    .replace('Municipal Corporation of Delhi (MCD)', 'MCD')
    .replace('BSES Rajdhani Power Limited', 'BSES')
    .slice(0, 16);

  const itemHours = item.slaHoursLeft ?? (item.slaDeadline ? parseInt(item.slaDeadline) : 18);
  const slaStatus = itemHours <= 0 ? 'OVERDUE' : (itemHours <= 6 ? 'AT_RISK' : 'ON_TRACK');

  const handleCardClick = () => {
    if (onOpen) onOpen(item);
  };

  const isOfficerOrAdmin = role === 'officer' || role === 'civic_officer' || role === 'dept_admin' || role === 'super_admin';

  return (
    <div
      onClick={handleCardClick}
      style={{
        borderRadius: '24px',
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 18px -2px rgba(15, 23, 42, 0.05)',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        position: 'relative'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 20px 38px -8px rgba(15, 23, 42, 0.12)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '0 4px 18px -2px rgba(15, 23, 42, 0.05)';
      }}
    >
      {/* ── Top Photo Header (Matching Reference 2 Card Visuals) ── */}
      <div style={{
        position: 'relative',
        height: '185px',
        width: '100%',
        overflow: 'hidden',
        background: '#F1F5F9'
      }}>
        <img
          src={displayImage}
          alt={item.title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />

        {/* Soft gradient wash */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.65) 100%)',
          pointerEvents: 'none'
        }} />

        {/* Floating Top-Left Category Badge */}
        <div style={{
          position: 'absolute', top: '14px', left: '14px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderRadius: '999px',
          padding: '4px 12px',
          display: 'flex', alignItems: 'center', gap: '6px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
        }}>
          <span style={{ fontSize: '13px' }}>{catCfg.emoji}</span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A' }}>
            {catCfg.label}
          </span>
        </div>

        {/* Floating Top-Right Badges */}
        <div style={{ position: 'absolute', top: '14px', right: '14px', display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {isMine && (
            <span style={{
              background: 'rgba(37, 99, 235, 0.95)',
              backdropFilter: 'blur(6px)',
              color: '#FFFFFF',
              borderRadius: '999px',
              padding: '4px 10px',
              fontSize: '10.5px',
              fontWeight: 700,
              boxShadow: '0 2px 6px rgba(37,99,235,0.3)'
            }}>
              👤 Assigned
            </span>
          )}
          {item.urgency === 'CRITICAL' ? (
            <span style={{
              background: 'rgba(220, 38, 38, 0.95)',
              backdropFilter: 'blur(6px)',
              color: '#FFFFFF',
              borderRadius: '999px',
              padding: '4px 10px',
              fontSize: '10.5px',
              fontWeight: 700,
              boxShadow: '0 2px 6px rgba(220,38,38,0.3)'
            }}>
              ● Critical
            </span>
          ) : item.urgency === 'HIGH' ? (
            <span style={{
              background: 'rgba(217, 119, 6, 0.95)',
              backdropFilter: 'blur(6px)',
              color: '#FFFFFF',
              borderRadius: '999px',
              padding: '4px 10px',
              fontSize: '10.5px',
              fontWeight: 700,
              boxShadow: '0 2px 6px rgba(217,119,6,0.3)'
            }}>
              High
            </span>
          ) : null}

          {item.status === 'RESOLVED' || item.status === 'RESOLVED_CONFIRMED' ? (
            <span style={{
              background: 'rgba(5, 150, 105, 0.95)',
              backdropFilter: 'blur(6px)',
              color: '#FFFFFF',
              borderRadius: '999px',
              padding: '4px 10px',
              fontSize: '10.5px',
              fontWeight: 700,
              boxShadow: '0 2px 6px rgba(5,150,105,0.3)'
            }}>
              ✓ Resolved
            </span>
          ) : null}
        </div>

        {/* Bottom of Image Metadata Bar */}
        <div style={{
          position: 'absolute', bottom: '12px', left: '16px', right: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          color: '#FFFFFF', fontSize: '11px', fontWeight: 600,
          textShadow: '0 1px 3px rgba(0,0,0,0.7)'
        }}>
          <span style={{ fontFamily: 'monospace', opacity: 0.9, letterSpacing: '0.5px' }}>
            #{item.id?.slice(-8) || item.id}
          </span>
          <span style={{
            background: slaStatus === 'OVERDUE' ? 'rgba(220, 38, 38, 0.85)' : 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(6px)',
            padding: '2px 8px', borderRadius: '6px', fontSize: '10.5px'
          }}>
            ⏱️ SLA: {item.slaDeadline || `${itemHours}h`} {slaStatus === 'OVERDUE' ? '(Breached)' : ''}
          </span>
        </div>
      </div>

      {/* ── Card Body (Inspired by Reference 2 Layout) ── */}
      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Title */}
        <h3 style={{
          fontSize: '15.5px',
          fontWeight: 800,
          color: '#0F172A',
          lineHeight: 1.35,
          margin: '0 0 6px 0',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '42px'
        }}>
          {item.title}
        </h3>

        {/* Snippet */}
        <p style={{
          fontSize: '12.5px',
          color: '#64748B',
          lineHeight: 1.45,
          margin: '0 0 14px 0',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {item.descriptionRaw || item.description || 'Civic issue logged in ward. Field team monitoring resolution.'}
        </p>

        {/* Specs Row with Subtle Dividers (Directly from Reference 2) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 0',
          borderTop: '1px solid #F1F5F9',
          borderBottom: '1px solid #F1F5F9',
          marginBottom: '14px',
          fontSize: '11.5px',
          color: '#475569'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', maxWidth: '38%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <MapPin style={{ width: '12px', height: '12px', color: '#94A3B8', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.location?.area || item.location?.ward || 'Ward Area'}</span>
          </span>
          <span style={{ color: '#E2E8F0' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            🏛️ {deptShort}
          </span>
          <span style={{ color: '#E2E8F0' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            {isOfficerOrAdmin ? (
              <span title={item.citizenName || 'Aditya Verma'}>
                👤 {(item.citizenName || 'Citizen').split(' ')[0]}
              </span>
            ) : (
              <>
                <ThumbsUp style={{ width: '11px', height: '11px', color: '#2563EB' }} />
                {item.upvotes || 1}
              </>
            )}
          </span>
        </div>

        {/* Step Progress Bar */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>{STATUS_STEPS[stepIdx]?.icon}</span>
              <span>{STATUS_STEPS[stepIdx]?.label}</span>
            </span>
            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
              Step {stepIdx + 1} of {STATUS_STEPS.length}
            </span>
          </div>
          <div style={{ height: '5px', background: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${((stepIdx + 0.2) / (STATUS_STEPS.length - 1)) * 100}%`,
              background: item.status === 'RESOLVED' || item.status === 'RESOLVED_CONFIRMED' ? '#059669' : '#2563EB',
              borderRadius: '999px',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* Action Row */}
        <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }} onClick={e => e.stopPropagation()}>
          {customAction ? (
            customAction
          ) : isOfficerOrAdmin ? (
            <>
              <button
                type="button"
                onClick={() => onInspect ? onInspect(item.id) : (onOpen ? onOpen(item) : null)}
                style={{
                  flex: 1,
                  height: '42px',
                  borderRadius: '999px',
                  background: '#0F172A',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(15,23,42,0.18)',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#1E293B'}
                onMouseLeave={e => e.currentTarget.style.background = '#0F172A'}
              >
                <Eye style={{ width: '13px', height: '13px' }} />
                <span>Inspect Case</span>
              </button>

              {onResolve && item.status !== 'RESOLVED' && item.status !== 'RESOLVED_CONFIRMED' && (
                <button
                  type="button"
                  onClick={() => onResolve(item.id)}
                  style={{
                    height: '42px',
                    padding: '0 14px',
                    borderRadius: '999px',
                    background: '#ECFDF5',
                    color: '#059669',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1px solid #A7F3D0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                  title="Mark Resolved"
                >
                  <CheckCircle2 style={{ width: '13px', height: '13px' }} />
                  <span>Resolve</span>
                </button>
              )}

              {onReassign && (
                <button
                  type="button"
                  onClick={() => onReassign(item.id)}
                  style={{
                    height: '42px',
                    padding: '0 12px',
                    borderRadius: '999px',
                    background: '#F8FAFC',
                    color: '#475569',
                    fontSize: '12px',
                    fontWeight: 600,
                    border: '1px solid #E2E8F0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                  title="Reassign Officer"
                >
                  <UserCheck style={{ width: '13px', height: '13px' }} />
                </button>
              )}
            </>
          ) : (
            <>
              {onUpvote && (
                <button
                  type="button"
                  onClick={() => onUpvote(item.id)}
                  style={{
                    height: '42px',
                    padding: '0 14px',
                    borderRadius: '999px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#334155',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <ThumbsUp style={{ width: '13px', height: '13px', color: '#2563EB' }} />
                  <span>{item.upvotes || 1}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onOpen ? onOpen(item) : null}
                style={{
                  flex: 1,
                  height: '42px',
                  borderRadius: '999px',
                  background: '#0F172A',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(15,23,42,0.18)'
                }}
              >
                <span>{item.status === 'RESOLVED' ? 'Verify Resolution' : 'View Status'}</span>
                <ArrowRight style={{ width: '13px', height: '13px' }} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Editorial Reference-2 Detail Popup / Modal
 * Shows complete investigation details, status steps, specs, and role actions
 */
export function ComplaintDetailModal({
  item,
  onClose,
  role = 'citizen',
  currentUser,
  onUpvote,
  onInspect,
  onResolve,
  onReassign
}) {
  if (!item) return null;

  const navigate = useNavigate();
  const catCfg = getCatConfig(item);
  const stepIdx = getStepIndex(item.status);
  const displayImage = item.evidence?.photoUrl || item.photoPreview || item.photoUrl || CATEGORY_IMAGES[catCfg.key] || CATEGORY_IMAGES['Other Civic Issue'];
  const isOfficerOrAdmin = role === 'officer' || role === 'civic_officer' || role === 'dept_admin' || role === 'super_admin';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '740px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '26px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)'
        }}
      >
        {/* Editorial Photo Header */}
        <div style={{
          position: 'relative',
          height: '180px',
          width: '100%',
          overflow: 'hidden',
          borderRadius: '26px 26px 0 0',
          background: '#F1F5F9'
        }}>
          <img
            src={displayImage}
            alt={item.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.65) 100%)',
            pointerEvents: 'none'
          }} />

          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              cursor: 'pointer',
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              zIndex: 2
            }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>

          {/* Floating Pill Badge */}
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: '999px',
            padding: '4px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
          }}>
            <span style={{ fontSize: '13px' }}>{catCfg.emoji}</span>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0F172A' }}>
              {catCfg.label}
            </span>
          </div>

          <div style={{ position: 'absolute', bottom: '14px', left: '18px', right: '18px', color: '#FFFFFF' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, opacity: 0.85, fontFamily: 'monospace', marginBottom: '2px' }}>
              #{item.id}
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, lineHeight: 1.3, color: '#FFFFFF' }}>
              {item.title}
            </h2>
          </div>
        </div>

        {/* Horizontal Status Timeline */}
        <div style={{ padding: '20px 24px 16px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📦 Resolution Timeline
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#EFF6FF', padding: '3px 10px', borderRadius: '999px', border: '1px solid #BFDBFE' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#1D4ED8' }}>
                Stage {stepIdx + 1} of {STATUS_STEPS.length}:
              </span>
              <strong style={{ fontSize: '11px', color: '#1E40AF' }}>
                {STATUS_STEPS[stepIdx]?.label}
              </strong>
            </div>
          </div>

          {/* Horizontal Track & Steps */}
          <div style={{ overflowX: 'auto', paddingBottom: '8px', WebkitOverflowScrolling: 'touch' }}>
            <div style={{ minWidth: '580px', position: 'relative', padding: '10px 4px 4px 4px' }}>
              {/* Background Connecting Bar */}
              <div style={{
                position: 'absolute',
                top: '26px',
                left: 'calc(100% / 14)',
                right: 'calc(100% / 14)',
                height: '3px',
                background: '#E2E8F0',
                borderRadius: '999px',
                zIndex: 0
              }} />

              {/* Active Progress Bar */}
              <div style={{
                position: 'absolute',
                top: '26px',
                left: 'calc(100% / 14)',
                width: `calc((100% - (100% / 7)) * ${stepIdx / (STATUS_STEPS.length - 1)})`,
                height: '3px',
                background: 'linear-gradient(90deg, #2563EB, #10B981)',
                borderRadius: '999px',
                zIndex: 1,
                transition: 'width 0.4s ease'
              }} />

              {/* Horizontal Step Nodes */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${STATUS_STEPS.length}, 1fr)`,
                position: 'relative',
                zIndex: 2,
                gap: '4px'
              }}>
                {STATUS_STEPS.map((step, idx) => {
                  const done = idx <= stepIdx;
                  const active = idx === stepIdx;

                  return (
                    <div key={step.key} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {/* Step Circle Node */}
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: active ? '#2563EB' : done ? '#ECFDF5' : '#F8FAFC',
                        border: active ? '3px solid #BFDBFE' : done ? '2px solid #10B981' : '2px solid #CBD5E1',
                        color: active ? '#FFFFFF' : done ? '#059669' : '#94A3B8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 800,
                        boxShadow: active ? '0 0 0 4px rgba(37, 99, 235, 0.2), 0 4px 8px rgba(37, 99, 235, 0.25)' : 'none',
                        marginBottom: '8px',
                        transition: 'all 0.2s ease'
                      }}>
                        {done ? (active ? step.icon : '✓') : idx + 1}
                      </div>

                      {/* Step Label */}
                      <div style={{
                        fontSize: '11px',
                        fontWeight: active ? 800 : done ? 700 : 500,
                        color: active ? '#1D4ED8' : done ? '#0F172A' : '#94A3B8',
                        lineHeight: 1.25,
                        maxWidth: '82px',
                        margin: '0 auto'
                      }}>
                        {step.label}
                      </div>

                      {/* Active Pill Badge */}
                      {active && (
                        <span style={{
                          marginTop: '4px',
                          fontSize: '9px',
                          fontWeight: 800,
                          background: '#DBEAFE',
                          color: '#1D4ED8',
                          padding: '1px 6px',
                          borderRadius: '999px',
                          letterSpacing: '0.02em'
                        }}>
                          ACTIVE
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Stage Callout Card */}
          <div style={{
            marginTop: '14px',
            padding: '12px 16px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
            border: '1px solid #DBEAFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#DBEAFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                flexShrink: 0
              }}>
                {STATUS_STEPS[stepIdx]?.icon || '📋'}
              </div>
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#1E40AF' }}>
                  Current Status: {STATUS_STEPS[stepIdx]?.label}
                </div>
                <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '1px' }}>
                  {STATUS_STEPS[stepIdx]?.desc}
                </div>
              </div>
            </div>
            {item.updatedAt && (
              <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 600, background: '#FFFFFF', padding: '3px 8px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                Updated: {item.updatedAt}
              </span>
            )}
          </div>
        </div>

        {/* Complaint Statement */}
        {(item.descriptionRaw || item.description) && (
          <div style={{ margin: '0 24px 16px', padding: '14px 16px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
              Citizen Complaint Statement
            </div>
            <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5, margin: 0 }}>
              "{(item.descriptionRaw || item.description || '').substring(0, 300)}"
            </p>
          </div>
        )}

        {/* 4 Key Specs */}
        <div style={{ margin: '0 24px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {[
            { label: 'Department',   value: item.department || 'Civic Services', col: '#1D4ED8', bg: '#EFF6FF' },
            { label: 'SLA Target',   value: item.slaDeadline || '24–48 Hours',   col: '#B45309', bg: '#FFFBEB' },
            { label: 'Ward Area',    value: item.location?.ward || 'Ward 14',    col: '#047857', bg: '#ECFDF5' },
            { label: 'Priority Tier',value: item.urgency === 'CRITICAL' ? 'Critical' : item.urgency === 'HIGH' ? 'High' : 'Normal', col: '#6D28D9', bg: '#F5F3FF' },
          ].map(info => (
            <div key={info.label} style={{ padding: '12px 14px', background: info.bg, borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: info.col, textTransform: 'uppercase', marginBottom: '3px' }}>
                {info.label}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {info.value}
              </div>
            </div>
          ))}
        </div>

        {/* Assigned Officer / Citizen Row */}
        <div style={{ margin: '0 24px 20px', padding: '12px 16px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
          <div>
            <span style={{ color: '#64748B' }}>Citizen: </span>
            <strong style={{ color: '#0F172A' }}>{item.citizenName || 'Aditya Verma'}</strong>
            {item.citizenPhone && <span style={{ color: '#94A3B8' }}> ({item.citizenPhone})</span>}
          </div>
          <div>
            <span style={{ color: '#64748B' }}>Officer: </span>
            <strong style={{ color: '#0F172A' }}>{item.officerName || 'Er. Sanjay Sharma'}</strong>
          </div>
        </div>

        {/* Bottom Actions */}
        <div style={{ padding: '0 24px 24px', display: 'flex', gap: '10px' }}>
          {isOfficerOrAdmin ? (
            <>
              {onResolve && item.status !== 'RESOLVED' && item.status !== 'RESOLVED_CONFIRMED' && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onResolve(item.id);
                  }}
                  style={{
                    flex: 1,
                    height: '44px',
                    borderRadius: '999px',
                    border: '1px solid #A7F3D0',
                    background: '#ECFDF5',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <CheckCircle2 style={{ width: '15px', height: '15px' }} /> Quick Resolve
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onInspect) onInspect(item.id);
                  else navigate(`/officer?section=investigation&id=${item.id}`);
                }}
                style={{
                  flex: 2,
                  height: '44px',
                  borderRadius: '999px',
                  background: '#0F172A',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(15,23,42,0.15)'
                }}
              >
                <span>Deep Investigation Workspace</span>
                <ArrowRight style={{ width: '15px', height: '15px' }} />
              </button>
            </>
          ) : (
            <>
              {onUpvote && (
                <button
                  onClick={() => onUpvote(item.id)}
                  style={{
                    flex: 1,
                    height: '44px',
                    borderRadius: '999px',
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <ThumbsUp style={{ width: '14px', height: '14px' }} /> Upvote ({item.upvotes || 1})
                </button>
              )}
              <Link
                to={`/citizen/complaints/${item.id}`}
                onClick={onClose}
                style={{
                  flex: 2,
                  height: '44px',
                  borderRadius: '999px',
                  background: '#0F172A',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(15,23,42,0.15)'
                }}
              >
                {item.status === 'RESOLVED' ? 'Verify Resolution' : 'Full Investigation View'} <ArrowRight style={{ width: '15px', height: '15px' }} />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
