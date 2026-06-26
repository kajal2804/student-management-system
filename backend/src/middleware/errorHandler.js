/**
 * Global error handling middleware
 */

const { AppError } = require('../utils/errors');

function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  // Handle database constraint errors
  if (err.code === '23505') {
    // Unique constraint violation
    return res.status(409).json({
      success: false,
      message: 'A record with this information already exists',
    });
  }

  if (err.code === '23503') {
    // Foreign key constraint violation
    return res.status(400).json({
      success: false,
      message: 'Referenced resource does not exist',
    });
  }

  // Generic error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
}

module.exports = errorHandler;
