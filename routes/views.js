const express = require('express');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const productManager = new ProductManager();

// GET / - Vista home con lista de productos
router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('home', {
      title: 'Home - Productos',
      isHome: true,
      products: products
    });
  } catch (error) {
    res.render('home', {
      title: 'Home - Productos',
      isHome: true,
      products: []
    });
  }
});

// GET /realtimeproducts - Vista de productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('realtimeproducts', {
      title: 'Real Time Products',
      isRealTime: true,
      products: products
    });
  } catch (error) {
    res.render('realtimeproducts', {
      title: 'Real Time Products',
      isRealTime: true,
      products: []
    });
  }
});

module.exports = router; 