const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '';

let supabaseAdmin = null;
let supabaseClient = null;

const isConfigured = Boolean(supabaseUrl && (supabaseServiceKey || supabaseAnonKey));

if (isConfigured) {
  try {
    const adminKey = supabaseServiceKey || supabaseAnonKey;
    supabaseAdmin = createClient(supabaseUrl, adminKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    if (supabaseAnonKey) {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    } else {
      supabaseClient = supabaseAdmin;
    }
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err.message);
  }
}

const testConnection = async () => {
  if (!supabaseAdmin) {
    return { connected: false, message: 'Supabase credentials not configured' };
  }
  try {
    const { data, error } = await supabaseAdmin.from('villages').select('id').limit(1);
    if (error) throw error;
    return { connected: true, message: 'Supabase connected successfully' };
  } catch (err) {
    return { connected: false, message: err.message };
  }
};

module.exports = {
  supabaseAdmin,
  supabaseClient,
  isConfigured,
  testConnection
};
