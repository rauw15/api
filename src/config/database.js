/**
 * Configuración de la base de datos
 * En este caso usamos almacenamiento JSON local
 */

const path = require('path');

const config = {
  // Configuración para almacenamiento JSON
  json: {
    dataDir: path.join(__dirname, '../../data'),
    productsFile: 'products.json'
  },
  
  // Configuración para futuras implementaciones con base de datos real
  database: {
    // SQLite
    sqlite: {
      filename: path.join(__dirname, '../../data/database.sqlite')
    },
    
    // MongoDB
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/api_flutter',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    },
    
    // PostgreSQL
    postgresql: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'api_flutter',
      username: process.env.DB_USER || 'username',
      password: process.env.DB_PASSWORD || 'password'
    }
  }
};

module.exports = config;

