/**
 * API routes
 */

const express = require('express');
const router = express.Router();

// Import route modules
const videoRoutes = require('./video');
const userRoutes = require('./user');
const analyticsRoutes = require('./analytics');
const socialRoutes = require('./social');

// Mount routes
router.use('/videos', videoRoutes);
router.use('/users', userRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/social', socialRoutes);

// Root API route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ClipFlowAI API',
    version: '1.0.0',
    endpoints: [
      '/api/videos',
      '/api/users',
      '/api/analytics',
      '/api/social'
    ]
  });
});

module.exports = router;
