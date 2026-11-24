import { supabase, createUserScopedClient } from '../config/supabase.js';

/**
 * Authentication middleware to verify Supabase JWT token.
 * Extracts Bearer token from Authorization header and verifies user session.
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Malformed authorization token.'
      });
    }

    // Verify token with Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session. Please log in again.'
      });
    }

    // Attach authenticated user and user-scoped client to request
    req.user = user;
    req.token = token;
    req.userClient = createUserScopedClient(token);

    next();
  } catch (err) {
    console.error('Authentication middleware error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server authentication error'
    });
  }
};
