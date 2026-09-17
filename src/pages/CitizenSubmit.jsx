import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, 
  MicOff, 
  Camera, 
  FileText,
  Sparkles, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Navigation,
  Sliders, 
  X, 
  Volume2, 
  Check, 
  Loader2, 
  Trash2,
  Copy,
  ShieldCheck,
  Clock,
  Building2,
  RotateCcw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { uploadComplaintMedia, uploadVoiceRecording } from '../services/supabaseClient';

const QUICK_PRESETS = [
  {
    label: '💧 Contaminated Water',
    hindiLabel: 'दूषित पेयजल',
    text: 'Pichle 3 din se hamare Sector 14 mein supply ka paani ganda aur badbudaar aa raha hai. Bacche bimaar pad rahe hain, urgent pipeline inspection required near Mother Dairy.',
    category: 'Water Supply & Contamination',
    department: 'Delhi Jal Board (DJB)',
    severity: 'CRITICAL',
    badgeColor: '#0284C7'
  },
  {
    label: '🚧 Road Pothole / Crater',
    hindiLabel: 'सड़क पर गहरा गड्ढा',
    text: 'Main road outer ring road flyover ke neeche bohot bada dangerous gaddha ho gaya hai. Kal raat 2 do-pahiya vahan slip hue. Severe accident hazard and traffic disruption.',
    category: 'Roads & Infrastructure',
    department: 'Public Works Department (PWD)',
    severity: 'HIGH',
    badgeColor: '#D97706'
  },
  {
    label: '🗑️ Garbage Dump & Stench',
    hindiLabel: 'कचरे का ढेर व दुर्गंध',
    text: 'Main market corner pe kude ka bohot bada dher laga hua hai, 4 din se koi sanitation truck nahi aaya. Animals spreading garbage and toxic stench everywhere.',
    category: 'Sanitation & Solid Waste',
    department: 'Municipal Corporation of Delhi (MCD)',
    severity: 'MEDIUM',
    badgeColor: '#059669'
  },
  {
    label: '⚡ Transformer Sparking',
    hindiLabel: 'ट्रांसफॉर्मर चिंगारी व खतरा',
    text: 'Gali number 4 ke corner pe electric transformer se spark nikal raha hai aur blast hone ka khatra hai. Poori residential line trip ho rahi hai. Immediate repair needed.',
    category: 'Electricity & Power Grid',
    department: 'BSES Rajdhani Power Limited',
    severity: 'CRITICAL',
    badgeColor: '#7C3AED'
  },
  {
    label: '🌊 Sewage / Drain Overflow',
    hindiLabel: 'सीवर व नाली ओवरफ्लो',
    text: 'Open stormwater drain chocked ho gaya hai aur ganda naali ka paani sadak pe bhar raha hai. Pedestrians cannot walk and dengue mosquito breeding risk.',
    category: 'Drainage & Waterlogging',
    department: 'Municipal Corporation of Delhi (MCD)',
    severity: 'HIGH',
    badgeColor: '#0891B2'
  }
];

export default function CitizenSubmit() {
  const navigate = useNavigate();
  const { submitGrievance, user } = useApp();

  const citizenInfo = user || {
    name: 'Aditya Verma',
    phone: '+91 98712-88210',
    ward: 'Ward 14 (Rohini Sector 14)',
    pincode: '110085'
  };

  // Accessibility / Saral (Easy Voice) Mode
  const [saralMode, setSaralMode] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ward, setWard] = useState(citizenInfo.ward || 'Ward 14 (Rohini Sector 14)');
  const [area, setArea] = useState('Sector 14 Pocket 2');
  const [pincode, setPincode] = useState(citizenInfo.pincode || '110085');
  const [manualCategory, setManualCategory] = useState('');
  const [severityLevel, setSeverityLevel] = useState('HIGH');

  // Media & Geolocation State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioStorageUrl, setAudioStorageUrl] = useState(null);
  const [micStatusMsg, setMicStatusMsg] = useState(null);

  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoStorageUrl, setPhotoStorageUrl] = useState(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [visionAnalysis, setVisionAnalysis] = useState(null);
  const [photoTag, setPhotoTag] = useState('');

  const [documentFile, setDocumentFile] = useState(null);

  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsCoordinates, setGpsCoordinates] = useState(null);
  const [locationStatusMsg, setLocationStatusMsg] = useState(null);

  // AI Understanding State
  const [liveUnderstanding, setLiveUnderstanding] = useState(null);
  const [isAnalyzingText, setIsAnalyzingText] = useState(false);
  const [copiedTicketId, setCopiedTicketId] = useState(false);

  // Submission Flow
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);

  // Refs for media capture
  const photoInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const speechRecognitionRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Real-time debounced AI synthesis trigger
  useEffect(() => {
    if (!description || description.trim().length < 12) {
      if (!description.trim()) setLiveUnderstanding(null);
      return;
    }

    const timer = setTimeout(() => {
      fetchAiUnderstanding(description, ward, area);
    }, 700);

    return () => clearTimeout(timer);
  }, [description, ward, area]);

  const fetchAiUnderstanding = async (textToAnalyze, currentWard, currentArea) => {
    if (isAnalyzingText) return;
    setIsAnalyzingText(true);

    try {
      const res = await fetch('/api/complaints/ai-understand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToAnalyze,
          ward: currentWard,
          area: currentArea
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.understanding) {
          setLiveUnderstanding(data.understanding);
          if (!title) {
            setTitle(data.understanding.problem_type);
          }
          if (data.understanding.severity) {
            setSeverityLevel(data.understanding.severity);
          }
        }
      }
    } catch (err) {
      console.warn('AI understand background fetch notice:', err.message);
    } finally {
      setIsAnalyzingText(false);
    }
  };

  // 1. REAL VOICE INPUT
  const handleStartVoice = async () => {
    if (isRecording) {
      handleStopVoice();
      return;
    }

    setMicStatusMsg(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const localUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(localUrl);
        stream.getTracks().forEach(t => t.stop());

        try {
          setMicStatusMsg('Saving audio & transcribing with AI...');
          const { publicUrl } = await uploadVoiceRecording(audioBlob);
          setAudioStorageUrl(publicUrl);

          const reader = new FileReader();
          reader.onload = async () => {
            try {
              const base64Audio = reader.result;
              const res = await fetch('/api/complaints/voice-transcribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audioBase64: base64Audio, mimeType: 'audio/webm', audioUrl: publicUrl })
              });

              if (res.ok) {
                const data = await res.json();
                if (data.transcript) {
                  setDescription(prev => (prev ? prev.trim() + ' ' : '') + data.transcript);
                  setMicStatusMsg(`Transcribed: "${data.transcript.slice(0, 55)}..."`);
                }
              }
            } catch (err) {
              console.warn('Voice transcription fallback notice:', err.message);
            }
          };
          reader.readAsDataURL(audioBlob);
        } catch (uploadErr) {
          console.warn('Voice upload notice:', uploadErr.message);
        }
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        speechRecognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'hi-IN';

        recognition.onresult = (event) => {
          let transcript = '';
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript + ' ';
          }
          if (transcript.trim()) {
            setDescription(prev => transcript.trim());
          }
        };

        try {
          recognition.start();
        } catch (err) {}
      }
    } catch (err) {
      console.warn('Microphone permission or hardware note:', err);
      setIsRecording(false);
      setMicStatusMsg('Microphone access was denied. You can type your complaint directly.');
    }
  };

  const handleStopVoice = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (err) {}
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsRecording(false);
  };

  // 2. REAL PHOTO UPLOAD & GEMINI COMPUTER VISION
  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);
    
    uploadComplaintMedia(file).then(({ publicUrl }) => {
      setPhotoStorageUrl(publicUrl);
    }).catch(e => console.warn('Supabase storage photo notice:', e.message));

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target.result;
      setPhotoPreview(base64Data);
      setIsAnalyzingImage(true);
      setPhotoTag(`Uploaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);

      try {
        const res = await fetch('/api/complaints/vision-analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64Data,
            mimeType: file.type || 'image/jpeg',
            contextPrompt: description || 'Civic infrastructure complaint'
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.vision) {
            setVisionAnalysis(data.vision);
            setPhotoTag(`Gemini Vision: ${data.vision.observed_hazard} (${Math.round(data.vision.confidence * 100)}% confidence)`);
            if (data.vision.category && !manualCategory) {
              setManualCategory(data.vision.category);
            }
          }
        }
      } catch (err) {
        console.warn('Vision analysis fallback notice:', err.message);
      } finally {
        setIsAnalyzingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPhotoFile(null);
    setVisionAnalysis(null);
    setPhotoTag('');
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  // 3. REAL DEVICE GEOLOCATION
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatusMsg('Geolocation not supported by browser.');
      return;
    }

    setIsDetectingGps(true);
    setLocationStatusMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
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
              setLocationStatusMsg(`GPS Locked: ${data.formattedAddress || `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`}`);
            }
          }
        } catch (err) {
          setArea(`GPS: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`);
          setLocationStatusMsg(`GPS Coords: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`);
        } finally {
          setIsDetectingGps(false);
        }
      },
      (err) => {
        setIsDetectingGps(false);
        setLocationStatusMsg('Location permission denied. You can manually choose your ward and area.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // 4. SUBMIT GRIEVANCE DIRECTLY
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    const finalCategory = manualCategory || liveUnderstanding?.category || 'General Civic Infrastructure';

    try {
      const created = await submitGrievance({
        title: title || liveUnderstanding?.problem_type || `${finalCategory} Issue in ${ward}`,
        description,
        ward,
        area,
        pincode,
        category: finalCategory,
        urgency: severityLevel,
        location: {
          ward,
          area,
          city: 'New Delhi',
          pincode,
          lat: gpsCoordinates?.lat || 28.7185,
          lng: gpsCoordinates?.lng || 77.1250
        },
        evidence: {
          hasPhoto: !!photoPreview || !!photoStorageUrl,
          photoUrl: photoStorageUrl || photoPreview,
          photoStorageUrl: photoStorageUrl || null,
          photoTag: photoTag || null,
          photoObservations: visionAnalysis?.observed_hazard || null,
          hasAudio: !!audioUrl || !!audioStorageUrl,
          audioUrl: audioStorageUrl || audioUrl,
          audioStorageUrl: audioStorageUrl || null,
          audioTranscript: description,
          hasDocument: !!documentFile,
          documentName: documentFile?.name || null
        }
      });

      setCreatedTicket(created);
      setIsSubmitting(false);

      // Celebration confetti
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (err) {}
    } catch (err) {
      console.error('Submission error:', err);
      setIsSubmitting(false);
    }
  };

  const handleCopyTicket = (id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(id);
      setCopiedTicketId(true);
      setTimeout(() => setCopiedTicketId(false), 2000);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setAudioUrl(null);
    setAudioStorageUrl(null);
    setPhotoPreview(null);
    setPhotoFile(null);
    setPhotoStorageUrl(null);
    setDocumentFile(null);
    setLiveUnderstanding(null);
    setCreatedTicket(null);
    setGpsCoordinates(null);
    setLocationStatusMsg(null);
    setMicStatusMsg(null);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--color-bg-canvas, #F8FAFC)',
      paddingTop: '28px',
      paddingBottom: '64px'
    }}>
      <div className="container" style={{ maxWidth: '980px', margin: '0 auto', padding: '0 16px' }}>

        {/* Hidden File Inputs */}
        <input 
          type="file" 
          ref={photoInputRef}
          accept="image/*"
          capture="environment"
          onChange={handlePhotoSelect}
          style={{ display: 'none' }}
        />
        <input 
          type="file" 
          ref={documentInputRef}
          accept=".pdf,.doc,.docx,image/*"
          onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
          style={{ display: 'none' }}
        />

        {/* ====================================================================
            UNIFIED MASTER CARD CONTAINER
            Arranges all content inside ONE cohesive, beautifully designed card.
           ==================================================================== */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid var(--color-border-subtle, rgba(15, 23, 42, 0.08))',
          boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04)',
          overflow: 'hidden'
        }}>

          {/* 1. MASTER CARD HEADER */}
          <div style={{
            padding: '28px 32px 24px 32px',
            borderBottom: '1px solid #F1F5F9',
            background: 'linear-gradient(180deg, #FAFCFB 0%, #FFFFFF 100%)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                  src="/logo.png" 
                  alt="JanSahayak Emblem" 
                  style={{ height: '36px', width: 'auto', objectFit: 'contain' }} 
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: '#047857',
                      background: '#ECFDF5',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      border: '1px solid #A7F3D0'
                    }}>
                      Official Redressal Portal
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted, #64748B)', fontWeight: 600 }}>
                      NCT of Delhi
                    </span>
                  </div>
                  <h1 style={{ 
                    fontSize: '26px', 
                    fontWeight: 800, 
                    color: 'var(--color-text-primary, #0F172A)', 
                    margin: '4px 0 0 0',
                    letterSpacing: '-0.02em'
                  }}>
                    Register a Civic Grievance
                  </h1>
                </div>
              </div>

              {/* Saral / Voice Mode Switch */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 14px',
                borderRadius: '999px',
                background: saralMode ? '#ECFDF5' : '#F8FAFC',
                border: saralMode ? '1.5px solid #059669' : '1px solid #E2E8F0',
                transition: 'all 200ms ease'
              }}>
                <Sliders style={{ width: '15px', height: '15px', color: saralMode ? '#059669' : '#64748B' }} />
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: saralMode ? '#065F46' : '#334155' }}>
                  सरल मोड (Easy Voice)
                </span>
                <button
                  type="button"
                  onClick={() => setSaralMode(!saralMode)}
                  aria-label="Toggle Saral Mode"
                  style={{
                    width: '38px',
                    height: '20px',
                    borderRadius: '999px',
                    background: saralMode ? '#059669' : '#CBD5E1',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background 200ms ease'
                  }}
                >
                  <div style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    position: 'absolute',
                    top: '3px',
                    left: saralMode ? '21px' : '3px',
                    transition: 'left 200ms ease',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                  }} />
                </button>
              </div>
            </div>

            <p style={{ 
              fontSize: '13.5px', 
              color: 'var(--color-text-secondary, #475569)', 
              margin: '0 0 20px 0', 
              lineHeight: 1.5,
              maxWidth: '780px' 
            }}>
              Describe what happened in your own words or speak in Hindi/English. JanSahayak’s AI immediately identifies the problem type, extracts evidence, determines responsible municipal division, and assigns official SLA deadlines.
            </p>

            {/* Visual Process Stepper (All-in-one guide) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              padding: '10px 14px',
              background: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ 
                  width: '22px', 
                  height: '22px', 
                  borderRadius: '50%', 
                  background: description.trim() ? '#10B981' : '#0F172A', 
                  color: '#FFFFFF', 
                  fontSize: '11px', 
                  fontWeight: 700, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  {description.trim() ? '✓' : '1'}
                </span>
                <div>
                  <strong style={{ fontSize: '12px', display: 'block', color: '#0F172A' }}>1. Describe & Evidence</strong>
                  <span style={{ fontSize: '10.5px', color: '#64748B' }}>Voice, photo or text</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ 
                  width: '22px', 
                  height: '22px', 
                  borderRadius: '50%', 
                  background: gpsCoordinates || area ? '#10B981' : '#94A3B8', 
                  color: '#FFFFFF', 
                  fontSize: '11px', 
                  fontWeight: 700, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  {gpsCoordinates ? '✓' : '2'}
                </span>
                <div>
                  <strong style={{ fontSize: '12px', display: 'block', color: '#0F172A' }}>2. Jurisdiction & GPS</strong>
                  <span style={{ fontSize: '10.5px', color: '#64748B' }}>Ward, colony & landmark</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ 
                  width: '22px', 
                  height: '22px', 
                  borderRadius: '50%', 
                  background: liveUnderstanding ? '#10B981' : '#94A3B8', 
                  color: '#FFFFFF', 
                  fontSize: '11px', 
                  fontWeight: 700, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  {liveUnderstanding ? '✓' : '3'}
                </span>
                <div>
                  <strong style={{ fontSize: '12px', display: 'block', color: '#0F172A' }}>3. AI Routing & DNA</strong>
                  <span style={{ fontSize: '10.5px', color: '#64748B' }}>Department & SLA target</span>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================================
              IF SUBMITTED: SHOW BEAUTIFUL INLINE SUCCESS STATE
              (No disjointed popups!)
             ================================================================== */}
          {createdTicket ? (
            <div style={{ padding: '48px 32px', textAlign: 'center' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)'
              }}>
                <CheckCircle2 style={{ width: '42px', height: '42px' }} />
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#065F46',
                padding: '4px 14px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 700,
                marginBottom: '12px'
              }}>
                <ShieldCheck style={{ width: '14px', height: '14px' }} />
                <span>MUNICIPAL COMPLAINT REGISTERED</span>
              </div>

              <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                Complaint #{createdTicket.id}
              </h2>
              <p style={{ fontSize: '14.5px', color: '#475569', maxWidth: '560px', margin: '0 auto 24px auto', lineHeight: 1.5 }}>
                Your grievance has been permanently registered in the municipal database, categorized by AI, and dispatched to <strong>{createdTicket.department || 'the responsible authority'}</strong>.
              </p>

              {/* Ticket Details Summary Card */}
              <div style={{
                maxWidth: '640px',
                margin: '0 auto 32px auto',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'left'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                      Ticket Identifier
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <strong style={{ fontSize: '14px', color: '#0F172A' }}>{createdTicket.id}</strong>
                      <button
                        type="button"
                        onClick={() => handleCopyTicket(createdTicket.id)}
                        style={{
                          border: 'none',
                          background: '#E2E8F0',
                          cursor: 'pointer',
                          padding: '3px 6px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <Copy style={{ width: '11px', height: '11px' }} />
                        <span>{copiedTicketId ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                      Assigned Department
                    </span>
                    <strong style={{ fontSize: '14px', color: '#0E5E3A', display: 'block', marginTop: '2px' }}>
                      {createdTicket.department || 'Municipal Corporation of Delhi'}
                    </strong>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                      Target SLA Resolution
                    </span>
                    <strong style={{ fontSize: '14px', color: '#D97706', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Clock style={{ width: '13px', height: '13px' }} />
                      <span>{createdTicket.slaDeadline || '24 Hours'}</span>
                    </strong>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                      Jurisdiction
                    </span>
                    <strong style={{ fontSize: '14px', color: '#0F172A', display: 'block', marginTop: '2px' }}>
                      {ward}
                    </strong>
                  </div>
                </div>

                <div style={{
                  padding: '12px 14px',
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  borderRadius: '10px',
                  fontSize: '12.5px',
                  color: '#065F46',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Check style={{ width: '15px', height: '15px', flexShrink: 0 }} />
                  <span>Grievance DNA™ generated, geo-coordinates linked, and field engineer alerted.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => navigate(`/citizen/complaints/${createdTicket.id}`)}
                  className="btn-primary"
                  style={{
                    height: '46px',
                    padding: '0 24px',
                    fontSize: '14px',
                    background: 'linear-gradient(135deg, #0E5E3A 0%, #064E3B 100%)',
                    boxShadow: '0 4px 14px rgba(14, 94, 58, 0.28)'
                  }}
                >
                  <span>Track Timeline & Field Progress</span>
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/citizen')}
                  className="btn-secondary"
                  style={{ height: '46px', padding: '0 20px', fontSize: '14px' }}
                >
                  Citizen Dashboard
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    height: '46px',
                    padding: '0 18px',
                    border: '1px solid #CBD5E1',
                    borderRadius: 'var(--radius-md, 10px)',
                    background: '#FFFFFF',
                    color: '#334155',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RotateCcw style={{ width: '14px', height: '14px' }} />
                  <span>File Another Issue</span>
                </button>
              </div>
            </div>
          ) : (

            /* ================================================================
               MAIN REPORTING WORKFLOW (ALL IN ONE)
               ================================================================ */
            <form onSubmit={handleSubmit} style={{ padding: '28px 32px' }}>

              {/* A. QUICK SITUATION PRESETS (Clickable Chips) */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: 700, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.04em', 
                    color: 'var(--color-text-muted, #64748B)' 
                  }}>
                    Quick Civic Scenarios (Click to test AI routing):
                  </span>
                  <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>
                    ⚡ Instant Pre-fill
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {QUICK_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setDescription(p.text);
                        setTitle(p.category);
                        setManualCategory(p.category);
                      }}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '999px',
                        background: manualCategory === p.category ? '#ECFDF5' : '#F8FAFC',
                        border: manualCategory === p.category ? '1.5px solid #059669' : '1px solid #E2E8F0',
                        color: manualCategory === p.category ? '#065F46' : '#334155',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 150ms ease'
                      }}
                    >
                      <span>{p.label}</span>
                      <span style={{ fontSize: '10.5px', opacity: 0.75 }}>({p.hindiLabel})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* B. GRIEVANCE DESCRIPTION & TITLE */}
              <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                    What is the civic problem? <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                    🌐 Hindi • Hinglish • English supported
                  </span>
                </div>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="उदा: हमारे सेक्टर 14 में 3 दिन से गंदा पानी आ रहा है / Severe road pothole near Moolchand flyover causing accidents..."
                  rows={saralMode ? 6 : 4}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: saralMode ? '16px' : '14px',
                    lineHeight: 1.6,
                    background: '#FFFFFF',
                    color: '#0F172A',
                    boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.04)',
                    outline: 'none',
                    transition: 'border-color 150ms ease'
                  }}
                  required
                />

                {/* Status Messages for Microphone/GPS */}
                {micStatusMsg && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Volume2 style={{ width: '13px', height: '13px' }} />
                    <span>{micStatusMsg}</span>
                  </div>
                )}
                {locationStatusMsg && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#065F46', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 style={{ width: '13px', height: '13px' }} />
                    <span>{locationStatusMsg}</span>
                  </div>
                )}

                {/* Inline Voice Playback if recorded */}
                {audioUrl && (
                  <div style={{
                    marginTop: '10px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Volume2 style={{ width: '16px', height: '16px', color: '#059669' }} />
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#14532D' }}>Your Voice Clip:</span>
                    </div>
                    <audio controls src={audioUrl} style={{ height: '32px', flex: 1, maxWidth: '280px' }} />
                    <button 
                      type="button" 
                      onClick={() => setAudioUrl(null)} 
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#EF4444' }}
                      title="Delete Voice Clip"
                    >
                      <Trash2 style={{ width: '15px', height: '15px' }} />
                    </button>
                  </div>
                )}

                {/* Inline Photo Preview & Vision Hazard Badge */}
                {photoPreview && (
                  <div style={{
                    marginTop: '10px',
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px'
                  }}>
                    <img 
                      src={photoPreview} 
                      alt="Complaint Evidence" 
                      style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #CBD5E1' }} 
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong style={{ fontSize: '13px', color: '#0F172A' }}>Visual Evidence Attached</strong>
                        {isAnalyzingImage && (
                          <span style={{ fontSize: '11px', color: '#4F46E5', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Loader2 className="animate-spin" style={{ width: '11px', height: '11px' }} />
                            <span>Gemini analyzing...</span>
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '12px', color: '#475569', display: 'block', marginTop: '2px' }}>
                        {photoTag || 'Photo ready for municipal verification.'}
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={handleRemovePhoto} 
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#EF4444', padding: '6px' }}
                      title="Remove Photo"
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                )}
              </div>

              {/* C. MULTIMODAL ACTION DOCK (4 Integrated Action Buttons) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                gap: '10px',
                marginBottom: '24px'
              }}>
                {/* 1. Voice Record Button */}
                <button
                  type="button"
                  onClick={handleStartVoice}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: isRecording ? '#FEF2F2' : '#FFFFFF',
                    border: isRecording ? '1.5px solid #EF4444' : '1px solid #CBD5E1',
                    color: isRecording ? '#DC2626' : '#1E293B',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    transition: 'all 150ms ease'
                  }}
                >
                  {isRecording ? (
                    <>
                      <MicOff style={{ width: '16px', height: '16px', animation: 'pulse 1s infinite' }} />
                      <span>Recording ({recordingSeconds}s)</span>
                    </>
                  ) : (
                    <>
                      <Mic style={{ width: '16px', height: '16px', color: '#059669' }} />
                      <span>Speak (Voice Input)</span>
                    </>
                  )}
                </button>

                {/* 2. Photo Upload Button */}
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={isAnalyzingImage}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: photoPreview ? '#ECFDF5' : '#FFFFFF',
                    border: photoPreview ? '1.5px solid #059669' : '1px solid #CBD5E1',
                    color: photoPreview ? '#065F46' : '#1E293B',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    transition: 'all 150ms ease'
                  }}
                >
                  {isAnalyzingImage ? (
                    <>
                      <Loader2 className="animate-spin" style={{ width: '16px', height: '16px' }} />
                      <span>Analyzing Photo...</span>
                    </>
                  ) : (
                    <>
                      <Camera style={{ width: '16px', height: '16px', color: '#059669' }} />
                      <span>{photoPreview ? 'Change Photo' : 'Upload / Camera'}</span>
                    </>
                  )}
                </button>

                {/* 3. Auto-Detect GPS Button */}
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isDetectingGps}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: gpsCoordinates ? '#ECFDF5' : '#FFFFFF',
                    border: gpsCoordinates ? '1.5px solid #059669' : '1px solid #CBD5E1',
                    color: gpsCoordinates ? '#065F46' : '#1E293B',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    transition: 'all 150ms ease'
                  }}
                >
                  {isDetectingGps ? (
                    <>
                      <Loader2 className="animate-spin" style={{ width: '16px', height: '16px' }} />
                      <span>Detecting GPS...</span>
                    </>
                  ) : (
                    <>
                      <Navigation style={{ width: '16px', height: '16px', color: '#059669' }} />
                      <span>{gpsCoordinates ? 'GPS Locked ✓' : 'Detect GPS'}</span>
                    </>
                  )}
                </button>

                {/* 4. Attach Document Button */}
                <button
                  type="button"
                  onClick={() => documentInputRef.current?.click()}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: documentFile ? '#F1F5F9' : '#FFFFFF',
                    border: documentFile ? '1.5px solid #64748B' : '1px solid #CBD5E1',
                    color: documentFile ? '#334155' : '#1E293B',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    transition: 'all 150ms ease'
                  }}
                >
                  <FileText style={{ width: '16px', height: '16px', color: '#64748B' }} />
                  <span>{documentFile ? documentFile.name.slice(0, 14) + '...' : 'Attach Bill / Doc'}</span>
                </button>
              </div>

              {/* D. JURISDICTION & ADDRESS (Clean 3-column row) */}
              <div style={{
                background: '#F8FAFC',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                padding: '18px 20px',
                marginBottom: '26px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin style={{ width: '15px', height: '15px', color: '#059669' }} />
                    <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#0F172A' }}>
                      Location & Municipal Ward
                    </span>
                  </div>
                  {gpsCoordinates && (
                    <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>
                      Lat: {gpsCoordinates.lat.toFixed(4)}, Lng: {gpsCoordinates.lng.toFixed(4)}
                    </span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>
                      MUNICIPAL WARD
                    </label>
                    <select
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      style={{
                        width: '100%',
                        height: '40px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        padding: '0 10px',
                        background: '#FFFFFF',
                        fontSize: '13px',
                        color: '#0F172A',
                        fontWeight: 600
                      }}
                    >
                      <option value="Ward 14 (Rohini Sector 14)">Ward 14 (Rohini Sector 14)</option>
                      <option value="Ward 8 (Lajpat Nagar / Moolchand)">Ward 8 (Lajpat Nagar / Moolchand)</option>
                      <option value="Ward 22 (Mayur Vihar Ph-1)">Ward 22 (Mayur Vihar Ph-1)</option>
                      <option value="Ward 5 (Kalkaji / South)">Ward 5 (Kalkaji / South)</option>
                      <option value="Ward 19 (Karol Bagh)">Ward 19 (Karol Bagh)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>
                      COLONY / LANDMARK
                    </label>
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. Pocket 2, Near Mother Dairy"
                      style={{
                        width: '100%',
                        height: '40px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        padding: '0 12px',
                        background: '#FFFFFF',
                        fontSize: '13px',
                        color: '#0F172A'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>
                      PINCODE
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="110085"
                      style={{
                        width: '100%',
                        height: '40px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        padding: '0 12px',
                        background: '#FFFFFF',
                        fontSize: '13px',
                        color: '#0F172A'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* E. LIVE GRIEVANCE DNA™ & AI ROUTING (INTEGRATED DIRECTLY INSIDE THE FORM!) */}
              <div style={{
                background: liveUnderstanding ? '#F0FDF4' : '#F8FAFC',
                borderRadius: '16px',
                border: liveUnderstanding ? '1.5px solid #10B981' : '1px solid #E2E8F0',
                padding: '22px',
                marginBottom: '28px',
                transition: 'all 250ms ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: liveUnderstanding ? '#10B981' : '#E2E8F0',
                      color: liveUnderstanding ? '#FFFFFF' : '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Sparkles style={{ width: '15px', height: '15px' }} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '14px', color: '#0F172A', display: 'block' }}>
                        Live Grievance DNA™ & Authority Routing
                      </strong>
                      <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                        Automated multi-agent synthesis powered by Gemini 3.5
                      </span>
                    </div>
                  </div>

                  {liveUnderstanding ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: '999px',
                        background: liveUnderstanding.severity === 'CRITICAL' ? '#FEF2F2' : '#FFFBEB',
                        color: liveUnderstanding.severity === 'CRITICAL' ? '#991B1B' : '#B45309',
                        border: liveUnderstanding.severity === 'CRITICAL' ? '1px solid #FECACA' : '1px solid #FDE68A'
                      }}>
                        ● {liveUnderstanding.severity || 'PRIORITY'}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '999px',
                        background: '#ECFDF5',
                        color: '#065F46',
                        border: '1px solid #A7F3D0'
                      }}>
                        SLA: {liveUnderstanding.estimated_sla_hours || 24} Hours
                      </span>
                    </div>
                  ) : (
                    <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                      {isAnalyzingText ? 'AI Analyzing...' : 'Ready for input'}
                    </span>
                  )}
                </div>

                {liveUnderstanding ? (
                  <div>
                    {/* Synthesis Banner */}
                    <div style={{
                      padding: '12px 16px',
                      background: '#FFFFFF',
                      borderRadius: '10px',
                      border: '1px solid #BBF7D0',
                      marginBottom: '14px'
                    }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#15803D', display: 'block', marginBottom: '3px' }}>
                        AI Synthesis • हमने आपकी समस्या को इस प्रकार समझा है:
                      </span>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#14532D', margin: 0, lineHeight: 1.5 }}>
                        "{liveUnderstanding.summary || liveUnderstanding.problem_type}"
                      </p>
                    </div>

                    {/* Department and Category Badges */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '14px' }}>
                      <div style={{ padding: '10px 14px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                        <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                          Responsible Authority
                        </span>
                        <strong style={{ fontSize: '13px', color: '#0E5E3A', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                          <Building2 style={{ width: '14px', height: '14px' }} />
                          <span>{liveUnderstanding.department || 'Municipal Corporation of Delhi'}</span>
                        </strong>
                      </div>

                      <div style={{ padding: '10px 14px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                        <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                          Problem Classification
                        </span>
                        <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block', marginTop: '2px' }}>
                          {liveUnderstanding.category || 'General Civic Infrastructure'}
                        </strong>
                      </div>
                    </div>

                    {/* Root Cause & SOP */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '10px',
                      fontSize: '12px'
                    }}>
                      <div style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                        <strong style={{ color: '#334155', display: 'block', marginBottom: '3px' }}>
                          🔍 Likely Root Cause:
                        </strong>
                        <p style={{ margin: 0, color: '#475569', lineHeight: 1.4 }}>
                          {liveUnderstanding.root_cause_hypothesis || 'Underground conduit stress requiring on-site pressure and flow inspection.'}
                        </p>
                      </div>

                      <div style={{ padding: '10px 12px', background: '#EFF6FF', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
                        <strong style={{ color: '#1E40AF', display: 'block', marginBottom: '3px' }}>
                          📋 Recommended SOP:
                        </strong>
                        <p style={{ margin: 0, color: '#1E3A8A', lineHeight: 1.4 }}>
                          {liveUnderstanding.recommended_action || 'Dispatch municipal maintenance squad with repair kit and seal joint within SLA window.'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '18px', textAlign: 'center', color: '#64748B' }}>
                    <p style={{ fontSize: '13px', margin: 0 }}>
                      💡 Start typing your problem, speaking into the microphone, or click a quick scenario above. The AI engine will instantly classify the issue, route it to the exact Delhi municipal department, and preview the resolution plan here.
                    </p>
                  </div>
                )}
              </div>

              {/* F. FINAL SUBMIT BAR */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                paddingTop: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck style={{ width: '16px', height: '16px', color: '#059669' }} />
                  <span style={{ fontSize: '12.5px', color: '#475569' }}>
                    Direct dispatch to official Delhi Municipal ledger with immutable audit trail.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!description.trim() || isSubmitting}
                  className="btn-primary"
                  style={{
                    height: '50px',
                    padding: '0 32px',
                    fontSize: '15px',
                    fontWeight: 700,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0E5E3A 0%, #064E3B 100%)',
                    boxShadow: '0 4px 16px rgba(14, 94, 58, 0.32)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: !description.trim() || isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: !description.trim() || isSubmitting ? 0.7 : 1,
                    transition: 'all 150ms ease'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" style={{ width: '18px', height: '18px' }} />
                      <span>Registering with Authority...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Grievance & Dispatch Authority (शिकायत दर्ज करें)</span>
                      <ArrowRight style={{ width: '18px', height: '18px' }} />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
