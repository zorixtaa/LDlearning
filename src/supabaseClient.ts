import { createClient } from '@supabase/supabase-js';

// Read configuration from Vite environment variables so deployments can
// provide their own credentials. A fallback URL is kept for development.
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ?? 'https://fpobwzdderqbslojsohp.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseKey);
