
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xfwtjndfclckgvpvgiaj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhmd3RqbmRmY2xja2d2cHZnaWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NDUyNDIsImV4cCI6MjA2NTEyMTI0Mn0.8ZUZVBHkq9vLuMJJmIECXx6-q40lAJ40C5T8IL3yrNc";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
