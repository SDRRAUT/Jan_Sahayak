import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jan-sahayak.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key-placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});


async function uploadViaApi(fileOrBlob, category, defaultMime = 'image/jpeg') {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result;
        const token = localStorage.getItem('jansahayk_token');
        const res = await fetch('/api/evidence/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            base64Data,
            mimeType: fileOrBlob.type || defaultMime,
            category
          })
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error?.message || `Upload failed: ${res.statusText}`);
        }
        const data = await res.json();
        resolve({ path: data.storagePath, publicUrl: data.publicUrl });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (e) => reject(new Error('Failed to read file: ' + e));
    reader.readAsDataURL(fileOrBlob);
  });
}

/**
 * Storage Helpers
 */
export async function uploadComplaintMedia(file, path) {
  try {
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
      .from('complaint-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('complaint-media')
      .getPublicUrl(filePath);

    return { path: data.path, publicUrl: publicUrlData.publicUrl };
  } catch (err) {
    // Graceful fallback to backend StorageService
    return await uploadViaApi(file, 'complaints', file.type || 'image/jpeg');
  }
}

export async function uploadVoiceRecording(blob, fileName = `voice_${Date.now()}.webm`) {
  try {
    const { data, error } = await supabase.storage
      .from('voice-recordings')
      .upload(fileName, blob, {
        contentType: blob.type || 'audio/webm',
        upsert: false
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('voice-recordings')
      .getPublicUrl(fileName);

    return { path: data.path, publicUrl: publicUrlData.publicUrl };
  } catch (err) {
    // Graceful fallback to backend StorageService
    return await uploadViaApi(blob, 'voice', 'audio/webm');
  }
}

export async function uploadFieldEvidence(file, path) {
  try {
    const fileName = `officer_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
      .from('field-evidence')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('field-evidence')
      .getPublicUrl(filePath);

    return { path: data.path, publicUrl: publicUrlData.publicUrl };
  } catch (err) {
    // Graceful fallback to backend StorageService
    return await uploadViaApi(file, 'field-actions', file.type || 'image/jpeg');
  }
}


export default supabase;
