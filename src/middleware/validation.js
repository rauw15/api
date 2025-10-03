const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware para validar los resultados de express-validator
 */
const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 'error',
      message: 'Datos de entrada inválidos',
      details: errors.array()
    });
  }
  next();
};

/**
 * Validaciones para productos
 */
const productValidations = {
  // Validación para crear producto
  create: [
    body('name')
      .notEmpty()
      .withMessage('El nombre es requerido')
      .isLength({ min: 2, max: 100 })
      .withMessage('El nombre debe tener entre 2 y 100 caracteres')
      .trim(),
    
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('La descripción no puede exceder 500 caracteres')
      .trim(),
    
    body('price')
      .isFloat({ min: 0 })
      .withMessage('El precio debe ser un número positivo')
      .toFloat(),
    
    body('category')
      .notEmpty()
      .withMessage('La categoría es requerida')
      .isLength({ min: 2, max: 50 })
      .withMessage('La categoría debe tener entre 2 y 50 caracteres')
      .trim(),
    
    body('stock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('El stock debe ser un número entero positivo')
      .toInt(),
    
    body('imageUrl')
      .optional()
      .custom((value) => {
        if (!value || value.trim() === '') {
          return true; // Permitir valores vacíos
        }
        try {
          new URL(value);
          return true;
        } catch {
          return false; // Solo rechazar si no es una URL válida
        }
      })
      .withMessage('La URL de imagen debe ser válida'),
    
    validateResults
  ],

  // Validación para actualizar producto
  update: [
    body('name')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('El nombre debe tener entre 2 y 100 caracteres')
      .trim(),
    
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('La descripción no puede exceder 500 caracteres')
      .trim(),
    
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('El precio debe ser un número positivo')
      .toFloat(),
    
    body('category')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('La categoría debe tener entre 2 y 50 caracteres')
      .trim(),
    
    body('stock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('El stock debe ser un número entero positivo')
      .toInt(),
    
    body('imageUrl')
      .optional()
      .custom((value) => {
        if (!value || value.trim() === '') {
          return true; // Permitir valores vacíos
        }
        try {
          new URL(value);
          return true;
        } catch {
          return false; // Solo rechazar si no es una URL válida
        }
      })
      .withMessage('La URL de imagen debe ser válida'),
    
    validateResults
  ],

  // Validación para ID de producto
  id: [
    param('id')
      .isUUID()
      .withMessage('ID de producto inválido'),
    
    validateResults
  ],

  // Validación para parámetros de consulta
  query: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('La página debe ser un número entero positivo')
      .toInt(),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('El límite debe ser entre 1 y 100')
      .toInt(),
    
    query('category')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('La categoría debe tener entre 2 y 50 caracteres')
      .trim(),
    
    query('minPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('El precio mínimo debe ser un número positivo')
      .toFloat(),
    
    query('maxPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('El precio máximo debe ser un número positivo')
      .toFloat(),
    
    query('search')
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage('El término de búsqueda debe tener entre 1 y 100 caracteres')
      .trim(),
    
    validateResults
  ]
};

module.exports = {
  validateResults,
  productValidations
};

