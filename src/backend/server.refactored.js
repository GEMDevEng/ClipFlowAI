/**
 * ClipFlowAI Backend Server
 * 
 * This server is designed to handle auxiliary services like the Telegram bot,
 * analytics collection, and scheduled video publishing that cannot be managed
 * directly from the frontend.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const config = require('./config');
const { supabase } = require('./config/supabase');
const { notFound, errorHandler } = require('./middleware/error');
const apiRoutes = require('./routes/api');
const telegramBot = require('./services/telegramBot');
const analyticsCollector = require('./services/analyticsCollector');
const socialMediaPublisher = require('./services/socialMediaPublisher');

// Initialize Express app
const app = express();
const PORT = config.server.port;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: config.server.corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan(config.server.env === 'production' ? 'combined' : 'dev')); // Logging

// Routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to ClipFlowAI API',
    version: '1.0.0',
    documentation: '/api'
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const server = app.listen(PORT, async () => {
  console.log(`Server running in ${config.server.env} mode on port ${PORT}`);

  // Initialize Telegram bot if token is provided
  if (config.notifications?.telegram?.token) {
    try {
      await telegramBot.initBot();
      console.log('Telegram bot initialized successfully');
    } catch (error) {
      console.error('Telegram bot initialization failed:', error.message);
    }
  } else {
    console.log('No Telegram bot token provided, skipping bot initialization');
  }

  // Start analytics collector if enabled
  if (config.analytics.enabled && supabase) {
    try {
      // Start collecting analytics every 60 minutes
      analyticsCollector.startCollector(60);
      console.log('Analytics collector started successfully');
    } catch (error) {
      console.error('Analytics collector initialization failed:', error.message);
    }
  } else {
    console.log('Analytics collector disabled or no Supabase credentials provided');
  }

  // Start scheduler for publishing scheduled videos
  if (supabase) {
    try {
      // Function to check for scheduled videos and publish them
      const checkScheduledVideos = async () => {
        console.log('Checking for scheduled videos...');

        try {
          // Get all videos that are scheduled to be published
          const { data: videos, error } = await supabase
            .from('videos')
            .select('*')
            .eq('scheduled_publish', true)
            .eq('status', 'processing');

          if (error) {
            throw error;
          }

          if (videos && videos.length > 0) {
            console.log(`Found ${videos.length} scheduled videos`);

            // Process each scheduled video
            const results = await socialMediaPublisher.processScheduledPublishing(videos);

            // Update the status of published videos
            for (const result of results) {
              if (result && result.videoId) {
                await supabase
                  .from('videos')
                  .update({ 
                    status: 'published', 
                    published_at: new Date().toISOString() 
                  })
                  .eq('id', result.videoId);

                console.log(`Updated status of video ${result.videoId} to published`);
              }
            }
          } else {
            console.log('No scheduled videos found');
          }
        } catch (error) {
          console.error('Error checking scheduled videos:', error.message);
        }
      };

      // Check for scheduled videos every 5 minutes
      setInterval(checkScheduledVideos, 5 * 60 * 1000);

      // Also check immediately on startup
      checkScheduledVideos();

      console.log('Scheduled video publisher started');
    } catch (error) {
      console.error('Scheduled video publisher initialization failed:', error.message);
    }
  } else {
    console.log('No Supabase credentials provided, skipping scheduled video publisher');
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Export app for testing
module.exports = app;
