const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const puntosRoutes = require('./routes/puntos');

require('dotenv').config();

const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/puntos', puntosRoutes);

//Esto de aqui esta dando problema , eliminar pipi
// app.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Ruta no encontrada'
//   });
// });

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 API Reciclaje funcionando!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Ruta para probar conexión a DB
app.get('/health', async (req, res) => {
  const dbConnection = await testConnection();
  res.json({
    status: 'OK',
    database: dbConnection ? 'Conectada' : 'Desconectada',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
const startServer = async () => {
  try {
    // Probar conexión a DB antes de iniciar
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;