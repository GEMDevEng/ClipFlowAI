import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Using actual values for the ClipFlowAI project
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://wkevcxbbnbtlndkkhtgr.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZXZjeGJibmJ0bG5ka2todGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NzQ5ODYsImV4cCI6MjA2MDE1MDk4Nn0.ZHQ10o6RMrENCu7TDqwauvaqZZLQ_ocli10XqRsHHyc';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };
