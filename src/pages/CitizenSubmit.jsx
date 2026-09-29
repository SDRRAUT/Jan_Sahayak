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
  ArrowLeft,
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
  AlertCircle,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { analyzeGrievanceInput } from '../services/aiEngine';
import GrievanceDnaCard from '../components/common/GrievanceDnaCard';
import RealMap from '../components/common/RealMap';

// Image Validation States per requirements
const IMAGE_STATES = {
  NO_IMAGE: 'NO_IMAGE',
  IMAGE_SELECTED: 'IMAGE_SELECTED',
  ANALYZING: 'ANALYZING',
  VALID: 'VALID',
  INVALID: 'INVALID',
  ERROR: 'ERROR'
};

export default function CitizenSubmit() {
  const navigate = useNavigate();
  const { 
    submitGrievance, 
    user,
    transcribeVoiceAudio,
    validateVisionImage,
    detectProblemCategory,
    reverseGeocodeLocation
  } = useApp();

  const citizenInfo = user || {
    name: 'Aditya Verma',
    phone: '+91 98712-88210',
    ward: 'Ward 14 (Rohini Sector 14)',
    pincode: '110085'
  };

  // Step Wizard: 1: Describe, 2: Image & Vision AI, 3: Category Detection, 4: GPS & Map, 5: Review & Submit
  const [currentStep, setCurrentStep] = useState(1);

  // Accessibility / Easy Mode Toggle
  const [saralMode, setSaralMode] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ward, setWard] = useState(citizenInfo.ward || 'Ward 14 (Rohini Sector 14)');
  const [area, setArea] = useState('Pocket 2, Near Market');
  const [pincode, setPincode] = useState(citizenInfo.pincode || '110085');
  const [severityLevel, setSeverityLevel] = useState('HIGH');
  const [affectedCount, setAffectedCount] = useState('50+ Families');

  // --- 1. VOICE FUNCTIONALITY ---
  // Voice 1: Live Speech Recognition (Web Speech API)
  const [isLiveListening, setIsLiveListening] = useState(false);
  const [liveSpeechError, setLiveSpeechError] = useState(null);
  const [liveSpeechLanguage, setLiveSpeechLanguage] = useState('hi-IN'); // 'hi-IN' or 'en-IN'
  const recognitionRef = useRef(null);

  // Voice 2: MediaRecorder Audio Pipeline
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [audioRecordingSeconds, setAudioRecordingSeconds] = useState(0);
  const [isTranscribingAudio, setIsTranscribingAudio] = useState(false);
  const [audioTranscriptionSource, setAudioTranscriptionSource] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  // Simulated Voice / Demo presets
  const [isSimulatingVoice, setIsSimulatingVoice] = useState(false);

  // --- 2. IMAGE AI VALIDATION STATE MACHINE ---
  const [imageState, setImageState] = useState(IMAGE_STATES.NO_IMAGE);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [imageValidationResult, setImageValidationResult] = useState(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [photoTag, setPhotoTag] = useState('');
  const fileInputRef = useRef(null);

  // Additional Evidence
  const [hasVideo, setHasVideo] = useState(false);
  const [videoTag, setVideoTag] = useState('');
  const [hasDocument, setHasDocument] = useState(false);
  const [documentTag, setDocumentTag] = useState('');

  // --- 3. AI CATEGORY DETECTION ---
  const [isDetectingCategory, setIsDetectingCategory] = useState(false);
  const [aiDetectedCategory, setAiDetectedCategory] = useState(null); // { category, subcategory, confidence, reason, source }
  const [finalCategory, setFinalCategory] = useState('Water Supply & Contamination');
  const [finalSubcategory, setFinalSubcategory] = useState('Water Quality / Contamination');

  // --- 4. GPS & REAL MAP ---
  const [locationCoords, setLocationCoords] = useState({
    latitude: 28.7189,
    longitude: 77.1265,
    accuracy: 15,
    source: 'gps',
    captured_at: new Date().toISOString()
  });
  const [resolvedAddress, setResolvedAddress] = useState('Sector 14, Rohini, New Delhi, Delhi 110085');
  const [isCapturingGps, setIsCapturingGps] = useState(false);
  const [gpsError, setGpsError] = useState(null);

  // --- 5. AI DNA & SUBMISSION ---
  const [liveDna, setLiveDna] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Quick preset test prompts
  const presets = [
    {
      label: '💧 Dirty Water (Hinglish)',
      text: 'Bhai pichle 3 din se hamare Sector 14, Pocket 2 mein naali ka ganda badbudaar paani supply mein mix hoke aa raha hai. Bacche bimaar pad rahe hain, jaldi theek karwao please near Mother Dairy.',
      tag: 'Water Contamination Hazard',
      category: 'Water & Drainage',
      subcategory: 'Water Quality / Low Pressure'
    },
    {
      label: '🚧 Road Cave-in (Pothole)',
      text: 'Moolchand flyover ke neeche Lajpat Nagar wali road pe bohot bada gaddha ho gaya hai barish ke baad. 2 scooter gir chuke hain aaj subah. Road par bada gaddha hai aur bikes slip ho rahi hain.',
      tag: 'Cavity Depth: 40cm',
      category: 'Roads & Infrastructure',
      subcategory: 'Pothole / Road Damage'
    },
    {
      label: '⚡ Transformer Sparking (Electricity)',
      text: 'Gali no 3, Main Market Kalka Ji, transformer mein se aag ki chingariyan nikal rahi hain aur blast hone ka khatra hai. Poori gali ki light chali gayi hai.',
      tag: 'Electrical Arc Hazard',
      category: 'Electricity & Power Grid',
      subcategory: 'Transformer Sparking / Power Outage'
    },
    {
      label: '🗑️ Garbage Burning (Sanitation)',
      text: 'Sector 6 main market ke saamne open kude ka dher hai, 5 din se MCD ka dumper nahi aaya. Kal raat ko kisi ne aag laga di jisse bohot zyaada toxic smoke ho gaya hai.',
      tag: 'Solid Waste Combustion',
      category: 'Sanitation & Solid Waste',
      subcategory: 'Open Garbage Dump / Burning'
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

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
    };
  }, []);

  // -------------------------------------------------------------
  // VOICE 1: LIVE SPEECH RECOGNITION (Web Speech API)
  // -------------------------------------------------------------
  const handleToggleLiveSpeech = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setLiveSpeechError('Web Speech API is not supported in this browser. Please use Recorded Voice or type manually.');
      return;
    }

    if (isLiveListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsLiveListening(false);
      return;
    }

    setLiveSpeechError(null);

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = liveSpeechLanguage;
      recognition.interimResults = true;
      recognition.continuous = true;

      recognition.onstart = () => {
        setIsLiveListening(true);
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        if (transcript.trim()) {
          setDescription(prev => {
            // If previous text is empty, replace; else append
            const base = prev.trim() ? prev.trim() + ' ' : '';
            return base + transcript.trim();
          });
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setLiveSpeechError('Microphone permission denied. Please allow microphone access in your browser settings.');
        } else {
          setLiveSpeechError(`Speech recognition error: ${event.error}`);
        }
        setIsLiveListening(false);
      };

      recognition.onend = () => {
        setIsLiveListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setLiveSpeechError(`Failed to initialize speech recognition: ${err.message}`);
      setIsLiveListening(false);
    }
  };

  // -------------------------------------------------------------
  // VOICE 2: RECORDED VOICE (MediaRecorder Pipeline)
  // -------------------------------------------------------------
  const handleStartAudioRecording = async () => {
    setLiveSpeechError(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        if (audioBlob.size > 0) {
          await processRecordedAudioBlob(audioBlob);
        }
      };

      mediaRecorder.start(200); // chunk every 200ms
      setIsAudioRecording(true);
      setAudioRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setAudioRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access failed:', err);
      setLiveSpeechError('Could not access microphone for recording. Please verify permissions.');
      setIsAudioRecording(false);
    }
  };

  const handleStopAudioRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsAudioRecording(false);
  };

  const processRecordedAudioBlob = async (audioBlob) => {
    setIsTranscribingAudio(true);
    setAudioTranscriptionSource(null);

    try {
      // Convert Blob to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = reader.result;
        try {
          const res = await transcribeVoiceAudio({
            audioBlob: base64Audio,
            language: liveSpeechLanguage
          });

          if (res && res.transcript) {
            setDescription(prev => (prev ? `${prev}\n${res.transcript}` : res.transcript));
            setAudioTranscriptionSource(res.source || 'gemini');
          }
        } catch (err) {
          console.error('Transcription error:', err);
          setLiveSpeechError('Voice transcription failed. You can still type your complaint.');
        } finally {
          setIsTranscribingAudio(false);
        }
      };
      reader.readAsDataURL(audioBlob);
    } catch (err) {
      console.error('Blob reading error:', err);
      setIsTranscribingAudio(false);
    }
  };

  // Preset Simulated Voice (for testing)
  const handleSimulatePresetVoice = () => {
    setIsSimulatingVoice(true);
    setTimeout(() => {
      setDescription('Bhai pichle 3 din se hamare Sector 14, Pocket 2 mein naali ka ganda badbudaar paani supply mein mix hoke aa raha hai. Bacche bimaar pad rahe hain please jaldi theek karwao near Mother Dairy.');
      setAudioTranscriptionSource('deterministic_fallback (Preset Simulation)');
      setIsSimulatingVoice(false);
    }, 1200);
  };

  // -------------------------------------------------------------
  // IMAGE SELECTION & STRICT AI VALIDATION STATE MACHINE
  // -------------------------------------------------------------
  const handleImageFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageState(IMAGE_STATES.IMAGE_SELECTED);
    setPhotoTag(`Uploaded image: ${file.name}`);

    // Create local preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);

    // Read as Base64 for backend analysis
    const reader = new FileReader();
    reader.onloadend = async () => {
      const dataUrl = reader.result;
      setImageDataUrl(dataUrl);

      // Transition to ANALYZING
      await runImageValidation(dataUrl, file.name);
    };
    reader.readAsDataURL(file);
  };

  const runImageValidation = async (dataUrl, fileName = 'evidence.jpg') => {
    setImageState(IMAGE_STATES.ANALYZING);
    setImageValidationResult(null);

    try {
      const result = await validateVisionImage({
        imageBase64: dataUrl,
        fileName: fileName,
        description: description || 'Civic infrastructure issue'
      });

      setImageValidationResult(result);

      if (result && result.isValid) {
        setImageState(IMAGE_STATES.VALID);
        setHasPhoto(true);
        setPhotoTag(result.tag || `Verified: ${result.detectedDefect || 'Civic Defect'}`);
      } else {
        setImageState(IMAGE_STATES.INVALID);
        setHasPhoto(false);
      }
    } catch (err) {
      console.error('Image AI validation failed:', err);
      setImageState(IMAGE_STATES.ERROR);
      setImageValidationResult({
        reason: 'Image verification could not be completed due to a connection or service error.',
        isValid: false
      });
      setHasPhoto(false);
    }
  };

  const handleRetakeImage = () => {
    setImageState(IMAGE_STATES.NO_IMAGE);
    setImagePreviewUrl(null);
    setImageDataUrl(null);
    setImageValidationResult(null);
    setHasPhoto(false);
    setPhotoTag('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Quick Preset Sample Image for testing
  const handleSelectSampleImage = async (type = 'water') => {
    let sampleDataUrl = '';
    let defectDesc = '';

    if (type === 'water') {
      // Generate a small SVG-based data URL representing contaminated brown water
      sampleDataUrl = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%2378350f"/><text x="20" y="50" fill="%23fef3c7" font-size="16" font-family="sans-serif">Contaminated Water Outflow</text><path d="M10 100 Q 80 50 150 100 T 290 100" stroke="%23d97706" stroke-width="8" fill="none"/></svg>';
      defectDesc = 'Contaminated Water Outflow & Pipe Fracture';
    } else if (type === 'road') {
      sampleDataUrl = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23334155"/><ellipse cx="150" cy="110" rx="90" ry="40" fill="%230f172a"/><text x="30" y="40" fill="%23f1f5f9" font-size="16" font-family="sans-serif">Road Pothole (Depth 40cm)</text></svg>';
      defectDesc = 'Severe Road Pothole & Asphalt Degradation';
    } else {
      // Invalid sample (e.g., selfie/indoor portrait)
      sampleDataUrl = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23fce7f3"/><circle cx="150" cy="90" r="45" fill="%23ec4899"/><text x="40" y="170" fill="%23831843" font-size="14" font-family="sans-serif">Indoor Selfie / Non-Civic</text></svg>';
      defectDesc = 'Indoor Selfie / Pet Photo';
    }

    setImagePreviewUrl(sampleDataUrl);
    setImageDataUrl(sampleDataUrl);
    await runImageValidation(sampleDataUrl, `${type}_sample.svg`);
  };

  // -------------------------------------------------------------
  // AI PROBLEM CATEGORY DETECTION
  // -------------------------------------------------------------
  const triggerCategoryDetection = async () => {
    setIsDetectingCategory(true);
    try {
      const result = await detectProblemCategory({
        text: description,
        imageAnalysis: imageValidationResult,
        location: { ward, area, pincode }
      });

      if (result) {
        setAiDetectedCategory(result);
        setFinalCategory(result.category || 'Water Supply & Contamination');
        setFinalSubcategory(result.subcategory || 'General Issue');
      }
    } catch (err) {
      console.error('Category detection error:', err);
    } finally {
      setIsDetectingCategory(false);
    }
  };

  // -------------------------------------------------------------
  // GPS & REAL MAP INTERACTION
  // -------------------------------------------------------------
  const handleCaptureRealGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsCapturingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy || 10),
          source: 'gps',
          captured_at: new Date().toISOString()
        };

        setLocationCoords(coords);
        setIsCapturingGps(false);

        // Perform reverse geocoding
        try {
          const geoRes = await reverseGeocodeLocation(coords.latitude, coords.longitude);
          if (geoRes) {
            setResolvedAddress(geoRes.formatted_address || `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`);
            if (geoRes.ward) setWard(geoRes.ward);
            if (geoRes.area) setArea(geoRes.area);
          }
        } catch (e) {
          console.warn('Reverse geocode error:', e);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setGpsError(`GPS request failed: ${err.message}. Using default ward coordinates; you can adjust the pin manually.`);
        setIsCapturingGps(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleManualMapLocationChange = async ({ latitude, longitude, address }) => {
    setLocationCoords(prev => ({
      ...prev,
      latitude,
      longitude,
      source: 'manual', // Strictly track manual pin adjustment
      captured_at: new Date().toISOString()
    }));

    if (address) {
      setResolvedAddress(address);
    } else {
      try {
        const geoRes = await reverseGeocodeLocation(latitude, longitude);
        if (geoRes) {
          setResolvedAddress(geoRes.formatted_address || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
          if (geoRes.ward) setWard(geoRes.ward);
          if (geoRes.area) setArea(geoRes.area);
        }
      } catch (e) {}
    }
  };

  // Step Navigations
  const goToStep = (step) => {
    if (step === 3 && !aiDetectedCategory) {
      triggerCategoryDetection();
    }
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // -------------------------------------------------------------
  // FINAL SUBMISSION
  // -------------------------------------------------------------
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      const created = await submitGrievance({
        title: title || `${finalCategory} Issue in ${ward}`,
        description,
        ward,
        area,
        pincode,
        category: finalCategory,
        subcategory: finalSubcategory,
        urgency: severityLevel,
        // AI Category Metadata
        ai_category: aiDetectedCategory?.category || liveDna?.category || finalCategory,
        ai_subcategory: aiDetectedCategory?.subcategory || finalSubcategory,
        ai_category_confidence: aiDetectedCategory?.confidence || 0.95,
        category_source: aiDetectedCategory?.source || 'deterministic_fallback',
        final_category: finalCategory,
        final_subcategory: finalSubcategory,
        // Real Location Metadata
        latitude: locationCoords.latitude,
        longitude: locationCoords.longitude,
        accuracy: locationCoords.accuracy,
        location_source: locationCoords.source,
        captured_at: locationCoords.captured_at,
        resolved_address: resolvedAddress,
        // Evidence
        evidence: {
          hasPhoto: imageState === IMAGE_STATES.VALID,
          photoTag: photoTag || (imageValidationResult?.detectedDefect ? `AI Verified: ${imageValidationResult.detectedDefect}` : 'Evidence Photo Attached'),
          hasVideo,
          videoTag,
          hasDocument,
          documentTag,
          hasAudio: !!audioTranscriptionSource || isLiveListening,
          audioTranscript: description,
          audioSource: audioTranscriptionSource || (isLiveListening ? 'Web Speech API' : 'text')
        }
      });

      setCreatedTicket(created);
      setIsSubmitting(false);
      setShowConfirmationModal(true);

      try {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    } catch (err) {
      console.error('Submission failed:', err);
      setIsSubmitting(false);
      alert('Failed to submit grievance: ' + (err.message || 'Please check backend connectivity.'));
    }
  };

  return (
    <div className="section-spacing" style={{ paddingTop: '24px', paddingBottom: '60px' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        
        {/* Header & Accessibility Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div>
            <div className="category-pill" style={{ marginBottom: '8px' }}>
              <Sparkles style={{ width: '13px', height: '13px' }} />
              <span>CITIZEN INTAKE PIPELINE • जनसहायक पोर्टल</span>
            </div>
            <h1 style={{ fontSize: '28px', marginBottom: '6px', fontWeight: 800 }}>
              File a Public Grievance
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', margin: 0 }}>
              Speak or write in Hindi, Hinglish, or English. Multi-modal AI verifies evidence, categorizes issues, and alerts municipal authorities.
            </p>
          </div>

          {/* Saral Mode Toggle */}
          <button
            type="button"
            onClick={() => setSaralMode(!saralMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 16px',
              minHeight: '44px',
              borderRadius: '9999px',
              background: saralMode ? '#FEF3C7' : '#FFFFFF',
              border: saralMode ? '2px solid #F59E0B' : '1px solid var(--color-border-medium)',
              boxShadow: 'var(--shadow-xs)',
              cursor: 'pointer'
            }}
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
            <div style={{ textAlign: 'left' }}>
              <strong style={{ fontSize: '12px', display: 'block', color: saralMode ? '#92400E' : 'var(--color-text-primary)' }}>
                {saralMode ? 'सरल मोड सक्रिय (Easy Mode)' : 'सरल मोड (Easy Mode)'}
              </strong>
              <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                {saralMode ? 'बड़ा फ़ॉन्ट और त्वरित आवाज़' : 'High contrast & voice assist'}
              </span>
            </div>
          </button>
        </div>

        {/* PROGRESS STEP INDICATOR (5 STEPS) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '8px',
          marginBottom: '28px'
        }}>
          {[
            { num: 1, label: '1. Describe', sub: 'Voice & Text' },
            { num: 2, label: '2. Image AI', sub: 'Validation' },
            { num: 3, label: '3. Category', sub: 'AI & Confirm' },
            { num: 4, label: '4. Location', sub: 'GPS & Map' },
            { num: 5, label: '5. Review', sub: 'Submit' }
          ].map(s => {
            const isActive = currentStep === s.num;
            const isCompleted = currentStep > s.num;
            return (
              <div
                key={s.num}
                style={{
                  padding: '10px 8px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? '#ECFDF5' : (isCompleted ? '#F0FDF4' : '#F8FAFC'),
                  border: isActive ? '2px solid var(--color-primary)' : (isCompleted ? '1px solid #86EFAC' : '1px solid var(--color-border-subtle)'),
                  textAlign: 'center',
                  transition: 'all 200ms ease'
                }}
              >
                <div style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: isActive ? 'var(--color-primary)' : (isCompleted ? '#166534' : 'var(--color-text-muted)')
                }}>
                  {isCompleted ? `✓ ${s.label}` : s.label}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'none' }} className="mobile-step-sub">
                  {s.sub}
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* STEP 1: DESCRIBE THE PROBLEM (VOICE & TEXT) */}
        {/* ========================================================= */}
        {currentStep === 1 && (
          <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', margin: 0, fontWeight: 700 }}>
                  Step 1: Describe the Civic Issue
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                  Use any of the 3 voice options below or type your problem directly in Hindi, Hinglish, or English.
                </p>
              </div>
            </div>

            {/* Quick Preset Buttons for Rapid Testing */}
            <div style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: '#F8FAFC',
              border: '1px solid var(--color-border-subtle)',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                ⚡ Quick Presets (1-Click Test Scenarios):
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setDescription(preset.text);
                      setFinalCategory(preset.category);
                      setFinalSubcategory(preset.subcategory);
                    }}
                    style={{
                      padding: '6px 12px',
                      minHeight: '44px',
                      borderRadius: '9999px',
                      background: '#FFFFFF',
                      border: '1px solid var(--color-border-medium)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TWO NEW VOICE INPUT OPTIONS + PRESET SIMULATION */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              marginBottom: '18px'
            }}>
              {/* Voice Option 1: Live Speech (Browser Web Speech API) */}
              <button
                type="button"
                onClick={handleToggleLiveSpeech}
                style={{
                  minHeight: '48px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: isLiveListening ? '#FEF2F2' : '#FFFFFF',
                  border: isLiveListening ? '2px solid #EF4444' : '1px solid var(--color-primary)',
                  color: isLiveListening ? '#DC2626' : 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                {isLiveListening ? (
                  <>
                    <MicOff style={{ width: '18px', height: '18px', animation: 'pulse 1s infinite' }} />
                    <span>🎙️ Listening... (Tap to Stop)</span>
                  </>
                ) : (
                  <>
                    <Mic style={{ width: '18px', height: '18px' }} />
                    <span>🎙️ Speak Now (Live Speech)</span>
                  </>
                )}
              </button>

              {/* Voice Option 2: Record Voice (MediaRecorder + Voice Transcribe API) */}
              <button
                type="button"
                onClick={isAudioRecording ? handleStopAudioRecording : handleStartAudioRecording}
                disabled={isTranscribingAudio}
                style={{
                  minHeight: '48px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: isAudioRecording ? '#FEF2F2' : '#FFFFFF',
                  border: isAudioRecording ? '2px solid #DC2626' : '1px solid #2563EB',
                  color: isAudioRecording ? '#DC2626' : '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: isTranscribingAudio ? 'not-allowed' : 'pointer',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                {isAudioRecording ? (
                  <>
                    <MicOff style={{ width: '18px', height: '18px' }} />
                    <span>🎤 Stop Recording ({audioRecordingSeconds}s)</span>
                  </>
                ) : isTranscribingAudio ? (
                  <>
                    <RefreshCw style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                    <span>Transcribing with AI...</span>
                  </>
                ) : (
                  <>
                    <Volume2 style={{ width: '18px', height: '18px' }} />
                    <span>🎤 Record Voice (Audio Note)</span>
                  </>
                )}
              </button>

              {/* Voice Option 3: Existing Preset Demo Voice */}
              <button
                type="button"
                onClick={handleSimulatePresetVoice}
                disabled={isSimulatingVoice}
                style={{
                  minHeight: '48px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: '#F8FAFC',
                  border: '1px solid var(--color-border-medium)',
                  color: 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                <Radio style={{ width: '16px', height: '16px' }} />
                <span>{isSimulatingVoice ? 'Simulating...' : '🔊 Demo Voice Sample'}</span>
              </button>
            </div>

            {/* Voice Language Selector & Error Banner */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                <span>Voice Recognition Dialect:</span>
                <select
                  value={liveSpeechLanguage}
                  onChange={(e) => setLiveSpeechLanguage(e.target.value)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border-medium)',
                    fontSize: '11px',
                    background: '#FFFFFF'
                  }}
                >
                  <option value="hi-IN">Hindi / Hinglish (hi-IN)</option>
                  <option value="en-IN">Indian English (en-IN)</option>
                </select>
              </div>

              {audioTranscriptionSource && (
                <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>
                  Transcription: {audioTranscriptionSource}
                </span>
              )}
            </div>

            {liveSpeechError && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#DC2626',
                fontSize: '12px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                <span>{liveSpeechError}</span>
              </div>
            )}

            {/* Description Textarea */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Complaint Description (Edit anytime)
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write or speak your grievance here in detail... (e.g., Paani bahut ganda aa raha hai aur pressure bhi bahut kam hai. Bacche bimaar pad rahe hain...)"
                style={{
                  width: '100%',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-medium)',
                  padding: '14px',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: 'var(--color-text-primary)',
                  background: '#FFFFFF',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Step 1 Next Button */}
            <button
              type="button"
              disabled={!description.trim()}
              onClick={() => goToStep(2)}
              className="btn-primary"
              style={{
                width: '100%',
                minHeight: '48px',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>Next: Upload Evidence Image</span>
              <ArrowRight style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 2: IMAGE UPLOAD & STRICT AI VALIDATION */}
        {/* ========================================================= */}
        {currentStep === 2 && (
          <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', margin: 0, fontWeight: 700 }}>
                Step 2: Upload Evidence Image & AI Verification
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                Jan Sahayak strictly requires an authentic civic image (e.g. road damage, water pipeline, garbage, electrical fault).
                <strong> Next Step is locked until the image is verified by AI.</strong>
              </p>
            </div>

            {/* Image Upload Input & Samples */}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageFileSelect}
            />

            {/* Image Preview & State Machine UI */}
            {imageState === IMAGE_STATES.NO_IMAGE && (
              <div>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed var(--color-border-medium)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '36px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#FAFAFA',
                    marginBottom: '16px'
                  }}
                >
                  <Camera style={{ width: '40px', height: '40px', color: 'var(--color-primary)', margin: '0 auto 12px auto' }} />
                  <strong style={{ fontSize: '15px', display: 'block', marginBottom: '4px' }}>
                    Click to Capture or Upload Civic Image
                  </strong>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    Works from Mobile Camera or Desktop Gallery (JPG, PNG, WebP)
                  </span>
                </div>

                {/* Preset Test Images */}
                <div style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: '#F8FAFC',
                  border: '1px solid var(--color-border-subtle)',
                  marginBottom: '16px'
                }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Or Test with Pre-configured Scenarios:
                  </span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => handleSelectSampleImage('water')}
                      style={{
                        minHeight: '44px',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        background: '#FFFFFF',
                        border: '1px solid var(--color-border-medium)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      💧 Sample Water Defect (Valid)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectSampleImage('road')}
                      style={{
                        minHeight: '44px',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        background: '#FFFFFF',
                        border: '1px solid var(--color-border-medium)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      🚧 Sample Road Pothole (Valid)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectSampleImage('invalid')}
                      style={{
                        minHeight: '44px',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        background: '#FEF2F2',
                        border: '1px solid #FCA5A5',
                        color: '#DC2626',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      ❌ Sample Non-Civic Image (Test Invalid)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* DURING ANALYZING STATE */}
            {imageState === IMAGE_STATES.ANALYZING && (
              <div style={{
                padding: '24px',
                borderRadius: 'var(--radius-lg)',
                background: '#F0F9FF',
                border: '2px solid #BAE6FD',
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                {imagePreviewUrl && (
                  <img
                    src={imagePreviewUrl}
                    alt="Uploaded preview"
                    style={{
                      maxHeight: '180px',
                      maxWidth: '100%',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '14px',
                      objectFit: 'cover'
                    }}
                  />
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                  <RefreshCw style={{ width: '20px', height: '20px', color: '#0284C7', animation: 'spin 1s linear infinite' }} />
                  <strong style={{ fontSize: '16px', color: '#0369A1' }}>
                    Analyzing Image with AI...
                  </strong>
                </div>
                <p style={{ fontSize: '13px', color: '#0284C7', margin: 0 }}>
                  Scanning for civic infrastructure defects, pipeline fractures, road damage, or waste accumulation.
                  <strong> The Next Step button will appear only after verification.</strong>
                </p>
              </div>
            )}

            {/* VALID STATE */}
            {imageState === IMAGE_STATES.VALID && (
              <div style={{
                padding: '20px',
                borderRadius: 'var(--radius-lg)',
                background: '#F0FDF4',
                border: '2px solid #86EFAC',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {imagePreviewUrl && (
                    <img
                      src={imagePreviewUrl}
                      alt="Verified evidence"
                      style={{
                        width: '100px',
                        height: '80px',
                        borderRadius: 'var(--radius-md)',
                        objectFit: 'cover',
                        border: '1px solid #86EFAC'
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: 700, fontSize: '15px' }}>
                      <CheckCircle2 style={{ width: '20px', height: '20px', color: '#16a34a' }} />
                      <span>✓ Image Verified by AI</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#166534', marginTop: '4px' }}>
                      <strong>Detected Defect: </strong>
                      {imageValidationResult?.detectedDefect || 'Civic Infrastructure Defect'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#15803D', marginTop: '2px' }}>
                      Confidence: {Math.round((imageValidationResult?.confidence || 0.95) * 100)}% • Source: {imageValidationResult?.source || 'Gemini Vision'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRetakeImage}
                    style={{
                      padding: '6px 12px',
                      minHeight: '44px',
                      borderRadius: 'var(--radius-sm)',
                      background: '#FFFFFF',
                      border: '1px solid #86EFAC',
                      color: '#166534',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Change Image
                  </button>
                </div>
              </div>
            )}

            {/* INVALID STATE */}
            {imageState === IMAGE_STATES.INVALID && (
              <div style={{
                padding: '20px',
                borderRadius: 'var(--radius-lg)',
                background: '#FEF2F2',
                border: '2px solid #FCA5A5',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <AlertTriangle style={{ width: '24px', height: '24px', color: '#DC2626', flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: '15px', color: '#B91C1C', display: 'block', marginBottom: '4px' }}>
                      Image Verification Failed
                    </strong>
                    <p style={{ fontSize: '13px', color: '#991B1B', margin: '0 0 8px 0', lineHeight: 1.5 }}>
                      {imageValidationResult?.reason || 'Image could not be verified as relevant to this civic grievance. Please upload a clearer image showing the reported issue.'}
                    </p>
                    <div style={{ fontSize: '12px', color: '#7F1D1D', marginBottom: '14px' }}>
                      <strong>Expected evidence: </strong> Potholes, broken water pipes, contaminated water, overflowing dumpsters, sparking wires, or damaged municipal property.
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={handleRetakeImage}
                        style={{
                          minHeight: '44px',
                          padding: '8px 16px',
                          borderRadius: 'var(--radius-sm)',
                          background: '#DC2626',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Retake / Upload Another Image
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ERROR STATE */}
            {imageState === IMAGE_STATES.ERROR && (
              <div style={{
                padding: '20px',
                borderRadius: 'var(--radius-lg)',
                background: '#FFFBEB',
                border: '2px solid #FDE68A',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <AlertCircle style={{ width: '22px', height: '22px', color: '#D97706', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: '14px', color: '#92400E', display: 'block', marginBottom: '4px' }}>
                      Image verification could not be completed.
                    </strong>
                    <p style={{ fontSize: '12px', color: '#78350F', margin: '0 0 10px 0' }}>
                      {imageValidationResult?.reason || 'The verification service encountered an issue. Please retry or re-select an image.'}
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => runImageValidation(imageDataUrl)}
                        style={{
                          minHeight: '44px',
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-sm)',
                          background: '#D97706',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Retry Verification
                      </button>
                      <button
                        type="button"
                        onClick={handleRetakeImage}
                        style={{
                          minHeight: '44px',
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-sm)',
                          background: '#FFFFFF',
                          border: '1px solid var(--color-border-medium)',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Choose Different Photo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => goToStep(1)}
                className="btn-secondary"
                style={{ minHeight: '48px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowLeft style={{ width: '16px', height: '16px' }} />
                <span>Back</span>
              </button>

              {/* CRITICAL REQUIREMENT: NEXT STEP BUTTON ONLY APPEARS WHEN IMAGE IS VALID */}
              {imageState === IMAGE_STATES.VALID ? (
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className="btn-primary"
                  style={{
                    minHeight: '48px',
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: 700
                  }}
                >
                  <span>Next Step: AI Category Detection</span>
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>
              ) : (
                <div style={{
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: '#F1F5F9',
                  color: 'var(--color-text-muted)',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span>🔒 Next Step locked (Awaiting valid image)</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3: AI PROBLEM CATEGORY DETECTION */}
        {/* ========================================================= */}
        {currentStep === 3 && (
          <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', margin: 0, fontWeight: 700 }}>
                Step 3: AI Problem Category Detection
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                Jan Sahayak analyzes your description and evidence to recommend the correct civic department. You have full authority to confirm or adjust it.
              </p>
            </div>

            {/* AI SUGGESTED CATEGORY CARD */}
            <div style={{
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#15803D' }}>
                  AI Suggested Category
                </span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: '#DCFCE7',
                  color: '#15803D',
                  fontSize: '11px',
                  fontWeight: 700
                }}>
                  {Math.round((aiDetectedCategory?.confidence || 0.94) * 100)}% Confidence
                </span>
              </div>

              <div style={{ fontSize: '18px', fontWeight: 800, color: '#14532D', marginBottom: '4px' }}>
                {aiDetectedCategory?.category || liveDna?.category || 'Water Supply & Contamination'}
              </div>

              <div style={{ fontSize: '13px', color: '#166534', marginBottom: '8px' }}>
                <strong>Subcategory: </strong>
                {aiDetectedCategory?.subcategory || 'Water Quality / Low Pressure'}
              </div>

              {aiDetectedCategory?.reason && (
                <p style={{ fontSize: '12px', color: '#15803D', margin: 0, fontStyle: 'italic' }}>
                  "{aiDetectedCategory.reason}"
                </p>
              )}
            </div>

            {/* CITIZEN CONFIRMATION / CORRECTION SECTION */}
            <div style={{
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              background: '#F8FAFC',
              border: '1px solid var(--color-border-medium)',
              marginBottom: '24px'
            }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                Final Complaint Category (Citizen Confirmed)
              </label>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                Select the final category used for department routing. Your choice takes priority over AI recommendations.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                    Department Category:
                  </label>
                  <select
                    value={finalCategory}
                    onChange={(e) => setFinalCategory(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '44px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border-medium)',
                      padding: '0 12px',
                      fontSize: '13px',
                      background: '#FFFFFF',
                      fontWeight: 600
                    }}
                  >
                    <option value="Water Supply & Contamination">Water Supply & Contamination</option>
                    <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                    <option value="Electricity & Power Grid">Electricity & Power Grid</option>
                    <option value="Sanitation & Solid Waste">Sanitation & Solid Waste</option>
                    <option value="Sewage & Drainage">Sewage & Drainage</option>
                    <option value="Public Health & Vector Control">Public Health & Vector Control</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                    Specific Subcategory:
                  </label>
                  <input
                    type="text"
                    value={finalSubcategory}
                    onChange={(e) => setFinalSubcategory(e.target.value)}
                    placeholder="e.g. Water Quality, Pothole, Sparking"
                    style={{
                      width: '100%',
                      minHeight: '44px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border-medium)',
                      padding: '0 12px',
                      fontSize: '13px',
                      background: '#FFFFFF',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <button
                type="button"
                onClick={() => goToStep(2)}
                className="btn-secondary"
                style={{ minHeight: '48px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowLeft style={{ width: '16px', height: '16px' }} />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => goToStep(4)}
                className="btn-primary"
                style={{
                  minHeight: '48px',
                  padding: '0 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: 700
                }}
              >
                <span>Next: Capture GPS & Map</span>
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 4: REAL MAP & GPS LOCATION CAPTURE */}
        {/* ========================================================= */}
        {currentStep === 4 && (
          <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', margin: 0, fontWeight: 700 }}>
                  Step 4: Location & Real Map Verification
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                  Capture your exact GPS coordinates or drag the pin on OpenStreetMap to adjust.
                </p>
              </div>

              {/* Use My Current Location Button */}
              <button
                type="button"
                onClick={handleCaptureRealGps}
                disabled={isCapturingGps}
                style={{
                  minHeight: '44px',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  background: 'var(--color-primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: isCapturingGps ? 'not-allowed' : 'pointer',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <Navigation style={{ width: '15px', height: '15px', animation: isCapturingGps ? 'spin 1s linear infinite' : 'none' }} />
                <span>{isCapturingGps ? 'Querying GPS...' : '📍 Use My Current Location'}</span>
              </button>
            </div>

            {gpsError && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                color: '#92400E',
                fontSize: '12px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                <span>{gpsError}</span>
              </div>
            )}

            {/* REAL MAP COMPONENT (Leaflet + OSM) */}
            <div style={{ marginBottom: '18px' }}>
              <RealMap
                latitude={locationCoords.latitude}
                longitude={locationCoords.longitude}
                accuracy={locationCoords.accuracy}
                draggable={true}
                height="320px"
                onLocationChange={handleManualMapLocationChange}
              />
            </div>

            {/* Captured Location Metadata Card */}
            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: '#F8FAFC',
              border: '1px solid var(--color-border-subtle)',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '12px' }}>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontWeight: 600 }}>Coordinates:</span>
                  <strong style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                    {locationCoords.latitude.toFixed(5)}° N, {locationCoords.longitude.toFixed(5)}° E
                  </strong>
                  <span style={{
                    marginLeft: '8px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 700,
                    background: locationCoords.source === 'gps' ? '#DCFCE7' : '#FEF3C7',
                    color: locationCoords.source === 'gps' ? '#166534' : '#92400E'
                  }}>
                    Source: {locationCoords.source.toUpperCase()}
                  </span>
                </div>

                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontWeight: 600 }}>Accuracy:</span>
                  <strong>±{locationCoords.accuracy} meters</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontWeight: 600 }}>Resolved Address:</span>
                  <strong style={{ color: 'var(--color-text-primary)' }}>{resolvedAddress}</strong>
                </div>
              </div>

              {/* Ward & Area Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr', gap: '10px', marginTop: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                    Ward:
                  </label>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '44px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border-medium)',
                      padding: '0 8px',
                      fontSize: '12px',
                      background: '#FFFFFF'
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
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                    Area / Landmark:
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '44px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border-medium)',
                      padding: '0 8px',
                      fontSize: '12px',
                      background: '#FFFFFF',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                    Pincode:
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '44px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border-medium)',
                      padding: '0 8px',
                      fontSize: '12px',
                      background: '#FFFFFF',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <button
                type="button"
                onClick={() => goToStep(3)}
                className="btn-secondary"
                style={{ minHeight: '48px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowLeft style={{ width: '16px', height: '16px' }} />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => goToStep(5)}
                className="btn-primary"
                style={{
                  minHeight: '48px',
                  padding: '0 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: 700
                }}
              >
                <span>Next: Review & Confirm</span>
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 5: REVIEW COMPLAINT & SUBMIT */}
        {/* ========================================================= */}
        {currentStep === 5 && (
          <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ fontSize: '18px', margin: 0, fontWeight: 700 }}>
                Step 5: Review & Submit Public Grievance
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                Verify all verified evidence, AI classification, and jurisdictional details before dispatch.
              </p>
            </div>

            {/* Summary Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
              marginBottom: '20px'
            }}>
              {/* Category & Department */}
              <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: '#F8FAFC', border: '1px solid var(--color-border-subtle)' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Complaint Category
                </span>
                <strong style={{ fontSize: '15px', color: 'var(--color-primary)' }}>
                  {finalCategory}
                </strong>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  Subcategory: {finalSubcategory}
                </div>
                <div style={{ fontSize: '11px', color: '#166534', marginTop: '6px', fontWeight: 600 }}>
                  AI Suggested: {aiDetectedCategory?.category || liveDna?.category || finalCategory} ({Math.round((aiDetectedCategory?.confidence || 0.94) * 100)}%)
                </div>
              </div>

              {/* Location */}
              <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: '#F8FAFC', border: '1px solid var(--color-border-subtle)' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Location & Ward
                </span>
                <strong style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>
                  {ward}
                </strong>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  {resolvedAddress}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px', fontFamily: 'monospace' }}>
                  GPS: {locationCoords.latitude.toFixed(5)}, {locationCoords.longitude.toFixed(5)} ({locationCoords.source})
                </div>
              </div>
            </div>

            {/* Description Verbatim */}
            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: '#F8FAFC',
              border: '1px solid var(--color-border-subtle)',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Description (Verbatim Record):
              </span>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--color-text-primary)', margin: 0 }}>
                "{description}"
              </p>
            </div>

            {/* Evidence Tag */}
            <div style={{
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              background: '#ECFDF5',
              border: '1px solid #A7F3D0',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#065F46'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck style={{ width: '18px', height: '18px' }} />
                <span>
                  <strong>Evidence Verified: </strong>
                  {photoTag || 'AI Validated Civic Defect Photograph'}
                </span>
              </div>
              <span style={{ fontWeight: 700 }}>✓ Ready for Audit</span>
            </div>

            {/* Submission Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <button
                type="button"
                onClick={() => goToStep(4)}
                className="btn-secondary"
                style={{ minHeight: '48px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowLeft style={{ width: '16px', height: '16px' }} />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="btn-primary"
                style={{
                  minHeight: '48px',
                  padding: '0 32px',
                  fontSize: '15px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                    <span>Transmitting to Authorities...</span>
                  </>
                ) : (
                  <>
                    <span>✓ Confirm & Submit Grievance</span>
                    <ArrowRight style={{ width: '18px', height: '18px' }} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 6: SUBMISSION SUCCESS MODAL */}
        {/* ========================================================= */}
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
            <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '32px', textAlign: 'center' }}>
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

              <h2 style={{ fontSize: '24px', marginBottom: '8px', fontWeight: 800 }}>
                Ticket #{createdTicket.id}
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
                Your grievance has been verified and routed to <strong>{createdTicket.department || createdTicket.category}</strong>.
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, marginBottom: '6px' }}>
                  <Check style={{ width: '14px', height: '14px' }} />
                  <span>Real-time Dispatches:</span>
                </div>
                <ul style={{ paddingLeft: '18px', margin: 0, lineHeight: 1.6 }}>
                  <li>SMS & Tracking hash dispatched to {citizenInfo.phone}</li>
                  <li>Assigned to Ward Official with 4-day Citizen Verification Window</li>
                  <li>Location pinned at GPS: {locationCoords.latitude.toFixed(4)}, {locationCoords.longitude.toFixed(4)}</li>
                </ul>
              </div>

              {/* Direct Navigation Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => navigate(`/citizen/complaints/${createdTicket.id}`)}
                  className="btn-primary"
                  style={{ flex: 1, minHeight: '44px' }}
                >
                  <span>Track Grievance</span>
                  <ArrowRight className="btn-arrow" style={{ width: '16px', height: '16px' }} />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/citizen')}
                  className="btn-secondary"
                  style={{ flex: 1, minHeight: '44px' }}
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
