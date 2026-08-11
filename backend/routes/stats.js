const express = require('express');
const { readTable } = require('../db');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', protect, (req, res) => {
  const products = readTable('products');
  const suppliers = readTable('suppliers');
  const users = readTable('users');
  const movements = readTable('stockMovements');

  const totalStockValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockProducts = products.filter((p) => p.stock <= p.lowStockThreshold);

  const byCategory = {};
  products.forEach((p) => {
    byCategory[p.category] = (byCategory[p.category] || 0) + 1;
  });

  const recentMovements = [...movements]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8)
    .map((m) => ({
      ...m,
      productName: products.find((p) => p.id === m.productId)?.name || 'Unknown',
    }));

  res.json({
    totals: {
      products: products.length,
      suppliers: suppliers.length,
      users: users.length,
      totalUnits,
      totalStockValue: Math.round(totalStockValue * 100) / 100,
      lowStockCount: lowStockProducts.length,
    },
    lowStockProducts,
    byCategory,
    recentMovements,
  });
});

module.exports = router;
