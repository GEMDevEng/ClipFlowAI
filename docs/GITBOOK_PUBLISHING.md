# Publishing to GitBook

This guide explains how to publish the ClipFlowAI documentation to GitBook.

## Prerequisites

Before you begin, make sure you have:

1. A GitBook account (sign up at [gitbook.com](https://www.gitbook.com/))
2. The documentation files prepared in the `docs/gitbook` directory

## Step 1: Create a New Space in GitBook

1. Log in to your GitBook account
2. Click "New Space"
3. Enter "ClipFlowAI" as the space name
4. Choose "Documentation" as the space type
5. Click "Create"

## Step 2: Connect to GitHub

1. In your GitBook space, go to "Integrations"
2. Click on "GitHub"
3. Click "Install GitHub App" if you haven't already
4. Select the repository that contains your ClipFlowAI documentation
5. Configure the integration:
   - Set the branch to sync from (e.g., `main`)
   - Set the path to your documentation files: `docs/gitbook`
   - Enable "Automatically sync content with GitHub"
6. Click "Save"

## Step 3: Configure GitBook Settings

1. Go to "Settings" in your GitBook space
2. Configure the following settings:
   - **General**: Update the title, description, and logo
   - **Appearance**: Customize the theme, colors, and fonts
   - **Features**: Enable or disable features like search, comments, and ratings
   - **Custom Domain**: Set up a custom domain if desired

## Step 4: Publish Your Documentation

1. After connecting to GitHub, GitBook will automatically sync your content
2. Review the preview of your documentation
3. Click "Publish" to make your documentation publicly available

## Step 5: Update Your Documentation

To update your documentation:

1. Make changes to the files in the `docs/gitbook` directory
2. Commit and push your changes to GitHub
3. GitBook will automatically sync the changes
4. Review and publish the updated content

## Step 6: Share Your Documentation

Once published, you can share your documentation using:

1. The GitBook URL: `https://yourusername.gitbook.io/clipflowai`
2. Your custom domain (if configured)
3. Links from your GitHub repository

## Troubleshooting

- **Sync Issues**: If GitBook is not syncing with GitHub, check the integration settings and ensure the repository and branch are correct
- **Formatting Problems**: If your content doesn't look right, check the Markdown syntax and ensure it's compatible with GitBook
- **Missing Content**: If some content is missing, check the SUMMARY.md file to ensure all pages are properly linked

## Additional Resources

- [GitBook Documentation](https://docs.gitbook.com/)
- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Integration Guide](https://docs.gitbook.com/integrations/github)
