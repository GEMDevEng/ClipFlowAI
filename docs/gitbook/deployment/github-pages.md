# GitHub Pages Deployment Guide

This guide explains how to deploy your ClipFlowAI application to GitHub Pages.

## Prerequisites

Before deploying to GitHub Pages, make sure you have:

1. A GitHub account
2. Your ClipFlowAI repository set up on GitHub
3. Node.js and npm installed on your machine
4. Your Supabase project set up and configured

## Step 1: Install the gh-pages Package

The gh-pages package makes it easy to deploy your React application to GitHub Pages:

```bash
cd src/frontend
npm install --save-dev gh-pages
```

## Step 2: Update package.json

Add the following to your `src/frontend/package.json` file:

```json
{
  "homepage": "https://yourusername.github.io/ClipFlowAI",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

Replace `yourusername` with your actual GitHub username.

## Step 3: Configure Environment Variables

Create a `.env` file in the `src/frontend` directory with your Supabase configuration:

```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_url` and `your_supabase_anon_key` with your actual Supabase project details.

## Step 4: Build and Deploy

Run the following command to build and deploy your application:

```bash
npm run deploy
```

This will:
1. Build your React application
2. Create a gh-pages branch in your repository
3. Push the build files to the gh-pages branch

## Step 5: Configure GitHub Pages in Repository Settings

1. Go to your GitHub repository
2. Click on "Settings"
3. Scroll down to the "GitHub Pages" section
4. Under "Source", select the "gh-pages" branch
5. Click "Save"

## Step 6: Access Your Deployed Application

Your application should now be accessible at:
```
https://yourusername.github.io/ClipFlowAI/
```

Replace `yourusername` with your actual GitHub username.

## Troubleshooting

### 404 Errors on Page Refresh

If you're getting 404 errors when refreshing pages, you need to use HashRouter instead of BrowserRouter in your React application:

```jsx
import { HashRouter as Router } from 'react-router-dom';
```

### CORS Issues

If you encounter CORS issues with Supabase:

1. Go to your Supabase dashboard
2. Navigate to Settings > API
3. Add your GitHub Pages URL to the "Additional Allowed Hosts" section

### Environment Variables

If your application can't connect to Supabase, check that:

1. Your environment variables are correctly set in the `.env` file
2. You're using the `REACT_APP_` prefix for all environment variables
3. You've rebuilt and redeployed after changing environment variables

## Automating Deployment with GitHub Actions

You can automate the deployment process using GitHub Actions:

1. Create a `.github/workflows/deploy.yml` file in your repository
2. Add the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'

      - name: Install dependencies
        run: |
          cd src/frontend
          npm install

      - name: Build
        run: |
          cd src/frontend
          npm run build
        env:
          REACT_APP_SUPABASE_URL: ${{ secrets.REACT_APP_SUPABASE_URL }}
          REACT_APP_SUPABASE_ANON_KEY: ${{ secrets.REACT_APP_SUPABASE_ANON_KEY }}

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@4.1.4
        with:
          branch: gh-pages
          folder: src/frontend/build
```

3. Add your Supabase URL and anon key as secrets in your GitHub repository settings

This workflow will automatically deploy your application to GitHub Pages whenever you push to the main branch.
