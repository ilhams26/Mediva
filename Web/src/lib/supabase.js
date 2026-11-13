import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[Mediva] Supabase belum dikonfigurasi. ' +
    'Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env'
  );
}

export const supabase = createClient(supabaseUrl ?? '', supabaseKey ?? '');

