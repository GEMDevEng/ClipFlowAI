# ClipFlowAI

Automated AI system to generate & publish short-form videos (Reels, TikTok, Shorts). AI creates video, voiceover, captions from prompts. Inspired by Fabian Markl's workflow.

## Project Overview

ClipFlowAI is a full-code solution for automating the creation and publication of viral short-form videos across multiple platforms. The system uses AI to generate engaging content from simple prompts.

## Features

- **Client-side Video Generation**: Create videos directly in the browser using FFmpeg.js
- **Text-to-Speech**: Generate voiceovers using Web Speech API
- **Automatic Captions**: Create synchronized captions for your videos
- **Social Media Sharing**: Share your videos to popular platforms
- **User Authentication**: Secure user accounts with Supabase Authentication and Google OAuth
- **Cloud Storage**: Store your videos, images, and profile avatars with Supabase Storage
- **PostgreSQL Database**: Powerful database capabilities with Supabase
- **Responsive Design**: Works on desktop and mobile devices
- **Analytics Dashboard**: Track video performance with real-time analytics
- **Security Features**: Rate limiting, account protection, and security activity tracking
- **Profile Management**: Upload profile pictures and manage account settings
- **Password Recovery**: Secure password reset functionality

### New Features

- **Video Customization**: Edit scripts, select music, choose voice profiles, and customize subtitles
- **Multi-Language Support**: Create videos in multiple languages including English, Spanish, French, German, Italian, Japanese, Korean, Chinese, Portuguese, and Russian
- **Scheduled Publishing**: Schedule videos to be published at specific times
- **Multi-Platform Publishing**: Support for TikTok, Instagram, and YouTube
- **Comprehensive Testing**: Unit tests for frontend and backend components

## $0 Budget Approach

This project is designed to be completely free to set up and run:

- **Supabase Free Tier**: Authentication, PostgreSQL database, and Storage
- **GitHub Pages**: Free hosting for the web application
- **Client-side Processing**: No server costs as processing happens in the browser
- **Free APIs**: Utilizing free APIs and libraries for core functionality

## Directory Structure

```text
├── docs/                     # Documentation files
├── src/                      # Source code
│   ├── frontend/             # React frontend application
│   │   ├── public/           # Public assets
│   │   └── src/              # React source code
│   │       ├── components/   # Reusable components
│   │       ├── context/      # React context providers
│   │       ├── supabase/     # Supabase configuration
│   │       ├── pages/        # Page components
│   │       └── services/     # Service modules
│   └── backend/              # Node.js backend application
│       ├── controllers/      # API controllers
│       ├── routes/           # API routes
│       ├── services/         # Business logic services
│       └── server.js         # Express server setup
├── tests/                    # Test files
│   ├── frontend/             # Frontend tests
│   │   ├── pages/            # Page component tests
│   │   └── services/         # Service module tests
│   └── backend/              # Backend tests
│       └── services/         # Service module tests
├── .github/                  # GitHub configuration
└── README.md                 # This file
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Supabase account (free tier)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/GEMDevEng/ClipFlowAI.git
   cd ClipFlowAI
   ```

2. Install dependencies:

   ```bash
   npm run install:all
   ```

3. Create a Supabase project and configure it:
   - Go to [Supabase](https://supabase.com/)
   - Create a new project
   - Set up Authentication (Email/Password and Google)
   - Create database tables (see SUPABASE_SETUP.md for details)
   - Set up Storage buckets
   - Get your Supabase URL and anon key

4. Create a `.env` file in the `src/frontend` directory with your Supabase configuration:

   ```env
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. Create a `.env` file in the `src/backend` directory with your configuration:

   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token (optional)
   ```

6. Start the development servers:

   ```bash
   # Start the frontend
   cd src/frontend
   npm start

   # In a separate terminal, start the backend
   cd src/backend
   npm start
   ```

### Deployment to GitHub Pages

1. Update the `homepage` field in both `package.json` files to match your GitHub Pages URL.

2. Deploy manually:

   ```bash
   npm run deploy
   ```

3. Or push to the main branch to trigger automatic deployment via GitHub Actions.

## Testing

The project includes comprehensive tests for both frontend and backend components:

```bash
# Run frontend tests
cd src/frontend
npm test

# Run backend tests
cd src/backend
npm test
```

## License

This project is proprietary and confidential.
