/**
 * Standardized API response formatters.
 * Used across all route handlers for consistent response structure.
 */

/**
 * Send a successful response.
 * @param {import('express').Response} res
 * @param {object} data - Response payload
 * @param {number} [statusCode=200]
 */
const success = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    ...data,
  });
};

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {string} message - Error message
 * @param {number} [statusCode=500]
 */
const error = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    error: message,
  });
};

module.exports = { success, error };
