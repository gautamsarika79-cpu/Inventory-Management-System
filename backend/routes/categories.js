const express = require('express');
const { readTable } = require('../db');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, (req, res) => {
  const categories = readTable('categories');
  const products = readTable('products');
  const enriched = categories.map((c) => ({
    ...c,
    productCount: products.filter((p) => p.category === c.name).length,
  }));
  res.json({ categories: enriched });
});

module.exports = router;
