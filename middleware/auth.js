const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ success: false, error: 'Unauthorized access. Please log in.' });
};

module.exports = { isAuthenticated };