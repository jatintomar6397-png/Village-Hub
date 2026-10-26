const admin = (req, res, next) => {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@villagehub.in').toLowerCase();
  const isAdmin = req.user && (req.user.role === 'admin' || (req.user.email && req.user.email.toLowerCase() === adminEmail));
  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

module.exports = admin;
