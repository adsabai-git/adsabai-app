import { createClient } from '@supabase/supabase-js';

// Strip UTF-8 BOM (0xFEFF) that Windows PowerShell pipe encoding can prepend to env vars
function stripBOM(s: string): string {
  return s.charCodeAt(0) === 0xFEFF ? s.slice(1) : s;
}

const supabaseUrl = stripBOM(process.env.SUPABASE_URL || '');
const supabaseServiceRoleKey = stripBOM(process.env.SUPABASE_SERVICE_ROLE_KEY || '');

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables.');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
});
