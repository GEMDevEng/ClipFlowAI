# Manual Deployment Guide for ClipFlowAI

This guide provides step-by-step instructions for manually deploying ClipFlowAI to GitHub Pages using Supabase as the backend.

## Prerequisites

Before you begin, make sure you have:

1. Set up your Supabase project following the instructions in SUPABASE_SETUP.md
2. Obtained your Supabase URL and anon key
3. Node.js and npm installed on your machine
4. Git installed on your machine

## Step 1: Configure Environment Variables

1. Navigate to the `src/frontend` directory:
   ```bash
   cd src/frontend
   ```

2. Create a `.env` file with your Supabase configuration:
   ```bash
   echo "REACT_APP_SUPABASE_URL=your_supabase_url" > .env
   echo "REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key" >> .env
   ```

   Replace `your_supabase_url` and `your_supabase_anon_key` with your actual Supabase project details.

3. Return to the project root:
   ```bash
   cd ../..
   ```

## Step 2: Install Dependencies

1. Install root project dependencies:
   ```bash
   npm install
   ```

2. Install frontend dependencies:
   ```bash
   cd src/frontend
   npm install
   cd ../..
   ```

## Step 3: Build the Project

1. Build the frontend:
   ```bash
   npm run build
   ```

   This command will create a production build in the `src/frontend/build` directory.

## Step 4: Deploy to GitHub Pages

1. Install the gh-pages package if it's not already installed:
   ```bash
   npm install gh-pages --save-dev
   ```

2. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

   This command will push the build to the `gh-pages` branch of your repository.

## Step 5: Configure GitHub Pages in Repository Settings

1. Go to your GitHub repository in a web browser
2. Click on "Settings"
3. Scroll down to the "GitHub Pages" section
4. Under "Source", select the `gh-pages` branch
5. Click "Save"
6. Wait a few minutes for the deployment to complete

## Step 6: Verify Deployment

1. Visit your GitHub Pages URL: `https://gemdeveng.github.io/ClipFlowAI/`
2. Test the application to ensure everything works as expected:
   - Sign up for a new account
   - Log in
   - Create a video
   - View the dashboard

## Troubleshooting

### Issue: 404 Page Not Found

If you're getting a 404 error when navigating to pages other than the home page:

1. Make sure you're using HashRouter in your React app
2. Check that the 404.html file is properly set up in the `src/frontend/public` directory
3. Verify that the `homepage` field in both package.json files is correctly set

### Issue: Authentication Problems

If you're having issues with authentication:

1. Check your Supabase URL and anon key in the `.env` file
2. Verify that authentication providers are properly set up in your Supabase project
3. Check the browser console for any errors

### Issue: Database or Storage Issues

If you're having issues with the database or storage:

1. Verify that your database tables are set up correctly
2. Check that Row Level Security (RLS) policies are properly configured
3. Ensure that storage buckets are created and have the correct permissions

## Updating Your Deployment

To update your deployment after making changes:

1. Make your changes to the codebase
2. Build the project: `npm run build`
3. Deploy to GitHub Pages: `npm run deploy`
4. Wait a few minutes for the changes to propagate
