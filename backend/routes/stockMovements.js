const express = require('express');
const { readTable, writeTable, nextId } = require('../db');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/stock-movements?productId=
router.get('/', protect, (req, res) => {
  let movements = readTable('stockMovements');
  const { productId } = req.query;
  if (productId) movements = movements.filter((m) => m.productId === Number(productId));

  const products = readTable('products');
  const users = readTable('users');

  const enriched = movements
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((m) => ({
      ...m,
      productName: products.find((p) => p.id === m.productId)?.name || 'Unknown product',
      userName: users.find((u) => u.id === m.userId)?.name || 'Unknown user',
    }));

  res.json({ count: enriched.length, movements: enriched });
});

// POST /api/stock-movements  { productId, type: 'in'|'out', quantity, reason }
router.post('/', protect, (req, res) => {
  const { productId, type, quantity, reason } = req.body;

  if (!productId || !['in', 'out'].includes(type) || !quantity || quantity <= 0) {
    return res.status(400).json({ error: 'productId, type (in/out) and a positive quantity are required.' });
  }

  const products = readTable('products');
  const idx = products.findIndex((p) => p.id === Number(productId));
  if (idx === -1) return res.status(404).json({ error: 'Product not found.' });

  if (type === 'out' && products[idx].stock < quantity) {
    return res.status(400).json({ error: `Insufficient stock. Only ${products[idx].stock} left.` });
  }

  products[idx].stock += type === 'in' ? Number(quantity) : -Number(quantity);
  products[idx].updatedAt = new Date().toISOString();
  writeTable('products', products);

  const movements = readTable('stockMovements');
  const newMovement = {
    id: nextId(movements),
    productId: Number(productId),
    type,
    quantity: Number(quantity),
    reason: reason || (type === 'in' ? 'Stock received' : 'Stock removed'),
    userId: req.user.id,
    date: new Date().toISOString(),
  };
  movements.push(newMovement);
  writeTable('stockMovements', movements);

  res.status(201).json({ movement: newMovement, product: products[idx] });
});

module.exports = router;
