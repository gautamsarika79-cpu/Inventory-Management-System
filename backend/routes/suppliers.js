const express = require('express');
const { readTable, writeTable, nextId } = require('../db');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, (req, res) => {
  const suppliers = readTable('suppliers');
  const products = readTable('products');
  const enriched = suppliers.map((s) => ({
    ...s,
    productCount: products.filter((p) => p.supplierId === s.id).length,
  }));
  res.json({ count: enriched.length, suppliers: enriched });
});

router.get('/:id', protect, (req, res) => {
  const suppliers = readTable('suppliers');
  const supplier = suppliers.find((s) => s.id === Number(req.params.id));
  if (!supplier) return res.status(404).json({ error: 'Supplier not found.' });

  const products = readTable('products').filter((p) => p.supplierId === supplier.id);
  res.json({ supplier, products });
});

router.post('/', protect, (req, res) => {
  const { name, contactPerson, email, phone, address, country } = req.body;
  if (!name) return res.status(400).json({ error: 'Supplier name is required.' });

  const suppliers = readTable('suppliers');
  const newSupplier = {
    id: nextId(suppliers),
    name,
    contactPerson: contactPerson || '',
    email: email || '',
    phone: phone || '',
    address: address || '',
    country: country || '',
    createdAt: new Date().toISOString(),
  };
  suppliers.push(newSupplier);
  writeTable('suppliers', suppliers);
  res.status(201).json({ supplier: newSupplier });
});

router.put('/:id', protect, (req, res) => {
  const suppliers = readTable('suppliers');
  const idx = suppliers.findIndex((s) => s.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Supplier not found.' });

  const updatable = ['name', 'contactPerson', 'email', 'phone', 'address', 'country'];
  updatable.forEach((f) => {
    if (req.body[f] !== undefined) suppliers[idx][f] = req.body[f];
  });

  writeTable('suppliers', suppliers);
  res.json({ supplier: suppliers[idx] });
});

router.delete('/:id', protect, adminOnly, (req, res) => {
  const suppliers = readTable('suppliers');
  const idx = suppliers.findIndex((s) => s.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Supplier not found.' });

  const [removed] = suppliers.splice(idx, 1);
  writeTable('suppliers', suppliers);
  res.json({ deleted: removed });
});

module.exports = router;
