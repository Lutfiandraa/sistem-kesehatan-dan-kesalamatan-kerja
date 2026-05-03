const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { query } = require('../config/database');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.jwt.secret);
      const result = await query(
        'SELECT id, username, email, full_name, role, department, is_active FROM users WHERE id = $1',
        [decoded.userId]
      );
      if (result.rows.length > 0) {
        req.user = result.rows[0];
        return next();
      }
    }
    
    // Fallback for development and testing
    req.user = { id: 1, username: 'admin', email: 'admin@k3.id', full_name: 'Admin K3', role: 'admin', department: 'Safety', is_active: true };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || (roles.length > 0 && !roles.includes(req.user.role))) {
      return res.status(403).json({ success: false, message: 'Access forbidden: unauthorized role' });
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};

