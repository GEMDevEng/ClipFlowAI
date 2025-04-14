# Installation Guide

This guide will walk you through the process of installing and setting up ClipFlowAI on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher) or **yarn**
- **Git**

You'll also need:

- A **GitHub account** (for cloning the repository and deploying to GitHub Pages)
- A **Supabase account** (for setting up the backend)

## Step 1: Clone the Repository

First, clone the ClipFlowAI repository from GitHub:

```bash
git clone https://github.com/GEMDevEng/ClipFlowAI.git
cd ClipFlowAI
```

## Step 2: Install Dependencies

Install the project dependencies:

```bash
# Install root project dependencies
npm install

# Install frontend dependencies
cd src/frontend
npm install
cd ../..
```

## Step 3: Set Up Supabase

1. Create a Supabase account at [supabase.com](https://supabase.com/) if you don't have one already
2. Create a new Supabase project
3. Set up the database tables, storage buckets, and authentication as described in the [Supabase Setup Guide](../deployment/supabase-setup.md)
4. Get your Supabase URL and anon key from the Settings > API section

## Step 4: Configure Environment Variables

Create a `.env` file in the `src/frontend` directory:

```bash
cd src/frontend
touch .env
```

Add the following environment variables to the `.env` file:

```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_url` and `your_supabase_anon_key` with your actual Supabase project details.

## Step 5: Run the Development Server

Start the development server:

```bash
npm start
```

This will start the React development server and open the application in your default browser at `http://localhost:3000`.

## Step 6: Verify the Installation

1. The application should open in your browser
2. You should see the ClipFlowAI login page
3. Try signing up for a new account
4. After logging in, you should be able to access the dashboard

## Troubleshooting

If you encounter any issues during installation:

### Node.js Version Issues

Make sure you're using Node.js v14 or higher:

```bash
node -v
```

If you need to update Node.js, visit [nodejs.org](https://nodejs.org/) to download the latest version.

### Dependency Installation Errors

If you encounter errors during dependency installation:

```bash
# Clear npm cache
npm cache clean --force

# Try installing dependencies again
npm install
```

### Supabase Connection Issues

If you're having trouble connecting to Supabase:

1. Double-check your Supabase URL and anon key in the `.env` file
2. Make sure your Supabase project is set up correctly
3. Check that your database tables and storage buckets are configured as described in the Supabase Setup Guide

### Browser Compatibility

ClipFlowAI works best with modern browsers. If you're experiencing issues:

1. Try using Google Chrome, Firefox, or Edge
2. Make sure your browser is up to date
3. Clear your browser cache and cookies

## Next Steps

Now that you have ClipFlowAI installed and running locally, you can:

1. [Create your first video](../user-guide/creating-videos.md)
2. [Deploy to GitHub Pages](../deployment/github-pages.md)
3. [Explore the architecture](../technical-documentation/architecture.md)
