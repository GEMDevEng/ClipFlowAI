# ClipFlowAI

Automated AI system to generate & publish short-form videos (Reels, TikTok, Shorts). AI creates video, voiceover, captions from prompts. Inspired by Fabian Markl's workflow.

## Project Overview

ClipFlowAI is a full-code solution for automating the creation and publication of viral short-form videos across multiple platforms. The system uses AI to generate engaging content from simple prompts.

## Features

- **Client-side Video Generation**: Create videos directly in the browser using FFmpeg.js
- **Text-to-Speech**: Generate voiceovers using Web Speech API
- **Automatic Captions**: Create synchronized captions for your videos
- **Social Media Sharing**: Share your videos to popular platforms
- **User Authentication**: Secure user accounts with Supabase Authentication
- **Cloud Storage**: Store your videos and images with Supabase Storage
- **PostgreSQL Database**: Powerful database capabilities with Supabase
- **Responsive Design**: Works on desktop and mobile devices

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
├── tests/                    # Test files
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

5. Start the development server:

   ```bash
   npm start
   ```

### Deployment to GitHub Pages

1. Update the `homepage` field in both `package.json` files to match your GitHub Pages URL.

2. Deploy manually:

   ```bash
   npm run deploy
   ```

3. Or push to the main branch to trigger automatic deployment via GitHub Actions.

## License

This project is proprietary and confidential.
