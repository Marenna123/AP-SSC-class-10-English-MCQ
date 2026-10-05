export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}

const SUPABASE_CONFIG_KEY = 'ap_ssc_supabase_config_v1';

export function getSupabaseConfig(): SupabaseConfig {
  try {
    const saved = localStorage.getItem(SUPABASE_CONFIG_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to read Supabase config', e);
  }

  // Fallback to env vars if available
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  return {
    url: envUrl,
    anonKey: envKey,
    isConnected: Boolean(envUrl && envKey),
  };
}

export function saveSupabaseConfig(config: { url: string; anonKey: string }): SupabaseConfig {
  const isConnected = Boolean(config.url.trim() && config.anonKey.trim());
  const updated: SupabaseConfig = {
    url: config.url.trim(),
    anonKey: config.anonKey.trim(),
    isConnected,
  };
  localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(updated));
  return updated;
}
