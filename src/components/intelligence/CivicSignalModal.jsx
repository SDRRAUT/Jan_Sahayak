import React, { useState } from 'react';
import { Radio, Mic, Camera, MapPin, X, ArrowRight, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CivicSignalModal({ isOpen, onClose }) {
  const { submitCivicSignal, user } = useApp();
  const [text, setText] = useState('');
  const [channel, setChannel] = useState('QUICK_TEXT'); // 'QUICK_TEXT' | 'VOICE_NOTE' | 'PHOTO'
  const [ward, setWard] = useState(user?.ward || 'Ward 14 (Rohini Sector 14)');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resultSignal, setResultSignal] = useState(null);

  if (!isOpen) return null;

  const handleVoiceToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      setChannel('VOICE_NOTE');
      setTimeout(() => {
        setIsRecording(false);
        setText('Paani road ke side se leak ho raha hai aur road pe continuous paani jama ho raha hai.');
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  const handleSamplePhoto = () => {
    setChannel('PHOTO');
    setPhotoUrl('https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&auto=format&fit=crop&q=80');
    if (!text) {
      setText('Water trickling out from road seam near boundary wall.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const signal = await submitCivicSignal({
      rawInput: text.trim(),
      ward,
      channel,
      photoUrl: photoUrl || null,
      citizenName: user?.name || 'Concerned Resident'
    });

    setResultSignal(signal);
    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setText('');
    setPhotoUrl('');
    setResultSignal(null);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        maxWidth: '480px',
        width: '100%',
        padding: '24px',
        boxShadow: 'var(--shadow-modal)',
        position: 'relative'
      }}>
        {/* Modal Close */}
        <button
          type="button"
          onClick={handleResetAndClose}
          style={{ position: 'absolute', top: '18px', right: '18px', color: 'var(--color-text-muted)' }}
        >
          <X style={{ width: '20px', height: '20px' }} />
        </button>

        {!isSubmitted ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F0FDF4', color: '#065F46', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Radio style={{ width: '16px', height: '16px' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', color: 'var(--color-text-primary)' }}>Report a Civic Signal</h3>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Quick observation to help AI discover emerging problems before they escalate
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
              {/* Observation Input */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--color-text-primary)' }}>
                  What did you observe?
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g. Unusual water leakage on road, flickering transformer sparks, drain blockage..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-medium)',
                    fontSize: '13px',
                    resize: 'vertical'
                  }}
                  required
                />
              </div>

              {/* Multi-Modal Inputs (Voice & Photo) */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: isRecording ? '#FEE2E2' : '#F8FAFC',
                    border: isRecording ? '1px solid #DC2626' : '1px solid var(--color-border-subtle)',
                    color: isRecording ? '#DC2626' : 'var(--color-text-secondary)',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Mic style={{ width: '14px', height: '14px' }} />
                  <span>{isRecording ? 'Listening (AI Transcribing...)' : 'Voice Note'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSamplePhoto}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: photoUrl ? '#F0FDF4' : '#F8FAFC',
                    border: photoUrl ? '1px solid var(--color-primary)' : '1px solid var(--color-border-subtle)',
                    color: photoUrl ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Camera style={{ width: '14px', height: '14px' }} />
                  <span>{photoUrl ? 'Photo Attached ✓' : 'Add Photo'}</span>
                </button>
              </div>

              {/* Photo Preview if attached */}
              {photoUrl && (
                <div style={{ marginBottom: '14px', position: 'relative', width: '80px', height: '60px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                  <img src={photoUrl} alt="Signal Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.6)', color: '#FFFFFF', borderRadius: '50%', padding: '2px' }}
                  >
                    <X style={{ width: '12px', height: '12px' }} />
                  </button>
                </div>
              )}

              {/* Ward Location */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px', color: 'var(--color-text-primary)' }}>
                  <MapPin style={{ width: '13px', height: '13px', color: 'var(--color-primary)' }} />
                  <span>Location / Jurisdiction</span>
                </label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-medium)',
                    fontSize: '13px'
                  }}
                >
                  <option value="Ward 14 (Rohini Sector 14)">Ward 14 (Rohini Sector 14)</option>
                  <option value="Ward 12 (Pitampura Border)">Ward 12 (Pitampura Border)</option>
                  <option value="Ward 8 (Lajpat Nagar / Moolchand)">Ward 8 (Lajpat Nagar / Moolchand)</option>
                  <option value="Ward 5 (Kalkaji)">Ward 5 (Kalkaji)</option>
                  <option value="Ward 22 (Mayur Vihar Ph-1)">Ward 22 (Mayur Vihar Ph-1)</option>
                </select>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', height: '42px', borderRadius: 'var(--radius-full)', fontSize: '13px' }}
              >
                <span>Transmit Civic Signal</span>
                <ArrowRight style={{ width: '14px', height: '14px' }} />
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation State */
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#F0FDF4',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle2 style={{ width: '28px', height: '28px' }} />
            </div>

            <h3 style={{ fontSize: '18px', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
              Civic Signal Received
            </h3>

            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Your observation has been ingested into the <strong>JanSahayak Pattern Engine</strong>. It has been associated with active infrastructure corridor <strong>{resultSignal?.incidentId || 'INC-2026-DEL-01'}</strong>.
            </p>

            <div style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: '#EEF2FF',
              border: '1px solid #C7D2FE',
              textAlign: 'left',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Sparkles style={{ width: '14px', height: '14px', color: '#4F46E5' }} />
                <strong style={{ fontSize: '12px', color: '#312E81' }}>Complaint DNA Generated</strong>
              </div>
              <span style={{ fontSize: '11px', color: '#4338CA', display: 'block' }}>
                Issue: <strong>{resultSignal?.category}</strong> • Asset: <strong>{resultSignal?.inferredAsset}</strong>
              </span>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="btn-primary"
              style={{ width: '100%', height: '40px', borderRadius: 'var(--radius-full)', fontSize: '13px' }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
