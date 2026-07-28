import { createClient, SupabaseClient } from '@supabase/supabase-js';

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const localUrl = typeof window !== 'undefined' ? localStorage.getItem('EXC_SUPABASE_URL') : null;
const localKey = typeof window !== 'undefined' ? localStorage.getItem('EXC_SUPABASE_ANON_KEY') : null;

// Prefer env vars, fallback to user provided localStorage credentials
export const supabaseUrl = (envUrl && envUrl !== 'https://tu-proyecto.supabase.co' ? envUrl : localUrl) || '';
export const supabaseAnonKey = (envKey && envKey !== 'tu_anon_key_aqui' ? envKey : localKey) || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://tu-proyecto.supabase.co' &&
  supabaseUrl.startsWith('http')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function setCustomSupabaseCredentials(url: string, key: string) {
  if (url && key) {
    localStorage.setItem('EXC_SUPABASE_URL', url.trim());
    localStorage.setItem('EXC_SUPABASE_ANON_KEY', key.trim());
    window.location.reload();
  }
}

export function clearCustomSupabaseCredentials() {
  localStorage.removeItem('EXC_SUPABASE_URL');
  localStorage.removeItem('EXC_SUPABASE_ANON_KEY');
  window.location.reload();
}

