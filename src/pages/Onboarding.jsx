import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import SplashScreen from '../components/onboarding/SplashScreen';
import OnboardingFlow from '../components/onboarding/OnboardingFlow';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

export default function Onboarding({ initialStep = 1, skipSplash = false }) {
  const { enterApp } = useApp();
  const [searchParams] = useSearchParams();
  const isDirectLogin = skipSplash || searchParams.get('login') === 'true' || searchParams.get('step') === '4' || initialStep === 4;
  const [showSplash, setShowSplash] = useState(!isDirectLogin);
  const resolvedStep = isDirectLogin ? 4 : (parseInt(searchParams.get('step')) || initialStep);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef(null);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleStartTour = () => {
    setShowSplash(false);
    
    // Trigger audio playback seamlessly on user click gesture
    try {
      if (!audioRef.current) {
        const audio = new Audio('/audio/onboarding_audio.mp3');
        audio.volume = 0.9;
        
        audio.onplay = () => setIsPlayingAudio(true);
        audio.onpause = () => setIsPlayingAudio(false);
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => {
          // Fallback to secondary path
          const fallback = new Audio('/audio/2.mp3');
          fallback.volume = 0.9;
          fallback.onplay = () => setIsPlayingAudio(true);
          fallback.onpause = () => setIsPlayingAudio(false);
          fallback.onended = () => setIsPlayingAudio(false);
          fallback.play().catch(e => console.warn('Audio playback note:', e));
          audioRef.current = fallback;
        };

        audio.play()
          .then(() => {
            setIsPlayingAudio(true);
            setAudioError(false);
          })
          .catch((err) => {
            console.warn('Audio auto-play note:', err);
            setAudioError(true);
          });

        audioRef.current = audio;
      } else {
        audioRef.current.play().catch(e => console.warn(e));
      }
    } catch (e) {
      console.warn('Audio error:', e);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.warn(e));
      }
    } else {
      handleStartTour();
    }
  };

  const handleEnter = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (enterApp) enterApp();
  };

  if (showSplash) {
    return <SplashScreen onStart={handleStartTour} />;
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Floating Audio Guide Status Pill (shown only in full onboarding tour) */}
      {!isDirectLogin && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '999px',
          background: 'rgba(15, 23, 42, 0.88)',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          backdropFilter: 'blur(16px)',
          color: '#FFFFFF',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          fontSize: '12.5px',
          fontWeight: 600
        }}>
          <button
            type="button"
            onClick={toggleAudio}
            aria-label={isPlayingAudio ? 'Pause Audio Guide' : 'Play Audio Guide'}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: isPlayingAudio ? '#10B981' : 'rgba(255, 255, 255, 0.18)',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
          >
            {isPlayingAudio ? (
              <Pause style={{ width: '13px', height: '13px' }} />
            ) : (
              <Play style={{ width: '13px', height: '13px', marginLeft: '2px' }} />
            )}
          </button>

          <span style={{ color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isPlayingAudio ? (
              <>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                  <span className="audio-wave-bar bar-1" />
                  <span className="audio-wave-bar bar-2" />
                  <span className="audio-wave-bar bar-3" />
                </span>
                <span>Audio Guide Playing</span>
              </>
            ) : (
              <span>Audio Guide Paused</span>
            )}
          </span>

          <style>{`
            .audio-wave-bar {
              width: 3px;
              background: #10B981;
              border-radius: 2px;
              animation: soundWave 1s ease-in-out infinite alternate;
            }
            .bar-1 { height: 6px; animation-delay: 0.1s; }
            .bar-2 { height: 12px; animation-delay: 0.3s; }
            .bar-3 { height: 8px; animation-delay: 0.2s; }
            @keyframes soundWave {
              0% { transform: scaleY(0.4); }
              100% { transform: scaleY(1.3); }
            }
          `}</style>
        </div>
      )}

      {/* Interactive Onboarding Lifecycle Tour */}
      <OnboardingFlow onComplete={handleEnter} initialStep={resolvedStep} />
    </div>
  );
}
