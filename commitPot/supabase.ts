import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const hasSupabaseEnv = Boolean(supabaseUrl && supabaseAnonKey);
const FALLBACK_SUPABASE_URL = 'https://placeholder.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjQ3MDAwMDAwMDB9.placeholder';

if (!hasSupabaseEnv) {
  console.warn('Supabaseの環境変数が未設定です。.envにEXPO_PUBLIC_SUPABASE_URL/ANON_KEYを設定してください。');
}

export const supabase = createClient(
  hasSupabaseEnv ? supabaseUrl! : FALLBACK_SUPABASE_URL,
  hasSupabaseEnv ? supabaseAnonKey! : FALLBACK_SUPABASE_ANON_KEY,
  {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
}
);
