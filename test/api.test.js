/**
 * Pruebas básicas para la API REST
 * Ejecutar con: npm test
 */

const request = require('supertest');
const app = require('../src/server');

describe('API REST Tests', () => {
  
  describe('GET /health', () => {
    it('debería retornar el estado del servidor', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('API funcionando correctamente');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.uptime).toBeDefined();
    });
  });

  describe('GET /', () => {
    it('debería retornar información de la API', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('API REST para Flutter');
      expect(response.body.version).toBe('1.0.0');
      expect(response.body.documentation).toBe('/api-docs');
    });
  });

  describe('GET /api/products', () => {
    it('debería retornar lista de productos', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.currentPage).toBe(1);
    });

    it('debería aplicar filtros correctamente', async () => {
      const response = await request(app)
        .get('/api/products?category=Electrónicos&limit=2')
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(response.body.data.length).toBeLessThanOrEqual(2);
    });
  });

  describe('GET /api/products/categories', () => {
    it('debería retornar lista de categorías', async () => {
      const response = await request(app)
        .get('/api/products/categories')
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/products', () => {
    it('debería crear un nuevo producto', async () => {
      const newProduct = {
        name: 'Producto de Prueba',
        description: 'Descripción de prueba',
        price: 99.99,
        category: 'Pruebas',
        stock: 5
      };

      const response = await request(app)
        .post('/api/products')
        .send(newProduct)
        .expect(201);
      
      expect(response.body.status).toBe('success');
      expect(response.body.data.name).toBe(newProduct.name);
      expect(response.body.data.price).toBe(newProduct.price);
      expect(response.body.data.id).toBeDefined();
    });

    it('debería validar datos requeridos', async () => {
      const invalidProduct = {
        name: 'P', // Muy corto
        price: -10 // Precio negativo
      };

      const response = await request(app)
        .post('/api/products')
        .send(invalidProduct)
        .expect(422);
      
      expect(response.body.status).toBe('error');
      expect(response.body.details).toBeDefined();
    });
  });

  describe('GET /api/products/:id', () => {
    let productId;

    beforeAll(async () => {
      // Crear un producto para las pruebas
      const newProduct = {
        name: 'Producto para Pruebas',
        description: 'Descripción',
        price: 199.99,
        category: 'Pruebas',
        stock: 10
      };

      const response = await request(app)
        .post('/api/products')
        .send(newProduct);
      
      productId = response.body.data.id;
    });

    it('debería retornar un producto específico', async () => {
      const response = await request(app)
        .get(`/api/products/${productId}`)
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(response.body.data.id).toBe(productId);
    });

    it('debería retornar 404 para producto inexistente', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app)
        .get(`/api/products/${fakeId}`)
        .expect(404);
      
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Producto no encontrado');
    });
  });

  describe('PUT /api/products/:id', () => {
    let productId;

    beforeAll(async () => {
      // Crear un producto para las pruebas
      const newProduct = {
        name: 'Producto para Actualizar',
        description: 'Descripción original',
        price: 299.99,
        category: 'Pruebas',
        stock: 15
      };

      const response = await request(app)
        .post('/api/products')
        .send(newProduct);
      
      productId = response.body.data.id;
    });

    it('debería actualizar un producto existente', async () => {
      const updateData = {
        name: 'Producto Actualizado',
        price: 399.99,
        stock: 20
      };

      const response = await request(app)
        .put(`/api/products/${productId}`)
        .send(updateData)
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.price).toBe(updateData.price);
      expect(response.body.data.stock).toBe(updateData.stock);
    });
  });

  describe('DELETE /api/products/:id', () => {
    let productId;

    beforeAll(async () => {
      // Crear un producto para las pruebas
      const newProduct = {
        name: 'Producto para Eliminar',
        description: 'Descripción',
        price: 499.99,
        category: 'Pruebas',
        stock: 25
      };

      const response = await request(app)
        .post('/api/products')
        .send(newProduct);
      
      productId = response.body.data.id;
    });

    it('debería eliminar un producto', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .expect(200);
      
      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Producto eliminado exitosamente');
    });

    it('debería retornar 404 al intentar eliminar producto inexistente', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app)
        .delete(`/api/products/${fakeId}`)
        .expect(404);
      
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Producto no encontrado');
    });
  });

  describe('Manejo de errores', () => {
    it('debería retornar 404 para rutas no encontradas', async () => {
      const response = await request(app)
        .get('/api/ruta-inexistente')
        .expect(404);
      
      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Ruta no encontrada');
    });

    it('debería validar formato de UUID', async () => {
      const response = await request(app)
        .get('/api/products/invalid-id')
        .expect(422);
      
      expect(response.body.status).toBe('error');
      expect(response.body.details).toBeDefined();
    });
  });
});

