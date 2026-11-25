import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded from the backend directory regardless of where node was launched
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config(); // fallback for current working directory

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Warning: SUPABASE_URL or SUPABASE_ANON_KEY is not defined in environment variables.');
}

export const hasServiceRoleKey = Boolean(
  supabaseServiceRoleKey && 
  supabaseServiceRoleKey.trim() !== '' && 
  supabaseServiceRoleKey !== supabaseAnonKey
);

// Client for general public/user-authenticated interactions
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

// Admin client for backend operations that need service role (e.g. bypassing RLS if service_role is provided)
export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  hasServiceRoleKey ? supabaseServiceRoleKey : (supabaseAnonKey || 'placeholder-key'),
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Helper to create a user-scoped Supabase client that obeys Row Level Security (RLS)
export const createUserScopedClient = (accessToken) => {
  return createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-anon-key',
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      },
      auth: {
        persistSession: false
      }
    }
  );
};

// Helper that picks the optimal Supabase client:
// - Uses supabaseAdmin if service role key is configured
// - Otherwise falls back to the user's RLS-authenticated client (req.userClient)
export const getDatabaseClient = (req) => {
  if (hasServiceRoleKey) {
    return supabaseAdmin;
  }
  return req?.userClient || supabase;
};
