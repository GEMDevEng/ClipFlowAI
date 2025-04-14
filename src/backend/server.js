const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// Removed: const connectDB = require('./config/db');
const telegramBot = require('./services/telegramBot');
const analyticsCollector = require('./services/analyticsCollector');
const socialMediaPublisher = require('./services/socialMediaPublisher');
const { createClient } = require('@supabase/supabase-js');

/**
 * NOTE: This backend server is simplified as the application primarily uses Supabase
 * for authentication, database, and storage operations directly from the frontend.
 *
 * The main purpose of this server is to handle auxiliary services like the Telegram bot
 * and analytics collection that cannot be managed directly from the frontend.
 * The MongoDB connection and related API routes have been removed to avoid architectural conflicts.
 */

// Load environment variables
dotenv.config();

// Initialize Supabase client
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
}

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ClipFlowAI API' });
});

// Removed: API routes for /api/videos
// app.use('/api/videos', require('./routes/videoRoutes'));

// Add the payment routes
app.use('/api/payment', require('./routes/paymentRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // Removed: Database connection logic
  // if (process.env.MONGO_URI) {
  //   try {
  //     await connectDB();
  //   } catch (error) {
  //     console.error('Database connection failed:', error.message);
  //   }
  // } else {
  //   console.log('No MongoDB URI provided, skipping database connection');
  // }

  // Initialize Telegram bot if token is provided
  if (process.env.TELEGRAM_BOT_TOKEN) {
    try {
      await telegramBot.initBot();
    } catch (error) {
      console.error('Telegram bot initialization failed:', error.message);
    }
  } else {
    console.log('No Telegram bot token provided, skipping bot initialization');
  }

  // Start analytics collector if Supabase credentials are provided
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    try {
      // Start collecting analytics every 60 minutes
      analyticsCollector.startCollector(60);
    } catch (error) {
      console.error('Analytics collector initialization failed:', error.message);
    }
  } else {
    console.log('No Supabase credentials provided, skipping analytics collector');
  }

  // Start scheduler for publishing scheduled videos if Supabase credentials are provided
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
                  .update({ status: 'published', published_at: new Date().toISOString() })
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

module.exports = app; // For testing purposes
