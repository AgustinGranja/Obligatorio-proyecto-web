const express = require('express');
const Product = require('../models/product.js');
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category, isAvailable: true });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get products by tags
router.get('/tags/:tag', async (req, res) => {
  const { tag } = req.params;
  try {
    const products = await Product.find({ tags: tag, isAvailable: true });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;