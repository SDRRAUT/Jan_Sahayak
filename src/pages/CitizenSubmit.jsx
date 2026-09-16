import React, { useState, useEffect } from 'react';
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
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { analyzeGrievanceInput } from '../services/aiEngine';
import GrievanceDnaCard from '../components/common/GrievanceDnaCard';

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
  const [area, setArea] = useState('Pocket 2, Near Market');
  const [pincode, setPincode] = useState(citizenInfo.pincode || '110085');
  const [manualCategory, setManualCategory] = useState('');
  const [severityLevel, setSeverityLevel] = useState('HIGH');
  const [affectedCount, setAffectedCount] = useState('50+ Families');
  const [gpsDetected, setGpsDetected] = useState(false);

  // Multimodal Inputs State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [photoTag, setPhotoTag] = useState('');
  const [hasVideo, setHasVideo] = useState(false);
  const [videoTag, setVideoTag] = useState('');
  const [hasDocument, setHasDocument] = useState(false);
  const [documentTag, setDocumentTag] = useState('');

  // AI & Workflow State
  const [liveDna, setLiveDna] = useState(null);
  const [showAiReviewModal, setShowAiReviewModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick preset test prompts
  const presets = [
    {
      label: '💧 Dirty Water (Hinglish)',
      text: 'Bhai pichle 3 din se hamare Sector 14, Pocket 2 mein naali ka ganda badbudaar paani supply mein mix hoke aa raha hai. Bacche bimaar pad rahe hain, jaldi theek karwao please near Mother Dairy.',
      tag: 'Water Contamination Hazard',
      category: 'Water Supply & Contamination'
    },
    {
      label: '🚧 Road Cave-in (Accident Hazard)',
      text: 'Moolchand flyover ke neeche Lajpat Nagar wali road pe bohot bada gaddha ho gaya hai barish ke baad. 2 scooter gir chuke hain aaj subah. Accidents ho rahe hain bar bar!',
      tag: 'Cavity Depth: 40cm',
      category: 'Roads & Infrastructure'
    },
    {
      label: '⚡ Transformer Sparking (Fire Hazard)',
      text: 'Gali no 3, Main Market Kalka Ji, transformer mein se aag ki chingariyan nikal rahi hain aur blast hone ka khatra hai. Poori gali ki light chali gayi hai.',
      tag: 'Electrical Arc Hazard',
      category: 'Electricity & Power Grid'
    },
    {
      label: '🗑️ Garbage Burning (Sanitation)',
      text: 'Sector 6 main market ke saamne open kude ka dher hai, 5 din se MCD ka dumper nahi aaya. Kal raat ko kisi ne aag laga di jisse bohot zyaada toxic smoke ho gaya hai.',
      tag: 'Solid Waste Combustion',
      category: 'Sanitation & Solid Waste'
    }
  ];

  // Re-run AI analysis whenever description or ward changes
  useEffect(() => {
    if (description.trim().length > 10) {
      const dna = analyzeGrievanceInput(description, { ward });
      setLiveDna(dna);
      if (!title) {
        setTitle(dna.summary || `${dna.category} in ${ward.split('(')[0]}`);
      }
    } else {
      setLiveDna(null);
    }
  }, [description, ward]);

  // Voice recording simulation timer
  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setDescription('Bhai pichle 3 din se hamare Sector 14, Pocket 2 mein naali ka ganda badbudaar paani supply mein mix hoke aa raha hai. Bacche bimaar pad rahe hain please jaldi theek karwao near Mother Dairy.');
      setIsRecording(false);
    }, 3200);
  };

  const handleSimulatePhoto = () => {
    setHasPhoto(true);
    setPhotoTag('Computer Vision: 100mm Cast-Iron Pipe Fracture & Sludge Detected (Confidence 98%)');
  };

  const handleSimulateVideo = () => {
    setHasVideo(true);
    setVideoTag('Video Clip Attached (10s): High-pressure water jetting & roadway erosion captured (1080p)');
  };

  const handleSimulateDocument = () => {
    setHasDocument(true);
    setDocumentTag('Document: DJB Consumer Water Bill #WB-88219 (PDF, 420 KB)');
  };

  const handleGpsDetect = () => {
    setGpsDetected(true);
    setArea('Pocket 2 (GPS: 28.7189° N, 77.1265° E)');
  };

  // Step 1 -> Step 2: Open AI Review Modal
  const handleProceedToReview = (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    setShowAiReviewModal(true);
  };

  // Step 2 -> Step 3: Confirm and Submit to Backend
  const handleConfirmSubmission = async () => {
    setIsSubmitting(true);
    const finalCategory = manualCategory || liveDna?.category || 'Civic Infrastructure';

    try {
      const created = await submitGrievance({
        title: title || `${finalCategory} Issue in ${ward}`,
        description,
        ward,
        area,
        pincode,
        category: finalCategory,
        urgency: severityLevel,
        evidence: {
          hasPhoto,
          photoTag,
          hasVideo,
          videoTag,
          hasDocument,
          documentTag,
          hasAudio: true,
          audioTranscript: description
        }
      });

      setCreatedTicket(created);
      setIsSubmitting(false);
      setShowAiReviewModal(false);
      setShowConfirmationModal(true);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    } catch (err) {
      setIsSubmitting(false);
      setShowAiReviewModal(false);
    }
  };

  return (
    <div className="section-spacing" style={{ paddingTop: '32px' }}>
      <div className="container">
        {/* Page Header & Low Literacy Mode Toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div>
            <div className="category-pill" style={{ marginBottom: '10px' }}>
              <Sparkles style={{ width: '13px', height: '13px' }} />
              <span>AI-ASSISTED CITIZEN INTAKE • जनसहायक पोर्टल</span>
            </div>
            <h1 style={{ fontSize: '34px', marginBottom: '8px' }}>
              File a Public Grievance
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
              Write or speak in your natural language (Hindi, Hinglish, or English). JanSahayk AI structures your report, identifies the correct department, and alerts responsible officers.
            </p>
          </div>

          {/* Saral / Easy Mode Toggle Switch */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 16px',
            borderRadius: 'var(--radius-full)',
            background: saralMode ? '#FEF3C7' : '#FFFFFF',
            border: saralMode ? '2px solid #F59E0B' : '1px solid var(--color-border-medium)',
            boxShadow: 'var(--shadow-xs)',
            cursor: 'pointer'
          }}
          onClick={() => setSaralMode(!saralMode)}
          >
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: saralMode ? '#D97706' : '#94A3B8',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 800
            }}>
              {saralMode ? '✓' : 'A'}
            </div>
            <div>
              <strong style={{ fontSize: '13px', display: 'block', color: saralMode ? '#92400E' : 'var(--color-text-primary)' }}>
                {saralMode ? 'सरल मोड सक्रिय (Easy Mode ON)' : 'सरल मोड (Easy Mode for Seniors)'}
              </strong>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                {saralMode ? 'बड़े बटन और हिंदी आवाज मार्गदर्शन' : 'Switch for large icons & one-tap Hindi voice'}
              </span>
            </div>
          </div>
        </div>

        {/* SARAL / EASY MODE VIEW (Designed for Low Digital Literacy) */}
        {saralMode && (
          <div style={{
            padding: '24px',
            borderRadius: 'var(--radius-xl)',
            background: '#FFFDF5',
            border: '2px solid #FDE68A',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Volume2 style={{ width: '20px', height: '20px', color: '#D97706' }} />
              <h3 style={{ fontSize: '18px', color: '#92400E', margin: 0 }}>
                सरल 3-कदम शिकायत दर्ज करें (Easy 3-Step Submission)
              </h3>
            </div>

            {/* 4 Big Visual Category Tiles */}
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#78350F', display: 'block', marginBottom: '10px' }}>
              1. समस्या चुनें (Tap Your Issue Category):
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              {[
                { emoji: '🚰', hi: 'गंदा पानी / लीकेज', en: 'Water Supply', desc: 'Sector 14 mein 3 din se ganda badbudaar paani supply mein mix hoke aa raha hai.' },
                { emoji: '🚧', hi: 'सड़क का गड्ढा', en: 'Road / Pothole', desc: 'Main road pe bohot bada dangerous gaddha ho gaya hai, accident ho rahe hain.' },
                { emoji: '💡', hi: 'बिजली / ट्रांसफॉर्मर', en: 'Electricity', desc: 'Transformer mein se chingariyan nikal rahi hain aur poori gali ki light chali gayi hai.' },
                { emoji: '🗑️', hi: 'कचरा / बदबू', en: 'Garbage Dump', desc: 'Open kude ka dher laga hai, 5 din se MCD ka dumper nahi aaya aur aag laga di hai.' }
              ].map((cat, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setDescription(cat.desc);
                    setManualCategory(cat.en);
                    setHasPhoto(true);
                    setPhotoTag('Auto-attached verification photo');
                  }}
                  style={{
                    padding: '16px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: description.includes(cat.en.toLowerCase().split(' ')[0]) ? '#FEF3C7' : '#FFFFFF',
                    border: description.includes(cat.en.toLowerCase().split(' ')[0]) ? '2px solid #D97706' : '1px solid #FCD34D',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 150ms ease'
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '6px' }}>{cat.emoji}</div>
                  <strong style={{ fontSize: '13px', display: 'block', color: '#78350F' }}>{cat.hi}</strong>
                  <span style={{ fontSize: '11px', color: '#92400E' }}>{cat.en}</span>
                </button>
              ))}
            </div>

            {/* Big 1-Tap Hindi Voice Button */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                onClick={isRecording ? () => setIsRecording(false) : handleStartVoice}
                style={{
                  flex: 1,
                  minWidth: '220px',
                  height: '56px',
                  borderRadius: '9999px',
                  background: isRecording ? '#DC2626' : '#D97706',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer'
                }}
              >
                {isRecording ? (
                  <>
                    <MicOff style={{ width: '22px', height: '22px' }} />
                    <span>सुन रहे हैं ({recordingSeconds}s)... बोलें!</span>
                  </>
                ) : (
                  <>
                    <Mic style={{ width: '22px', height: '22px' }} />
                    <span>माइक दबाएं और हिंदी में बोलें (Tap & Speak)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSimulatePhoto}
                style={{
                  height: '56px',
                  padding: '0 24px',
                  borderRadius: '9999px',
                  background: hasPhoto ? '#059669' : '#FFFFFF',
                  color: hasPhoto ? '#FFFFFF' : '#0F172A',
                  border: hasPhoto ? 'none' : '2px solid #059669',
                  fontSize: '14px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Camera style={{ width: '20px', height: '20px' }} />
                <span>{hasPhoto ? 'फोटो जुड़ गया ✓' : 'कैमरे से फोटो लें (Photo)'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Demo Fill Buttons (Always accessible for rapid testing) */}
        <div style={{
          padding: '16px 20px',
          borderRadius: 'var(--radius-lg)',
          background: '#FFFFFF',
          border: '1px solid var(--color-border-subtle)',
          boxShadow: 'var(--shadow-xs)',
          marginBottom: '28px'
        }}>
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', display: 'block', marginBottom: '10px' }}>
            ⚡ 1-Click Test Scenarios (Instant AI Engine Demo):
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setDescription(preset.text);
                  setManualCategory(preset.category);
                  setHasPhoto(true);
                  setPhotoTag(preset.tag);
                }}
                style={{
                  padding: '8px 14px',
                  borderRadius: '9999px',
                  background: '#F1F5F9',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  border: '1px solid rgba(15,23,42,0.06)',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
                onMouseEnter={e => {
                  e.target.style.background = 'var(--color-accent-tint)';
                  e.target.style.color = 'var(--color-primary)';
                }}
                onMouseLeave={e => {
                  e.target.style.background = '#F1F5F9';
                  e.target.style.color = 'var(--color-text-primary)';
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Two-Column Form & Live Grievance DNA Preview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* Left Column: Comprehensive Submission Form (7 Cols) */}
          <div style={{ gridColumn: 'span 7' }} className="hero-left-col">
            <form onSubmit={handleProceedToReview} className="card" style={{ padding: '32px' }}>
              
              {/* Location Selectors with GPS detection */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-muted)' }}>
                    Location & Jurisdiction
                  </label>
                  <button
                    type="button"
                    onClick={handleGpsDetect}
                    style={{
                      border: 'none',
                      background: 'none',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: gpsDetected ? '#059669' : 'var(--color-primary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <Navigation style={{ width: '12px', height: '12px' }} />
                    <span>{gpsDetected ? 'GPS Coordinates Locked ✓' : 'Auto-Detect Current GPS'}</span>
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr', gap: '12px' }}>
                  <div>
                    <select
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      style={{
                        width: '100%',
                        height: '42px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border-medium)',
                        padding: '0 10px',
                        background: '#FFFFFF',
                        fontSize: '13px',
                        color: 'var(--color-text-primary)'
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
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="Local Area / Landmark"
                      style={{
                        width: '100%',
                        height: '42px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border-medium)',
                        padding: '0 10px',
                        background: '#FFFFFF',
                        fontSize: '13px',
                        color: 'var(--color-text-primary)'
                      }}
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Pincode"
                      style={{
                        width: '100%',
                        height: '42px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border-medium)',
                        padding: '0 10px',
                        background: '#FFFFFF',
                        fontSize: '13px',
                        color: 'var(--color-text-primary)'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Main Description Input with Voice and Media Toolbar */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    Describe the Issue (Voice or Text)
                  </label>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    Hindi • Hinglish • English accepted
                  </span>
                </div>

                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Apni pareshani yahan likhein ya mic daba kar bolein... (Jaise: Gali No. 4 mein 3 din se pipeline tooti hai aur ganda paani aa raha hai)"
                  style={{
                    width: '100%',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-medium)',
                    padding: '14px',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    color: 'var(--color-text-primary)',
                    background: '#FFFFFF',
                    resize: 'vertical'
                  }}
                  required
                />

                {/* Multimodal Input Toolbar: Voice, Photo, Video, Document */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginTop: '10px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: '#F8F9FA',
                  border: '1px solid var(--color-border-subtle)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {/* Voice Button */}
                    <button
                      type="button"
                      onClick={isRecording ? () => setIsRecording(false) : handleStartVoice}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '9999px',
                        background: isRecording ? '#FEF2F2' : '#FFFFFF',
                        border: isRecording ? '1px solid #EF4444' : '1px solid var(--color-border-medium)',
                        color: isRecording ? '#EF4444' : 'var(--color-text-primary)',
                        fontSize: '12px',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      {isRecording ? (
                        <>
                          <MicOff style={{ width: '13px', height: '13px' }} />
                          <span>Listening ({recordingSeconds}s)...</span>
                        </>
                      ) : (
                        <>
                          <Mic style={{ width: '13px', height: '13px', color: 'var(--color-primary)' }} />
                          <span>Speak (Hindi / English)</span>
                        </>
                      )}
                    </button>

                    {/* Camera Button */}
                    <button
                      type="button"
                      onClick={handleSimulatePhoto}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '9999px',
                        background: hasPhoto ? 'var(--color-accent-tint)' : '#FFFFFF',
                        border: hasPhoto ? '1px solid var(--color-accent)' : '1px solid var(--color-border-medium)',
                        color: hasPhoto ? 'var(--color-primary)' : 'var(--color-text-primary)',
                        fontSize: '12px',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Camera style={{ width: '13px', height: '13px' }} />
                      <span>{hasPhoto ? 'Photo Added ✓' : 'Add Photo'}</span>
                    </button>

                    {/* Video Button */}
                    <button
                      type="button"
                      onClick={handleSimulateVideo}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '9999px',
                        background: hasVideo ? '#EFF6FF' : '#FFFFFF',
                        border: hasVideo ? '1px solid #93C5FD' : '1px solid var(--color-border-medium)',
                        color: hasVideo ? '#1D4ED8' : 'var(--color-text-primary)',
                        fontSize: '12px',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Video style={{ width: '13px', height: '13px' }} />
                      <span>{hasVideo ? 'Video Clip Added ✓' : 'Add Video'}</span>
                    </button>

                    {/* Document Button */}
                    <button
                      type="button"
                      onClick={handleSimulateDocument}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '9999px',
                        background: hasDocument ? '#FAF5FF' : '#FFFFFF',
                        border: hasDocument ? '1px solid #D8B4FE' : '1px solid var(--color-border-medium)',
                        color: hasDocument ? '#7E22CE' : 'var(--color-text-primary)',
                        fontSize: '12px',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <FileText style={{ width: '13px', height: '13px' }} />
                      <span>{hasDocument ? 'PDF Bill Added ✓' : 'Add Document'}</span>
                    </button>
                  </div>

                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    AI parses all evidence in real time
                  </span>
                </div>

                {/* Evidence Attachments Badges */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                  {hasPhoto && (
                    <div style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', background: '#ECFDF5', border: '1px solid #A7F3D0', fontSize: '12px', color: '#065F46', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>📷 {photoTag}</span>
                      <button type="button" onClick={() => setHasPhoto(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#065F46' }}>×</button>
                    </div>
                  )}
                  {hasVideo && (
                    <div style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', background: '#EFF6FF', border: '1px solid #BFDBFE', fontSize: '12px', color: '#1E40AF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>🎥 {videoTag}</span>
                      <button type="button" onClick={() => setHasVideo(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#1E40AF' }}>×</button>
                    </div>
                  )}
                  {hasDocument && (
                    <div style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', background: '#FAF5FF', border: '1px solid #E9D5FF', fontSize: '12px', color: '#6B21A8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>📄 {documentTag}</span>
                      <button type="button" onClick={() => setHasDocument(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#6B21A8' }}>×</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata & Severity Selectors */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: '#F8F9FA',
                marginBottom: '20px'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                    Severity / Urgency Level
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['NORMAL', 'HIGH', 'CRITICAL'].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSeverityLevel(lvl)}
                        style={{
                          flex: 1,
                          height: '34px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '11px',
                          fontWeight: 700,
                          border: severityLevel === lvl ? 'none' : '1px solid var(--color-border-medium)',
                          background: severityLevel === lvl ? (lvl === 'CRITICAL' ? '#EF4444' : (lvl === 'HIGH' ? '#F59E0B' : 'var(--color-primary)')) : '#FFFFFF',
                          color: severityLevel === lvl ? '#FFFFFF' : 'var(--color-text-secondary)',
                          cursor: 'pointer'
                        }}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                    Estimated Affected Citizens
                  </label>
                  <select
                    value={affectedCount}
                    onChange={(e) => setAffectedCount(e.target.value)}
                    style={{
                      width: '100%',
                      height: '34px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border-medium)',
                      padding: '0 8px',
                      fontSize: '12px',
                      background: '#FFFFFF'
                    }}
                  >
                    <option value="1-5 Households">1-5 Households (Local)</option>
                    <option value="10-25 Households">10-25 Households (Street)</option>
                    <option value="50+ Families">50+ Families (Sub-locality)</option>
                    <option value="Entire Colony / 500+">Entire Colony / 500+ (Widespread)</option>
                  </select>
                </div>
              </div>

              {/* Citizen Contact Strip */}
              <div style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
                fontSize: '12px'
              }}>
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>Filing as: </span>
                  <strong>{citizenInfo.name}</strong> ({citizenInfo.phone})
                </div>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                  ✓ Instant SMS & WhatsApp Dispatch
                </span>
              </div>

              {/* Next Step CTA */}
              <button
                type="submit"
                disabled={!description.trim() || isSubmitting}
                className="btn-primary"
                style={{ width: '100%', height: '52px', fontSize: '15px' }}
              >
                <span>Review AI Structure & Submit Grievance</span>
                <ArrowRight className="btn-arrow" style={{ width: '18px', height: '18px' }} />
              </button>
            </form>
          </div>

          {/* Right Column: Live Grievance DNA™ Inspector (5 Cols) */}
          <div style={{ gridColumn: 'span 5' }} className="hero-right-col">
            <div style={{ position: 'sticky', top: '90px' }}>
              {liveDna ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-primary)' }}>
                      Live Intelligence Fingerprint
                    </span>
                    <span className="category-pill" style={{ height: '22px', fontSize: '10px' }}>
                      Ready to Dispatch
                    </span>
                  </div>

                  {/* Render the DNA Card */}
                  <GrievanceDnaCard dna={liveDna} compact={false} />

                  {/* Duplicate / Cluster Warning if matched */}
                  {liveDna.clusterMatch && (
                    <div style={{
                      marginTop: '16px',
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      background: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      color: '#92400E'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
                        <AlertTriangle style={{ width: '16px', height: '16px', color: '#F59E0B' }} />
                        <span>Nearby Cluster Detected!</span>
                      </div>
                      <p style={{ fontSize: '12px', lineHeight: 1.5 }}>
                        {liveDna.clusterMatch.message}
                      </p>
                      <div style={{ marginTop: '8px', fontSize: '11px', fontWeight: 700, color: '#0E5E3A' }}>
                        ✓ Your ticket will be bundled with Cluster #{liveDna.clusterMatch.clusterId} for fast-track resolution.
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{
                  padding: '40px 24px',
                  borderRadius: 'var(--radius-lg)',
                  background: '#FFFFFF',
                  border: '2px dashed var(--color-border-medium)',
                  textAlign: 'center'
                }}>
                  <div className="icon-squircle" style={{ margin: '0 auto 16px auto' }}>
                    <Sparkles style={{ width: '22px', height: '22px' }} />
                  </div>
                  <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>
                    Live DNA™ Engine Idle
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                    Type or click one of the quick test scenarios above. The AI engine will immediately extract entities, classify the department, and calculate SLA risk.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STEP 2: AI-ASSISTED STRUCTURED SUMMARY REVIEW MODAL ("We understood your issue as...") */}
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
            <div className="card" style={{ maxWidth: '720px', width: '100%', padding: '32px', maxHeight: '92vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div className="category-pill">
                  <Sparkles style={{ width: '13px', height: '13px' }} />
                  <span>AI UNDERSTANDING & CITIZEN VERIFICATION</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAiReviewModal(false)}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                >
                  <X style={{ width: '20px', height: '20px' }} />
                </button>
              </div>

              {/* Signature 'We Understood Your Issue As...' Banner */}
              <div style={{
                padding: '16px 20px',
                borderRadius: 'var(--radius-lg)',
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                marginBottom: '20px'
              }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#15803D', display: 'block', marginBottom: '4px' }}>
                  JanSahayk AI Synthesis • हमने आपकी समस्या को इस प्रकार समझा है:
                </span>
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#14532D', lineHeight: 1.5, margin: 0 }}>
                  "{liveDna?.structuredSummary || `A civic defect in ${ward} near ${area} requiring priority intervention.`}"
                </p>
              </div>

              {/* Original Complaint Verbatim (Preserved Integrity) */}
              <div style={{
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                background: '#F8F9FA',
                border: '1px solid var(--color-border-subtle)',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                    Original Citizen Submission ({liveDna?.detectedLang || 'Natural Language'}):
                  </span>
                  <span style={{ fontSize: '10px', color: '#059669', fontWeight: 700 }}>
                    ✓ 100% Unaltered Verbatim Record
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-text-primary)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                  "{description}"
                </p>

                {/* English Translation if non-English */}
                {(liveDna?.isHinglish || liveDna?.isHindi) && (
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(15,23,42,0.06)', fontSize: '12px' }}>
                    <strong style={{ color: 'var(--color-primary)' }}>Standard English Translation for Authorities: </strong>
                    <span style={{ color: 'var(--color-text-secondary)' }}>"{liveDna.translatedText}"</span>
                  </div>
                )}
              </div>

              {/* Editable Fields: Title & Category */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '14px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                    Structured Title (Edit or Correct):
                  </label>
                  <input
                    type="text"
                    value={title}
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
                    Department & Subcategory:
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
                    <strong>{liveDna?.department ? liveDna.department.split('(')[0] : 'DJB'}</strong>
                    <span style={{ fontSize: '10px', color: '#059669', fontWeight: 700 }}>
                      {liveDna?.confidence || 98}% Confidence
                    </span>
                  </div>
                </div>
              </div>

              {/* Technical Breakdown Matrix */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: '#F8F9FA',
                fontSize: '12px',
                marginBottom: '18px'
              }}>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Primary Intent:</span>
                  <strong style={{ fontSize: '11px', color: 'var(--color-text-primary)' }}>{liveDna?.intent || 'Emergency Rectification'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Priority / Severity:</span>
                  <strong style={{ fontSize: '11px', color: severityLevel === 'CRITICAL' ? '#DC2626' : '#D97706' }}>
                    {liveDna?.priority || 'P1 (Emergency)'} • {severityLevel}
                  </strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>SLA Target:</span>
                  <strong style={{ fontSize: '11px', color: 'var(--color-primary)' }}>
                    Max {liveDna?.slaTargetHours || 12} Hours Window
                  </strong>
                </div>
              </div>

              {/* Missing Information / Actionable Tips Alert */}
              {liveDna?.missingInfo && liveDna.missingInfo.length > 0 && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  fontSize: '12px',
                  color: '#92400E',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, marginBottom: '4px' }}>
                    <AlertTriangle style={{ width: '14px', height: '14px', color: '#D97706' }} />
                    <span>Suggestions for Faster Resolution:</span>
                  </div>
                  {liveDna.missingInfo.map((m, i) => (
                    <div key={i} style={{ marginTop: '3px' }}>
                      • <strong>{m.field}: </strong>{m.tip}
                    </div>
                  ))}
                </div>
              )}

              {/* 3-Way Citizen Control Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Citizen has full authority to edit, correct, or reject AI categorization.
                </span>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowAiReviewModal(false)}
                    className="btn-secondary btn-sm"
                  >
                    ✏️ Edit / Correct Details
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmSubmission}
                    disabled={isSubmitting}
                    className="btn-primary btn-sm"
                    style={{ minWidth: '180px' }}
                  >
                    {isSubmitting ? 'Dispatching to Officials...' : '✓ Confirm & Submit Grievance'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* STEP 3: SUBMISSION CONFIRMATION MODAL */}
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
                Your grievance has been validated, assigned a cryptographic tracking hash, and routed to <strong>{createdTicket.department}</strong>.
              </p>

              {/* Status Alert */}
              <div style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                fontSize: '12px',
                color: '#166534',
                marginBottom: '24px',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, marginBottom: '4px' }}>
                  <Check style={{ width: '14px', height: '14px' }} />
                  <span>Real-time Alerts Dispatched:</span>
                </div>
                <ul style={{ paddingLeft: '18px', margin: 0, lineHeight: 1.6 }}>
                  <li>WhatsApp confirmation with tracking link sent to {citizenInfo.phone}</li>
                  <li>Ward Executive Engineer notified on Field Command terminal</li>
                  <li>SLA Countdown Active: Max {createdTicket.slaHoursLeft || 24} hours to complete resolution</li>
                </ul>
              </div>

              {/* Direct Navigation Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => navigate(`/citizen/complaints/${createdTicket.id}`)}
                  className="btn-primary"
                  style={{ flex: 1 }}
                >
                  <span>Track Grievance Timeline</span>
                  <ArrowRight className="btn-arrow" style={{ width: '16px', height: '16px' }} />
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
