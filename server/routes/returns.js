const express = require('express');
const Return = require('../models/Return');
const Invoice = require('../models/Invoice');
const Product = require('../models/Product');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all returns
router.get('/', authenticateToken, async (req, res) => {
  try {
    const returns = await Return.find().populate('originalInvoice customer processedBy');
    res.json(returns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get return by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const returnDoc = await Return.findById(req.params.id).populate('originalInvoice customer processedBy');
    if (!returnDoc) return res.status(404).json({ message: 'Return not found' });
    res.json(returnDoc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create return
router.post('/', authenticateToken, async (req, res) => {
  try {
    const returnDoc = new Return(req.body);
    // Update product stock on return
    for (const item of returnDoc.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }
    await returnDoc.save();
    res.status(201).json(returnDoc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update return status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const returnDoc = await Return.findByIdAndUpdate(req.params.id, { status, processedBy: req.user.id }, { new: true });
    if (!returnDoc) return res.status(404).json({ message: 'Return not found' });
    res.json(returnDoc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete return
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const returnDoc = await Return.findByIdAndDelete(req.params.id);
    if (!returnDoc) return res.status(404).json({ message: 'Return not found' });
    res.json({ message: 'Return deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
