require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '';

let supabaseAdmin = null;
let supabaseClient = null;

const isConfigured = Boolean(supabaseUrl && (supabaseServiceKey || supabaseAnonKey));

if (isConfigured) {
  try {
    if (supabaseServiceKey) {
      supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
    }

    if (supabaseAnonKey) {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    } else if (supabaseAdmin) {
      supabaseClient = supabaseAdmin;
    }
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err.message);
  }
}

const testConnection = async () => {
  const client = supabaseAdmin || supabaseClient;
  if (!client) {
    return { connected: false, message: 'Supabase credentials not configured' };
  }
  try {
    let { data, error } = await client.from('villages').select('id').limit(1);
    if (error && supabaseClient && client !== supabaseClient) {
      const res = await supabaseClient.from('villages').select('id').limit(1);
      data = res.data;
      error = res.error;
    }
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
