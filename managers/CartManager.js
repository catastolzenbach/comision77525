const fs = require('fs').promises;
const path = require('path');

class CartManager {
  constructor() {
    this.path = path.join(__dirname, '../data/carts.json');
    this.carts = [];
    this.initializeFile();
  }

  async initializeFile() {
    try {
      await fs.access(this.path);
    } catch (error) {
      // Si el archivo no existe, crear el directorio y el archivo
      await fs.mkdir(path.dirname(this.path), { recursive: true });
      await fs.writeFile(this.path, JSON.stringify([], null, 2));
    }
    await this.loadCarts();
  }

  async loadCarts() {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      this.carts = JSON.parse(data);
    } catch (error) {
      console.error('Error al cargar carritos:', error);
      this.carts = [];
    }
  }

  async saveCarts() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    } catch (error) {
      console.error('Error al guardar carritos:', error);
      throw error;
    }
  }

  generateId() {
    if (this.carts.length === 0) return 1;
    const maxId = Math.max(...this.carts.map(cart => cart.id));
    return maxId + 1;
  }

  async createCart() {
    await this.loadCarts();
    
    const newCart = {
      id: this.generateId(),
      products: []
    };

    this.carts.push(newCart);
    await this.saveCarts();
    return newCart;
  }

  async getCartById(id) {
    await this.loadCarts();
    const cart = this.carts.find(c => c.id === parseInt(id));
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }
    return cart;
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    await this.loadCarts();
    
    const cartIndex = this.carts.findIndex(c => c.id === parseInt(cartId));
    if (cartIndex === -1) {
      throw new Error('Carrito no encontrado');
    }

    const cart = this.carts[cartIndex];
    
    // Buscar si el producto ya existe en el carrito
    const existingProductIndex = cart.products.findIndex(p => p.product === parseInt(productId));
    
    if (existingProductIndex !== -1) {
      // Si el producto ya existe, incrementar la cantidad
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // Si el producto no existe, agregarlo
      cart.products.push({
        product: parseInt(productId),
        quantity: quantity
      });
    }

    await this.saveCarts();
    return cart;
  }

  async removeProductFromCart(cartId, productId) {
    await this.loadCarts();
    
    const cartIndex = this.carts.findIndex(c => c.id === parseInt(cartId));
    if (cartIndex === -1) {
      throw new Error('Carrito no encontrado');
    }

    const cart = this.carts[cartIndex];
    const productIndex = cart.products.findIndex(p => p.product === parseInt(productId));
    
    if (productIndex === -1) {
      throw new Error('Producto no encontrado en el carrito');
    }

    cart.products.splice(productIndex, 1);
    await this.saveCarts();
    return cart;
  }

  async updateProductQuantity(cartId, productId, quantity) {
    await this.loadCarts();
    
    const cartIndex = this.carts.findIndex(c => c.id === parseInt(cartId));
    if (cartIndex === -1) {
      throw new Error('Carrito no encontrado');
    }

    const cart = this.carts[cartIndex];
    const productIndex = cart.products.findIndex(p => p.product === parseInt(productId));
    
    if (productIndex === -1) {
      throw new Error('Producto no encontrado en el carrito');
    }

    if (quantity <= 0) {
      // Si la cantidad es 0 o menor, eliminar el producto
      cart.products.splice(productIndex, 1);
    } else {
      // Actualizar la cantidad
      cart.products[productIndex].quantity = quantity;
    }

    await this.saveCarts();
    return cart;
  }

  async clearCart(cartId) {
    await this.loadCarts();
    
    const cartIndex = this.carts.findIndex(c => c.id === parseInt(cartId));
    if (cartIndex === -1) {
      throw new Error('Carrito no encontrado');
    }

    this.carts[cartIndex].products = [];
    await this.saveCarts();
    return this.carts[cartIndex];
  }

  async deleteCart(cartId) {
    await this.loadCarts();
    
    const cartIndex = this.carts.findIndex(c => c.id === parseInt(cartId));
    if (cartIndex === -1) {
      throw new Error('Carrito no encontrado');
    }

    const deletedCart = this.carts.splice(cartIndex, 1)[0];
    await this.saveCarts();
    return deletedCart;
  }
}

module.exports = CartManager; 