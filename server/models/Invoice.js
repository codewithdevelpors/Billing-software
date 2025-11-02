const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 }
});

const paymentSchema = new mongoose.Schema({
  method: { type: String, enum: ['cash', 'card', 'digital', 'credit'], required: true },
  amount: { type: Number, required: true },
  reference: { type: String }
});

const invoiceSchema = new mongoose.Schema({
  client: { type: String, required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  date: { type: Date, required: true },
  items: [itemSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  gstRate: { type: Number, default: 18 }, // GST rate in percentage
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, enum: ['paid', 'unpaid', 'held', 'cancelled'], default: 'unpaid' },
  paymentMethod: { type: String, enum: ['cash', 'card', 'digital'], default: 'cash' },
  payments: [paymentSchema], // For split payments
  holdReason: { type: String }, // For held bills
  loyaltyPointsUsed: { type: Number, default: 0 },
  loyaltyPointsEarned: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
