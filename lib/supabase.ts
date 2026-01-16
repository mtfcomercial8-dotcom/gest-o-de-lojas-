import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://orffnbtsunyqdsjfwxsi.supabase.co';
const supabaseKey = 'sb_publishable_rc_koSvWRUK9ALk-f6JQpA_DQwtmdmZ';

export const supabase = createClient(supabaseUrl, supabaseKey);
