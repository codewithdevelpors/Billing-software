const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  category: { type: String },
  barcode: { type: String, unique: true },
  reorderPoint: { type: Number, default: 10 },
  gstRate: { type: Number, default: 18 }, // GST rate for the product
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  variants: [{ type: String }], // e.g., sizes, colors
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
