const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const viewsRouter = require('./routes/views');
const path = require('path');
const ProductManager = require('./managers/ProductManager');

const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = 8080;

// Configurar Handlebars con helpers personalizados
app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    // Helper para comparaciones de igualdad
    eq: function(a, b) {
      return a === b;
    },
    // Helper para comparaciones de desigualdad
    ne: function(a, b) {
      return a !== b;
    },
    // Helper para comparaciones mayor que
    gt: function(a, b) {
      return a > b;
    },
    // Helper para comparaciones menor que
    lt: function(a, b) {
      return a < b;
    },
    // Helper para formatear precios
    formatPrice: function(price) {
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
      }).format(price);
    }
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Socket.io events
const productManager = new ProductManager();

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Agregar producto
  socket.on('addProduct', async (productData) => {
    try {
      const newProduct = await productManager.addProduct(productData);
      io.emit('productAdded', newProduct);
    } catch (error) {
      socket.emit('productError', error.message);
    }
  });

  // Eliminar producto
  socket.on('deleteProduct', async (productId) => {
    try {
      await productManager.deleteProduct(productId);
      io.emit('productDeleted', productId);
    } catch (error) {
      socket.emit('productError', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:8080`);
});
