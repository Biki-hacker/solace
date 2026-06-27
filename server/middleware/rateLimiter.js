/**
 * Rate limiting middleware using express-rate-limit.
 * - aiLimiter: 30 requests per minute for AI routes
 * - generalLimiter: 100 requests per minute for all other routes
 */
const rateLimit = require('express-rate-limit');

const aiLimiter = rateLimit({
  windowMs: 60_000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many AI requests. Please wait a moment.' },
});

const generalLimiter = rateLimit({
  windowMs: 60_000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please slow down.' },
});

module.exports = { aiLimiter, generalLimiter };
