# Deployment Guide for ClipFlowAI

This guide will walk you through deploying ClipFlowAI to GitHub Pages.

## Prerequisites

- Git installed on your machine
- Node.js and npm installed
- A GitHub account
- Firebase project set up (see FIREBASE_SETUP.md)

## Option 1: Automatic Deployment with GitHub Actions

The repository is already configured to automatically deploy to GitHub Pages when changes are pushed to the main branch. This is handled by the GitHub Actions workflow in `.github/workflows/deploy.yml`.

### Steps:

1. Commit and push your changes to the main branch:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. GitHub Actions will automatically build and deploy your site
   - You can monitor the progress in the "Actions" tab of your GitHub repository

3. Once the workflow completes successfully, your site will be available at:
   `https://gemdeveng.github.io/ClipFlowAI/`

## Option 2: Manual Deployment

If you prefer to deploy manually or if the automatic deployment isn't working:

### Steps:

1. Install the gh-pages package if you haven't already:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

4. Your site will be available at:
   `https://gemdeveng.github.io/ClipFlowAI/`

## Setting Up a Custom Domain (Optional)

If you want to use a custom domain instead of the default GitHub Pages domain:

1. Purchase a domain from a domain registrar (e.g., Namecheap, GoDaddy)

2. Configure DNS settings at your domain registrar:
   - For an apex domain (example.com):
     - A record: 185.199.108.153
     - A record: 185.199.109.153
     - A record: 185.199.110.153
     - A record: 185.199.111.153
   - For a www subdomain (www.example.com):
     - CNAME record: gemdeveng.github.io

3. Add your custom domain in the GitHub repository settings:
   - Go to Settings > Pages
   - Under "Custom domain", enter your domain name
   - Click "Save"

4. Update the CNAME file in the `src/frontend/public` directory with your custom domain

5. Update the `homepage` field in both package.json files to match your custom domain

## Troubleshooting Deployment Issues

### Issue: 404 Page Not Found

If you're getting a 404 error when navigating to pages other than the home page:

1. Make sure you're using HashRouter instead of BrowserRouter in your React app
2. Check that the 404.html file is properly set up in the `src/frontend/public` directory
3. Verify that the `homepage` field in both package.json files is correctly set

### Issue: Blank Page After Deployment

If you're seeing a blank page after deployment:

1. Check the browser console for errors
2. Make sure all paths in your code are relative, not absolute
3. Verify that the `homepage` field in both package.json files is correctly set

### Issue: CSS/JS Not Loading

If your CSS or JavaScript files aren't loading:

1. Check that the paths in your HTML files are correct
2. Make sure you're using the `%PUBLIC_URL%` prefix for assets in public directory
3. Verify that the build process completed successfully

### Issue: GitHub Actions Workflow Failed

If the GitHub Actions workflow fails:

1. Check the workflow logs in the "Actions" tab of your GitHub repository
2. Make sure all dependencies are properly installed
3. Verify that the build process completes successfully locally
4. Check that you have the necessary permissions for the repository

## Post-Deployment Steps

After successfully deploying your site:

1. Test all functionality to ensure everything works as expected
2. Set up proper Firebase security rules for production
3. Consider setting up monitoring and analytics
4. Update your README.md with information about your deployed site
