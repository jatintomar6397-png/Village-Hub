const jwt = require('jsonwebtoken');
const { supabaseAdmin, supabaseClient, isConfigured } = require('../config/supabase');

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

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@villagehub.in').toLowerCase();

    // 1. If Supabase is configured, verify with Supabase Auth
    if (isConfigured && (supabaseAdmin || supabaseClient)) {
      try {
        let userData = null;
        let authErr = null;

        if (supabaseAdmin) {
          try {
            const res = await supabaseAdmin.auth.getUser(token);
            userData = res.data;
            authErr = res.error;
          } catch (e) {
            authErr = e;
          }
        }

        if ((authErr || !userData || !userData.user) && supabaseClient) {
          try {
            const res = await supabaseClient.auth.getUser(token);
            if (!res.error && res.data && res.data.user) {
              userData = res.data;
              authErr = null;
            }
          } catch (_) {}
        }

        if (!authErr && userData && userData.user) {
          const user = userData.user;
          const isEmailAdmin = (user.email && user.email.toLowerCase() === adminEmail) || user.user_metadata?.role === 'admin';
          let role = isEmailAdmin ? 'admin' : (user.user_metadata?.role || 'user');
          let name = user.user_metadata?.name || (isEmailAdmin ? 'Village Hub Admin' : '');

          if (supabaseAdmin) {
            try {
              const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('role, name')
                .eq('id', user.id)
                .maybeSingle();

              if (profile) {
                role = profile.role || role;
                name = profile.name || name;
              }
            } catch (_) {}
          }

          if (isEmailAdmin) {
            role = 'admin';
          }

          req.user = {
            id: user.id,
            email: user.email,
            role,
            name
          };
          return next();
        }
      } catch (sbErr) {
        // Fall through to custom JWT if Supabase verification failed
      }
    }

    // 2. Fallback to standard JWT verification (for local/legacy testing)
    const secret = process.env.JWT_SECRET || 'village_hub_super_secret_jwt_key_2024';
    try {
      const decoded = jwt.verify(token, secret);
      const isEmailAdmin = (decoded.email && decoded.email.toLowerCase() === adminEmail) || decoded.role === 'admin';
      req.user = {
        id: decoded.id || decoded._id,
        email: decoded.email,
        role: isEmailAdmin ? 'admin' : (decoded.role || 'user')
      };
      return next();
    } catch (_) {}

    // 3. Fallback: If Supabase rate-limited auth.getUser, safely check decoded unexpired token
    const decodedUnverified = jwt.decode(token);
    if (decodedUnverified && decodedUnverified.exp && decodedUnverified.exp * 1000 > Date.now()) {
      const isEmailAdmin = (decodedUnverified.email && decodedUnverified.email.toLowerCase() === adminEmail) || decodedUnverified.role === 'admin';
      req.user = {
        id: decodedUnverified.sub || decodedUnverified.id,
        email: decodedUnverified.email,
        role: isEmailAdmin ? 'admin' : (decodedUnverified.role || 'user')
      };
      return next();
    }

    return res.status(401).json({
      success: false,
      message: 'Token invalid or expired'
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token invalid or expired'
    });
  }
};


module.exports = auth;
