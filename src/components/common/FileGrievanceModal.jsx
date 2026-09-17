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
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

export default function FileGrievanceModal({ isOpen, onClose, defaultCategory = '' }) {
  const navigate = useNavigate();
  const { user, submitGrievance } = useApp();

  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Problem Details
  const [category, setCategory] = useState(defaultCategory || 'Water Supply & Contamination');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [speechMsg, setSpeechMsg] = useState(null);

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
    { key: 'Other Civic Issue', label: 'Other Problem', icon: '🌐' }
  ];

  const presets = [
    { label: '💧 Dirty tap water', text: 'Pichle 2 din se nal mein ganda badbudar paani aa raha hai.', cat: 'Water Supply & Contamination' },
    { label: '🚧 Dangerous pothole', text: 'Main road par bohot gehra gaddha hai, accident ka khatra hai.', cat: 'Roads & Infrastructure' },
    { label: '🗑️ Garbage not cleared', text: 'Mohalle ke corner par kooda jama hai aur badbu fail rahi hai.', cat: 'Sanitation & Solid Waste' },
    { label: '💡 Streetlight not working', text: 'Gali ki 3 streetlight kharab hain, raat ko andhera rehta hai.', cat: 'Electricity & Power Grid' }
  ];

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setCreatedTicket(null);
      if (defaultCategory) setCategory(defaultCategory);
      if (user?.name) setCitizenName(user.name);
      if (user?.phone) setCitizenPhone(user.phone);
      if (user?.ward) setWard(user.ward);
      if (user?.pincode) setPincode(user.pincode);
    }
  }, [isOpen, defaultCategory, user]);

  const handleToggleVoice = () => {
    if (isRecording) {
      handleStopVoice();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechMsg('Speech recognition is not supported in this browser. Please type directly.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN';

      recognition.onstart = () => {
        setIsRecording(true);
        setRecordingTimer(0);
        setSpeechMsg('Listening... Speak in Hindi, Hinglish, or English');
        timerIntervalRef.current = setInterval(() => {
          setRecordingTimer(prev => prev + 1);
        }, 1000);
      };

      recognition.onresult = (e) => {
        let transcript = '';
        for (let i = 0; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript + ' ';
        }
        if (transcript.trim()) {
          setDescription(transcript.trim());
          if (!title) {
            setTitle(transcript.trim().slice(0, 45) + (transcript.length > 45 ? '...' : ''));
          }
        }
      };

      recognition.onerror = () => {
        handleStopVoice();
      };

      recognition.onend = () => {
        handleStopVoice();
      };

      recognition.start();
    } catch (err) {
      setIsRecording(false);
    }
  };

  const handleStopVoice = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsRecording(false);
    setSpeechMsg(null);
  };

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
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
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
            }
          }
        } catch (e) {
          setGpsLocked(true);
          setArea(`GPS: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`);
        } finally {
          setIsDetectingGps(false);
        }
      },
      () => {
        setIsDetectingGps(false);
        alert('Could not access GPS location. Please enter area manually.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleFinalSubmit = async () => {
    if (!description.trim()) {
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

      setCreatedTicket(created);
      setIsSubmitting(false);

      try {
        confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
      } catch (err) {}
    } catch (err) {
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
            <div style={{ textAlign: 'center', padding: '12px 0 8px 0' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px auto',
                boxShadow: '0 0 0 8px #D1FAE5'
              }}>
                <CheckCircle2 style={{ width: '32px', height: '32px' }} />
              </div>

              <span style={{
                display: 'inline-block',
                background: '#EFF6FF',
                color: '#2563EB',
                fontSize: '11px',
                fontWeight: 800,
                padding: '3px 12px',
                borderRadius: '999px',
                marginBottom: '8px'
              }}>
                TICKET DISPATCHED TO MUNICIPAL LEDGER
              </span>

              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                Ticket #{createdTicket.id}
              </h3>

              <p style={{ fontSize: '13px', color: '#475569', maxWidth: '440px', margin: '0 auto 16px auto', lineHeight: 1.5 }}>
                Your problem has been registered, linked to Complaint DNA, and assigned to <strong>{createdTicket.department || 'Delhi Municipal Authority'}</strong>.
              </p>

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
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Target SLA Timer</span>
                    <strong style={{ color: '#059669' }}>24 Hours Guaranteed</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Ward & Area</span>
                    <strong style={{ color: '#0F172A' }}>{ward}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>WhatsApp Status</span>
                    <strong style={{ color: '#2563EB' }}>Active on {citizenPhone}</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(`/citizen/complaints/${createdTicket.id}`);
                  }}
                  style={{
                    height: '42px',
                    padding: '0 20px',
                    borderRadius: '10px',
                    background: '#0E5E3A',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>Track Grievance Live</span>
                  <ArrowRight style={{ width: '15px', height: '15px' }} />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    height: '42px',
                    padding: '0 20px',
                    borderRadius: '10px',
                    background: '#F1F5F9',
                    color: '#334155',
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
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
                    1. Select Problem Category:
                  </label>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
                    {categories.map((cat) => {
                      const isSelected = category === cat.key;
                      return (
                        <button
                          key={cat.key}
                          type="button"
                          onClick={() => setCategory(cat.key)}
                          style={{
                            padding: '9px 6px',
                            borderRadius: '10px',
                            border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                            background: isSelected ? '#EFF6FF' : '#F8FAFC',
                            textAlign: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ fontSize: '18px', marginBottom: '2px' }}>{cat.icon}</div>
                          <strong style={{ fontSize: '11px', display: 'block', color: isSelected ? '#1E40AF' : '#0F172A', lineHeight: 1.2 }}>
                            {cat.label}
                          </strong>
                        </button>
                      );
                    })}
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        Description (Bol Kar Ya Likh Kar Batayein):
                      </label>
                      <button
                        type="button"
                        onClick={handleToggleVoice}
                        style={{
                          background: isRecording ? '#FEE2E2' : '#EFF6FF',
                          color: isRecording ? '#DC2626' : '#2563EB',
                          border: isRecording ? '1px solid #FCA5A5' : '1px solid #BFDBFE',
                          borderRadius: '999px',
                          padding: '3px 10px',
                          fontSize: '11px',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          cursor: 'pointer'
                        }}
                      >
                        {isRecording ? <MicOff style={{ width: '13px', height: '13px' }} /> : <Mic style={{ width: '13px', height: '13px' }} />}
                        <span>{isRecording ? `Recording (${recordingTimer}s) - Stop` : '🎙️ Speak Hindi/English'}</span>
                      </button>
                    </div>

                    {speechMsg && (
                      <div style={{ fontSize: '11px', color: '#2563EB', marginBottom: '4px', fontStyle: 'italic' }}>
                        {speechMsg}
                      </div>
                    )}

                    <textarea 
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Gali/mohalle mein kya problem hai? Hindi, Hinglish, ya English mein likhein..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '13px',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                        resize: 'none'
                      }}
                    />
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
                    alert('Please enter or speak a description of the problem.');
                    return;
                  }
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
