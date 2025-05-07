# ClipFlowAI Backend

This directory contains the backend server for ClipFlowAI, which handles auxiliary services like the Telegram bot, analytics collection, and scheduled video publishing that cannot be managed directly from the frontend.

## Architecture

The backend follows a modular architecture with the following components:

- **Config**: Configuration files for the server, database, and external services
- **Controllers**: Request handlers for API endpoints
- **Middleware**: Express middleware for authentication, error handling, etc.
- **Models**: Data models for database entities
- **Routes**: API route definitions
- **Services**: Business logic services
- **Utils**: Utility functions for common tasks

## Directory Structure

```
/backend
├── config/                # Configuration files
│   ├── index.js           # Main configuration
│   └── supabase.js        # Supabase client configuration
├── controllers/           # Request handlers
│   ├── videoController.js # Video controller
│   └── ...
├── middleware/            # Express middleware
│   ├── auth.js            # Authentication middleware
│   ├── error.js           # Error handling middleware
│   └── ...
├── models/                # Data models
│   └── ...
├── routes/                # API routes
│   ├── api.js             # Main API router
│   ├── video.js           # Video routes
│   └── ...
├── services/              # Business logic services
│   ├── analyticsCollector.js  # Analytics collection service
│   ├── socialMediaPublisher.js # Social media publishing service
│   ├── telegramBot.js     # Telegram bot service
│   └── ...
├── utils/                 # Utility functions
│   └── ...
├── server.js              # Main server file
└── README.md              # This file
```

## API Endpoints

The backend provides the following API endpoints:

- **GET /api**: API information
- **GET /api/videos**: Get all videos for a user
- **GET /api/videos/:id**: Get a video by ID
- **POST /api/videos**: Create a new video
- **PUT /api/videos/:id**: Update a video
- **DELETE /api/videos/:id**: Delete a video
- **POST /api/videos/upload**: Upload a video file
- **POST /api/videos/:id/process**: Process a video
- **POST /api/videos/:id/publish**: Publish a video to platforms
- **GET /api/videos/:id/analytics**: Get video analytics

## Authentication

Authentication is handled using Supabase Auth, which provides:

- JWT-based authentication
- Token verification
- Role-based access control

## Services

### Analytics Collector

The analytics collector service periodically fetches analytics data from social media platforms and updates the database.

### Social Media Publisher

The social media publisher service handles publishing videos to various platforms like YouTube, TikTok, Instagram, etc.

### Telegram Bot

The Telegram bot service provides notifications and allows users to interact with the application via Telegram.

## Configuration

The backend is configured using environment variables. See the `.env.example` file for a list of available configuration options.

## Getting Started

1. Install dependencies: `npm install`
2. Create a `.env` file based on `.env.example`
3. Start the server: `npm start`

## Development

- Start the server in development mode: `npm run dev`
- Run tests: `npm test`
- Lint code: `npm run lint`

## Deployment

The backend can be deployed to any hosting provider that supports Node.js applications.

## Note on Architecture

This backend is designed to complement the frontend-centric approach of ClipFlowAI, where most of the authentication, database, and storage operations are handled directly from the frontend using Supabase. The backend focuses on tasks that cannot be performed from the frontend, such as scheduled jobs, notifications, and integration with external services.
