const express = require('express');
const { readTable, writeTable } = require('../db');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

function publicUser(u) {
  const { passwordHash, ...rest } = u;
  return rest;
}

router.get('/', protect, adminOnly, (req, res) => {
  const users = readTable('users').map(publicUser);
  res.json({ count: users.length, users });
});

router.put('/:id/role', protect, adminOnly, (req, res) => {
  const { role } = req.body;
  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({ error: "role must be 'admin' or 'user'." });
  }

  const users = readTable('users');
  const idx = users.findIndex((u) => u.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'User not found.' });

  users[idx].role = role;
  writeTable('users', users);
  res.json({ user: publicUser(users[idx]) });
});

router.delete('/:id', protect, adminOnly, (req, res) => {
  if (Number(req.params.id) === req.user.id) {
    return res.status(400).json({ error: 'You cannot delete your own account.' });
  }
  const users = readTable('users');
  const idx = users.findIndex((u) => u.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'User not found.' });

  const [removed] = users.splice(idx, 1);
  writeTable('users', users);
  res.json({ deleted: publicUser(removed) });
});

module.exports = router;
