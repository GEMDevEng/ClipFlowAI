/**
 * Supabase client configuration
 */

const { createClient } = require('@supabase/supabase-js');
const config = require('./index');

// Create Supabase client
const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
);

// Create Supabase admin client (with service role key)
const supabaseAdmin = config.supabase.serviceKey
  ? createClient(
      config.supabase.url,
      config.supabase.serviceKey
    )
  : null;

module.exports = {
  supabase,
  supabaseAdmin
};
