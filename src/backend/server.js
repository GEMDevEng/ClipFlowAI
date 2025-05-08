const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// Removed: const connectDB = require('./config/db');
const telegramBot = require('./services/telegramBot');
const analyticsCollector = require('./services/analyticsCollector');
const schedulerService = require('./services/schedulerService');
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

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/social', require('./routes/social'));

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
      // Initialize the scheduler service
      schedulerService.initializeScheduler();

      console.log('Scheduler service started');
    } catch (error) {
      console.error('Scheduler service initialization failed:', error.message);
    }
  } else {
    console.log('No Supabase credentials provided, skipping scheduler service');
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');

  // Stop the scheduler
  if (schedulerService) {
    schedulerService.stopScheduler();
  }

  // Close the server
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');

  // Stop the scheduler
  if (schedulerService) {
    schedulerService.stopScheduler();
  }

  // Close the server
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Export app for testing purposes
module.exports = app;

// Export createServer function for integration tests
module.exports.createServer = () => {
  return { app, server };
};
