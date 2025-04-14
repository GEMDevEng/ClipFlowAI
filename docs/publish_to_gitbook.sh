#!/bin/bash

# This script prepares and publishes the ClipFlowAI documentation to GitBook

# Exit on error
set -e

echo "ClipFlowAI GitBook Publishing Script"
echo "===================================="
echo

# Step 1: Ensure the gitbook directory exists
if [ ! -d "docs/gitbook" ]; then
  echo "Error: docs/gitbook directory not found!"
  echo "Please run this script from the root of the ClipFlowAI repository."
  exit 1
fi

# Step 2: Check if GitBook CLI is installed
if ! command -v gitbook &> /dev/null; then
  echo "GitBook CLI not found. Installing..."
  npm install -g gitbook-cli
  gitbook install
fi

# Step 3: Build the GitBook
echo "Building GitBook documentation..."
cd docs/gitbook
gitbook build
echo "GitBook built successfully."
echo

# Step 4: Prepare for publishing
echo "Preparing for publishing..."
if [ ! -d "_book" ]; then
  echo "Error: _book directory not found after build!"
  exit 1
fi

# Step 5: Create or update gh-pages branch
echo "Creating/updating gh-pages branch for documentation..."
git checkout -b gh-pages-docs
cp -R _book/* .
rm -rf _book
git add .
git commit -m "Update documentation"
echo "Changes committed to gh-pages-docs branch."
echo

# Step 6: Push to GitHub
echo "Would you like to push the documentation to GitHub? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
  git push origin gh-pages-docs
  echo "Documentation pushed to GitHub."
  echo "Your documentation will be available at: https://gemdeveng.github.io/ClipFlowAI/docs/"
else
  echo "Skipping push to GitHub."
  echo "To push manually, run: git push origin gh-pages-docs"
fi

# Step 7: Return to original branch
git checkout -
echo
echo "Documentation publishing process completed."
echo "To connect this to GitBook, follow the instructions in GITBOOK_PUBLISHING.md"
