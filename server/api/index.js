/**
 * Express server entry point — exported as default for Vercel serverless.
 * Initializes all middleware, mounts routes, and exports the app.
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

/* Initialize Firebase Admin (imported for side-effect initialization) */
require('../services/firestore.service');

const aiRoutes = require('../routes/ai.routes');
const journalRoutes = require('../routes/journal.routes');
const moodRoutes = require('../routes/mood.routes');
const userRoutes = require('../routes/user.routes');
const { generalLimiter } = require('../middleware/rateLimiter');

const app = express();

/* Security headers */
app.use(helmet());

/* Compression */
app.use(compression());

/* CORS — strictly set to frontend URL */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

/* JSON body parser with size limit to prevent payload attacks */
app.use(express.json({ limit: '10kb' }));

/* Request logging — dev only */
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

/* Global rate limiter */
app.use(generalLimiter);

/* Route mounts */
app.use('/api/ai', aiRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/users', userRoutes);

/* Health check */
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

/* 404 handler */
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

/* Global error handler */
app.use((err, req, res, _next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('Unhandled error:', err);
  }
  res.status(500).json({ success: false, error: 'Internal server error' });
});

/* Local dev server (Vercel uses the export) */
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Solace API running on port ${PORT}`);
  });
}

module.exports = app;
