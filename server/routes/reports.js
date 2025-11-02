const express = require('express');
const Invoice = require('../models/Invoice');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// Sales report
router.get('/sales', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    const invoices = await Invoice.find(query);
    const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
    const gstCollected = invoices.reduce((sum, inv) => sum + inv.tax, 0);
    res.json({ totalSales, paidInvoices, invoicesCount: invoices.length, gstCollected });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Inventory report
router.get('/inventory', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const products = await Product.find().populate('supplier');
    const lowStock = products.filter(p => p.stock <= p.reorderPoint);
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    res.json({ products, lowStock, totalValue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Top-selling products report
router.get('/top-products', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;
    const query = {};
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    const invoices = await Invoice.find(query).populate('items.product');
    const productSales = {};

    invoices.forEach(invoice => {
      invoice.items.forEach(item => {
        const productId = item.product._id.toString();
        if (!productSales[productId]) {
          productSales[productId] = {
            name: item.product.name,
            totalSold: 0,
            revenue: 0
          };
        }
        productSales[productId].totalSold += item.quantity;
        productSales[productId].revenue += item.quantity * item.price;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);

    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Customer report
router.get('/customers', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const customers = await Customer.find();
    const customerStats = customers.map(customer => ({
      ...customer.toObject(),
      averagePurchase: customer.totalPurchases / (customer.loyaltyPoints / 100 || 1) // Rough estimate
    }));
    res.json(customerStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
