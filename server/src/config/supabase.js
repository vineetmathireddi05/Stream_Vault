const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.warn(
    '[supabase] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing — auth-protected routes will fail until set.'
  );
}

const supabaseAdmin = createClient(supabaseUrl || 'http://localhost', serviceRoleKey || 'placeholder', {
  auth: { autoRefreshToken: false, persistSession: false },
});

const getUserClient = (accessToken) =>
  createClient(supabaseUrl || 'http://localhost', serviceRoleKey || 'placeholder', {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });

module.exports = { supabaseAdmin, getUserClient };
