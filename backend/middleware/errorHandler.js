// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  
  // PostgreSQL errors
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        statusCode = 409;
        message = 'Duplicate entry. This record already exists.';
        break;
      case '23503': // Foreign key violation
        statusCode = 400;
        message = 'Invalid reference. Related record does not exist.';
        break;
      case '23502': // Not null violation
        statusCode = 400;
        message = 'Required field is missing.';
        break;
      case '42P01': // Undefined table
        statusCode = 500;
        message = 'Database configuration error.';
        break;
      default:
        statusCode = 500;
        message = 'Database error occurred.';
    }
  }
  
  // Validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404 handler
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};

module.exports = {
  errorHandler,
  notFound,
};

