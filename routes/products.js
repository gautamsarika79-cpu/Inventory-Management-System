const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const upload = require('../middleware/upload');
const { isAuthenticated } = require('../middleware/auth');

// GET: Products List with Search and Supplier Filter
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const { search, supplierId } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (supplierId) {
      query.supplier = supplierId;
    }

    const products = await Product.find(query).populate('supplier', 'name email phone');
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET: Single Product View Details
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('supplier', 'name email phone');
    if (!product) return res.status(404).json({ success: false, error: 'Product not found.' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST: Create Product with Multipart File Upload
router.post('/', isAuthenticated, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, quantity, supplier } = req.body;

    if (!name || price === undefined || quantity === undefined || !supplier) {
      return res.status(400).json({ success: false, error: 'Please complete all required fields.' });
    }
    if (Number(price) < 0 || Number(quantity) < 0) {
      return res.status(400).json({ success: false, error: 'Price and Quantity cannot be negative numbers.' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a real image file from your computer.' });
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      quantity: Number(quantity),
      supplier,
      imageUrl: `/uploads/${req.file.filename}`
    });

    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;