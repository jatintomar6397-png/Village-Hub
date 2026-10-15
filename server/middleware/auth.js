const jwt = require('jsonwebtoken');
const { supabaseAdmin, isConfigured } = require('../config/supabase');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }

    // 1. If Supabase is configured, verify with Supabase Auth
    if (isConfigured && supabaseAdmin) {
      try {
        const { data: userData, error } = await supabaseAdmin.auth.getUser(token);
        if (!error && userData && userData.user) {
          const user = userData.user;
          // Look up verified role in profiles table
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('role, name')
            .eq('id', user.id)
            .maybeSingle();

          req.user = {
            id: user.id,
            email: user.email,
            role: (profile && profile.role) || 'user',
            name: (profile && profile.name) || user.user_metadata?.name || ''
          };
          return next();
        }
      } catch (sbErr) {
        // Fall through to custom JWT if Supabase verification failed
      }
    }

    // 2. Fallback to standard JWT verification (for local/legacy testing)
    const secret = process.env.JWT_SECRET || 'village_hub_super_secret_jwt_key_2024';
    const decoded = jwt.verify(token, secret);

    req.user = {
      id: decoded.id || decoded._id,
      email: decoded.email,
      role: decoded.role || 'user'
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token invalid or expired'
    });
  }
};

module.exports = auth;
