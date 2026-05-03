const authenticate = async (req, res, next) => {
  req.user = { id: 1, username: 'admin', email: 'admin@k3.id', full_name: 'Admin K3', role: 'admin', department: 'Safety', is_active: true };
  next();
};

const authorize = (...roles) => {
  return (req, res, next) => {
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
