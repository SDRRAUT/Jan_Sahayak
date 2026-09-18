import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Camera, 
  Mic, 
  MicOff, 
  Navigation, 
  CheckCircle2, 
  Loader2,
  Trash2,
  Building2,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

export default function FileGrievanceModal({ isOpen, onClose, defaultCategory = '' }) {
  const navigate = useNavigate();
  const { user, submitGrievance, switchDemoRole } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const [copiedId, setCopiedId] = useState(false);

  // Step 1: Problem Details
  const [category, setCategory] = useState(defaultCategory || 'Water Supply & Contamination');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [speechMsg, setSpeechMsg] = useState(null);
  const [interimText, setInterimText] = useState('');   // live interim transcript shown while speaking
  const [speechLang, setSpeechLang] = useState('hi-IN'); // hi-IN or en-IN
  const [finalAccumulated, setFinalAccumulated] = useState(''); // finalized text accumulated so far


  // Step 2: Photo Evidence
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [visionAnalysis, setVisionAnalysis] = useState(null);

  // Step 3: Location Details
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [landmark, setLandmark] = useState('');
  const [area, setArea] = useState('Sector 14 Corridor');
  const [ward, setWard] = useState(user?.ward || 'Ward 14 (Rohini Sector 14)');
  const [pincode, setPincode] = useState(user?.pincode || '110085');
  const [gpsLocked, setGpsLocked] = useState(false);
  const [gpsCoordinates, setGpsCoordinates] = useState(null);
  const [gpsErrorMsg, setGpsErrorMsg] = useState('');
  const [stepErrorMsg, setStepErrorMsg] = useState('');

  // Step 4: Contact & Urgency
  const [citizenName, setCitizenName] = useState(user?.name || 'Aditya Verma');
  const [citizenPhone, setCitizenPhone] = useState(user?.phone || '+91 98712-88210');
  const [urgency, setUrgency] = useState('HIGH');

  // Submission State & Result
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);

  // Refs
  const photoInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const categories = [
    { key: 'Water Supply & Contamination', label: 'Water Supply', icon: '💧' },
    { key: 'Roads & Infrastructure', label: 'Roads & Potholes', icon: '🚧' },
    { key: 'Sanitation & Solid Waste', label: 'Garbage & Waste', icon: '🗑️' },
    { key: 'Electricity & Power Grid', label: 'Streetlight & Power', icon: '💡' },
    { key: 'Drainage & Waterlogging', label: 'Sewage & Drainage', icon: '🕳️' },
  ];

  // AI category detection state
  const [isAiDetecting, setIsAiDetecting] = useState(false);
  const [aiDetectedCategory, setAiDetectedCategory] = useState(null); // null = not detected yet
  const [aiModeSelected, setAiModeSelected] = useState(false); // true = user explicitly chose AI mode
  const aiDebounceRef = useRef(null);



  const presets = [
    { label: '💧 Dirty tap water', text: 'Pichle 2 din se nal mein ganda badbudar paani aa raha hai.', cat: 'Water Supply & Contamination' },
    { label: '🚧 Dangerous pothole', text: 'Main road par bohot gehra gaddha hai, accident ka khatra hai.', cat: 'Roads & Infrastructure' },
    { label: '🗑️ Garbage not cleared', text: 'Mohalle ke corner par kooda jama hai aur badbu fail rahi hai.', cat: 'Sanitation & Solid Waste' },
    { label: '💡 Streetlight not working', text: 'Gali ki 3 streetlight kharab hain, raat ko andhera rehta hai.', cat: 'Electricity & Power Grid' }
  ];

  const prevIsOpenRef = useRef(false);

  useEffect(() => {
    // Only initialize form fields when the modal is newly opened
    if (isOpen && !prevIsOpenRef.current) {
      setCurrentStep(1);
      setCreatedTicket(null);
      setAiDetectedCategory(null);
      setAiModeSelected(false);
      if (defaultCategory) setCategory(defaultCategory);
      if (user?.name) setCitizenName(user.name);
      if (user?.phone) setCitizenPhone(user.phone);
      if (user?.ward) setWard(user.ward);
      if (user?.pincode) setPincode(user.pincode);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, defaultCategory, user]);

  // ─── AI Category Detection ───────────────────────────────────────────────────
  // Client-side instant keyword matching (works offline, zero latency)
  const detectCategoryFromText = (text) => {
    const t = text.toLowerCase();
    if (/paani|water|nal|pipe|contamina|boring|tank|supply|leak|water.?log/i.test(t))
      return 'Water Supply & Contamination';
    if (/road|pothole|gaddha|sadak|crack|break|pit|sinkhole|speed.?breaker|footpath|pavem/i.test(t))
      return 'Roads & Infrastructure';
    if (/garbage|kooda|kachra|waste|trash|dustbin|sweeping|sweeper|sanitation|clean|smell|badbu/i.test(t))
      return 'Sanitation & Solid Waste';
    if (/light|streetlight|lamp|bijli|electricity|power|current|dark|andhera|transformer|wire/i.test(t))
      return 'Electricity & Power Grid';
    if (/drain|nali|sewer|naala|waterlog|flood|overflow|blockage|clog|gutter/i.test(t))
      return 'Drainage & Waterlogging';
    return null; // not enough info yet
  };

  // Auto-detect category as user types/speaks (debounced 600ms)
  useEffect(() => {
    if (aiDebounceRef.current) clearTimeout(aiDebounceRef.current);
    if (description.length < 8) {
      setAiDetectedCategory(null);
      setIsAiDetecting(false);
      return;
    }

    setIsAiDetecting(true);
    aiDebounceRef.current = setTimeout(async () => {
      // 1. Try instant client-side detection first
      const clientResult = detectCategoryFromText(description + ' ' + title);
      if (clientResult) {
        setAiDetectedCategory(clientResult);
        setCategory(clientResult);
        setIsAiDetecting(false);
        return;
      }

      // 2. Fallback: call backend Gemini AI for ambiguous text
      try {
        const res = await fetch('/api/complaints/classify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: description, title })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.category) {
            setAiDetectedCategory(data.category);
            setCategory(data.category);
          }
        }
      } catch (_) {
        // backend unavailable — silently skip, user can pick manually
      } finally {
        setIsAiDetecting(false);
      }
    }, 600);

    return () => clearTimeout(aiDebounceRef.current);
  }, [description, title]); // eslint-disable-line



  // ─── Real-time Speech-to-Text ───────────────────────────────────────────────
  const handleToggleVoice = () => {
    if (isRecording) {
      handleStopVoice();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback: show helpful message + open mic via MediaRecorder if available
      setSpeechMsg('⚠️ Your browser does not support live speech. Please use Chrome or Edge, or type your complaint below.');
      return;
    }

    try {
      // Reset interim & accumulated before starting fresh
      setInterimText('');
      setFinalAccumulated('');

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = true;       // keep listening until manually stopped
      recognition.interimResults = true;   // show live partial results
      recognition.maxAlternatives = 1;
      recognition.lang = speechLang;       // hi-IN or en-IN

      recognition.onstart = () => {
        setIsRecording(true);
        setRecordingTimer(0);
        setSpeechMsg(speechLang === 'hi-IN'
          ? '🎙️ Sun raha hoon... Hindi, Hinglish ya English mein bolein'
          : '🎙️ Listening... Speak clearly in English');
        timerIntervalRef.current = setInterval(() => {
          setRecordingTimer(prev => prev + 1);
        }, 1000);
      };

      recognition.onresult = (e) => {
        let interim = '';
        let newFinal = '';

        for (let i = e.resultIndex; i < e.results.length; i++) {
          const transcript = e.results[i][0].transcript;
          if (e.results[i].isFinal) {
            newFinal += transcript + ' ';
          } else {
            interim += transcript;
          }
        }

        // Update interim live display
        setInterimText(interim);

        if (newFinal) {
          // Append final text to description textarea + accumulated ref
          setFinalAccumulated(prev => {
            const updated = prev + newFinal;
            setDescription(updated.trim());
            // Auto-fill title from first few words if title is empty
            if (!title) {
              setTitle(updated.trim().slice(0, 50) + (updated.trim().length > 50 ? '...' : ''));
            }
            return updated;
          });
        }
      };

      recognition.onerror = (e) => {
        if (e.error === 'no-speech') {
          // No speech detected — just show a gentle hint, keep going
          setSpeechMsg('🤫 Koi awaaz nahi aayi... phir se bolein / No speech detected, please speak again');
        } else if (e.error === 'not-allowed') {
          setSpeechMsg('❌ Microphone access denied. Please allow mic in browser settings.');
          handleStopVoice();
        } else if (e.error === 'network') {
          setSpeechMsg('⚠️ Network error. Retrying...');
          // Auto-restart on network errors
          setTimeout(() => {
            if (recognitionRef.current) {
              try { recognitionRef.current.start(); } catch (_) {}
            }
          }, 500);
        } else {
          handleStopVoice();
        }
      };

      recognition.onend = () => {
        // Auto-restart if still in recording mode (continuous mode sometimes stops)
        if (isRecording) {
          try {
            if (recognitionRef.current) recognitionRef.current.start();
          } catch (_) {
            // recognition already started or modal closed
          }
        }
        setInterimText('');
      };

      recognition.start();
    } catch (err) {
      setSpeechMsg('Could not start microphone. Please try again.');
      setIsRecording(false);
    }
  };

  const handleStopVoice = () => {
    setIsRecording(false);
    setInterimText('');
    setSpeechMsg(null);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.onend = null; recognitionRef.current.stop(); } catch (_) {}
      recognitionRef.current = null;
    }
  };

  // Cleanup on modal close
  useEffect(() => {
    if (!isOpen) handleStopVoice();
  }, [isOpen]); // eslint-disable-line



  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);
    const reader = new FileReader();

    reader.onload = async (event) => {
      const base64Data = event.target.result;
      setPhotoPreview(base64Data);
      setIsAnalyzingPhoto(true);

      try {
        const res = await fetch('/api/complaints/vision-analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64Data,
            mimeType: file.type || 'image/jpeg',
            contextPrompt: description || category
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.vision) {
            setVisionAnalysis(data.vision);
            if (data.vision.category) {
              setCategory(data.vision.category);
            }
          }
        }
      } catch (err) {
        console.warn('Vision analysis fallback:', err.message);
      } finally {
        setIsAnalyzingPhoto(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPhotoFile(null);
    setVisionAnalysis(null);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const handleDetectLocation = () => {
    setGpsErrorMsg('');
    if (!navigator.geolocation) {
      setGpsErrorMsg('📍 Geolocation is not supported by your browser. Please enter area manually below.');
      return;
    }

    setIsDetectingGps(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setGpsCoordinates({ lat, lng });

        try {
          const res = await fetch('/api/location/reverse-geocode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lng })
          });

          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              setWard(data.ward || ward);
              setArea(data.area || `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`);
              setPincode(data.pincode || pincode);
              setLandmark(data.formattedAddress?.split(',')[0] || 'Near current location');
              setGpsLocked(true);
              setGpsErrorMsg('');
            }
          }
        } catch (e) {
          setGpsLocked(true);
          setArea(`GPS: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`);
          setGpsErrorMsg('');
        } finally {
          setIsDetectingGps(false);
        }
      },
      () => {
        setIsDetectingGps(false);
        setGpsErrorMsg('📍 GPS permission unavailable or timed out. Default ward is pre-filled, or you can edit manually below.');
      },
      { timeout: 6000, enableHighAccuracy: true }
    );
  };

  const handleFinalSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    console.log('[FileGrievanceModal] handleFinalSubmit triggered');
    if (!description.trim()) {
      console.warn('[FileGrievanceModal] Description empty, switching to step 1');
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);

    try {
      const created = await submitGrievance({
        title: title || `${category} Issue in ${ward}`,
        description,
        ward,
        area: landmark ? `${landmark}, ${area}` : area,
        pincode,
        category,
        urgency,
        citizenName: citizenName || user?.name || 'Aditya Verma',
        citizenPhone: citizenPhone || user?.phone || '+91 98712-88210',
        location: {
          ward,
          area: landmark ? `${landmark}, ${area}` : area,
          city: 'New Delhi',
          pincode,
          lat: gpsCoordinates?.lat || 28.7185,
          lng: gpsCoordinates?.lng || 77.1250
        },
        evidence: {
          hasPhoto: !!photoPreview,
          photoUrl: photoPreview,
          photoTag: photoFile ? photoFile.name : null,
          photoObservations: visionAnalysis?.observed_hazard || null
        }
      });

      console.log('[FileGrievanceModal] Grievance created successfully:', created);
      setCreatedTicket(created);
      setIsSubmitting(false);

      try {
        confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
      } catch (err) {}
    } catch (err) {
      console.error('[FileGrievanceModal] Submit error:', err);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.78)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px',
      boxSizing: 'border-box'
    }}>
      <input 
        type="file" 
        ref={photoInputRef}
        accept="image/*"
        capture="environment"
        onChange={handlePhotoSelect}
        style={{ display: 'none' }}
      />

      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '620px',
        width: '100%',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 55px -10px rgba(15, 23, 42, 0.45)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 22px',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FAFAFC'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src="/logo.png" 
              alt="JanSahayak" 
              style={{ height: '32px', width: 'auto', objectFit: 'contain' }} 
            />
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#1E2653', margin: 0 }}>
                File Civic Grievance
              </h2>
              <span style={{ fontSize: '11px', color: '#64748B' }}>
                4-Step Instant Resolution Portal
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#F1F5F9',
              border: 'none',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X style={{ width: '17px', height: '17px' }} />
          </button>
        </div>

        {/* Progress Bar */}
        {!createdTicket && (
          <div style={{ padding: '10px 22px 6px 22px', background: '#FFFFFF', borderBottom: '1px solid #F8FAFC' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Step {currentStep} of 4: {
                  currentStep === 1 ? 'Problem Details' :
                  currentStep === 2 ? 'Photo & Proof' :
                  currentStep === 3 ? 'Location Details' : 'Contact & Submit'
                }
              </span>
              <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                {Math.round((currentStep / 4) * 100)}% Complete
              </span>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 3, 4].map((step) => (
                <div 
                  key={step} 
                  style={{
                    flex: 1,
                    height: '5px',
                    borderRadius: '999px',
                    background: step <= currentStep ? 'linear-gradient(90deg, #2563EB, #10B981)' : '#E2E8F0',
                    transition: 'all 250ms ease'
                  }} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px' }}>
          {createdTicket ? (
            <div style={{ textAlign: 'center', padding: '8px 4px 6px 4px' }}>
              {/* Animated Success Badge */}
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
                boxShadow: '0 0 0 8px #D1FAE5, 0 8px 20px rgba(5, 150, 105, 0.2)'
              }}>
                <CheckCircle2 style={{ width: '36px', height: '36px' }} />
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '999px', padding: '4px 14px', marginBottom: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563EB', display: 'inline-block' }} />
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Successfully Submitted & Transmitted
                </span>
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
                Ticket #{createdTicket.id}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '13px', color: '#64748B' }}>Tracking ID:</span>
                <code style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', background: '#F1F5F9', padding: '3px 8px', borderRadius: '6px' }}>
                  {createdTicket.id}
                </code>
                <button
                  type="button"
                  onClick={() => {
                    if (createdTicket?.id) {
                      navigator.clipboard.writeText(createdTicket.id);
                      setCopiedId(true);
                      setTimeout(() => setCopiedId(false), 2000);
                    }
                  }}
                  title="Copy Ticket ID"
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: copiedId ? '#ECFDF5' : '#F8FAFC',
                    border: `1px solid ${copiedId ? '#A7F3D0' : '#E2E8F0'}`,
                    color: copiedId ? '#059669' : '#475569',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copiedId ? <Check style={{ width: '12px', height: '12px' }} /> : <Copy style={{ width: '12px', height: '12px' }} />}
                  <span>{copiedId ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <p style={{ fontSize: '13px', color: '#475569', maxWidth: '480px', margin: '0 auto 16px auto', lineHeight: 1.5 }}>
                Your grievance is officially registered and dispatched to <strong>{createdTicket.department || 'Delhi Municipal Authority'}</strong>. Real-time updates active.
              </p>

              {/* Real-time Dispatch Dual Channel Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', marginBottom: '16px', textAlign: 'left' }}>
                {/* 1. Officer Desk Dispatch */}
                <div style={{
                  background: '#F0FDF4',
                  border: '1.5px solid #BBF7D0',
                  borderRadius: '14px',
                  padding: '12px 14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Building2 style={{ width: '16px', height: '16px', color: '#059669' }} />
                      <strong style={{ fontSize: '12px', color: '#065F46' }}>Govt Officer Desk</strong>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 800, background: '#10B981', color: '#FFFFFF', padding: '2px 8px', borderRadius: '999px' }}>
                      #1 IN QUEUE
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#047857' }}>
                    {createdTicket.officerName || 'Er. Sanjay Sharma (AEE)'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#065F46', marginTop: '2px' }}>
                    Ready at the top of Officer Workspace for field work order.
                  </div>
                </div>

                {/* 2. Central Administration Dispatch */}
                <div style={{
                  background: '#EFF6FF',
                  border: '1.5px solid #BFDBFE',
                  borderRadius: '14px',
                  padding: '12px 14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck style={{ width: '16px', height: '16px', color: '#2563EB' }} />
                      <strong style={{ fontSize: '12px', color: '#1E40AF' }}>Administration Panel</strong>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 800, background: '#2563EB', color: '#FFFFFF', padding: '2px 8px', borderRadius: '999px' }}>
                      LIVE AT TOP
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#1D4ED8' }}>
                    Municipal Command Center
                  </div>
                  <div style={{ fontSize: '11px', color: '#1E40AF', marginTop: '2px' }}>
                    Broadcast to Ward 14 geospatial radar & executive incident ledger.
                  </div>
                </div>
              </div>

              {/* Ticket Details Summary Grid */}
              <div style={{
                background: '#F8FAFC',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                padding: '12px 16px',
                textAlign: 'left',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Category</span>
                    <strong style={{ color: '#0F172A' }}>{createdTicket.category}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Target SLA Window</span>
                    <strong style={{ color: '#059669' }}>24 Hours Guaranteed</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Ward & Area</span>
                    <strong style={{ color: '#0F172A' }}>{ward}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Live WhatsApp Updates</span>
                    <strong style={{ color: '#2563EB' }}>Active on {citizenPhone}</strong>
                  </div>
                </div>
              </div>

              {/* Fast Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  id="btn-track-grievance-live"
                  type="button"
                  onClick={async () => {
                    onClose();
                    if (!user || user.role !== 'citizen') {
                      await switchDemoRole('citizen');
                    }
                    navigate(`/citizen/complaints/${createdTicket.id}`);
                  }}
                  style={{
                    height: '42px',
                    padding: '0 22px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #0E5E3A 0%, #064E3B 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(14, 94, 58, 0.35)'
                  }}
                >
                  <span>Track Complaint</span>
                  <ArrowRight style={{ width: '15px', height: '15px' }} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCreatedTicket(null);
                    setCurrentStep(1);
                    setTitle('');
                    setDescription('');
                    setPhotoPreview(null);
                  }}
                  style={{
                    height: '42px',
                    padding: '0 14px',
                    borderRadius: '10px',
                    background: '#F1F5F9',
                    color: '#334155',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  + File Another
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    height: '42px',
                    padding: '0 14px',
                    borderRadius: '10px',
                    background: '#FFFFFF',
                    color: '#64748B',
                    border: '1px solid #E2E8F0',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1 */}
              {currentStep === 1 && (
                <div>
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        1. Problem Category:
                      </label>
                      {/* AI detection badge — clickable to activate AI mode */}
                      <button
                        type="button"
                        onClick={() => { setAiModeSelected(true); setCategory(''); setAiDetectedCategory(null); }}
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          color: aiDetectedCategory ? '#065F46' : aiModeSelected ? '#4338CA' : '#6366F1',
                          background: aiDetectedCategory ? '#ECFDF5' : aiModeSelected ? '#EDE9FE' : '#EEF2FF',
                          border: `1px solid ${aiDetectedCategory ? '#A7F3D0' : aiModeSelected ? '#A5B4FC' : '#C7D2FE'}`,
                          borderRadius: '999px',
                          padding: '3px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                          transition: 'all 150ms'
                        }}
                      >
                        {isAiDetecting
                          ? <><Loader2 style={{ width: '10px', height: '10px', animation: 'spin 1s linear infinite' }} /> AI detecting...</>
                          : aiDetectedCategory
                            ? <>✅ AI detected</>
                            : aiModeSelected
                              ? <>🤖 AI mode ON</>
                              : <>🤖 AI will auto-detect</>
                        }
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      {categories.map((cat) => {
                        const isSelected = !aiModeSelected && category === cat.key;
                        const isAiPick = aiDetectedCategory === cat.key;
                        return (
                          <button
                            key={cat.key}
                            type="button"
                            onClick={() => { setCategory(cat.key); setAiDetectedCategory(null); setAiModeSelected(false); }}
                            style={{
                              padding: '9px 6px',
                              borderRadius: '10px',
                              border: isSelected ? '2px solid #2563EB' : isAiPick ? '2px solid #059669' : '1px solid #E2E8F0',
                              background: isSelected ? '#EFF6FF' : isAiPick ? '#ECFDF5' : '#F8FAFC',
                              textAlign: 'center',
                              cursor: 'pointer',
                              position: 'relative',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ fontSize: '18px', marginBottom: '2px' }}>{cat.icon}</div>
                            <strong style={{ fontSize: '11px', display: 'block', color: isSelected ? '#1E40AF' : isAiPick ? '#065F46' : '#0F172A', lineHeight: 1.2 }}>
                              {cat.label}
                            </strong>
                            {isAiPick && (
                              <span style={{
                                position: 'absolute',
                                top: '-6px',
                                right: '-6px',
                                background: '#059669',
                                color: '#fff',
                                fontSize: '9px',
                                fontWeight: 800,
                                borderRadius: '999px',
                                padding: '1px 5px',
                                lineHeight: 1.4
                              }}>AI ✓</span>
                            )}
                          </button>
                        );
                      })}

                      {/* 6th slot: AI Detection tile — clickable button */}
                      <button
                        type="button"
                        onClick={() => { setAiModeSelected(true); setCategory(''); setAiDetectedCategory(null); }}
                        style={{
                          padding: '9px 6px',
                          borderRadius: '10px',
                          border: aiModeSelected ? '2px solid #6366F1' : '1px dashed #A5B4FC',
                          background: aiModeSelected ? '#EDE9FE' : '#F5F3FF',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {isAiDetecting ? (
                          <>
                            <Loader2 style={{ width: '18px', height: '18px', color: '#6366F1', animation: 'spin 1s linear infinite', marginBottom: '2px' }} />
                            <strong style={{ fontSize: '10px', color: '#6366F1', lineHeight: 1.2 }}>Detecting...</strong>
                          </>
                        ) : aiDetectedCategory ? (
                          <>
                            <div style={{ fontSize: '16px', marginBottom: '2px' }}>✅</div>
                            <strong style={{ fontSize: '10px', color: '#059669', lineHeight: 1.2 }}>AI detected!</strong>
                          </>
                        ) : aiModeSelected ? (
                          <>
                            <div style={{ fontSize: '16px', marginBottom: '2px' }}>🤖</div>
                            <strong style={{ fontSize: '10px', color: '#4338CA', lineHeight: 1.2 }}>AI Mode ON</strong>
                          </>
                        ) : (
                          <>
                            <div style={{ fontSize: '16px', marginBottom: '2px' }}>🤖</div>
                            <strong style={{ fontSize: '10px', color: '#6366F1', lineHeight: 1.2 }}>Type to detect</strong>
                          </>
                        )}
                      </button>
                    </div>

                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  </div>



                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Problem Title (Short Headline):
                    </label>
                    <input 
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Dirty contaminated tap water near Pocket 2"
                      style={{
                        width: '100%',
                        height: '38px',
                        padding: '0 12px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '13px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    {/* Row: Label + Language Toggle + Mic Button */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        Description (Bol Kar Ya Likh Kar Batayein):
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {/* Language Toggle */}
                        {!isRecording && (
                          <div style={{ display: 'flex', borderRadius: '999px', overflow: 'hidden', border: '1px solid #CBD5E1', fontSize: '10px', fontWeight: 700 }}>
                            <button
                              type="button"
                              onClick={() => setSpeechLang('hi-IN')}
                              style={{
                                padding: '3px 9px',
                                background: speechLang === 'hi-IN' ? '#2563EB' : '#F1F5F9',
                                color: speechLang === 'hi-IN' ? '#fff' : '#475569',
                                border: 'none',
                                cursor: 'pointer'
                              }}
                            >हिंदी</button>
                            <button
                              type="button"
                              onClick={() => setSpeechLang('en-IN')}
                              style={{
                                padding: '3px 9px',
                                background: speechLang === 'en-IN' ? '#2563EB' : '#F1F5F9',
                                color: speechLang === 'en-IN' ? '#fff' : '#475569',
                                border: 'none',
                                cursor: 'pointer'
                              }}
                            >ENG</button>
                          </div>
                        )}

                        {/* Mic Button */}
                        <button
                          type="button"
                          onClick={handleToggleVoice}
                          style={{
                            background: isRecording ? '#FEF2F2' : '#EFF6FF',
                            color: isRecording ? '#DC2626' : '#2563EB',
                            border: isRecording ? '2px solid #FCA5A5' : '1px solid #BFDBFE',
                            borderRadius: '999px',
                            padding: '4px 12px',
                            fontSize: '11px',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            cursor: 'pointer',
                            boxShadow: isRecording ? '0 0 0 3px rgba(220,38,38,0.15)' : 'none',
                            transition: 'all 0.2s'
                          }}
                        >
                          {isRecording
                            ? <><MicOff style={{ width: '13px', height: '13px' }} /><span>⏹ Stop ({recordingTimer}s)</span></>
                            : <><Mic style={{ width: '13px', height: '13px' }} /><span>🎙️ {speechLang === 'hi-IN' ? 'Boliye Hindi/English' : 'Speak English'}</span></>
                          }
                        </button>
                      </div>
                    </div>

                    {/* Status message */}
                    {speechMsg && (
                      <div style={{
                        fontSize: '11px',
                        color: speechMsg.startsWith('❌') ? '#DC2626' : '#2563EB',
                        marginBottom: '6px',
                        padding: '5px 10px',
                        background: speechMsg.startsWith('❌') ? '#FEF2F2' : '#EFF6FF',
                        borderRadius: '8px',
                        lineHeight: 1.4
                      }}>
                        {speechMsg}
                      </div>
                    )}

                    {/* Textarea — with real-time interim overlay */}
                    <div style={{ position: 'relative' }}>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                          setFinalAccumulated(e.target.value);
                        }}
                        placeholder="Gali/mohalle mein kya problem hai? Hindi, Hinglish, ya English mein likhein..."
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: isRecording ? '2px solid #2563EB' : '1px solid #CBD5E1',
                          fontSize: '13px',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                          resize: 'none',
                          transition: 'border-color 0.2s',
                          background: isRecording ? '#F0F7FF' : '#fff'
                        }}
                      />

                      {/* Live interim transcript — shown in gray below existing text */}
                      {isRecording && interimText && (
                        <div style={{
                          position: 'absolute',
                          bottom: '10px',
                          left: '12px',
                          right: '12px',
                          fontSize: '12px',
                          color: '#94A3B8',
                          fontStyle: 'italic',
                          pointerEvents: 'none',
                          lineHeight: 1.4,
                          background: 'transparent'
                        }}>
                          {interimText}
                          <span style={{
                            display: 'inline-block',
                            width: '2px',
                            height: '14px',
                            background: '#2563EB',
                            marginLeft: '2px',
                            verticalAlign: 'middle',
                            animation: 'blink 1s step-end infinite'
                          }} />
                        </div>
                      )}

                      {/* Pulsing recording indicator */}
                      {isRecording && (
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#DC2626',
                            animation: 'pulse 1s ease-in-out infinite'
                          }} />
                          <span style={{ fontSize: '10px', color: '#DC2626', fontWeight: 700 }}>LIVE</span>
                        </div>
                      )}
                    </div>

                    {/* Blinking cursor + pulse animation */}
                    <style>{`
                      @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
                      @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
                    `}</style>

                    {stepErrorMsg && (
                      <div style={{
                        marginTop: '6px',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: '#FEF2F2',
                        border: '1px solid #FECACA',
                        color: '#DC2626',
                        fontSize: '11.5px',
                        fontWeight: 600
                      }}>
                        {stepErrorMsg}
                      </div>
                    )}
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '4px' }}>
                      Quick Examples:
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {presets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setDescription(preset.text);
                            setTitle(preset.label);
                            setCategory(preset.cat);
                          }}
                          style={{
                            background: '#F1F5F9',
                            border: '1px solid #E2E8F0',
                            borderRadius: '999px',
                            padding: '3px 10px',
                            fontSize: '11px',
                            color: '#334155',
                            cursor: 'pointer'
                          }}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {currentStep === 2 && (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                      Upload Ground Photo (Optional)
                    </h3>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                      Complaints with photos get resolved 2x faster by field engineers.
                    </p>
                  </div>

                  {!photoPreview ? (
                    <div 
                      onClick={() => photoInputRef.current?.click()}
                      style={{
                        border: '2px dashed #94A3B8',
                        borderRadius: '16px',
                        padding: '28px 16px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: '#F8FAFC',
                        marginBottom: '14px'
                      }}
                    >
                      <div style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: '#EFF6FF',
                        color: '#2563EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 10px auto'
                      }}>
                        <Camera style={{ width: '22px', height: '22px' }} />
                      </div>
                      <strong style={{ fontSize: '13px', color: '#1E2653', display: 'block', marginBottom: '3px' }}>
                        Click to Take Photo or Upload Image
                      </strong>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>
                        Supports Camera capture or Gallery selection
                      </span>
                    </div>
                  ) : (
                    <div style={{
                      borderRadius: '14px',
                      overflow: 'hidden',
                      border: '1px solid #CBD5E1',
                      background: '#0F172A',
                      position: 'relative',
                      marginBottom: '14px'
                    }}>
                      <img 
                        src={photoPreview} 
                        alt="Evidence Preview" 
                        style={{
                          width: '100%',
                          maxHeight: '210px',
                          objectFit: 'cover',
                          display: 'block'
                        }} 
                      />

                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: 'rgba(0, 0, 0, 0.65)',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 style={{ width: '15px', height: '15px' }} />
                      </button>

                      <div style={{
                        padding: '8px 12px',
                        background: '#FFFFFF',
                        borderTop: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        {isAnalyzingPhoto ? (
                          <>
                            <Loader2 className="animate-spin" style={{ width: '15px', height: '15px', color: '#2563EB' }} />
                            <span style={{ fontSize: '11.5px', color: '#2563EB', fontWeight: 600 }}>
                              Gemini Vision is scanning hazard features...
                            </span>
                          </>
                        ) : visionAnalysis ? (
                          <>
                            <CheckCircle2 style={{ width: '15px', height: '15px', color: '#10B981', flexShrink: 0 }} />
                            <div style={{ fontSize: '11.5px', color: '#334155' }}>
                              <strong style={{ color: '#0F172A' }}>AI Hazard Identified: </strong>
                              {visionAnalysis.observed_hazard} ({Math.round(visionAnalysis.confidence * 100)}% Match)
                            </div>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 style={{ width: '15px', height: '15px', color: '#10B981' }} />
                            <span style={{ fontSize: '11.5px', color: '#0F172A', fontWeight: 600 }}>
                              Photo attached ({photoFile?.name})
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  <div style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    fontSize: '11.5px',
                    color: '#166534'
                  }}>
                    💡 If you cannot take a photo right now, click "Skip Photo / Next" to proceed.
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {currentStep === 3 && (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                      Where is this issue located?
                    </h3>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                      Accurate location ensures the right field officer arrives on site.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={isDetectingGps}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      background: gpsLocked ? '#ECFDF5' : '#EFF6FF',
                      border: gpsLocked ? '1px solid #A7F3D0' : '1px solid #BFDBFE',
                      color: gpsLocked ? '#065F46' : '#1D4ED8',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      marginBottom: '14px'
                    }}
                  >
                    {isDetectingGps ? (
                      <>
                        <Loader2 className="animate-spin" style={{ width: '15px', height: '15px' }} />
                        <span>Locking GPS Coordinates...</span>
                      </>
                    ) : gpsLocked ? (
                      <>
                        <CheckCircle2 style={{ width: '15px', height: '15px', color: '#059669' }} />
                        <span>GPS Locked: {area}</span>
                      </>
                    ) : (
                      <>
                        <Navigation style={{ width: '15px', height: '15px' }} />
                        <span>📍 Auto-Detect My Current GPS Location</span>
                      </>
                    )}
                  </button>

                  {gpsErrorMsg && (
                    <div style={{
                      marginBottom: '12px',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      background: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      color: '#B45309',
                      fontSize: '11.5px',
                      lineHeight: 1.4
                    }}>
                      {gpsErrorMsg}
                    </div>
                  )}

                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Landmark / Street / House No:
                    </label>
                    <input 
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Near Mother Dairy, Opposite Metro Pillar 420"
                      style={{
                        width: '100%',
                        height: '38px',
                        padding: '0 12px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '13px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '10px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Ward / Municipal Zone:
                      </label>
                      <select
                        value={ward}
                        onChange={(e) => setWard(e.target.value)}
                        style={{
                          width: '100%',
                          height: '38px',
                          padding: '0 10px',
                          borderRadius: '10px',
                          border: '1px solid #CBD5E1',
                          fontSize: '12.5px',
                          boxSizing: 'border-box',
                          background: '#FFFFFF'
                        }}
                      >
                        <option value="Ward 14 (Rohini Sector 14)">Ward 14 (Rohini Sector 14)</option>
                        <option value="Ward 22 (Civil Lines)">Ward 22 (Civil Lines)</option>
                        <option value="Ward 33 (Karol Bagh)">Ward 33 (Karol Bagh)</option>
                        <option value="Ward 45 (Lajpat Nagar)">Ward 45 (Lajpat Nagar)</option>
                        <option value="Ward 60 (Dwarka Sector 6)">Ward 60 (Dwarka Sector 6)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Pincode:
                      </label>
                      <input 
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="110085"
                        style={{
                          width: '100%',
                          height: '38px',
                          padding: '0 12px',
                          borderRadius: '10px',
                          border: '1px solid #CBD5E1',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Colony / Area Name:
                    </label>
                    <input 
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. Sector 14 Corridor"
                      style={{
                        width: '100%',
                        height: '38px',
                        padding: '0 12px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '13px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {currentStep === 4 && (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                      Contact Details & Final Review
                    </h3>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                      We send live ticket updates and engineer arrival alerts via WhatsApp.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        Your Full Name:
                      </label>
                      <input 
                        type="text"
                        value={citizenName}
                        onChange={(e) => setCitizenName(e.target.value)}
                        placeholder="Aditya Verma"
                        style={{
                          width: '100%',
                          height: '38px',
                          padding: '0 12px',
                          borderRadius: '10px',
                          border: '1px solid #CBD5E1',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        WhatsApp / Mobile No:
                      </label>
                      <input 
                        type="text"
                        value={citizenPhone}
                        onChange={(e) => setCitizenPhone(e.target.value)}
                        placeholder="+91 98712-88210"
                        style={{
                          width: '100%',
                          height: '38px',
                          padding: '0 12px',
                          borderRadius: '10px',
                          border: '1px solid #CBD5E1',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Urgency / Severity:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      {[
                        { key: 'LOW', label: 'Normal (48h)', color: '#059669', bg: '#ECFDF5' },
                        { key: 'HIGH', label: 'High (24h)', color: '#D97706', bg: '#FFFBEB' },
                        { key: 'CRITICAL', label: 'Critical (12h)', color: '#DC2626', bg: '#FEF2F2' }
                      ].map((u) => (
                        <button
                          key={u.key}
                          type="button"
                          onClick={() => setUrgency(u.key)}
                          style={{
                            padding: '8px 6px',
                            borderRadius: '10px',
                            border: urgency === u.key ? `2px solid ${u.color}` : '1px solid #E2E8F0',
                            background: urgency === u.key ? u.bg : '#F8FAFC',
                            color: u.color,
                            fontWeight: 700,
                            fontSize: '11px',
                            cursor: 'pointer'
                          }}
                        >
                          {u.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{
                    background: '#F8FAFC',
                    borderRadius: '14px',
                    border: '1px solid #E2E8F0',
                    padding: '12px 14px',
                    marginBottom: '8px'
                  }}>
                    <strong style={{ fontSize: '12px', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                      📋 Grievance Summary:
                    </strong>
                    <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
                      <div>• <strong>Category:</strong> {category}</div>
                      <div>• <strong>Title:</strong> {title || 'Standard Grievance'}</div>
                      <div>• <strong>Location:</strong> {ward} • {landmark ? `${landmark}, ` : ''}{area}</div>
                      <div>• <strong>Evidence:</strong> {photoPreview ? '✓ 1 Photo attached' : 'No photo'}</div>
                      <div>• <strong>Citizen:</strong> {citizenName} ({citizenPhone})</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!createdTicket && (
          <div style={{
            padding: '12px 22px',
            borderTop: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#FAFAFC'
          }}>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                style={{
                  height: '38px',
                  padding: '0 16px',
                  borderRadius: '10px',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#475569',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ArrowLeft style={{ width: '14px', height: '14px' }} />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                style={{
                  height: '38px',
                  padding: '0 16px',
                  borderRadius: '10px',
                  background: 'transparent',
                  border: 'none',
                  color: '#64748B',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 1 && !description.trim()) {
                    setStepErrorMsg('⚠️ Please enter or speak a description of the problem.');
                    return;
                  }
                  setStepErrorMsg('');
                  setCurrentStep(prev => prev + 1);
                }}
                style={{
                  height: '38px',
                  padding: '0 18px',
                  borderRadius: '10px',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
                }}
              >
                <span>{currentStep === 2 && !photoPreview ? 'Skip Photo / Next' : 'Next Step'}</span>
                <ArrowRight style={{ width: '14px', height: '14px' }} />
              </button>
            ) : (
              <button
                id="btn-confirm-submit-grievance"
                data-testid="btn-confirm-submit-grievance"
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                style={{
                  height: '40px',
                  padding: '0 22px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0E5E3A 0%, #064E3B 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(14, 94, 58, 0.35)'
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" style={{ width: '15px', height: '15px' }} />
                    <span>Transmitting to Officials...</span>
                  </>
                ) : (
                  <span>🚀 Confirm & Submit Grievance</span>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
