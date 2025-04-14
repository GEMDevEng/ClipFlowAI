const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// Removed: const connectDB = require('./config/db');
const telegramBot = require('./services/telegramBot');

/**
 * NOTE: This backend server is simplified as the application primarily uses Supabase
 * for authentication, database, and storage operations directly from the frontend.
 *
 * The main purpose of this server is to handle auxiliary services like the Telegram bot
 * that cannot be managed directly from the frontend. The MongoDB connection and related
 * API routes have been removed to avoid architectural conflicts.
 */

// Load environment variables
dotenv.config();

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
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app; // For testing purposes
