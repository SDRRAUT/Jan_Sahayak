import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  Briefcase, 
  CheckCircle2, 
  Save, 
  Bell, 
  Globe, 
  Settings, 
  Shield, 
  Smartphone, 
  MessageSquare, 
  RefreshCw,
  Wrench,
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp, DEMO_USERS } from '../../context/AppContext';
import RegisterWorkerModal from '../worker/RegisterWorkerModal';
import { WORKER_CATEGORIES } from '../../data/mockWorkers';

export default function UserProfileModal({ isOpen, onClose, initialTab = 'profile' }) {
  const { 
    user, 
    role, 
    updateUserSettings,
    currentWorkerProfile,
    registerAsWorker,
    updateWorkerAvailability
  } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(initialTab); // 'profile' | 'worker' | 'settings'
  const [showRegisterWorkerModal, setShowRegisterWorkerModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Mobile touch gesture for easy bottom-sheet dismiss
  const touchStartY = useRef(null);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartY.current !== null) {
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;
      if (deltaY > 50) {
        onClose();
      }
      touchStartY.current = null;
    }
  };

  // Fallback profile based on role
  const currentRole = user?.role || role || 'citizen';
  const defaultProfile = DEMO_USERS[currentRole] || DEMO_USERS.citizen;

  // Form states (Editable basic info & contact)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  
  // Role specific fields
  const [ward, setWard] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [zone, setZone] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [office, setOffice] = useState('');

  // Settings states
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);
  const [notifySms, setNotifySms] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [preferredLang, setPreferredLang] = useState('hi');
  const [voiceAssistance, setVoiceAssistance] = useState(true);

  // Sync state whenever modal opens or user changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setSaveSuccess(false);
      setErrorMsg('');

      const source = user || defaultProfile;
      setName(source.name || '');
      setEmail(source.email || '');
      setPhone(source.phone || '+91 98230-12345');
      setAltPhone(source.altPhone || '+91 98230-90021');

      setWard(source.ward || 'Wagholi Ward 29 (Ivy Estate & Kesnand Road)');
      setPincode(source.pincode || '412207');
      setAddress(source.address || 'Ivy Estate, Kesnand Road, Wagholi, Pune');
      
      setDepartment(source.department || (currentRole === 'super_admin' ? 'Maharashtra Secretariat & IT Governance' : 'PMC Water Supply Department'));
      setDesignation(source.designation || (currentRole === 'super_admin' ? 'Principal Secretary, IAS' : 'Assistant Executive Engineer'));
      setZone(source.zone || 'Wagholi Sub-Division (Wards 27-31, Pune)');
      setEmployeeId(source.employeeId || (currentRole === 'super_admin' ? 'MAH-IAS-0042' : 'PMC-ENG-2024'));
      setOffice(source.office || 'PMC Main Administrative Building, Pune');

      if (source.settings) {
        setNotifyWhatsapp(source.settings.notifyWhatsapp ?? true);
        setNotifySms(source.settings.notifySms ?? true);
        setNotifyEmail(source.settings.notifyEmail ?? true);
        setPreferredLang(source.settings.preferredLang || 'hi');
        setVoiceAssistance(source.settings.voiceAssistance ?? true);
      }
    }
  }, [isOpen, initialTab, user, currentRole]);

  if (!isOpen) return null;

  // Role visual metadata
  const getRoleMeta = () => {
    switch (currentRole) {
      case 'super_admin':
        return {
          label: 'Super Administrator (IAS)',
          badgeColor: '#4338CA',
          badgeBg: '#EEF2FF',
          border: '#C7D2FE',
          icon: ShieldCheck,
          accent: '#4338CA'
        };
      case 'civic_officer':
      case 'officer':
      case 'dept_admin':
        return {
          label: 'Govt Civic Officer (PMC)',
          badgeColor: '#059669',
          badgeBg: '#ECFDF5',
          border: '#A7F3D0',
          icon: Briefcase,
          accent: '#059669'
        };
      default:
        return {
          label: 'Verified Citizen',
          badgeColor: '#2563EB',
          badgeBg: '#EFF6FF',
          border: '#BFDBFE',
          icon: User,
          accent: '#2563EB'
        };
    }
  };

  const roleMeta = getRoleMeta();
  const RoleIcon = roleMeta.icon;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Full name cannot be empty');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid Gmail / Email address');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');

    try {
      const updatedData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        altPhone: altPhone.trim(),
        ward,
        pincode,
        address,
        department,
        designation,
        zone,
        employeeId,
        office,
        settings: {
          notifyWhatsapp,
          notifySms,
          notifyEmail,
          preferredLang,
          voiceAssistance
        }
      };

      if (updateUserSettings) {
        await updateUserSettings(updatedData);
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      setErrorMsg('Failed to save profile changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="user-profile-modal-overlay">
      {/* Click outside to close backdrop */}
      <div 
        onClick={onClose} 
        style={{ position: 'absolute', inset: 0 }}
      />

      {/* Modal Dialog Card */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        className="user-profile-modal-card"
      >
        {/* Top Header with Aesthetic Gradient Banner */}
        <div 
          className="user-profile-modal-header"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            background: `linear-gradient(135deg, ${roleMeta.badgeBg} 0%, #FFFFFF 100%)`,
            padding: '12px 20px 14px 20px',
            borderBottom: `1px solid ${roleMeta.border}`,
            position: 'relative'
          }}
        >
          {/* Mobile Touch Drag Handle */}
          <div 
            className="mobile-sheet-drag-handle" 
            onClick={onClose} 
            title="Swipe or tap down to close"
            aria-label="Dismiss sheet"
          />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile modal"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.85)',
              border: '1px solid rgba(15, 23, 42, 0.1)',
              color: '#64748B',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 150ms ease'
            }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>

          {/* User Profile Header Brief */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Avatar with role icon badge */}
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: `linear-gradient(135deg, ${roleMeta.accent} 0%, #1E2653 100%)`,
                color: '#FFFFFF',
                fontSize: '22px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 12px ${roleMeta.badgeColor}33`
              }}>
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{
                position: 'absolute',
                bottom: '-4px',
                right: '-4px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: roleMeta.accent,
                border: '2px solid #FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <RoleIcon style={{ width: '10px', height: '10px' }} />
              </div>
            </div>

            {/* Name + Role Badge */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 
                  id="profile-modal-title" 
                  style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}
                >
                  {name || 'JanSahayak User'}
                </h3>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: roleMeta.badgeColor,
                  background: roleMeta.badgeBg,
                  border: `1px solid ${roleMeta.border}`,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px'
                }}>
                  <CheckCircle2 style={{ width: '10px', height: '10px' }} />
                  {roleMeta.label}
                </span>
              </div>

              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span>{email || 'No email attached'}</span>
                <span>•</span>
                <span>{phone || 'No phone attached'}</span>
              </div>
            </div>
          </div>

          {/* Tab Switcher: Basic Info vs Worker Profile vs Account Settings */}
          <div style={{
            display: 'flex',
            gap: '6px',
            marginTop: '14px',
            background: 'rgba(255, 255, 255, 0.7)',
            padding: '3px',
            borderRadius: '10px',
            border: '1px solid rgba(15, 23, 42, 0.08)'
          }}>
            <button
              type="button"
              onClick={() => { setActiveTab('profile'); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '7px 10px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'profile' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'profile' ? '#0F172A' : '#64748B',
                fontWeight: activeTab === 'profile' ? 700 : 500,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                boxShadow: activeTab === 'profile' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 150ms ease'
              }}
            >
              <User style={{ width: '13px', height: '13px', color: activeTab === 'profile' ? roleMeta.accent : '#64748B' }} />
              <span>Basic Info</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('worker'); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '7px 10px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'worker' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'worker' ? '#065F46' : '#64748B',
                fontWeight: activeTab === 'worker' ? 700 : 500,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                boxShadow: activeTab === 'worker' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 150ms ease'
              }}
            >
              <Wrench style={{ width: '13px', height: '13px', color: activeTab === 'worker' ? '#065F46' : '#64748B' }} />
              <span>Worker Profile</span>
              {currentWorkerProfile && (
                <span style={{ fontSize: '9px', background: '#DCFCE7', color: '#166534', padding: '1px 5px', borderRadius: '999px', fontWeight: 800 }}>
                  ACTIVE
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('settings'); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '7px 10px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'settings' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'settings' ? '#0F172A' : '#64748B',
                fontWeight: activeTab === 'settings' ? 700 : 500,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                boxShadow: activeTab === 'settings' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 150ms ease'
              }}
            >
              <Settings style={{ width: '13px', height: '13px', color: activeTab === 'settings' ? roleMeta.accent : '#64748B' }} />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
          <div className="user-profile-modal-body" style={{ flex: 1, overflowY: 'auto' }}>
            
            {/* Feedback Banners */}
            {saveSuccess && (
              <div style={{
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#065F46',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '14px'
              }}>
                <CheckCircle2 style={{ width: '16px', height: '16px', color: '#059669', flexShrink: 0 }} />
                <span>Profile details and settings have been updated successfully!</span>
              </div>
            )}

            {errorMsg && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#991B1B',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '14px'
              }}>
                <X style={{ width: '16px', height: '16px', color: '#DC2626', flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* =====================================================================
                TAB 1: BASIC INFO & PROFILE (Edit & Updates)
                ===================================================================== */}
            {activeTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Full Name */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '5px' }}>
                    Full Name
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '8px 12px' }}>
                    <User style={{ width: '14px', height: '14px', color: '#64748B' }} />
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aditya Verma"
                      required
                      style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '13px', fontWeight: 600, color: '#0F172A', outline: 'none' }}
                    />
                  </div>
                </div>

                {/* Email / Gmail Contact */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Email Address (Gmail / Govt ID)
                    </label>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#059669', background: '#DCFCE7', padding: '1px 6px', borderRadius: '4px' }}>
                      Primary Contact & Login
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '8px 12px' }}>
                    <Mail style={{ width: '14px', height: '14px', color: '#64748B' }} />
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. aditya@citizen.in or user@gmail.com"
                      required
                      style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '13px', fontWeight: 600, color: '#0F172A', outline: 'none' }}
                    />
                  </div>
                </div>

                {/* Phone & Alternate Contact Grid */}
                <div className="user-profile-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '5px' }}>
                      Primary Mobile Contact
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '8px 12px' }}>
                      <Phone style={{ width: '14px', height: '14px', color: '#64748B' }} />
                      <input 
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98712-88210"
                        style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '13px', fontWeight: 600, color: '#0F172A', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '5px' }}>
                      Emergency / WhatsApp
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '8px 12px' }}>
                      <Smartphone style={{ width: '14px', height: '14px', color: '#64748B' }} />
                      <input 
                        type="text"
                        value={altPhone}
                        onChange={(e) => setAltPhone(e.target.value)}
                        placeholder="+91 98111-90021"
                        style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '13px', fontWeight: 600, color: '#0F172A', outline: 'none' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Role-Specific Details Section */}
                <div style={{
                  marginTop: '4px',
                  background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <RoleIcon style={{ width: '14px', height: '14px', color: roleMeta.accent }} />
                    <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      {currentRole === 'citizen' ? 'Citizen Residence & Jurisdiction' : currentRole === 'super_admin' ? 'Administrative Secretariat Profile' : 'Department Operational Roster'}
                    </span>
                  </div>

                  {/* Citizen Fields */}
                  {currentRole === 'citizen' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div className="user-profile-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '3px' }}>Assigned Ward</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px 10px' }}>
                            <MapPin style={{ width: '12px', height: '12px', color: '#64748B' }} />
                            <input 
                              type="text"
                              value={ward}
                              onChange={(e) => setWard(e.target.value)}
                              placeholder="e.g. Wagholi Ward 29 (Ivy Estate)"
                              style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '12px', fontWeight: 600, color: '#0F172A', outline: 'none' }}
                            />
                          </div>
                        </div>

                        <div>
                          <label style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '3px' }}>Pincode</label>
                          <input 
                            type="text"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            placeholder="412207"
                            style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px 10px', width: '100%', fontSize: '12px', fontWeight: 600, color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '3px' }}>Residential Address</label>
                        <input 
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="e.g. Ivy Estate, Kesnand Road, Wagholi"
                          style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px 10px', width: '100%', fontSize: '12px', fontWeight: 600, color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Civic Officer Fields */}
                  {(currentRole === 'civic_officer' || currentRole === 'officer' || currentRole === 'dept_admin') && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div className="user-profile-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '3px' }}>Government Department</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px 10px' }}>
                            <Building2 style={{ width: '12px', height: '12px', color: '#059669' }} />
                            <input 
                              type="text"
                              value={department}
                              onChange={(e) => setDepartment(e.target.value)}
                              placeholder="e.g. PMC Water Supply Department"
                              style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '12px', fontWeight: 600, color: '#0F172A', outline: 'none' }}
                            />
                          </div>
                        </div>

                        <div>
                          <label style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '3px' }}>Employee / Badge ID</label>
                          <input 
                            type="text"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            placeholder="PMC-ENG-2024"
                            style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px 10px', width: '100%', fontSize: '12px', fontWeight: 600, color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>

                      <div className="user-profile-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '3px' }}>Official Designation</label>
                          <input 
                            type="text"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            placeholder="Assistant Executive Engineer"
                            style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px 10px', width: '100%', fontSize: '12px', fontWeight: 600, color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '3px' }}>Field Zone Jurisdiction</label>
                          <input 
                            type="text"
                            value={zone}
                            onChange={(e) => setZone(e.target.value)}
                            placeholder="Wagholi Sub-Division (Wards 27-31, Pune)"
                            style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px 10px', width: '100%', fontSize: '12px', fontWeight: 600, color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Super Admin Fields */}
                  {currentRole === 'super_admin' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div className="user-profile-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '3px' }}>Administrative Rank</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px 10px' }}>
                            <ShieldCheck style={{ width: '12px', height: '12px', color: '#4338CA' }} />
                            <input 
                              type="text"
                              value={designation}
                              onChange={(e) => setDesignation(e.target.value)}
                              placeholder="Principal Secretary, IAS"
                              style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '12px', fontWeight: 600, color: '#0F172A', outline: 'none' }}
                            />
                          </div>
                        </div>

                        <div>
                          <label style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '3px' }}>Officer Code</label>
                          <input 
                            type="text"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            placeholder="MAH-IAS-0042"
                            style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px 10px', width: '100%', fontSize: '12px', fontWeight: 600, color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '3px' }}>Secretariat / Ministry Office</label>
                        <input 
                          type="text"
                          value={office}
                          onChange={(e) => setOffice(e.target.value)}
                          placeholder="PMC Main Administrative Building, Shivajinagar, Pune"
                          style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px 10px', width: '100%', fontSize: '12px', fontWeight: 600, color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* =====================================================================
                TAB: WORKER PROFILE & PORTAL (Requested in Profile Section)
                ===================================================================== */}
            {activeTab === 'worker' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {!currentWorkerProfile ? (
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '20px',
                    padding: '24px 20px',
                    textAlign: 'center',
                    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
                  }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '20px',
                      background: '#ECFDF5',
                      color: '#065F46',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      border: '1px solid #A7F3D0'
                    }}>
                      <Wrench style={{ width: '30px', height: '30px' }} />
                    </div>

                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>
                      Jan_Sahayak Wagholi Worker Portal
                    </h2>
                    <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, maxWidth: '480px', margin: '0 auto 20px' }}>
                      Join Wagholi’s verified civic technician network. Receive direct paid service orders from local citizens and government field officers without middleman commissions.
                    </p>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '10px',
                      textAlign: 'left',
                      marginBottom: '24px'
                    }}>
                      <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                          ⚡ Instant Direct Orders
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748B', lineHeight: 1.4 }}>
                          Get real-time booking alerts when residents or PMC engineers need repairs in your ward.
                        </div>
                      </div>

                      <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                          💰 Transparent Dynamic Fares
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748B', lineHeight: 1.4 }}>
                          Fair distance and duration pricing with automatic priority surges for emergency jobs.
                        </div>
                      </div>

                      <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                          🏛️ PMC Municipal Dispatch
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748B', lineHeight: 1.4 }}>
                          Direct institutional contracting for grievance resolution across Wagholi wards.
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => setShowRegisterWorkerModal(true)}
                        style={{
                          padding: '11px 24px',
                          borderRadius: '12px',
                          border: 'none',
                          background: '#065F46',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '13px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 14px rgba(6, 78, 59, 0.25)'
                        }}
                      >
                        <span>Register as Worker Profile</span>
                        <ArrowRight style={{ width: '15px', height: '15px' }} />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          registerAsWorker({
                            name: name || user?.name || 'Rahul Raut (Technician)',
                            phone: phone || user?.phone || '+91 98234 56789',
                            ward: ward || 'Ward 28 - Ivy Estate / Pune-Nagar Hwy',
                            category: 'plumbing',
                            skills: ['Pipe Repair', 'HDPE Welding', 'Motor Overhaul', 'Leak Detection'],
                            experienceYears: 6,
                            baseFarePerHour: 250,
                            verificationType: 'PMC Enrolled Contractor',
                            verificationId: 'PMC-WAG-TECH-8824',
                            avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80',
                            isVerified: true,
                            availability: 'AVAILABLE'
                          });
                        }}
                        style={{
                          padding: '11px 18px',
                          borderRadius: '12px',
                          border: '1px solid #CBD5E1',
                          background: '#FFFFFF',
                          color: '#334155',
                          fontWeight: 600,
                          fontSize: '13px',
                          cursor: 'pointer'
                        }}
                      >
                        1-Click Quick Demo Profile
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '20px',
                    padding: '20px',
                    boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={currentWorkerProfile.avatar}
                          alt={currentWorkerProfile.name}
                          style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #065F46' }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                              {currentWorkerProfile.name}
                            </h3>
                            <span style={{ fontSize: '11px', color: '#065F46', background: '#D1FAE5', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                              PMC Partner
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                            {currentWorkerProfile.category} · {currentWorkerProfile.experienceYears || 5} yrs exp · Base ₹{currentWorkerProfile.baseFarePerHour}/hr
                          </div>
                        </div>
                      </div>

                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '999px',
                        background: currentWorkerProfile.availability === 'AVAILABLE' ? '#DCFCE7' : '#FEF3C7',
                        color: currentWorkerProfile.availability === 'AVAILABLE' ? '#166534' : '#B45309'
                      }}>
                        {currentWorkerProfile.availability === 'AVAILABLE' ? '🟢 AVAILABLE' : '🟡 BUSY'}
                      </span>
                    </div>

                    <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '12px 14px', marginBottom: '16px', fontSize: '12px', color: '#475569' }}>
                      <div style={{ marginBottom: '6px' }}>
                        <strong style={{ color: '#0F172A' }}>Assigned Ward: </strong>{currentWorkerProfile.ward}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {(currentWorkerProfile.skills || []).map((sk, i) => (
                          <span key={i} style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                        Change Availability Status
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {['AVAILABLE', 'BUSY', 'OFFLINE'].map(status => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => updateWorkerAvailability(currentWorkerProfile.id, status)}
                            style={{
                              flex: 1,
                              padding: '7px 10px',
                              borderRadius: '8px',
                              border: currentWorkerProfile.availability === status ? '2px solid #065F46' : '1px solid #CBD5E1',
                              background: currentWorkerProfile.availability === status ? '#ECFDF5' : '#FFFFFF',
                              color: currentWorkerProfile.availability === status ? '#065F46' : '#64748B',
                              fontWeight: 700,
                              fontSize: '11.5px',
                              cursor: 'pointer'
                            }}
                          >
                            {status === 'AVAILABLE' ? '🟢 Available' : status === 'BUSY' ? '🟡 Busy' : '⚪ Offline'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setShowRegisterWorkerModal(true)}
                        style={{
                          flex: 1,
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #CBD5E1',
                          background: '#FFFFFF',
                          color: '#334155',
                          fontWeight: 700,
                          fontSize: '12.5px',
                          cursor: 'pointer'
                        }}
                      >
                        Edit Profile
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          navigate('/worker');
                        }}
                        style={{
                          flex: 1.5,
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: 'none',
                          background: '#065F46',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '12.5px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 12px rgba(6, 78, 59, 0.25)'
                        }}
                      >
                        <span>Open Full Dashboard</span>
                        <ArrowRight style={{ width: '14px', height: '14px' }} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =====================================================================
                TAB 2: BASIC SETTINGS & NOTIFICATIONS
                ===================================================================== */}
            {activeTab === 'settings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Notification Channels Box */}
                <div style={{
                  background: '#F8FAFC',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  padding: '12px 14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <Bell style={{ width: '14px', height: '14px', color: '#2563EB' }} />
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>Contact & Notification Channels</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* WhatsApp */}
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#FFFFFF',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      cursor: 'pointer'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <MessageSquare style={{ width: '13px', height: '13px' }} />
                        </div>
                        <div>
                          <strong style={{ fontSize: '12px', color: '#0F172A', display: 'block' }}>WhatsApp Civic Alerts</strong>
                          <span style={{ fontSize: '10px', color: '#64748B' }}>Receive SLA timer & ticket resolution photos</span>
                        </div>
                      </div>
                      <input 
                        type="checkbox"
                        checked={notifyWhatsapp}
                        onChange={(e) => setNotifyWhatsapp(e.target.checked)}
                        style={{ width: '16px', height: '16px', accentColor: '#16A34A', cursor: 'pointer' }}
                      />
                    </label>

                    {/* SMS */}
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#FFFFFF',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      cursor: 'pointer'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Smartphone style={{ width: '13px', height: '13px' }} />
                        </div>
                        <div>
                          <strong style={{ fontSize: '12px', color: '#0F172A', display: 'block' }}>SMS Field Updates</strong>
                          <span style={{ fontSize: '10px', color: '#64748B' }}>Direct text alerts for assigned work orders</span>
                        </div>
                      </div>
                      <input 
                        type="checkbox"
                        checked={notifySms}
                        onChange={(e) => setNotifySms(e.target.checked)}
                        style={{ width: '16px', height: '16px', accentColor: '#2563EB', cursor: 'pointer' }}
                      />
                    </label>

                    {/* Email / Gmail */}
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#FFFFFF',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      cursor: 'pointer'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Mail style={{ width: '13px', height: '13px' }} />
                        </div>
                        <div>
                          <strong style={{ fontSize: '12px', color: '#0F172A', display: 'block' }}>Gmail / Official Email Reports</strong>
                          <span style={{ fontSize: '10px', color: '#64748B' }}>Weekly civic digest & municipal audit copies</span>
                        </div>
                      </div>
                      <input 
                        type="checkbox"
                        checked={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.checked)}
                        style={{ width: '16px', height: '16px', accentColor: '#7C3AED', cursor: 'pointer' }}
                      />
                    </label>
                  </div>
                </div>

                {/* Preferred Language */}
                <div style={{
                  background: '#F8FAFC',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  padding: '12px 14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Globe style={{ width: '14px', height: '14px', color: '#059669' }} />
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>Language & Voice Assistance</span>
                  </div>

                  <div className="user-profile-grid-2col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '8px', marginBottom: '10px' }}>
                    {[
                      { key: 'hi', label: 'हिन्दी (Hindi)' },
                      { key: 'en', label: 'English' },
                      { key: 'hinglish', label: 'Hinglish (Mix)' }
                    ].map(lang => (
                      <button
                        key={lang.key}
                        type="button"
                        onClick={() => setPreferredLang(lang.key)}
                        style={{
                          padding: '7px 6px',
                          borderRadius: '8px',
                          fontSize: '11.5px',
                          fontWeight: preferredLang === lang.key ? 700 : 500,
                          color: preferredLang === lang.key ? '#059669' : '#475569',
                          background: preferredLang === lang.key ? '#ECFDF5' : '#FFFFFF',
                          border: preferredLang === lang.key ? '1.5px solid #059669' : '1px solid #CBD5E1',
                          cursor: 'pointer',
                          transition: 'all 120ms ease'
                        }}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox"
                      checked={voiceAssistance}
                      onChange={(e) => setVoiceAssistance(e.target.checked)}
                      style={{ width: '15px', height: '15px', accentColor: '#059669' }}
                    />
                    <span style={{ fontSize: '11.5px', color: '#475569', fontWeight: 500 }}>
                      Enable automatic voice narration & Bhasini speech-to-text
                    </span>
                  </label>
                </div>

                {/* Account Security Box */}
                <div style={{
                  background: '#F8FAFC',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  padding: '12px 14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Shield style={{ width: '14px', height: '14px', color: '#4338CA' }} />
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>Security & Credentials</span>
                    </div>
                    <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 700, background: '#ECFDF5', padding: '2px 8px', borderRadius: '999px' }}>
                      ✓ Pune Single Sign-On Verified
                    </span>
                  </div>

                  <div style={{ fontSize: '11.5px', color: '#64748B', lineHeight: 1.4 }}>
                    Logged in with authenticated municipal credentials. Role permissions are enforced through JanSahayak Sovereign Engine.
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Modal Footer with Actions */}
          {activeTab === 'worker' ? (
            <div className="user-profile-modal-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Wrench style={{ width: '13px', height: '13px', color: '#065F46' }} />
                <span>{currentWorkerProfile ? 'Verified PMC Civic Technician' : 'PMC Wagholi Technician Network'}</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '8px 18px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#334155',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          ) : (
            <div className="user-profile-modal-footer">
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#475569',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                style={{
                  padding: '8px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#1E2653',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(30, 38, 83, 0.25)',
                  transition: 'all 150ms ease'
                }}
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="animate-spin" style={{ width: '14px', height: '14px' }} />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save style={{ width: '14px', height: '14px' }} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>

      </div>

      {/* Embedded Register Worker Modal */}
      <RegisterWorkerModal
        isOpen={showRegisterWorkerModal}
        onClose={() => setShowRegisterWorkerModal(false)}
        onSuccess={() => {
          setShowRegisterWorkerModal(false);
          setActiveTab('worker');
        }}
      />
    </div>
  );
}
