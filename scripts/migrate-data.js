const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

const connectDB = require('../config/database');

async function migrateData() {
  try {
    // Conectar a MongoDB
    await connectDB();
    
    // Leer datos existentes de JSON
    const productsPath = path.join(__dirname, '../data/products.json');
    const cartsPath = path.join(__dirname, '../data/carts.json');
    
    let productsData = [];
    let cartsData = [];
    
    try {
      const productsJson = await fs.readFile(productsPath, 'utf8');
      productsData = JSON.parse(productsJson);
    } catch (error) {
      console.log('No se encontró archivo products.json');
    }
    
    try {
      const cartsJson = await fs.readFile(cartsPath, 'utf8');
      cartsData = JSON.parse(cartsJson);
    } catch (error) {
      console.log('No se encontró archivo carts.json');
    }
    
    // Limpiar colecciones existentes
    await Product.deleteMany({});
    await Cart.deleteMany({});
    
    // Migrar productos
    if (productsData.length > 0) {
      console.log(`Migrando ${productsData.length} productos...`);
      for (const product of productsData) {
        const { id, ...productData } = product;
        await Product.create(productData);
      }
      console.log('Productos migrados exitosamente');
    }
    
    // Migrar carritos
    if (cartsData.length > 0) {
      console.log(`Migrando ${cartsData.length} carritos...`);
      for (const cart of cartsData) {
        const { id, ...cartData } = cart;
        await Cart.create(cartData);
      }
      console.log('Carritos migrados exitosamente');
    }
    
    console.log('Migración completada');
    process.exit(0);
  } catch (error) {
    console.error('Error en la migración:', error);
    process.exit(1);
  }
}

migrateData();
