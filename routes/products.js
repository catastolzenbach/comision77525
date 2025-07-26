const express = require('express');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const productManager = new ProductManager();

// GET / - Listar todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json({
      status: 'success',
      data: products
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET /:pid - Obtener producto por ID
router.get('/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    res.json({
      status: 'success',
      data: product
    });
  } catch (error) {
    if (error.message === 'Producto no encontrado') {
      res.status(404).json({
        status: 'error',
        message: error.message
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
});

// POST / - Agregar nuevo producto
router.post('/', async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json({
      status: 'success',
      data: newProduct
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// PUT /:pid - Actualizar producto
router.put('/:pid', async (req, res) => {
  try {
    const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
    res.json({
      status: 'success',
      data: updatedProduct
    });
  } catch (error) {
    if (error.message === 'Producto no encontrado') {
      res.status(404).json({
        status: 'error',
        message: error.message
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }
});

// DELETE /:pid - Eliminar producto
router.delete('/:pid', async (req, res) => {
  try {
    const deletedProduct = await productManager.deleteProduct(req.params.pid);
    res.json({
      status: 'success',
      data: deletedProduct,
      message: 'Producto eliminado correctamente'
    });
  } catch (error) {
    if (error.message === 'Producto no encontrado') {
      res.status(404).json({
        status: 'error',
        message: error.message
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
});

module.exports = router; 