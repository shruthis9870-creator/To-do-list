import { supabase, supabaseAdmin, hasServiceRoleKey, createUserScopedClient } from '../config/supabase.js';

/**
 * Register a new user with Supabase Auth and initialize user profile
 */
export const register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    // Validation
    if (!full_name || full_name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid full name (at least 2 characters).'
      });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Register user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: full_name.trim()
        }
      }
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Registration failed. Please check your details.'
      });
    }

    if (!data.user) {
      return res.status(400).json({
        success: false,
        message: 'Unable to create user account. Please try again.'
      });
    }

    // Upsert into public.profiles
    // If the database trigger on_auth_user_created ran, it's already there;
    // this ensures it exists if the trigger was not yet added.
    try {
      const client = hasServiceRoleKey 
        ? supabaseAdmin 
        : (data.session?.access_token ? createUserScopedClient(data.session.access_token) : null);

      if (client) {
        await client
          .from('profiles')
          .upsert({
            id: data.user.id,
            full_name: full_name.trim(),
            created_at: new Date().toISOString()
          }, { onConflict: 'id' });
      }
    } catch (profileErr) {
      console.warn('Profile sync notice:', profileErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: full_name.trim()
      },
      session: data.session
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      success: false,
      message: 'An unexpected server error occurred during registration.'
    });
  }
};

/**
 * Log in an existing user with email and password
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Both email and password are required.'
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });

    if (error || !data.user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please try again.'
      });
    }

    // Retrieve profile
    let fullName = data.user.user_metadata?.full_name || data.user.email.split('@')[0];

    try {
      const client = hasServiceRoleKey
        ? supabaseAdmin
        : (data.session?.access_token ? createUserScopedClient(data.session.access_token) : null);

      if (client) {
        const { data: profile } = await client
          .from('profiles')
          .select('full_name, created_at')
          .eq('id', data.user.id)
          .single();

        if (profile?.full_name) {
          fullName = profile.full_name;
        }
      }
    } catch {
      // Fallback to user_metadata
    }

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: fullName
      },
      session: data.session
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'An unexpected server error occurred during login.'
    });
  }
};

/**
 * Log out user
 */
export const logout = async (req, res) => {
  try {
    if (req.token) {
      await supabase.auth.admin?.signOut?.(req.token).catch(() => {});
    }

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({
      success: false,
      message: 'Error during logout.'
    });
  }
};

/**
 * Get currently authenticated user profile
 */
export const getMe = async (req, res) => {
  try {
    let fullName = req.user.user_metadata?.full_name || req.user.email.split('@')[0];

    try {
      const client = hasServiceRoleKey ? supabaseAdmin : (req.userClient || supabase);
      const { data: profile } = await client
        .from('profiles')
        .select('*')
        .eq('id', req.user.id)
        .single();

      if (profile?.full_name) {
        fullName = profile.full_name;
      }
    } catch {
      // Fallback
    }

    return res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        full_name: fullName
      }
    });
  } catch (err) {
    console.error('GetMe error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile.'
    });
  }
};
