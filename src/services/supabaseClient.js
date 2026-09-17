import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://epnfavpqweeybzoyoexq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwbmZhdnBxd2VleWJ6b3lvZXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MTcxOTMsImV4cCI6MjEwMzk5MzE5M30.PIvlGuiavqRRnb1zTFIwdmizMh9AeSLxc5nW8YdhYHQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

/**
 * Storage Helpers
 */
export async function uploadComplaintMedia(file, path) {
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
}

export async function uploadVoiceRecording(blob, fileName = `voice_${Date.now()}.webm`) {
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
}

export async function uploadFieldEvidence(file, path) {
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
}

export default supabase;
