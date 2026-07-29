const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const { isAuthenticated } = require('../middleware/auth');

// GET: List Suppliers
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json({ success: true, data: suppliers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST: Create Supplier
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, error: 'Name, Email, and Phone are required.' });
    }

    const supplier = new Supplier({ name, email, phone });
    await supplier.save();
    res.status(201).json({ success: true, data: supplier });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;