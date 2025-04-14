# Quick Start Guide

This guide will help you get ClipFlowAI up and running quickly.

## Prerequisites

Before you begin, make sure you have:

- Node.js (v14 or higher)
- npm or yarn
- A GitHub account
- A Supabase account (free tier)

## Step 1: Clone the Repository

```bash
git clone https://github.com/GEMDevEng/ClipFlowAI.git
cd ClipFlowAI
```

## Step 2: Install Dependencies

```bash
# Install root project dependencies
npm install

# Install frontend dependencies
cd src/frontend
npm install
```

## Step 3: Set Up Supabase

1. Go to [Supabase](https://supabase.com/) and sign up or log in
2. Create a new project
3. Set up the database tables, storage buckets, and authentication as described in the [Supabase Setup Guide](../deployment/supabase-setup.md)
4. Get your Supabase URL and anon key from the Settings > API section

## Step 4: Configure Environment Variables

Create a `.env` file in the `src/frontend` directory:

```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_url` and `your_supabase_anon_key` with your actual Supabase project details.

## Step 5: Run the Application Locally

```bash
npm start
```

This will start the development server and open the application in your default browser at `http://localhost:3000`.

## Step 6: Deploy to GitHub Pages

1. Update the `homepage` field in `src/frontend/package.json` to your GitHub Pages URL:

```json
"homepage": "https://yourusername.github.io/ClipFlowAI"
```

2. Install the gh-pages package:

```bash
npm install --save-dev gh-pages
```

3. Add deploy scripts to `src/frontend/package.json`:

```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

4. Deploy to GitHub Pages:

```bash
npm run deploy
```

5. Configure GitHub Pages in your repository settings to use the gh-pages branch

## Step 7: Start Creating Videos

1. Visit your deployed application or local development server
2. Sign up for a new account
3. Log in to the application
4. Click "Create Video" to start creating your first AI-generated video
5. Enter a title and prompt
6. Upload a background image
7. Select platforms for sharing
8. Click "Generate Video"

## Next Steps

- Explore the [User Guide](../user-guide/creating-videos.md) to learn more about creating and managing videos
- Check out the [Technical Documentation](../technical-documentation/architecture.md) to understand how ClipFlowAI works
- Join our community to share your feedback and get help
