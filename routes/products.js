const express = require('express');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const productManager = new ProductManager();

// GET / - Listar productos con paginación, filtros y ordenamiento
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    
    // Obtener todos los productos
    let products = await productManager.getProducts();
    
    // Aplicar filtros
    if (query) {
      if (query === 'available') {
        products = products.filter(p => p.status === true && p.stock > 0);
      } else if (query === 'unavailable') {
        products = products.filter(p => p.status === false || p.stock === 0);
      } else {
        products = products.filter(p => 
          p.category.toLowerCase().includes(query.toLowerCase())
        );
      }
    }

    // Aplicar ordenamiento
    if (sort === 'asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'desc') {
      products.sort((a, b) => b.price - a.price);
    }

    // Calcular paginación
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const totalDocs = products.length;
    const totalPages = Math.ceil(totalDocs / limitNum);
    const skip = (pageNum - 1) * limitNum;
    
    // Aplicar paginación
    const paginatedProducts = products.slice(skip, skip + limitNum);

    // Calcular páginas anterior y siguiente
    const hasPrevPage = pageNum > 1;
    const hasNextPage = pageNum < totalPages;
    const prevPage = hasPrevPage ? pageNum - 1 : null;
    const nextPage = hasNextPage ? pageNum + 1 : null;

    // Construir URLs
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    
    const prevLink = hasPrevPage ? 
      `${baseUrl}?${new URLSearchParams({...req.query, page: prevPage}).toString()}` : 
      null;
    
    const nextLink = hasNextPage ? 
      `${baseUrl}?${new URLSearchParams({...req.query, page: nextPage}).toString()}` : 
      null;

    res.json({
      status: 'success',
      payload: paginatedProducts,
      totalPages,
      prevPage,
      nextPage,
      page: pageNum,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink
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
