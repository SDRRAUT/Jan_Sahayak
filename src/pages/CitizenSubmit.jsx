import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, 
  MicOff, 
  Camera, 
  Video,
  FileText,
  Sparkles, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Navigation,
  Layers, 
  UploadCloud, 
  Radio, 
  RefreshCw,
  Eye,
  Sliders,
  X,
  Volume2,
  Check,
  Loader2,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import GrievanceDnaCard from '../components/common/GrievanceDnaCard';
import WhyExplainer from '../components/common/WhyExplainer';
import { uploadComplaintMedia, uploadVoiceRecording } from '../services/supabaseClient';

export default function CitizenSubmit() {
  const navigate = useNavigate();
  const { submitGrievance, user } = useApp();

  const citizenInfo = user || {
    name: 'Aditya Verma',
    phone: '+91 98712-88210',
    ward: 'Ward 14 (Rohini Sector 14)',
    pincode: '110085'
  };

  // Accessibility / Low Digital Literacy Toggle
  const [saralMode, setSaralMode] = useState(false);

  // Form Inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ward, setWard] = useState(citizenInfo.ward || 'Ward 14 (Rohini Sector 14)');
  const [area, setArea] = useState('Sector 14 Corridor');
  const [pincode, setPincode] = useState(citizenInfo.pincode || '110085');
  const [manualCategory, setManualCategory] = useState('');
  const [severityLevel, setSeverityLevel] = useState('HIGH');
  const [showLocationDetails, setShowLocationDetails] = useState(false);

  // Real Multimodal & Geolocation State
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

  // AI & Workflow State
  const [liveUnderstanding, setLiveUnderstanding] = useState(null);
  const [isAnalyzingText, setIsAnalyzingText] = useState(false);
  const [showAiReviewModal, setShowAiReviewModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for real media capture
  const photoInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const speechRecognitionRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Quick preset test prompts (for convenience during review)
  const presets = [
    {
      label: '💧 Contaminated Drinking Water (Hinglish)',
      text: 'Bhai pichle 3 din se hamare Sector 14 mein naali ka ganda badbudaar paani supply mein mix hoke aa raha hai. Bacche bimaar pad rahe hain, jaldi theek karwao please near Mother Dairy.',
      category: 'Water Supply & Contamination'
    },
    {
      label: '🚧 Road Cave-in & Pothole (Accident Hazard)',
      text: 'Moolchand flyover ke neeche main road pe bohot bada gaddha ho gaya hai barish ke baad. 2 scooter gir chuke hain aaj subah. Severe traffic bottleneck and accident risk!',
      category: 'Roads & Infrastructure'
    },
    {
      label: '⚡ Transformer Sparking (Fire Hazard)',
      text: 'Gali no 3 main market transformer mein se aag ki chingariyan nikal rahi hain aur blast hone ka khatra hai. Poori gali ki light chali gayi hai.',
      category: 'Electricity & Power Grid'
    },
    {
      label: '🗑️ Solid Waste Accumulation & Open Burning',
      text: 'Main market ke saamne open kude ka dher hai, 5 din se koi truck nahi aaya. Toxic smoke and foul stench spreading across residential colony.',
      category: 'Sanitation & Solid Waste'
    }
  ];

  // 1. REAL VOICE INPUT VIA MEDIARECORDER & WEB SPEECH API
  const handleStartVoice = async () => {
    if (isRecording) {
      handleStopVoice();
      return;
    }

    setMicStatusMsg(null);

    // Request real browser microphone permission
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

        // Upload to Supabase Storage voice-recordings bucket
        try {
          setMicStatusMsg('Uploading audio to Supabase and running AI transcription...');
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
                  setMicStatusMsg(`Transcribed in ${data.language || 'Hindi/English'}: "${data.transcript.slice(0, 60)}..."`);
                }
              }
            } catch (err) {
              console.warn('Voice transcription notice:', err.message);
            }
          };
          reader.readAsDataURL(audioBlob);
        } catch (uploadErr) {
          console.warn('Voice recording upload notice:', uploadErr.message);
        }
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      // Start recording timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);

      // Also trigger SpeechRecognition if supported for real-time live transcription
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        speechRecognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'hi-IN'; // Supports Hindi/Hinglish/English

        recognition.onresult = (event) => {
          let transcript = '';
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript + ' ';
          }
          if (transcript.trim()) {
            setDescription(prev => {
              const base = prev ? prev.trim() + ' ' : '';
              return transcript.trim();
            });
          }
        };

        recognition.onerror = (e) => {
          console.warn('[SpeechRecognition] Note:', e.error);
        };

        try {
          recognition.start();
        } catch (err) {}
      } else {
        setMicStatusMsg('Audio recording active. (Browser voice typing not supported, audio clip will be saved)');
      }
    } catch (err) {
      console.warn('Microphone error:', err);
      setIsRecording(false);
      setMicStatusMsg('Microphone access was denied or is unavailable. You can type your report directly.');
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

  // 2. REAL PHOTO UPLOAD & GEMINI COMPUTER VISION ANALYSIS
  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);
    
    // Upload to Supabase Storage complaint-media bucket
    uploadComplaintMedia(file).then(({ publicUrl }) => {
      setPhotoStorageUrl(publicUrl);
    }).catch(e => console.warn('[Supabase Storage] Photo upload notice:', e.message));

    const reader = new FileReader();

    reader.onload = async (event) => {
      const base64Data = event.target.result;
      setPhotoPreview(base64Data);
      setIsAnalyzingImage(true);
      setPhotoTag(`Uploaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);

      try {
        // Real multimodal analysis through backend Gemini
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
        console.warn('Vision analysis fallback:', err.message);
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

  // 3. REAL DOCUMENT UPLOAD
  const handleDocumentSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentFile(file);
    }
  };

  // 4. REAL DEVICE GEOLOCATION & REVERSE GEOCODING
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatusMsg('Geolocation is not supported by your browser.');
      setShowLocationDetails(true);
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
          // Call real reverse geocode endpoint
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
              setLocationStatusMsg(`GPS Locked: ${data.formattedAddress}`);
            }
          }
        } catch (err) {
          setArea(`GPS: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`);
          setLocationStatusMsg(`GPS Coords: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`);
        } finally {
          setIsDetectingGps(false);
          setShowLocationDetails(true);
        }
      },
      (err) => {
        setIsDetectingGps(false);
        setLocationStatusMsg('Location access permission was denied. You can manually enter your area.');
        setShowLocationDetails(true);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // 5. REAL-TIME AI UNDERSTANDING PRE-REVIEW VIA GEMINI
  const handleProceedToReview = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsAnalyzingText(true);
    setShowAiReviewModal(true);

    try {
      const res = await fetch('/api/complaints/ai-understand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: description,
          ward,
          area
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
      console.warn('AI understand note:', err.message);
    } finally {
      setIsAnalyzingText(false);
    }
  };

  // 6. CONFIRM & SUBMIT TO REAL BACKEND
  const handleConfirmSubmission = async () => {
    setIsSubmitting(true);
    const finalCategory = manualCategory || liveUnderstanding?.category || 'General Civic Infrastructure';

    try {
      const created = await submitGrievance({
        title: title || liveUnderstanding?.problem_type || `${finalCategory} in ${ward}`,
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
      setShowAiReviewModal(false);
      setShowConfirmationModal(true);

      // Celebration confetti
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (err) {}
    } catch (err) {
      setIsSubmitting(false);
      setShowAiReviewModal(false);
    }
  };

  return (
    <div className="section-spacing" style={{ paddingTop: '32px' }}>
      <div className="container">

        {/* Hidden File Inputs for Real Camera & Document Attachment */}
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
          onChange={handleDocumentSelect}
          style={{ display: 'none' }}
        />

        {/* Page Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <img src="/logo.png" alt="JanSahayak" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
              <div className="category-pill" style={{ background: '#ECFDF5', color: '#065F46', borderColor: '#A7F3D0' }}>
                <Sparkles style={{ width: '13px', height: '13px' }} />
                <span>CITIZEN REPORTING GATEWAY</span>
              </div>
            </div>
            <h1 style={{ fontSize: '32px', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
              Report a Civic Problem
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14.5px', maxWidth: '640px' }}>
              Describe what happened in your own words. JanSahayak’s live AI connects real evidence, assigns the responsible authority, and updates your timeline in real time.
            </p>
          </div>

          {/* Saral / Easy Mode Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: saralMode ? 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)' : '#FFFFFF',
            padding: '10px 18px',
            borderRadius: 'var(--radius-lg)',
            border: saralMode ? '2px solid #059669' : '1px solid var(--color-border-subtle)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Sliders style={{ width: '16px', height: '16px', color: 'var(--color-primary)' }} />
            <div>
              <strong style={{ fontSize: '13px', display: 'block', color: 'var(--color-text-primary)' }}>
                सरल मोड (Saral Mode)
              </strong>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                Large buttons & voice-first guidance
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSaralMode(!saralMode)}
              style={{
                width: '40px',
                height: '22px',
                borderRadius: '999px',
                background: saralMode ? 'var(--color-primary)' : '#E2E8F0',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 200ms ease'
              }}
            >
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#FFFFFF',
                position: 'absolute',
                top: '3px',
                left: saralMode ? '21px' : '3px',
                transition: 'left 200ms ease'
              }} />
            </button>
          </div>
        </div>

        {/* Main Grid: Input Form (Left) & Intelligence Sidebar (Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '28px', alignItems: 'start' }}>
          
          {/* LEFT: CITIZEN REPORTING CARD */}
          <div className="card" style={{ padding: '28px' }}>
            
            {/* Quick Test Presets Bar */}
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
                Quick Sample Situations (Click to test):
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setDescription(p.text);
                      setTitle(p.category);
                      setManualCategory(p.category);
                    }}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 'var(--radius-full)',
                      background: '#F8FAFC',
                      border: '1px solid rgba(15, 23, 42, 0.12)',
                      fontSize: '12px',
                      color: 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 150ms ease'
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleProceedToReview}>
              
              {/* Complaint Description Textarea */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                  What is the problem? <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the defect, leakage, road pothole, electricity issue, or sanitation problem..."
                    rows={saralMode ? 6 : 4}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border-medium)',
                      fontSize: saralMode ? '16px' : '14px',
                      lineHeight: 1.6,
                      background: '#FFFFFF',
                      color: 'var(--color-text-primary)'
                    }}
                    required
                  />
                </div>

                {/* Multimodal Input Controls (Microphone, Camera, Geolocation) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    
                    {/* 1. Real Microphone Button */}
                    <button
                      type="button"
                      onClick={handleStartVoice}
                      style={{
                        padding: '7px 14px',
                        borderRadius: '9999px',
                        background: isRecording ? '#FEF2F2' : '#FFFFFF',
                        border: isRecording ? '1.5px solid #EF4444' : '1px solid var(--color-border-medium)',
                        color: isRecording ? '#DC2626' : 'var(--color-text-primary)',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      {isRecording ? (
                        <>
                          <MicOff style={{ width: '14px', height: '14px', animation: 'pulse 1s infinite' }} />
                          <span>Stop Recording ({recordingSeconds}s)</span>
                        </>
                      ) : (
                        <>
                          <Mic style={{ width: '14px', height: '14px', color: '#059669' }} />
                          <span>Speak (Voice Input)</span>
                        </>
                      )}
                    </button>

                    {/* 2. Real Camera / Photo Button */}
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      disabled={isAnalyzingImage}
                      style={{
                        padding: '7px 14px',
                        borderRadius: '9999px',
                        background: photoPreview ? '#ECFDF5' : '#FFFFFF',
                        border: photoPreview ? '1.5px solid #059669' : '1px solid var(--color-border-medium)',
                        color: photoPreview ? '#065F46' : 'var(--color-text-primary)',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      {isAnalyzingImage ? (
                        <>
                          <Loader2 className="animate-spin" style={{ width: '14px', height: '14px' }} />
                          <span>Analyzing with Gemini...</span>
                        </>
                      ) : (
                        <>
                          <Camera style={{ width: '14px', height: '14px', color: '#059669' }} />
                          <span>{photoPreview ? 'Change Photo' : 'Upload / Capture Photo'}</span>
                        </>
                      )}
                    </button>

                    {/* 3. Real Device Geolocation Button */}
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={isDetectingGps}
                      style={{
                        padding: '7px 14px',
                        borderRadius: '9999px',
                        background: gpsCoordinates ? '#ECFDF5' : '#FFFFFF',
                        border: gpsCoordinates ? '1.5px solid #059669' : '1px solid var(--color-border-medium)',
                        color: gpsCoordinates ? '#065F46' : 'var(--color-text-primary)',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      {isDetectingGps ? (
                        <>
                          <Loader2 className="animate-spin" style={{ width: '14px', height: '14px' }} />
                          <span>Detecting GPS...</span>
                        </>
                      ) : (
                        <>
                          <MapPin style={{ width: '14px', height: '14px', color: '#059669' }} />
                          <span>{gpsCoordinates ? 'GPS Locked ✓' : 'Detect GPS Location'}</span>
                        </>
                      )}
                    </button>

                    {/* 4. Document Button */}
                    <button
                      type="button"
                      onClick={() => documentInputRef.current?.click()}
                      style={{
                        padding: '7px 14px',
                        borderRadius: '9999px',
                        background: documentFile ? '#F1F5F9' : '#FFFFFF',
                        border: documentFile ? '1.5px solid #64748B' : '1px solid var(--color-border-medium)',
                        color: documentFile ? '#334155' : 'var(--color-text-primary)',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <FileText style={{ width: '14px', height: '14px' }} />
                      <span>{documentFile ? documentFile.name.slice(0, 18) + '...' : 'Attach Bill/Doc'}</span>
                    </button>
                  </div>
                </div>

                {/* Inline Real Notifications & Status Messages */}
                {micStatusMsg && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle style={{ width: '13px', height: '13px' }} />
                    <span>{micStatusMsg}</span>
                  </div>
                )}
                {locationStatusMsg && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#065F46', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 style={{ width: '13px', height: '13px' }} />
                    <span>{locationStatusMsg}</span>
                  </div>
                )}

                {/* Real Audio Playback Preview */}
                {audioUrl && (
                  <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: 'var(--radius-md)', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Volume2 style={{ width: '16px', height: '16px', color: '#059669' }} />
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>Your Voice Recording:</span>
                    </div>
                    <audio controls src={audioUrl} style={{ height: '32px', flex: 1, maxWidth: '280px' }} />
                    <button type="button" onClick={() => setAudioUrl(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#EF4444' }}>
                      <Trash2 style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                )}

                {/* Real Photo Thumbnail & Vision Observations Banner */}
                {photoPreview && (
                  <div style={{ marginTop: '12px', padding: '12px', borderRadius: 'var(--radius-md)', background: '#F0FDF4', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img 
                      src={photoPreview} 
                      alt="Complaint Evidence" 
                      style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #A7F3D0' }} 
                    />
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '13px', color: '#14532D', display: 'block' }}>
                        📷 Visual Evidence Attached
                      </strong>
                      <span style={{ fontSize: '11.5px', color: '#166534', display: 'block' }}>
                        {photoTag || 'Photo analyzed by Gemini Multimodal Vision.'}
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={handleRemovePhoto} 
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#EF4444', padding: '4px' }}
                      title="Remove Photo"
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                )}
              </div>

              {/* Location Selector & Landmark */}
              <div style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: '#F8FAFC',
                border: '1px solid var(--color-border-subtle)',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                    Jurisdiction & Street Location
                  </span>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    style={{
                      border: 'none',
                      background: 'none',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      color: gpsCoordinates ? '#059669' : 'var(--color-primary)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Navigation style={{ width: '12px', height: '12px' }} />
                    <span>{gpsCoordinates ? 'GPS Active' : 'Refresh GPS'}</span>
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr', gap: '10px' }}>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    style={{
                      width: '100%',
                      height: '38px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border-medium)',
                      padding: '0 8px',
                      background: '#FFFFFF',
                      fontSize: '12.5px'
                    }}
                  >
                    <option value="Ward 14 (Rohini Sector 14)">Ward 14 (Rohini Sector 14)</option>
                    <option value="Ward 8 (Lajpat Nagar / Moolchand)">Ward 8 (Lajpat Nagar / Moolchand)</option>
                    <option value="Ward 22 (Mayur Vihar Ph-1)">Ward 22 (Mayur Vihar Ph-1)</option>
                    <option value="Ward 5 (Kalkaji / South)">Ward 5 (Kalkaji / South)</option>
                    <option value="Ward 19 (Karol Bagh)">Ward 19 (Karol Bagh)</option>
                  </select>

                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Local Area / Landmark"
                    style={{
                      width: '100%',
                      height: '38px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border-medium)',
                      padding: '0 10px',
                      background: '#FFFFFF',
                      fontSize: '12.5px'
                    }}
                  />

                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Pincode"
                    style={{
                      width: '100%',
                      height: '38px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border-medium)',
                      padding: '0 10px',
                      background: '#FFFFFF',
                      fontSize: '12.5px'
                    }}
                  />
                </div>
              </div>

              {/* Primary Action Button: Review Real AI Understanding */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  🔒 Official Delhi Grievance Redressal Gateway
                </span>

                <button
                  type="submit"
                  disabled={!description.trim() || isAnalyzingText}
                  className="btn-primary"
                  style={{
                    height: '46px',
                    padding: '0 26px',
                    fontSize: '14px',
                    background: 'linear-gradient(135deg, #0E5E3A 0%, #064E3B 100%)',
                    boxShadow: '0 4px 14px rgba(14, 94, 58, 0.28)'
                  }}
                >
                  {isAnalyzingText ? (
                    <>
                      <Loader2 className="animate-spin" style={{ width: '16px', height: '16px' }} />
                      <span>Consulting Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <span>Review AI Understanding</span>
                      <ArrowRight style={{ width: '16px', height: '16px' }} />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* RIGHT: LIVE INTELLIGENCE SIDEBAR */}
          <div>
            {liveUnderstanding ? (
              <div className="card" style={{ padding: '24px', border: '1.5px solid #10B981', background: '#FDFEFE' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div className="category-pill" style={{ background: '#ECFDF5', color: '#065F46' }}>
                    <Sparkles style={{ width: '12px', height: '12px' }} />
                    <span>REAL GEMINI AI UNDERSTANDING</span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', background: liveUnderstanding.severity === 'CRITICAL' ? '#FEF2F2' : '#FFFBEB', color: liveUnderstanding.severity === 'CRITICAL' ? '#991B1B' : '#B45309' }}>
                    ● {liveUnderstanding.severity}
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                  {liveUnderstanding.problem_type}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {liveUnderstanding.summary}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', display: 'block' }}>Category</span>
                    <strong style={{ fontSize: '12px', color: 'var(--color-text-primary)' }}>{liveUnderstanding.category}</strong>
                  </div>
                  <div style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', display: 'block' }}>Target Department</span>
                    <strong style={{ fontSize: '12px', color: '#0E5E3A' }}>{liveUnderstanding.department?.split('(')[0]}</strong>
                  </div>
                </div>

                <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: '#F0FDF4', border: '1px solid #BBF7D0', fontSize: '12px', color: '#166534', marginBottom: '14px' }}>
                  <strong>Infrastructural Root Cause Hypothesis:</strong>
                  <p style={{ margin: '4px 0 0 0', lineHeight: 1.4 }}>{liveUnderstanding.root_cause_hypothesis}</p>
                </div>

                <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: '#EFF6FF', border: '1px solid #BFDBFE', fontSize: '12px', color: '#1E40AF' }}>
                  <strong>Recommended Standard Operating Procedure:</strong>
                  <p style={{ margin: '4px 0 0 0', lineHeight: 1.4 }}>{liveUnderstanding.recommended_action}</p>
                </div>
              </div>
            ) : (
              <div style={{
                padding: '36px 20px',
                borderRadius: 'var(--radius-lg)',
                background: '#FFFFFF',
                border: '2px dashed var(--color-border-medium)',
                textAlign: 'center'
              }}>
                <div className="icon-squircle" style={{ margin: '0 auto 14px auto', background: '#ECFDF5', color: '#059669' }}>
                  <Sparkles style={{ width: '22px', height: '22px' }} />
                </div>
                <h4 style={{ fontSize: '16px', marginBottom: '6px' }}>
                  Live Multi-Agent Intelligence
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  Enter your complaint or speak via voice. JanSahayak’s Gemini 3.5 pipeline will instantly categorize the problem, identify root causes, and prepare authority routing.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* STEP 2: REAL AI REVIEW MODAL */}
        {showAiReviewModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 25, 20, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div className="card" style={{ maxWidth: '680px', width: '100%', padding: '32px', maxHeight: '92vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div className="category-pill" style={{ background: '#ECFDF5', color: '#065F46' }}>
                  <Sparkles style={{ width: '13px', height: '13px' }} />
                  <span>PRE-SUBMISSION INTELLIGENCE REVIEW</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAiReviewModal(false)}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                >
                  <X style={{ width: '20px', height: '20px' }} />
                </button>
              </div>

              {/* Gemini Understanding Banner */}
              <div style={{
                padding: '16px 20px',
                borderRadius: 'var(--radius-lg)',
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                marginBottom: '20px'
              }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#15803D', display: 'block', marginBottom: '4px' }}>
                  JanSahayak AI Synthesis • हमने आपकी समस्या को इस प्रकार समझा है:
                </span>
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#14532D', lineHeight: 1.5, margin: 0 }}>
                  "{liveUnderstanding?.summary || `A civic defect in ${ward} near ${area} requiring priority intervention.`}"
                </p>
              </div>

              {/* Original Citizen Verbatim Text */}
              <div style={{
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                background: '#F8FAFC',
                border: '1px solid var(--color-border-subtle)',
                marginBottom: '20px'
              }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                  Your Verbatim Words:
                </span>
                <p style={{ fontSize: '13px', color: 'var(--color-text-primary)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                  "{description}"
                </p>
              </div>

              {/* Editable Fields: Title & Department */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '14px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                    Title:
                  </label>
                  <input
                    type="text"
                    value={title || liveUnderstanding?.problem_type || ''}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{
                      width: '100%',
                      height: '38px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border-medium)',
                      padding: '0 10px',
                      fontSize: '13px',
                      fontWeight: 600,
                      background: '#FFFFFF'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                    Department:
                  </label>
                  <div style={{
                    height: '38px',
                    borderRadius: 'var(--radius-sm)',
                    background: '#F1F5F9',
                    padding: '0 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}>
                    <strong>{liveUnderstanding?.department ? liveUnderstanding.department.split('(')[0] : 'MCD'}</strong>
                    <span style={{ fontSize: '10.5px', color: '#059669', fontWeight: 700 }}>
                      SLA: {liveUnderstanding?.estimated_sla_hours || 24}h
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAiReviewModal(false)}
                  className="btn-secondary btn-sm"
                >
                  ✏️ Edit Details
                </button>

                <button
                  type="button"
                  onClick={handleConfirmSubmission}
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{
                    height: '44px',
                    padding: '0 24px',
                    background: 'linear-gradient(135deg, #0E5E3A 0%, #064E3B 100%)'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" style={{ width: '15px', height: '15px' }} />
                      <span>Logging to Municipal Ledger...</span>
                    </>
                  ) : (
                    <span>✓ Confirm & Submit Problem</span>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* STEP 3: REAL CONFIRMATION MODAL */}
        {showConfirmationModal && createdTicket && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 25, 20, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div className="card" style={{ maxWidth: '540px', width: '100%', padding: '36px', textAlign: 'center' }}>
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

              <div className="category-pill" style={{ margin: '0 auto 12px auto' }}>
                GRIEVANCE SUCCESSFULLY LOGGED
              </div>

              <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>
                Ticket #{createdTicket.id}
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
                Your report has been saved to the municipal database, categorized, and assigned to <strong>{createdTicket.department}</strong>.
              </p>

              {/* Status Summary */}
              <div style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                fontSize: '12.5px',
                color: '#166534',
                marginBottom: '24px',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, marginBottom: '6px' }}>
                  <Check style={{ width: '14px', height: '14px' }} />
                  <span>Real-time System Action:</span>
                </div>
                <ul style={{ paddingLeft: '18px', margin: 0, lineHeight: 1.6 }}>
                  <li>Ticket ID: <strong>{createdTicket.id}</strong></li>
                  <li>Assigned Department: <strong>{createdTicket.department}</strong></li>
                  <li>SLA Target: <strong>{createdTicket.slaDeadline || '24 Hours'}</strong></li>
                  <li>Complaint DNA & Cluster Linkage generated</li>
                </ul>
              </div>

              {/* Navigation Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => navigate(`/citizen/complaints/${createdTicket.id}`)}
                  className="btn-primary"
                  style={{ flex: 1 }}
                >
                  <span>Track Timeline</span>
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/citizen')}
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  Citizen Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
