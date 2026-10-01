import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Loader2, 
  Edit3, 
  Sparkles,
  RefreshCw,
  VideoOff
} from 'lucide-react';
import { analyzeCivicPhoto } from '../../services/aiVisionService';

export default function LiveCameraCapture({ 
  photoPreview, 
  setPhotoPreview, 
  visionAnalysis, 
  setVisionAnalysis,
  category,
  setCategory,
  contextText = '',
  onDetailCorrection = () => {}
}) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraFacing, setCameraFacing] = useState('environment'); // 'environment' (back) or 'user' (front)
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customDetailText, setCustomDetailText] = useState('');
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Stop camera stream when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async (facing = cameraFacing) => {
    setCameraError(null);
    stopCamera();

    try {
      const constraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Live camera access failed, falling back to native capture dialog:', err);
      setCameraError('Camera access denied or unavailable. You can snap directly via device camera button below.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    if (isCameraActive) {
      startCamera(nextFacing);
    }
  };

  const capturePhotoFromStream = async () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Data = canvas.toDataURL('image/jpeg', 0.85);
    stopCamera();
    processCapturedImage(base64Data);
  };

  const handleNativeCameraFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target.result;
      processCapturedImage(base64Data, file.type || 'image/jpeg');
    };
    reader.readAsDataURL(file);
  };

  const processCapturedImage = async (base64Data, mimeType = 'image/jpeg') => {
    setPhotoPreview(base64Data);
    setIsAnalyzing(true);
    setVisionAnalysis(null);

    try {
      const result = await analyzeCivicPhoto(base64Data, mimeType, contextText || category);
      setVisionAnalysis(result);

      if (result.isValidCivic) {
        if (result.category && setCategory) {
          setCategory(result.category);
        }
        if (result.observedHazard) {
          setCustomDetailText(result.observedHazard);
          onDetailCorrection(result.observedHazard);
        }
      }
    } catch (err) {
      console.warn('Vision processing failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setVisionAnalysis(null);
    setCustomDetailText('');
    stopCamera();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleTextCorrection = (e) => {
    const val = e.target.value;
    setCustomDetailText(val);
    onDetailCorrection(val);
  };

  return (
    <div style={{ fontFamily: 'inherit' }}>
      {/* Hidden Native Camera Input (uses capture="environment" for instant camera snap on phones/browsers) */}
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        capture="environment" 
        style={{ display: 'none' }}
        onChange={handleNativeCameraFile}
      />

      {/* State 1: Active Live Camera Viewfinder */}
      {isCameraActive && (
        <div style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          background: '#0F172A',
          border: '2px solid #2563EB',
          boxShadow: '0 10px 25px rgba(37, 99, 235, 0.2)',
          marginBottom: '14px'
        }}>
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted
            style={{
              width: '100%',
              maxHeight: '260px',
              objectFit: 'cover',
              display: 'block'
            }}
          />

          {/* Viewfinder Target Reticle Overlay */}
          <div style={{
            position: 'absolute',
            inset: '20px',
            border: '2px dashed rgba(255, 255, 255, 0.6)',
            borderRadius: '12px',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{
              background: 'rgba(0, 0, 0, 0.6)',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '999px',
              backdropFilter: 'blur(4px)'
            }}>
              Align ground problem in frame
            </span>
          </div>

          {/* Camera Controls Footer */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            zIndex: 10
          }}>
            <button
              type="button"
              onClick={toggleCameraFacing}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Switch camera"
            >
              <RotateCw size={16} />
            </button>

            {/* Snap Button */}
            <button
              type="button"
              onClick={capturePhotoFromStream}
              style={{
                padding: '10px 24px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                color: '#FFFFFF',
                border: '2px solid #FFFFFF',
                fontWeight: 700,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
              }}
            >
              <Camera size={16} />
              <span>Snap Photo Now</span>
            </button>

            <button
              type="button"
              onClick={stopCamera}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.85)',
                color: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Cancel camera"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}

      {/* State 2: No Photo Yet (Live Camera Prompt) */}
      {!isCameraActive && !photoPreview && (
        <div style={{
          border: '2px dashed #94A3B8',
          borderRadius: '16px',
          padding: '24px 16px',
          textAlign: 'center',
          background: '#F8FAFC',
          marginBottom: '14px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#EFF6FF',
            color: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px auto'
          }}>
            <Camera size={24} />
          </div>

          <strong style={{ fontSize: '13.5px', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
            Capture Live Ground Photo
          </strong>
          <p style={{ fontSize: '12px', color: '#64748B', maxWidth: '380px', margin: '0 auto 14px auto', lineHeight: 1.4 }}>
            Take an instant on-site photo of the issue (road pothole, garbage dump, water leak, dangling wire). AI will verify problem authenticity.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Primary Action: Open Live Camera Viewfinder */}
            <button
              type="button"
              onClick={() => startCamera('environment')}
              style={{
                padding: '9px 20px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(37, 99, 235, 0.25)'
              }}
            >
              <Camera size={16} />
              <span>Open Live Camera</span>
            </button>

            {/* Direct Device Camera Snap */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '9px 16px',
                borderRadius: '12px',
                background: '#FFFFFF',
                color: '#334155',
                border: '1.5px solid #CBD5E1',
                fontSize: '12.5px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <span>Take Phone Photo</span>
            </button>
          </div>

          {cameraError && (
            <div style={{ marginTop: '10px', fontSize: '11px', color: '#DC2626' }}>
              {cameraError}
            </div>
          )}
        </div>
      )}

      {/* State 3: Captured Photo Preview & AI Inspection Results */}
      {photoPreview && (
        <div style={{
          borderRadius: '16px',
          overflow: 'hidden',
          border: visionAnalysis && !visionAnalysis.isValidCivic ? '2px solid #EF4444' : '1.5px solid #CBD5E1',
          background: '#0F172A',
          position: 'relative',
          marginBottom: '14px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
        }}>
          <img 
            src={photoPreview} 
            alt="Captured Evidence" 
            style={{
              width: '100%',
              maxHeight: '220px',
              objectFit: 'cover',
              display: 'block'
            }}
          />

          {/* Retake / Remove Button */}
          <button
            type="button"
            onClick={handleRemovePhoto}
            aria-label="Remove photo"
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(0, 0, 0, 0.7)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.15s'
            }}
          >
            <Trash2 size={15} />
          </button>

          {/* AI Analysis Result Panel */}
          <div style={{
            padding: '12px 14px',
            background: '#FFFFFF',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {isAnalyzing ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Loader2 className="animate-spin" size={16} style={{ color: '#2563EB' }} />
                <span style={{ fontSize: '12.5px', color: '#2563EB', fontWeight: 600 }}>
                  AI Vision is scanning image for physical civic hazards...
                </span>
              </div>
            ) : visionAnalysis ? (
              visionAnalysis.isValidCivic ? (
                /* Valid Civic Ground Issue */
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                    <CheckCircle2 size={18} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <strong style={{ fontSize: '13px', color: '#0F172A' }}>
                          AI Civic Hazard Verified:
                        </strong>
                        <span style={{
                          fontSize: '10.5px',
                          fontWeight: 700,
                          background: '#ECFDF5',
                          color: '#059669',
                          border: '1px solid #A7F3D0',
                          padding: '1px 7px',
                          borderRadius: '999px'
                        }}>
                          {Math.round(visionAnalysis.confidence * 100)}% Match
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#334155', margin: '2px 0 0 0', lineHeight: 1.4 }}>
                        {visionAnalysis.observedHazard}
                      </p>
                    </div>
                  </div>

                  {/* Option to Edit / Add Custom Text if AI Detected something different */}
                  <div style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    marginTop: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Edit3 size={13} style={{ color: '#2563EB' }} />
                        <span>Add or edit specific problem details by typing:</span>
                      </label>
                      <span style={{ fontSize: '10.5px', color: '#64748B' }}>Optional</span>
                    </div>
                    <input 
                      type="text"
                      value={customDetailText}
                      onChange={handleTextCorrection}
                      placeholder="e.g. Also near water pipeline junction; deep hole dangerous at night..."
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '12px',
                        color: '#0F172A',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              ) : (
                /* REJECTED / INVALID IMAGE (e.g. Website UI / Non-Civic screenshot) */
                <div style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: '#FEF2F2',
                  border: '1.5px solid #FECACA',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <AlertTriangle size={18} style={{ color: '#DC2626', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ fontSize: '13px', color: '#991B1B', display: 'block' }}>
                        ⚠️ Non-Civic Image Detected: Photo Not Accepted
                      </strong>
                      <p style={{ fontSize: '12px', color: '#B91C1C', margin: '2px 0 0 0', lineHeight: 1.4 }}>
                        {visionAnalysis.rejectionReason || 'This image appears to be a website UI, software graphic, or unrelated file rather than a physical ground issue (road, garbage, water, etc.).'}
                      </p>
                    </div>
                  </div>

                  {/* Actions for User */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => {
                        handleRemovePhoto();
                        startCamera('environment');
                      }}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        background: '#DC2626',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      <Camera size={13} />
                      <span>Retake Ground Photo</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        background: '#FFFFFF',
                        color: '#374151',
                        border: '1px solid #D1D5DB',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <span>Describe by Typing Instead</span>
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569' }}>
                <CheckCircle2 size={15} style={{ color: '#059669' }} />
                <span>Ground photo captured</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
