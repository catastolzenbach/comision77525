const fs = require('fs').promises;
const path = require('path');

class ProductManager {
  constructor() {
    this.path = path.join(__dirname, '../data/products.json');
    this.products = [];
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
    await this.loadProducts();
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      this.products = [];
    }
  }

  async saveProducts() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.error('Error al guardar productos:', error);
      throw error;
    }
  }

  generateId() {
    if (this.products.length === 0) return 1;
    const maxId = Math.max(...this.products.map(product => product.id));
    return maxId + 1;
  }

  async getProducts() {
    await this.loadProducts();
    return this.products;
  }

  async getProductById(id) {
    await this.loadProducts();
    const product = this.products.find(p => p.id === parseInt(id));
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return product;
  }

  async addProduct(productData) {
    await this.loadProducts();
    
    // Validar campos requeridos
    const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
    for (const field of requiredFields) {
      if (!productData[field]) {
        throw new Error(`El campo ${field} es requerido`);
      }
    }

    // Verificar que el código no esté duplicado
    const existingProduct = this.products.find(p => p.code === productData.code);
    if (existingProduct) {
      throw new Error('Ya existe un producto con ese código');
    }

    const newProduct = {
      id: this.generateId(),
      title: productData.title,
      description: productData.description,
      code: productData.code,
      price: Number(productData.price),
      status: productData.status !== undefined ? productData.status : true,
      stock: Number(productData.stock),
      category: productData.category,
      thumbnails: productData.thumbnails || []
    };

    this.products.push(newProduct);
    await this.saveProducts();
    return newProduct;
  }

  async updateProduct(id, updateData) {
    await this.loadProducts();
    
    const productIndex = this.products.findIndex(p => p.id === parseInt(id));
    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }

    // No permitir actualizar el ID
    delete updateData.id;

    // Actualizar solo los campos proporcionados
    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updateData
    };

    await this.saveProducts();
    return this.products[productIndex];
  }

  async deleteProduct(id) {
    await this.loadProducts();
    
    const productIndex = this.products.findIndex(p => p.id === parseInt(id));
    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }

    const deletedProduct = this.products.splice(productIndex, 1)[0];
    await this.saveProducts();
    return deletedProduct;
  }
}

module.exports = ProductManager; 