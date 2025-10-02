const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

/**
 * Modelo de Producto para manejo de datos
 */
class Product {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.description = data.description || '';
    this.price = data.price;
    this.category = data.category;
    this.stock = data.stock || 0;
    this.imageUrl = data.imageUrl || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.isActive = data.isActive !== undefined ? data.isActive : true;
  }

  /**
   * Convierte el producto a objeto plano
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      category: this.category,
      stock: this.stock,
      imageUrl: this.imageUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isActive: this.isActive
    };
  }

  /**
   * Actualiza los campos del producto
   */
  update(data) {
    const allowedFields = ['name', 'description', 'price', 'category', 'stock', 'imageUrl', 'isActive'];
    
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        this[field] = data[field];
      }
    });
    
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Valida los datos del producto
   */
  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    if (!this.price || this.price < 0) {
      errors.push('El precio debe ser un número positivo');
    }

    if (!this.category || this.category.trim().length < 2) {
      errors.push('La categoría debe tener al menos 2 caracteres');
    }

    if (this.stock < 0) {
      errors.push('El stock no puede ser negativo');
    }

    if (this.imageUrl && !this.isValidUrl(this.imageUrl)) {
      errors.push('La URL de imagen debe ser válida');
    }

    return errors;
  }

  /**
   * Valida si una URL es válida
   */
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }
}

/**
 * Clase para manejo de persistencia de datos
 */
class ProductRepository {
  constructor() {
    this.dataFile = path.join(__dirname, '../../data/products.json');
    this.products = [];
    this.initializeData();
  }

  /**
   * Inicializa los datos desde el archivo JSON
   */
  async initializeData() {
    try {
      await fs.mkdir(path.dirname(this.dataFile), { recursive: true });
      const data = await fs.readFile(this.dataFile, 'utf8');
      this.products = JSON.parse(data).map(item => new Product(item));
    } catch (error) {
      // Si el archivo no existe, crear datos de ejemplo
      this.products = this.getSampleData();
      await this.saveData();
    }
  }

  /**
   * Obtiene datos de ejemplo para inicializar la base de datos
   */
  getSampleData() {
    const sampleData = [
      {
        id: uuidv4(),
        name: 'Smartphone Samsung Galaxy S23',
        description: 'Teléfono inteligente con pantalla AMOLED de 6.1 pulgadas',
        price: 899.99,
        category: 'Electrónicos',
        stock: 15,
        imageUrl: 'https://example.com/samsung-s23.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      },
      {
        id: uuidv4(),
        name: 'Laptop MacBook Air M2',
        description: 'Laptop ultradelgada con chip M2 de Apple',
        price: 1299.99,
        category: 'Computadoras',
        stock: 8,
        imageUrl: 'https://example.com/macbook-air.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      },
      {
        id: uuidv4(),
        name: 'Auriculares Sony WH-1000XM4',
        description: 'Auriculares inalámbricos con cancelación de ruido',
        price: 349.99,
        category: 'Audio',
        stock: 25,
        imageUrl: 'https://example.com/sony-headphones.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      },
      {
        id: uuidv4(),
        name: 'Smartwatch Apple Watch Series 8',
        description: 'Reloj inteligente con monitoreo de salud avanzado',
        price: 399.99,
        category: 'Wearables',
        stock: 12,
        imageUrl: 'https://example.com/apple-watch.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      },
      {
        id: uuidv4(),
        name: 'Tablet iPad Air',
        description: 'Tablet con pantalla Liquid Retina de 10.9 pulgadas',
        price: 599.99,
        category: 'Tablets',
        stock: 20,
        imageUrl: 'https://example.com/ipad-air.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      }
    ];
    
    // Convertir a instancias de Product
    return sampleData.map(data => new Product(data));
  }

  /**
   * Guarda los datos en el archivo JSON
   */
  async saveData() {
    try {
      const data = this.products.map(product => product.toJSON());
      await fs.writeFile(this.dataFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error al guardar datos:', error);
      throw new Error('Error al guardar los datos');
    }
  }

  /**
   * Obtiene todos los productos
   */
  async getAll() {
    return this.products.filter(product => product.isActive);
  }

  /**
   * Obtiene un producto por ID
   */
  async getById(id) {
    return this.products.find(product => product.id === id && product.isActive);
  }

  /**
   * Crea un nuevo producto
   */
  async create(productData) {
    const product = new Product(productData);
    const errors = product.validate();
    
    if (errors.length > 0) {
      throw new Error(`Errores de validación: ${errors.join(', ')}`);
    }

    this.products.push(product);
    await this.saveData();
    return product;
  }

  /**
   * Actualiza un producto existente
   */
  async update(id, updateData) {
    const product = await this.getById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    product.update(updateData);
    const errors = product.validate();
    
    if (errors.length > 0) {
      throw new Error(`Errores de validación: ${errors.join(', ')}`);
    }

    await this.saveData();
    return product;
  }

  /**
   * Elimina un producto (soft delete)
   */
  async delete(id) {
    const product = await this.getById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    product.isActive = false;
    product.updatedAt = new Date().toISOString();
    await this.saveData();
    return true;
  }

  /**
   * Busca productos con filtros
   */
  async search(filters = {}) {
    let results = await this.getAll();

    // Filtro por categoría
    if (filters.category) {
      results = results.filter(product => 
        product.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    // Filtro por rango de precios
    if (filters.minPrice !== undefined) {
      results = results.filter(product => product.price >= filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      results = results.filter(product => product.price <= filters.maxPrice);
    }

    // Búsqueda por texto
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      results = results.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }

    // Ordenamiento
    if (filters.sortBy) {
      const sortField = filters.sortBy;
      const sortOrder = filters.sortOrder || 'asc';
      
      results.sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        
        if (sortOrder === 'desc') {
          return bVal > aVal ? 1 : -1;
        } else {
          return aVal > bVal ? 1 : -1;
        }
      });
    }

    return results;
  }

  /**
   * Aplica paginación a los resultados
   */
  paginate(results, page = 1, limit = 10) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedResults = results.slice(startIndex, endIndex);
    
    return {
      data: paginatedResults,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(results.length / limit),
        totalItems: results.length,
        itemsPerPage: limit,
        hasNextPage: endIndex < results.length,
        hasPrevPage: page > 1
      }
    };
  }
}

module.exports = { Product, ProductRepository };
