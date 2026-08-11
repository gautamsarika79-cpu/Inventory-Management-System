const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST: Web Login Route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required.' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid username or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid username or password.' });
    }

    req.session.userId = user._id;
    req.session.username = user.username;
    res.json({ success: true, message: 'Welcome to Inventory Management System!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST: Logout Route
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ success: false, error: 'Could not log out.' });
    res.json({ success: true, message: 'Logged out successfully.' });
  });
});

// GET: Session Authentication Check
router.get('/me', (req, res) => {
  if (req.session && req.session.userId) {
    return res.json({ authenticated: true, username: req.session.username });
  }
  res.json({ authenticated: false });
});

module.exports = router;