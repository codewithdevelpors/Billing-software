const express = require('express');
const Customer = require('../models/Customer');
const Invoice = require('../models/Invoice');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get customer loyalty info
router.get('/customer/:id', authenticateToken, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json({
      loyaltyPoints: customer.loyaltyPoints,
      totalPurchases: customer.totalPurchases
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Redeem loyalty points
router.post('/redeem', authenticateToken, async (req, res) => {
  try {
    const { customerId, pointsToRedeem, invoiceId } = req.body;
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    if (customer.loyaltyPoints < pointsToRedeem) {
      return res.status(400).json({ message: 'Insufficient loyalty points' });
    }

    customer.loyaltyPoints -= pointsToRedeem;
    await customer.save();

    // Update invoice with points used
    const invoice = await Invoice.findById(invoiceId);
    if (invoice) {
      invoice.loyaltyPointsUsed = pointsToRedeem;
      await invoice.save();
    }

    res.json({ message: 'Points redeemed successfully', remainingPoints: customer.loyaltyPoints });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Earn loyalty points (called after successful payment)
router.post('/earn', authenticateToken, async (req, res) => {
  try {
    const { customerId, amountSpent } = req.body;
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const pointsEarned = Math.floor(amountSpent / 100); // 1 point per 100 rupees
    customer.loyaltyPoints += pointsEarned;
    customer.totalPurchases += amountSpent;
    await customer.save();

    res.json({ message: 'Points earned successfully', pointsEarned, totalPoints: customer.loyaltyPoints });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
