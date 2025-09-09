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
      products: products.slice(0, 10) // Mostrar solo los primeros 10
    });
  } catch (error) {
    res.render('home', {
      title: 'Home - Productos',
      isHome: true,
      products: []
    });
  }
});

// GET /products - Vista de productos con paginación
router.get('/products', async (req, res) => {
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

    const hasPrevPage = pageNum > 1;
    const hasNextPage = pageNum < totalPages;
    const prevPage = hasPrevPage ? pageNum - 1 : null;
    const nextPage = hasNextPage ? pageNum + 1 : null;

    res.render('products', {
      title: 'Productos',
      isProducts: true,
      products: paginatedProducts,
      pagination: {
        totalPages,
        prevPage,
        nextPage,
        page: pageNum,
        hasPrevPage,
        hasNextPage,
        limit: limitNum,
        sort,
        query
      }
    });
  } catch (error) {
    res.render('products', {
      title: 'Productos',
      isProducts: true,
      products: [],
      pagination: {
        totalPages: 0,
        prevPage: null,
        nextPage: null,
        page: 1,
        hasPrevPage: false,
        hasNextPage: false,
        limit: 10,
        sort: null,
        query: null
      }
    });
  }
});

// GET /products/:pid - Vista de producto individual
router.get('/products/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    
    res.render('product-detail', {
      title: product.title,
      isProductDetail: true,
      product: product
    });
  } catch (error) {
    res.status(404).render('error', {
      title: 'Producto no encontrado',
      message: 'El producto que buscas no existe'
    });
  }
});

// GET /carts/:cid - Vista de carrito específico
router.get('/carts/:cid', async (req, res) => {
  try {
    const CartManager = require('../managers/CartManager');
    const cartManager = new CartManager();
    const cart = await cartManager.getCartById(req.params.cid);
    
    // Obtener información completa de los productos
    const productsWithDetails = [];
    
    for (const cartProduct of cart.products) {
      try {
        const product = await productManager.getProductById(cartProduct.product);
        productsWithDetails.push({
          product: product,
          quantity: cartProduct.quantity
        });
      } catch (error) {
        productsWithDetails.push({
          product: {
            _id: cartProduct.product,
            title: 'Producto no encontrado',
            description: 'Este producto ya no está disponible',
            price: 0,
            status: false
          },
          quantity: cartProduct.quantity
        });
      }
    }
    
    res.render('cart', {
      title: `Carrito ${cart.id}`,
      isCart: true,
      cart: {
        _id: cart.id,
        products: productsWithDetails
      }
    });
  } catch (error) {
    res.status(404).render('error', {
      title: 'Carrito no encontrado',
      message: 'El carrito que buscas no existe'
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
      products: products.slice(0, 10)
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
