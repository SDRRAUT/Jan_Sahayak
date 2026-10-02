import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, MapPin, Briefcase, Award, Wrench } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WORKER_CATEGORIES } from '../../data/mockWorkers';

const WAGHOLI_WARDS = [
  'Ward 28 - Ivy Estate / Pune-Nagar Highway',
  'Ward 29 - Kesnand Road & Raisoni Chowk',
  'Ward 27 - Baif Road / Wagholi Central',
  'Ward 30 - Domkhel Road & Ubale Nagar',
  'Ward 31 - Bakori Road & Wagheshwar Temple'
];

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
];

export default function RegisterWorkerModal({ isOpen, onClose, onSuccess }) {
  const { user, registerAsWorker } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '+91 98234 56789');
  const [selectedWard, setSelectedWard] = useState(WAGHOLI_WARDS[0]);
  const [category, setCategory] = useState('plumbing');
  const [skills, setSkills] = useState('Pipe Repair, Leak Detection, Valve Replacement');
  const [experienceYears, setExperienceYears] = useState(5);
  const [baseFarePerHour, setBaseFarePerHour] = useState(240);
  const [verificationType, setVerificationType] = useState('PMC Enrolled Contractor');
  const [verificationId, setVerificationId] = useState('PMC-WAG-TECH-8824');
  const [avatar, setAvatar] = useState(AVATAR_OPTIONS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCategoryChange = (catId) => {
    setCategory(catId);
    const cat = WORKER_CATEGORIES.find(c => c.id === catId);
    if (cat) {
      setBaseFarePerHour(cat.suggestedBaseFare);
      if (cat.skills && cat.skills.length > 0) {
        setSkills(cat.skills.slice(0, 3).join(', '));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const skillsArray = typeof skills === 'string' 
      ? skills.split(',').map(s => s.trim()).filter(Boolean)
      : skills;

    const workerData = {
      name: name.trim() || user?.name || 'Local Technician',
      phone: phone.trim() || '+91 98234 56789',
      ward: selectedWard,
      category,
      skills: skillsArray.length > 0 ? skillsArray : ['General Civic Maintenance'],
      experienceYears: Number(experienceYears) || 3,
      baseFarePerHour: Number(baseFarePerHour) || 200,
      verificationType,
      verificationId,
      avatar,
      isVerified: true,
      availability: 'AVAILABLE'
    };

    setTimeout(() => {
      const savedProfile = registerAsWorker(workerData);
      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        if (onSuccess) onSuccess(savedProfile);
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div className="citizen-bottom-sheet-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="citizen-bottom-sheet-content" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="sheet-handle" />

        {/* Modal Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)',
          borderRadius: '24px 24px 0 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: '#2563EB',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37,99,235,0.25)'
            }}>
              <Wrench style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                  Register as Wagholi Civic Worker
                </h2>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#1D4ED8',
                  background: '#DBEAFE',
                  padding: '2px 8px',
                  borderRadius: '999px'
                }}>
                  PMC Partner
                </span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>
                Receive paid service requests from citizens & direct municipal work orders.
              </p>
            </div>
          </div>

          <button 
            type="button" 
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#64748B',
              padding: '6px',
              borderRadius: '8px'
            }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {isSuccess ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#DCFCE7',
              color: '#16A34A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 24px rgba(22,163,74,0.2)'
            }}>
              <CheckCircle2 style={{ width: '36px', height: '36px' }} />
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
              Worker Profile Created!
            </h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#475569' }}>
              Your profile is verified and active in the Wagholi Service Network.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }}>
            {/* 1. Category Selection */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                Select Your Primary Trade / Service Category *
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '8px'
              }}>
                {WORKER_CATEGORIES.map(cat => {
                  const isSelected = category === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                        background: isSelected ? '#EFF6FF' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{cat.icon}</span>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: isSelected ? '#1D4ED8' : '#0F172A', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {cat.name}
                        </div>
                        <div style={{ fontSize: '10px', color: '#64748B' }}>
                          ₹{cat.suggestedBaseFare}/hr base
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Personal & Contact Info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Technician / Worker Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Rahul Raut"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    fontWeight: 600,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Mobile Contact Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98234 56789"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    fontWeight: 600,
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* 3. Ward & Service Area */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Primary Operational Ward in Wagholi *
              </label>
              <select
                value={selectedWard}
                onChange={e => setSelectedWard(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  fontWeight: 600,
                  boxSizing: 'border-box',
                  background: '#FFFFFF'
                }}
              >
                {WAGHOLI_WARDS.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            {/* 4. Skills & Experience & Base Rate */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '16px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Specific Skills (Comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                  placeholder="e.g. Pipe Jointing, Motor Overhaul, Pressure Testing"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Experience (Years) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  required
                  value={experienceYears}
                  onChange={e => setExperienceYears(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    fontWeight: 600,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Base Rate (₹ / Hour) *
                </label>
                <input
                  type="number"
                  min="100"
                  max="2000"
                  step="10"
                  required
                  value={baseFarePerHour}
                  onChange={e => setBaseFarePerHour(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#0F172A',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* 5. Verification Documents */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '14px',
              padding: '14px 16px',
              marginBottom: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <ShieldCheck style={{ width: '16px', height: '16px', color: '#16A34A' }} />
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>
                  Verification & Credential Details
                </span>
                <span style={{ fontSize: '11px', color: '#64748B' }}>(For trust & govt dispatch)</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Document Type
                  </label>
                  <select
                    value={verificationType}
                    onChange={e => setVerificationType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '12px',
                      background: '#FFFFFF'
                    }}
                  >
                    <option value="PMC Enrolled Contractor">PMC Enrolled Contractor Badge</option>
                    <option value="Govt Trade Certificate (ITI/NCVT)">Govt Trade Certificate (ITI / NCVT)</option>
                    <option value="Aadhaar Verified">Aadhaar Card (Identity Verified)</option>
                    <option value="PMRDA Registered Vendor">PMRDA Registered Technician</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Registration / Certificate No.
                  </label>
                  <input
                    type="text"
                    value={verificationId}
                    onChange={e => setVerificationId(e.target.value)}
                    placeholder="e.g. PMC-WAG-TECH-8824"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '12px',
                      fontWeight: 600,
                      fontFamily: 'monospace',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 6. Profile Avatar Preview */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Choose Profile Photo
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                {AVATAR_OPTIONS.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Avatar ${idx + 1}`}
                    onClick={() => setAvatar(img)}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: avatar === img ? '3px solid #2563EB' : '2px solid transparent',
                      boxShadow: avatar === img ? '0 0 0 2px rgba(37,99,235,0.3)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Submit CTA */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '10px 22px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.3)'
                }}
              >
                <Sparkles style={{ width: '15px', height: '15px' }} />
                <span>{isSubmitting ? 'Registering...' : 'Register Worker Profile'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
