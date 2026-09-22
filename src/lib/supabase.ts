import { createClient, SupabaseClient } from '@supabase/supabase-js';

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const DEFAULT_SUPABASE_URL = "https://muyqxxzjcgwyvluzumbt.supabase.co";
const DEFAULT_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXF4eHpqY2d3eXZsdXp1bWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODAzODAsImV4cCI6MjEwMDc1NjM4MH0.dbcSNdYK4psdcAI1XapaTAIkQrZttglJ_kkgODZsICg";

const localUrl = typeof window !== 'undefined' ? localStorage.getItem('EXC_SUPABASE_URL') : null;
const localKey = typeof window !== 'undefined' ? localStorage.getItem('EXC_SUPABASE_ANON_KEY') : null;

// Prefer env vars, fallback to localStorage or default project credentials
export const supabaseUrl = (envUrl && envUrl !== 'https://tu-proyecto.supabase.co' ? envUrl : (localUrl || DEFAULT_SUPABASE_URL)) || '';
export const supabaseAnonKey = (envKey && envKey !== 'tu_anon_key_aqui' ? envKey : (localKey || DEFAULT_SUPABASE_KEY)) || '';

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

