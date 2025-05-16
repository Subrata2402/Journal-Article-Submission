/**
 * Utility to standardize API responses
 */

/**
 * Creates a successful response object
 * @param {Object} options - Response options
 * @param {string} options.message - Success message
 * @param {any} options.data - Response data
 * @param {number} options.statusCode - HTTP status code (default: 200)
 * @param {Object} options.meta - Optional metadata (like pagination)
 * @returns {Object} Formatted success response
 */
const success = ({ message = 'Operation successful', data = null, statusCode = 200, meta = null }) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString(),
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return { body: response, statusCode };
};

/**
 * Creates an error response object
 * @param {Object} options - Error options
 * @param {string} options.message - Error message
 * @param {string} options.code - Error code (optional)
 * @param {number} options.statusCode - HTTP status code (default: 400)
 * @param {Array} options.errors - Validation errors array
 * @returns {Object} Formatted error response
 */
const error = ({ message = 'An error occurred', code = null, statusCode = 400, errors = null }) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };

  if (code) {
    response.code = code;
  }

  if (errors) {
    response.errors = errors;
  }

  return { body: response, statusCode };
};

/**
 * Response helper middleware
 * Attaches response formatter methods to res object
 */
const responseMiddleware = (req, res, next) => {
  // Send success response
  res.sendSuccess = function({ message, data, statusCode = 200, meta }) {
    const { body, statusCode: code } = success({ message, data, statusCode, meta });
    return res.status(code).json(body);
  };

  // Send error response
  res.sendError = function({ message, code, statusCode = 400, errors }) {
    const { body, statusCode: httpCode } = error({ message, code, statusCode, errors });
    return res.status(httpCode).json(body);
  };

  next();
};

module.exports = {
  success,
  error,
  responseMiddleware
};
