import { createClient } from '@supabase/supabase-js';

// Use a fixed Supabase project URL and fall back to the provided key if
// SUPABASE_KEY isn't set in the environment.
const supabaseUrl = 'https://fpobwzdderqbslojsohp.supabase.co';
const supabaseKey =
  process.env.SUPABASE_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwb2J3emRkZXJxYnNsb2pzb2hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMjkzMTUsImV4cCI6MjA2OTYwNTMxNX0.S7t75697yDxbeQ9mlSeQDtt5k51O9UycDZGOy4_ipdQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
