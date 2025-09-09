const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Usar MongoDB Atlas o local según variable de entorno
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://catastolzenbach:password123@cluster0.mongodb.net/comision77525?retryWrites=true&w=majority';
    
    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    console.log('Usando modo fallback sin base de datos...');
    // No salir del proceso, continuar sin MongoDB
  }
};

module.exports = connectDB;
