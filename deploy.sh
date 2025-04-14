#!/bin/bash

# Exit on error
set -e

echo "ClipFlowAI Deployment Script"
echo "============================"
echo

# Step 1: Install dependencies
echo "Step 1: Installing dependencies..."
npm install
cd src/frontend
npm install
cd ../..
echo "Dependencies installed successfully."
echo

# Step 2: Build the project
echo "Step 2: Building the project..."
npm run build
echo "Build completed successfully."
echo

# Step 3: Deploy to GitHub Pages
echo "Step 3: Deploying to GitHub Pages..."
npm run deploy
echo "Deployment completed successfully."
echo

echo "ClipFlowAI has been deployed to GitHub Pages!"
echo "Visit your site at: https://gemdeveng.github.io/ClipFlowAI/"
echo
echo "Note: It may take a few minutes for the changes to propagate."
