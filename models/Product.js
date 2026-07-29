const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: [true, 'Product name is required'], trim: true },
  description: { type: String, trim: true },
  price:       { type: Number, required: [true, 'Price is required'], min: [0, 'Price cannot be negative'] },
  quantity:    { type: Number, required: [true, 'Quantity is required'], min: [0, 'Quantity cannot be negative'] },
  imageUrl:    { type: String, required: [true, 'Product image is required'] },
  supplier:    { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: [true, 'Supplier is required'] }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);