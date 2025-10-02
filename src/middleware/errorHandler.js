/**
 * Middleware para manejo centralizado de errores
 * @param {Error} err - Error capturado
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error capturado:', err);

  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Error de validación',
      details: err.message
    });
  }

  // Error de sintaxis JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      status: 'error',
      message: 'JSON inválido en el cuerpo de la petición'
    });
  }

  // Error de recurso no encontrado
  if (err.status === 404) {
    return res.status(404).json({
      status: 'error',
      message: err.message || 'Recurso no encontrado'
    });
  }

  // Error de validación de datos
  if (err.status === 422) {
    return res.status(422).json({
      status: 'error',
      message: 'Datos de entrada inválidos',
      details: err.details || err.message
    });
  }

  // Error interno del servidor
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;

