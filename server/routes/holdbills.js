const express = require('express');
const Invoice = require('../models/Invoice');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all held bills
router.get('/', authenticateToken, async (req, res) => {
  try {
    const heldBills = await Invoice.find({ status: 'held' }).populate('customer');
    res.json(heldBills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Hold a bill
router.post('/hold/:id', authenticateToken, async (req, res) => {
  try {
    const { holdReason } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, { status: 'held', holdReason }, { new: true });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Recall a held bill
router.post('/recall/:id', authenticateToken, async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, { status: 'unpaid', holdReason: null }, { new: true });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
