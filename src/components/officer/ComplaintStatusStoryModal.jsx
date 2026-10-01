import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Phone, 
  Building2, 
  ArrowRight,
  ShieldAlert,
  Flame,
  Check,
  Zap,
  Users
} from 'lucide-react';
import { maskCitizenName, maskCitizenPhone } from '../../utils/privacy';

export default function ComplaintStatusStoryModal({ 
  isOpen, 
  onClose, 
  grievances = [],
  onOpenGrievance,
  onResolveQuick
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const STORY_DURATION_MS = 6000; // 6 seconds per card

  // Priority Sorting Logic per user instructions:
  // 1. Today's Critical (Ingested / Analyzed / Critical)
  // 2. Pending Critical (In Progress / Dispatched + Critical)
  // 3. Today's High / Medium
  // 4. Pending other
  // 5. Solved / Verified
  const sortedComplaints = React.useMemo(() => {
    if (!grievances || grievances.length === 0) return [];
    
    return [...grievances].sort((a, b) => {
      const getPriorityScore = (item) => {
        const isCritical = item.urgency === 'CRITICAL';
        const isHigh = item.urgency === 'HIGH';
        const isToday = item.status === 'INGESTED' || item.status === 'ANALYZED' || (item.createdAt && item.createdAt.includes('2026'));
        const isPending = item.status === 'IN_PROGRESS' || item.status === 'ACTION_DISPATCHED';
        const isResolved = item.status === 'RESOLVED' || item.status === 'ACTION_COMPLETED';

        if (isResolved) return 10;
        if (isToday && isCritical) return 1;
        if (isPending && isCritical) return 2;
        if (isToday && isHigh) return 3;
        if (isToday) return 4;
        if (isPending && isHigh) return 5;
        if (isPending) return 6;
        return 7;
      };

      const scoreA = getPriorityScore(a);
      const scoreB = getPriorityScore(b);
      if (scoreA !== scoreB) return scoreA - scoreB;
      return (b.urgencyScore || 0) - (a.urgencyScore || 0);
    });
  }, [grievances]);

  // Reset progress when index changes
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  // Auto-advance progress timer (WhatsApp/Instagram Story style)
  useEffect(() => {
    if (!isOpen || sortedComplaints.length === 0) return;

    if (isPaused) return;

    const interval = 50; // update every 50ms
    const step = (interval / STORY_DURATION_MS) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isOpen, currentIndex, isPaused, sortedComplaints.length]);

  // Keyboard navigation (Left, Right, Escape, Spacebar)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, sortedComplaints.length]);

  if (!isOpen || sortedComplaints.length === 0) return null;

  const current = sortedComplaints[currentIndex] || sortedComplaints[0];
  const isCritical = current.urgency === 'CRITICAL';
  const isHigh = current.urgency === 'HIGH';
  const isResolved = current.status === 'RESOLVED' || current.status === 'ACTION_COMPLETED';
  const isPending = current.status === 'IN_PROGRESS' || current.status === 'ACTION_DISPATCHED';

  const handleNext = () => {
    if (currentIndex < sortedComplaints.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose(); // Auto close on end of story
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const displayImage = current.photoUrl || current.evidence?.photoUrl || (
    current.category?.includes('Water') ? '/civic-problems/water_pipe_leak.jpg' :
    current.category?.includes('Sanitation') ? '/civic-problems/roadside_garbage_heap.jpg' :
    current.category?.includes('Roads') ? '/civic-problems/pothole_broken_drain_grate.jpg' :
    current.category?.includes('Electricity') ? '/civic-problems/ai_dangling_power_cables.jpg' :
    '/civic-problems/open_sewage_nullah_garbage.jpg'
  );

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10000,
      background: 'rgba(5, 10, 20, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      {/* Background ambient color burst matching current card severity */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: isCritical 
          ? 'radial-gradient(circle, rgba(239, 68, 68, 0.18) 0%, transparent 70%)'
          : (isResolved ? 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, transparent 70%)'),
        pointerEvents: 'none',
        transition: 'all 500ms ease'
      }} />

      {/* Main Story Card (Phone/Story Aspect Ratio) */}
      <div 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{
          width: '100%',
          maxWidth: '460px',
          maxHeight: '92vh',
          height: '760px',
          background: '#0F172A',
          borderRadius: '24px',
          border: '1.5px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(16, 185, 129, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Top Progress Segment Bars (Instagram / WhatsApp Status Style) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          padding: '12px 14px 6px',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)',
          display: 'flex',
          gap: '4px'
        }}>
          {sortedComplaints.map((item, idx) => {
            const isPast = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const itemCrit = item.urgency === 'CRITICAL';
            
            return (
              <div 
                key={item.id} 
                onClick={() => setCurrentIndex(idx)}
                style={{
                  flex: 1,
                  height: '3.5px',
                  background: 'rgba(255, 255, 255, 0.25)',
                  borderRadius: '999px',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  height: '100%',
                  width: isPast ? '100%' : (isCurrent ? `${progress}%` : '0%'),
                  background: itemCrit ? '#EF4444' : '#10B981',
                  borderRadius: '999px',
                  transition: isCurrent ? 'none' : 'width 200ms ease'
                }} />
              </div>
            );
          })}
        </div>

        {/* Top Header Bar */}
        <div style={{
          position: 'absolute',
          top: '24px',
          left: 0,
          right: 0,
          zIndex: 20,
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              border: '2px solid #FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '16px'
            }}>
              🏛️
            </div>
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>PMC Wagholi Command</span>
                <span style={{ fontSize: '10px', background: '#059669', color: '#FFFFFF', padding: '1px 6px', borderRadius: '4px' }}>
                  {currentIndex + 1} / {sortedComplaints.length}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                Priority Queue • {current.createdAt || 'Today'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Play / Pause Toggle Button */}
            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title={isPaused ? "Resume auto-play" : "Pause status"}
            >
              {isPaused ? <Play size={14} fill="#FFFFFF" /> : <Pause size={14} fill="#FFFFFF" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Close Story Mode"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Hero Visual Image Viewport */}
        <div style={{
          flex: '0 0 52%',
          position: 'relative',
          overflow: 'hidden',
          background: '#000000'
        }}>
          <img 
            src={displayImage} 
            alt={current.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.92)'
            }}
          />

          {/* Severity Overlay Gradient */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(15,23,42,0.4) 0%, transparent 40%, rgba(15,23,42,0.95) 100%)'
          }} />

          {/* Left/Right Click Target Zones for Quick Tapping */}
          <div 
            onClick={handlePrev}
            style={{
              position: 'absolute',
              top: '60px',
              left: 0,
              width: '35%',
              bottom: 0,
              zIndex: 10,
              cursor: 'pointer'
            }}
            title="Tap for Previous (or Left Arrow)"
          />
          <div 
            onClick={handleNext}
            style={{
              position: 'absolute',
              top: '60px',
              right: 0,
              width: '45%',
              bottom: 0,
              zIndex: 10,
              cursor: 'pointer'
            }}
            title="Tap for Next (or Right Arrow)"
          />

          {/* Floating Priority Badges at Bottom of Image */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '16px',
            right: '16px',
            zIndex: 15,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '999px',
                background: isCritical ? '#EF4444' : (isHigh ? '#F59E0B' : '#10B981'),
                color: '#FFFFFF',
                letterSpacing: '0.04em',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {isCritical ? '🚨 CRITICAL' : (isHigh ? '⚠️ HIGH PRIORITY' : '🟢 NORMAL')}
              </span>

              <span style={{
                fontSize: '10.5px',
                fontWeight: 700,
                background: 'rgba(0, 0, 0, 0.65)',
                color: '#CBD5E1',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.15)',
                fontFamily: 'monospace'
              }}>
                {current.id}
              </span>
            </div>

            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              background: isResolved ? '#065F46' : 'rgba(239, 68, 68, 0.25)',
              color: isResolved ? '#6EE7B7' : '#FCA5A5',
              border: `1px solid ${isResolved ? '#059669' : '#EF4444'}`,
              padding: '2px 8px',
              borderRadius: '999px'
            }}>
              {current.slaHoursLeft ? `⏱️ ${current.slaHoursLeft}h SLA Target` : '⏱️ 24h SLA Target'}
            </span>
          </div>
        </div>

        {/* Lower Detail Card (Complaint Metadata, Address, Actions) */}
        <div style={{
          flex: '1 1 auto',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0F172A',
          color: '#FFFFFF'
        }}>
          <div>
            {/* Title */}
            <h3 style={{
              fontSize: '17px',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: '0 0 8px 0',
              lineHeight: 1.35
            }}>
              {current.title}
            </h3>

            {/* Location & Department */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '12px',
              color: '#94A3B8',
              marginBottom: '10px',
              flexWrap: 'wrap'
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#38BDF8' }}>
                <MapPin size={13} />
                <strong>{current.location?.ward?.split('(')[0]?.trim() || 'Wagholi Ward 29'}</strong>
              </span>
              <span>•</span>
              <span style={{ color: '#E2E8F0' }}>
                {current.department?.split('(')[0]?.trim() || 'PMC Water Department'}
              </span>
            </div>

            {/* Citizen Statement / Description */}
            <p style={{
              fontSize: '12.5px',
              color: '#CBD5E1',
              lineHeight: 1.45,
              margin: '0 0 12px 0',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '10px 12px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              "{current.descriptionRaw || current.summary || 'Citizen reported severe issue requiring field action.'}"
            </p>

            {/* Quick Metadata Pill Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px',
              marginBottom: '12px'
            }}>
              <div style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '10px', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Citizen</span>
                <span style={{ fontSize: '11.5px', color: '#F1F5F9', fontWeight: 600 }}>{maskCitizenName(current.citizenName || 'Verified Citizen')}</span>
              </div>
              <div style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '10px', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Current Status</span>
                <span style={{ fontSize: '11.5px', color: isResolved ? '#34D399' : '#F59E0B', fontWeight: 700 }}>
                  ● {current.status?.replace('_', ' ') || 'IN PROGRESS'}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Action Footer with Previous / Next Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            paddingTop: '10px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            {/* Back Button */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              style={{
                height: '40px',
                padding: '0 14px',
                borderRadius: '12px',
                background: currentIndex === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: currentIndex === 0 ? '#64748B' : '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>

            {/* Quick Inspect Button */}
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenGrievance) onOpenGrievance(current.id);
              }}
              style={{
                flex: 1,
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
              }}
            >
              <span>Inspect Complaint</span>
              <ArrowRight size={15} />
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              style={{
                height: '40px',
                padding: '0 14px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
