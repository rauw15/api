const { ProductRepository } = require('../models/Product');

const productRepository = new ProductRepository();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - category
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: ID único del producto
 *         name:
 *           type: string
 *           description: Nombre del producto
 *         description:
 *           type: string
 *           description: Descripción del producto
 *         price:
 *           type: number
 *           format: float
 *           description: Precio del producto
 *         category:
 *           type: string
 *           description: Categoría del producto
 *         stock:
 *           type: integer
 *           description: Cantidad en stock
 *         imageUrl:
 *           type: string
 *           format: uri
 *           description: URL de la imagen del producto
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *         isActive:
 *           type: boolean
 *           description: Estado activo del producto
 *     ApiResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [success, error]
 *         data:
 *           type: object
 *         message:
 *           type: string
 *     PaginationInfo:
 *       type: object
 *       properties:
 *         currentPage:
 *           type: integer
 *         totalPages:
 *           type: integer
 *         totalItems:
 *           type: integer
 *         itemsPerPage:
 *           type: integer
 *         hasNextPage:
 *           type: boolean
 *         hasPrevPage:
 *           type: boolean
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener lista de productos
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Cantidad de elementos por página
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por categoría
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Precio mínimo
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Precio máximo
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Término de búsqueda
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, price, createdAt, updatedAt]
 *         description: Campo para ordenar
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Orden de clasificación
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationInfo'
 *       422:
 *         description: Parámetros de consulta inválidos
 */
const getAllProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      search,
      sortBy,
      sortOrder
    } = req.query;

    // Convertir parámetros numéricos
    const filters = {
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      search,
      sortBy,
      sortOrder
    };

    // Buscar productos con filtros
    const results = await productRepository.search(filters);
    
    // Aplicar paginación
    const paginatedResults = productRepository.paginate(
      results, 
      parseInt(page), 
      parseInt(limit)
    );

    res.json({
      status: 'success',
      data: paginatedResults.data,
      pagination: paginatedResults.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 *       422:
 *         description: ID inválido
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productRepository.getById(id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Producto no encontrado'
      });
    }

    res.json({
      status: 'success',
      data: product.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Smartphone Samsung Galaxy S24"
 *               description:
 *                 type: string
 *                 example: "Teléfono inteligente con pantalla AMOLED"
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 999.99
 *               category:
 *                 type: string
 *                 example: "Electrónicos"
 *               stock:
 *                 type: integer
 *                 example: 10
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       422:
 *         description: Datos de entrada inválidos
 */
const createProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    const product = await productRepository.create(productData);

    res.status(201).json({
      status: 'success',
      data: product.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar un producto existente
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Smartphone Samsung Galaxy S24 Ultra"
 *               description:
 *                 type: string
 *                 example: "Teléfono inteligente premium con pantalla AMOLED"
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 1199.99
 *               category:
 *                 type: string
 *                 example: "Electrónicos"
 *               stock:
 *                 type: integer
 *                 example: 15
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/image-updated.jpg"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 *       422:
 *         description: Datos de entrada inválidos
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const product = await productRepository.update(id, updateData);

    res.json({
      status: 'success',
      data: product.toJSON()
    });
  } catch (error) {
    if (error.message === 'Producto no encontrado') {
      return res.status(404).json({
        status: 'error',
        message: error.message
      });
    }
    next(error);
  }
};

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: "Producto eliminado exitosamente"
 *       404:
 *         description: Producto no encontrado
 *       422:
 *         description: ID inválido
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await productRepository.delete(id);

    res.json({
      status: 'success',
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    if (error.message === 'Producto no encontrado') {
      return res.status(404).json({
        status: 'error',
        message: error.message
      });
    }
    next(error);
  }
};

/**
 * @swagger
 * /api/products/categories:
 *   get:
 *     summary: Obtener lista de categorías disponibles
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Electrónicos", "Computadoras", "Audio", "Wearables", "Tablets"]
 */
const getCategories = async (req, res, next) => {
  try {
    const products = await productRepository.getAll();
    const categories = [...new Set(products.map(product => product.category))];
    
    res.json({
      status: 'success',
      data: categories.sort()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
};

