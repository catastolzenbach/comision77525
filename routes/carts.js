const express = require('express');
const CartManager = require('../managers/CartManager');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

// POST / - Crear nuevo carrito
router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({
      status: 'success',
      data: newCart
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET /:cid - Obtener carrito por ID
router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    
    res.json({
      status: 'success',
      data: cart
    });
  } catch (error) {
    if (error.message === 'Carrito no encontrado') {
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

// POST /:cid/product/:pid - Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const quantity = req.body.quantity || 1;
    
    // Verificar que el producto existe
    await productManager.getProductById(pid);
    
    // Agregar producto al carrito
    const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);
    
    res.json({
      status: 'success',
      data: updatedCart,
      message: 'Producto agregado al carrito correctamente'
    });
  } catch (error) {
    if (error.message === 'Carrito no encontrado') {
      res.status(404).json({
        status: 'error',
        message: error.message
      });
    } else if (error.message === 'Producto no encontrado') {
      res.status(404).json({
        status: 'error',
        message: 'El producto que intentas agregar no existe'
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
});

// PUT /:cid/product/:pid - Actualizar cantidad de producto en el carrito
router.put('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    
    if (quantity === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'La cantidad es requerida'
      });
    }
    
    const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
    
    res.json({
      status: 'success',
      data: updatedCart,
      message: 'Cantidad actualizada correctamente'
    });
  } catch (error) {
    if (error.message === 'Carrito no encontrado' || error.message === 'Producto no encontrado en el carrito') {
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

// DELETE /:cid/product/:pid - Eliminar producto del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    
    const updatedCart = await cartManager.removeProductFromCart(cid, pid);
    
    res.json({
      status: 'success',
      data: updatedCart,
      message: 'Producto eliminado del carrito correctamente'
    });
  } catch (error) {
    if (error.message === 'Carrito no encontrado' || error.message === 'Producto no encontrado en el carrito') {
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

// DELETE /:cid - Vaciar carrito
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    
    const updatedCart = await cartManager.clearCart(cid);
    
    res.json({
      status: 'success',
      data: updatedCart,
      message: 'Carrito vaciado correctamente'
    });
  } catch (error) {
    if (error.message === 'Carrito no encontrado') {
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