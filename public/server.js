const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Ensure upload directory exists
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)){
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'inventory_mgmt_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/products', require('./routes/products'));

// Web Page Routes
app.get('/', (req, res) => {
  if (req.session && req.session.userId) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'public/login.html'));
  }
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Inventory_Management_DB';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Inventory Management System connected to MongoDB.');
    app.listen(PORT, () => console.log(`Website live at: http://localhost:${PORT}`));
  })
  .catch(err => console.error('Database connection error:', err));