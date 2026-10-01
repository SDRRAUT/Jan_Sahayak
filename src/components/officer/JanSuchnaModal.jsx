import React, { useState } from 'react';
import { 
  X, 
  Radio, 
  Clock, 
  MapPin, 
  Send, 
  AlertTriangle, 
  Building2, 
  Phone, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Droplets,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function JanSuchnaModal({ isOpen, onClose }) {
  const { broadcastJanSuchna, user } = useApp();

  const [title, setTitle] = useState('⚡ 4-Hour Scheduled Electricity Grid Maintenance — Wagholi & Ward 14');
  const [category, setCategory] = useState('Electricity / Power Grid');
  const [ward, setWard] = useState('Wagholi (Ward 14 / Sector 14)');
  const [affectedAreas, setAffectedAreas] = useState('Wagholi Sub-Division, Pocket 2, Main Market, Sector 14');
  const [startTime, setStartTime] = useState('Today, 10:00 AM');
  const [duration, setDuration] = useState('4 Hours');
  const [severity, setSeverity] = useState('HIGH');
  const [instructions, setInstructions] = useState('Sub-station transformer upgrade underway. High-voltage backup systems active for medical centers. Please keep essential devices charged and store necessary water.');
  const [helpline, setHelpline] = useState('1800-11-2222 / +91 98111-90021');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    broadcastJanSuchna({
      title,
      category,
      ward,
      affectedAreas: affectedAreas.split(',').map(s => s.trim()),
      startTime,
      duration,
      severity,
      instructions,
      helpline,
      officerName: user?.name || 'Er. Sanjay Sharma',
      officerDesignation: user?.designation || 'Government Officer & Executive Engineer',
      department: user?.department || 'PMC Water Supply Department & PMC'
    });

    setIsSubmitting(false);
    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '680px',
        width: '100%',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.4)',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        animation: 'modalCenterScale 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                background: '#F59E0B',
                color: '#78350F',
                padding: '2px 8px',
                borderRadius: '999px'
              }}>
                📢 PUBLIC CIVIC BROADCAST
              </span>
              <span style={{ fontSize: '11px', color: '#C7D2FE' }}>
                Jan Suchna (जन सूचना) Engine
              </span>
            </div>

            <h2 style={{ fontSize: '19px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
              Create & Dispatch Jan Suchna Notice
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        {/* Form Body */}
        {broadcastSuccess ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#ECFDF5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <CheckCircle2 style={{ width: '36px', height: '36px' }} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
              Jan Suchna Broadcast Dispatched! 📢
            </h3>
            <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '440px', margin: '0 auto' }}>
              All residents in <strong>{ward}</strong> have received this high-priority public advisory banner and notification.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Title */}
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                Advisory Headline (Headline & Outage Notice):
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{
                  width: '100%',
                  height: '42px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  padding: '0 14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Grid Row: Category & Ward */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Category:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    padding: '0 10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    background: '#FFFFFF'
                  }}
                >
                  <option value="Electricity / Power Grid">⚡ Electricity / Power Grid</option>
                  <option value="Water Supply">💧 Drinking Water / Pipe Maintenance</option>
                  <option value="Roads & Resurfacing">🛣️ Road Resurfacing / PWD</option>
                  <option value="Sanitation & Pest Control">🧹 Sanitation & Fogging Drive</option>
                  <option value="Public Safety Advisory">⚠️ Public Safety Advisory</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Target Territory / Ward:
                </label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    padding: '0 10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    background: '#FFFFFF'
                  }}
                >
                  <option value="Wagholi Ward 27 (Nagar Road Highway & Raisoni Chowk)">Wagholi Ward 27 (Nagar Road Highway & Raisoni Chowk)</option>
                  <option value="Wagholi Ward 28 (Baif Road & Market Yard)">Wagholi Ward 28 (Baif Road & Market Yard)</option>
                  <option value="Wagholi Ward 29 (Ivy Estate & Kesnand Road)">Wagholi Ward 29 (Ivy Estate & Kesnand Road)</option>
                  <option value="Wagholi Ward 30 (Domkhel & Ubale Nagar)">Wagholi Ward 30 (Domkhel & Ubale Nagar)</option>
                  <option value="Wagholi Ward 31 (Bakori Road & Wagheshwar)">Wagholi Ward 31 (Bakori Road & Wagheshwar)</option>
                  <option value="All Wagholi Sub-Division Wards">All Wagholi Sub-Division Wards (Townwide Broadcast)</option>
                </select>
              </div>
            </div>

            {/* Grid Row: Timing & Duration */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Start Time:
                </label>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="e.g. Today, 10:00 AM"
                  style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    padding: '0 12px',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Expected Outage Duration:
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 4 Hours (10 AM - 2 PM)"
                  style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    padding: '0 12px',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Citizen Advisory Instructions */}
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                Citizen Guidelines & Precautions:
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
                required
                style={{
                  width: '100%',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  padding: '10px 12px',
                  fontSize: '12.5px',
                  lineHeight: 1.5,
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Helpline Number */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Emergency Contact & Helpline:
              </label>
              <input
                type="text"
                value={helpline}
                onChange={(e) => setHelpline(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  padding: '0 12px',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Officer Signature Badge */}
            <div style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              fontSize: '12px',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <ShieldCheck style={{ width: '16px', height: '16px', color: '#059669' }} />
              <span>Broadcasting Officer: <strong>{user?.name || 'Er. Sanjay Sharma'}</strong> ({user?.designation || 'Executive Engineer'})</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                minHeight: '46px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #1E1B4B 0%, #4338CA 100%)',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(67, 56, 202, 0.3)',
                marginTop: '8px'
              }}
            >
              <Radio style={{ width: '16px', height: '16px' }} />
              <span>Broadcast Jan Suchna to {ward}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
