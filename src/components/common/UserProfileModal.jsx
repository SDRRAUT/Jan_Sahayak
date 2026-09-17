import React, { useState, useEffect } from 'react';
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
  RefreshCw
} from 'lucide-react';
import { useApp, DEMO_USERS } from '../../context/AppContext';

export default function UserProfileModal({ isOpen, onClose, initialTab = 'profile' }) {
  const { user, role, updateUserSettings } = useApp();

  const [activeTab, setActiveTab] = useState(initialTab); // 'profile' or 'settings'
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
      setPhone(source.phone || '+91 98712-88210');
      setAltPhone(source.altPhone || '+91 98111-90021');

      setWard(source.ward || 'Ward 14 (Rohini Sector 14)');
      setPincode(source.pincode || '110085');
      setAddress(source.address || 'Pocket 2, Sector 14, Rohini, New Delhi');
      
      setDepartment(source.department || (currentRole === 'super_admin' ? 'Secretariat & IT Governance' : 'Delhi Jal Board (DJB)'));
      setDesignation(source.designation || (currentRole === 'super_admin' ? 'Principal Secretary, IAS' : 'Assistant Executive Engineer'));
      setZone(source.zone || 'Zone North-West (Rohini)');
      setEmployeeId(source.employeeId || (currentRole === 'super_admin' ? 'DEL-IAS-0042' : 'DJB-ENG-2024'));
      setOffice(source.office || 'Players Building, Delhi Secretariat');

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
          label: 'Govt Civic Officer (DJB)',
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
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)'
    }}>
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
        style={{
          position: 'relative',
          background: '#FFFFFF',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '540px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.08)',
          overflow: 'hidden',
          zIndex: 1
        }}
      >
        {/* Top Header with Aesthetic Gradient Banner */}
        <div style={{
          background: `linear-gradient(135deg, ${roleMeta.badgeBg} 0%, #FFFFFF 100%)`,
          padding: '18px 20px 14px 20px',
          borderBottom: `1px solid ${roleMeta.border}`,
          position: 'relative'
        }}>
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

          {/* Tab Switcher: My Profile vs Account Settings */}
          <div style={{
            display: 'flex',
            gap: '8px',
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
                padding: '7px 12px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'profile' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'profile' ? '#0F172A' : '#64748B',
                fontWeight: activeTab === 'profile' ? 700 : 500,
                fontSize: '12.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: activeTab === 'profile' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 150ms ease'
              }}
            >
              <User style={{ width: '13px', height: '13px', color: activeTab === 'profile' ? roleMeta.accent : '#64748B' }} />
              <span>Basic Info & Profile</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('settings'); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '7px 12px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'settings' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'settings' ? '#0F172A' : '#64748B',
                fontWeight: activeTab === 'settings' ? 700 : 500,
                fontSize: '12.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: activeTab === 'settings' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 150ms ease'
              }}
            >
              <Settings style={{ width: '13px', height: '13px', color: activeTab === 'settings' ? roleMeta.accent : '#64748B' }} />
              <span>Basic Settings & Alerts</span>
            </button>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
          <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
            
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '3px' }}>Assigned Ward</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px 10px' }}>
                            <MapPin style={{ width: '12px', height: '12px', color: '#64748B' }} />
                            <input 
                              type="text"
                              value={ward}
                              onChange={(e) => setWard(e.target.value)}
                              placeholder="e.g. Ward 14 (Rohini)"
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
                            placeholder="110085"
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
                          placeholder="e.g. Pocket 2, Sector 14, Rohini"
                          style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px 10px', width: '100%', fontSize: '12px', fontWeight: 600, color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Civic Officer Fields */}
                  {(currentRole === 'civic_officer' || currentRole === 'officer' || currentRole === 'dept_admin') && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '3px' }}>Government Department</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px 10px' }}>
                            <Building2 style={{ width: '12px', height: '12px', color: '#059669' }} />
                            <input 
                              type="text"
                              value={department}
                              onChange={(e) => setDepartment(e.target.value)}
                              placeholder="e.g. Delhi Jal Board (DJB)"
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
                            placeholder="DJB-ENG-2024"
                            style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px 10px', width: '100%', fontSize: '12px', fontWeight: 600, color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
                            placeholder="Zone North-West (Rohini)"
                            style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px 10px', width: '100%', fontSize: '12px', fontWeight: 600, color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Super Admin Fields */}
                  {currentRole === 'super_admin' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px' }}>
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
                            placeholder="DEL-IAS-0042"
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
                          placeholder="Players Building, Delhi Secretariat, IP Estate"
                          style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px 10px', width: '100%', fontSize: '12px', fontWeight: 600, color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                  )}
                </div>

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

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '10px' }}>
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
                      ✓ Delhi Single Sign-On Verified
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
          <div style={{
            padding: '12px 20px',
            borderTop: '1px solid #E2E8F0',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}>
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
        </form>

      </div>
    </div>
  );
}
