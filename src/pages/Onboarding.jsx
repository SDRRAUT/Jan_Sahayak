import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Mic, 
  Camera, 
  ShieldCheck, 
  Users, 
  Building2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Onboarding() {
  const navigate = useNavigate();
  const { currentRole, setRole } = useApp();
  const [step, setStep] = useState(1);
  const [micGranted, setMicGranted] = useState(false);
  const [camGranted, setCamGranted] = useState(false);
  const [gpsGranted, setGpsGranted] = useState(false);

  const requestMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      setMicGranted(true);
    } catch (e) {
      alert('Microphone access was denied or not supported.');
    }
  };

  const requestCam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(t => t.stop());
      setCamGranted(true);
    } catch (e) {
      alert('Camera access was denied or not supported.');
    }
  };

  const requestGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => setGpsGranted(true),
      (err) => alert(`GPS access failed: ${err.message}`)
    );
  };

  return (
    <div className="section-spacing" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        <div className="card" style={{ padding: '36px', textAlign: 'center' }}>
          
          <div className="category-pill" style={{ margin: '0 auto 12px auto' }}>
            <Sparkles style={{ width: '13px', height: '13px' }} />
            <span>WELCOME TO JAN SAHAYAK • जनसहायक</span>
          </div>

          {step === 1 && (
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>
                Civic Intelligence at Your Fingertips
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                Jan Sahayak connects citizens, field officers, and municipal leadership through AI-driven complaint triaging, real GPS mapping, and 4-day verified resolution tracking.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '28px' }}>
                <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: '#F8FAFC', border: '1px solid var(--color-border-subtle)' }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>🎙️</div>
                  <strong style={{ fontSize: '13px', display: 'block' }}>3 Voice Options</strong>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Hindi & English</span>
                </div>
                <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: '#F8FAFC', border: '1px solid var(--color-border-subtle)' }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>📷</div>
                  <strong style={{ fontSize: '13px', display: 'block' }}>AI Vision</strong>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Defect Verification</span>
                </div>
                <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: '#F8FAFC', border: '1px solid var(--color-border-subtle)' }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>📍</div>
                  <strong style={{ fontSize: '13px', display: 'block' }}>Real Leaflet GPS</strong>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Pinpoint Accuracy</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-primary"
                style={{ width: '100%', minHeight: '48px', fontSize: '15px', fontWeight: 700 }}
              >
                <span>Continue Setup</span>
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
                Hardware & Device Permissions
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
                For seamless voice grievance intake, camera photo evidence, and pinpoint GPS, please allow the permissions below:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 'var(--radius-md)', background: micGranted ? '#ECFDF5' : '#F8FAFC', border: micGranted ? '1px solid #A7F3D0' : '1px solid var(--color-border-medium)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Mic style={{ width: '20px', height: '20px', color: micGranted ? '#059669' : 'var(--color-primary)' }} />
                    <div>
                      <strong style={{ fontSize: '13px', display: 'block' }}>Microphone Permission</strong>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>For Live Speech & Voice Recording</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={requestMic}
                    style={{ minHeight: '44px', padding: '6px 14px', borderRadius: 'var(--radius-sm)', background: micGranted ? '#059669' : 'var(--color-primary)', color: '#FFFFFF', border: 'none', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    {micGranted ? '✓ Granted' : 'Allow Mic'}
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 'var(--radius-md)', background: camGranted ? '#ECFDF5' : '#F8FAFC', border: camGranted ? '1px solid #A7F3D0' : '1px solid var(--color-border-medium)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Camera style={{ width: '20px', height: '20px', color: camGranted ? '#059669' : 'var(--color-primary)' }} />
                    <div>
                      <strong style={{ fontSize: '13px', display: 'block' }}>Camera Permission</strong>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>For On-Site Evidence Capture</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={requestCam}
                    style={{ minHeight: '44px', padding: '6px 14px', borderRadius: 'var(--radius-sm)', background: camGranted ? '#059669' : 'var(--color-primary)', color: '#FFFFFF', border: 'none', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    {camGranted ? '✓ Granted' : 'Allow Camera'}
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 'var(--radius-md)', background: gpsGranted ? '#ECFDF5' : '#F8FAFC', border: gpsGranted ? '1px solid #A7F3D0' : '1px solid var(--color-border-medium)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MapPin style={{ width: '20px', height: '20px', color: gpsGranted ? '#059669' : 'var(--color-primary)' }} />
                    <div>
                      <strong style={{ fontSize: '13px', display: 'block' }}>GPS Geolocation</strong>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>For Accurate Ward & Street Pinning</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={requestGps}
                    style={{ minHeight: '44px', padding: '6px 14px', borderRadius: 'var(--radius-sm)', background: gpsGranted ? '#059669' : 'var(--color-primary)', color: '#FFFFFF', border: 'none', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    {gpsGranted ? '✓ Granted' : 'Allow GPS'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary"
                  style={{ flex: 1, minHeight: '48px' }}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/citizen')}
                  className="btn-primary"
                  style={{ flex: 2, minHeight: '48px', fontWeight: 700 }}
                >
                  <span>Start Citizen Experience</span>
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
