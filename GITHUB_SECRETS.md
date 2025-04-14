# Setting Up GitHub Secrets for ClipFlowAI

This guide explains how to set up GitHub secrets for your ClipFlowAI project. These secrets are used by the GitHub Actions workflow to build and deploy your application with the correct Supabase configuration.

## What are GitHub Secrets?

GitHub Secrets are encrypted environment variables that you can create for a GitHub repository. They allow you to store sensitive information, such as API keys, that your GitHub Actions workflows can use without exposing them in your workflow files.

## Required Secrets for ClipFlowAI

For the ClipFlowAI project, you need to set up the following secrets:

1. `REACT_APP_SUPABASE_URL`: Your Supabase project URL
2. `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anon key

## How to Set Up GitHub Secrets

1. Go to your GitHub repository
2. Click on "Settings" (tab at the top)
3. In the left sidebar, click on "Secrets and variables" and then "Actions"
4. Click on "New repository secret"
5. For the first secret:
   - Name: `REACT_APP_SUPABASE_URL`
   - Value: Your Supabase project URL (e.g., `https://abcdefghijklm.supabase.co`)
   - Click "Add secret"
6. Click on "New repository secret" again
7. For the second secret:
   - Name: `REACT_APP_SUPABASE_ANON_KEY`
   - Value: Your Supabase anon key
   - Click "Add secret"

## Where to Find Your Supabase Configuration

1. Go to your Supabase project dashboard
2. Click on "Settings" in the left sidebar
3. Click on "API" in the submenu
4. You'll find your project URL and anon key in the "Project API keys" section

## Verifying Your Secrets

After setting up your secrets, you can verify that they're being used correctly by:

1. Making a small change to your repository
2. Pushing the change to the main branch
3. Going to the "Actions" tab in your GitHub repository
4. Checking that the workflow runs successfully

Note: GitHub will not display the values of your secrets in the workflow logs for security reasons.

## Updating Your Secrets

If you need to update your secrets (for example, if you create a new Supabase project):

1. Go to your GitHub repository
2. Click on "Settings"
3. In the left sidebar, click on "Secrets and variables" and then "Actions"
4. Find the secret you want to update
5. Click on "Update"
6. Enter the new value
7. Click "Update secret"
