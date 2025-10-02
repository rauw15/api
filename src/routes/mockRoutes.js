const express = require('express');
const router = express.Router();

// Datos simulados de productos
const mockProducts = [
  {
    id: '1',
    name: 'Smartphone Samsung Galaxy S23',
    description: 'Teléfono inteligente con pantalla AMOLED de 6.1 pulgadas',
    price: 899.99,
    category: 'Electrónicos',
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: '2',
    name: 'Laptop MacBook Air M2',
    description: 'Laptop ultradelgada con chip M2 de Apple',
    price: 1299.99,
    category: 'Computadoras',
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: '3',
    name: 'Auriculares Sony WH-1000XM4',
    description: 'Auriculares inalámbricos con cancelación de ruido',
    price: 349.99,
    category: 'Audio',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: '4',
    name: 'Smartwatch Apple Watch Series 8',
    description: 'Reloj inteligente con monitoreo de salud avanzado',
    price: 399.99,
    category: 'Wearables',
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: '5',
    name: 'Tablet iPad Air',
    description: 'Tablet con pantalla Liquid Retina de 10.9 pulgadas',
    price: 599.99,
    category: 'Tablets',
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: '6',
    name: 'Cámara Canon EOS R5',
    description: 'Cámara mirrorless profesional de 45MP',
    price: 3899.99,
    category: 'Fotografía',
    stock: 5,
    imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: '7',
    name: 'Teclado Mecánico Logitech MX Keys',
    description: 'Teclado inalámbrico con retroiluminación',
    price: 99.99,
    category: 'Accesorios',
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: '8',
    name: 'Monitor LG UltraWide 34"',
    description: 'Monitor curvo 4K para gaming y productividad',
    price: 599.99,
    category: 'Monitores',
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  }
];

// GET /api/mock/products - Obtener productos simulados
router.get('/products', (req, res) => {
  const { page = 1, limit = 10, category, search, minPrice, maxPrice } = req.query;
  
  let filteredProducts = [...mockProducts];
  
  // Filtrar por categoría
  if (category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category.toLowerCase().includes(category.toLowerCase())
    );
  }
  
  // Filtrar por búsqueda
  if (search) {
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Filtrar por precio mínimo
  if (minPrice) {
    filteredProducts = filteredProducts.filter(product => 
      product.price >= parseFloat(minPrice)
    );
  }
  
  // Filtrar por precio máximo
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(product => 
      product.price <= parseFloat(maxPrice)
    );
  }
  
  // Paginación
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.json({
    status: 'success',
    data: paginatedProducts,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(filteredProducts.length / limit),
      totalItems: filteredProducts.length,
      itemsPerPage: parseInt(limit),
      hasNextPage: endIndex < filteredProducts.length,
      hasPrevPage: page > 1
    }
  });
});

// GET /api/mock/products/:id - Obtener producto por ID
router.get('/products/:id', (req, res) => {
  const { id } = req.params;
  const product = mockProducts.find(p => p.id === id);
  
  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Producto no encontrado'
    });
  }
  
  res.json({
    status: 'success',
    data: product
  });
});

// GET /api/mock/categories - Obtener categorías
router.get('/categories', (req, res) => {
  const categories = [...new Set(mockProducts.map(product => product.category))];
  
  res.json({
    status: 'success',
    data: categories.sort()
  });
});

// POST /api/mock/products - Crear producto (simulado)
router.post('/products', (req, res) => {
  const { name, description, price, category, stock, imageUrl } = req.body;
  
  const newProduct = {
    id: (mockProducts.length + 1).toString(),
    name,
    description: description || '',
    price: parseFloat(price),
    category,
    stock: parseInt(stock) || 0,
    imageUrl: imageUrl || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  };
  
  mockProducts.push(newProduct);
  
  res.status(201).json({
    status: 'success',
    data: newProduct
  });
});

// PUT /api/mock/products/:id - Actualizar producto (simulado)
router.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const productIndex = mockProducts.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'Producto no encontrado'
    });
  }
  
  const updatedProduct = {
    ...mockProducts[productIndex],
    ...req.body,
    id: id, // Mantener el ID original
    updatedAt: new Date().toISOString()
  };
  
  mockProducts[productIndex] = updatedProduct;
  
  res.json({
    status: 'success',
    data: updatedProduct
  });
});

// DELETE /api/mock/products/:id - Eliminar producto (simulado)
router.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  const productIndex = mockProducts.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'Producto no encontrado'
    });
  }
  
  mockProducts.splice(productIndex, 1);
  
  res.json({
    status: 'success',
    message: 'Producto eliminado exitosamente'
  });
});

module.exports = router;
