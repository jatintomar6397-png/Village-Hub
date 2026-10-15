const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
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

    const secret = process.env.JWT_SECRET || 'village_hub_super_secret_jwt_key_2024';
    const decoded = jwt.verify(token, secret);

    req.user = {
      id: decoded.id || decoded._id,
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
