/**
 * Utilidades para respuestas estandarizadas de la API
 */

/**
 * Crea una respuesta exitosa
 * @param {Object} res - Response object de Express
 * @param {*} data - Datos a enviar
 * @param {string} message - Mensaje opcional
 * @param {number} statusCode - Código de estado HTTP
 */
const successResponse = (res, data, message = null, statusCode = 200) => {
  const response = {
    status: 'success',
    data
  };

  if (message) {
    response.message = message;
  }

  return res.status(statusCode).json(response);
};

/**
 * Crea una respuesta de error
 * @param {Object} res - Response object de Express
 * @param {string} message - Mensaje de error
 * @param {number} statusCode - Código de estado HTTP
 * @param {*} details - Detalles adicionales del error
 */
const errorResponse = (res, message, statusCode = 500, details = null) => {
  const response = {
    status: 'error',
    message
  };

  if (details) {
    response.details = details;
  }

  return res.status(statusCode).json(response);
};

/**
 * Crea una respuesta con paginación
 * @param {Object} res - Response object de Express
 * @param {Array} data - Datos paginados
 * @param {Object} pagination - Información de paginación
 * @param {number} statusCode - Código de estado HTTP
 */
const paginatedResponse = (res, data, pagination, statusCode = 200) => {
  return res.status(statusCode).json({
    status: 'success',
    data,
    pagination
  });
};

/**
 * Crea una respuesta de validación
 * @param {Object} res - Response object de Express
 * @param {Array} errors - Errores de validación
 * @param {number} statusCode - Código de estado HTTP
 */
const validationResponse = (res, errors, statusCode = 422) => {
  return res.status(statusCode).json({
    status: 'error',
    message: 'Datos de entrada inválidos',
    details: errors
  });
};

/**
 * Crea una respuesta de recurso no encontrado
 * @param {Object} res - Response object de Express
 * @param {string} resource - Nombre del recurso
 */
const notFoundResponse = (res, resource = 'Recurso') => {
  return res.status(404).json({
    status: 'error',
    message: `${resource} no encontrado`
  });
};

/**
 * Crea una respuesta de conflicto
 * @param {Object} res - Response object de Express
 * @param {string} message - Mensaje de conflicto
 */
const conflictResponse = (res, message) => {
  return res.status(409).json({
    status: 'error',
    message
  });
};

/**
 * Crea una respuesta de no autorizado
 * @param {Object} res - Response object de Express
 * @param {string} message - Mensaje de autorización
 */
const unauthorizedResponse = (res, message = 'No autorizado') => {
  return res.status(401).json({
    status: 'error',
    message
  });
};

/**
 * Crea una respuesta de prohibido
 * @param {Object} res - Response object de Express
 * @param {string} message - Mensaje de prohibición
 */
const forbiddenResponse = (res, message = 'Acceso prohibido') => {
  return res.status(403).json({
    status: 'error',
    message
  });
};

/**
 * Crea una respuesta de demasiadas solicitudes
 * @param {Object} res - Response object de Express
 * @param {string} message - Mensaje de rate limit
 */
const tooManyRequestsResponse = (res, message = 'Demasiadas solicitudes') => {
  return res.status(429).json({
    status: 'error',
    message
  });
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
  validationResponse,
  notFoundResponse,
  conflictResponse,
  unauthorizedResponse,
  forbiddenResponse,
  tooManyRequestsResponse
};

