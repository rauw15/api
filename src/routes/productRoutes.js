const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
} = require('../controllers/productController');
const { productValidations } = require('../middleware/validation');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Operaciones CRUD para productos
 */

/**
 * GET /api/products
 * Obtener lista de productos con filtros y paginación
 */
router.get('/', productValidations.query, getAllProducts);

/**
 * GET /api/products/categories
 * Obtener lista de categorías disponibles
 */
router.get('/categories', getCategories);

/**
 * GET /api/products/:id
 * Obtener un producto específico por ID
 */
router.get('/:id', productValidations.id, getProductById);

/**
 * POST /api/products
 * Crear un nuevo producto
 */
router.post('/', productValidations.create, createProduct);

/**
 * PUT /api/products/:id
 * Actualizar un producto existente
 */
router.put('/:id', productValidations.id, productValidations.update, updateProduct);

/**
 * DELETE /api/products/:id
 * Eliminar un producto (soft delete)
 */
router.delete('/:id', productValidations.id, deleteProduct);

module.exports = router;

