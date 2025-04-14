#!/bin/bash

# Exit on error
set -e

# Check if we're in a git repository
if [ ! -d .git ]; then
  echo "Error: Not a git repository"
  exit 1
fi

# Get current branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: $BRANCH"

# Add all changes
echo "Adding all changes..."
git add .

# Commit with a message
echo "Committing changes..."
git commit -m "Implement full-code solution with $0 budget approach for GitHub Pages deployment" --no-edit

# Push to remote
echo "Pushing to remote..."
git push origin $BRANCH

echo "Done!"
