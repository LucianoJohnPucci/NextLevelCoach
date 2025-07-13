import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jkxpicilmypvdcqifmfv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpreHBpY2lsbXlwdmRjcWlmbWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NzAzMDEsImV4cCI6MjA1NzA0NjMwMX0.B4fqbIHiOIVEMaILknJj5g7rvWKfhoQQPIllRBtpeC8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
