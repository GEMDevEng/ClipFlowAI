# GitHub Secrets

This guide explains how to set up and manage GitHub Secrets for ClipFlowAI. GitHub Secrets are used to store sensitive information like API keys and environment variables securely in your GitHub repository.

## What are GitHub Secrets?

GitHub Secrets are encrypted environment variables that you create in a repository or organization. These secrets are available to use in GitHub Actions workflows and help you keep sensitive data out of your repository's source code.

In ClipFlowAI, we use GitHub Secrets to store:

- Supabase URL and API keys
- Social media API credentials
- Deployment configuration
- Other sensitive information

## Why Use GitHub Secrets?

Using GitHub Secrets provides several benefits:

1. **Security**: Sensitive information is encrypted and not exposed in your code
2. **Separation of Concerns**: Keep configuration separate from code
3. **Environment Management**: Easily manage different environments (development, staging, production)
4. **Access Control**: Only repository administrators can manage secrets

## Required Secrets for ClipFlowAI

The following secrets are required for ClipFlowAI to function properly:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `REACT_APP_SUPABASE_URL` | Your Supabase project URL | `https://xyzproject.supabase.co` |
| `REACT_APP_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `GITHUB_TOKEN` | Automatically provided by GitHub | N/A (automatic) |

Optional secrets for social media integration:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `REACT_APP_INSTAGRAM_CLIENT_ID` | Instagram API client ID | `123456789012345` |
| `REACT_APP_TIKTOK_CLIENT_KEY` | TikTok API client key | `awesomeapikeystring` |
| `REACT_APP_YOUTUBE_API_KEY` | YouTube Data API key | `AIzaSyBR_HVhLJJ8Xz9...` |

## Setting Up GitHub Secrets

### Prerequisites

Before you begin, make sure you have:

1. Administrator access to your GitHub repository
2. Your Supabase project URL and anon key
3. Any social media API credentials you want to use

### Adding Secrets to Your Repository

1. **Navigate to your repository settings**:
   - Go to your GitHub repository
   - Click on "Settings" in the top navigation bar
   - In the left sidebar, click on "Secrets and variables" and then "Actions"

2. **Add a new repository secret**:
   - Click the "New repository secret" button
   - Enter the secret name (e.g., `REACT_APP_SUPABASE_URL`)
   - Enter the secret value (e.g., your Supabase URL)
   - Click "Add secret"

3. **Repeat for all required secrets**:
   - Add `REACT_APP_SUPABASE_ANON_KEY` with your Supabase anon key
   - Add any optional secrets for social media integration

### Verifying Your Secrets

After adding your secrets, you should see them listed in the "Actions secrets" section. The values will be hidden, but you can see when they were last updated.

## Using GitHub Secrets in Workflows

GitHub Secrets are automatically available in GitHub Actions workflows. Here's how to use them:

### In GitHub Actions Workflow Files

Secrets can be accessed using the `secrets` context in your workflow files:

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        env:
          REACT_APP_SUPABASE_URL: ${{ secrets.REACT_APP_SUPABASE_URL }}
          REACT_APP_SUPABASE_ANON_KEY: ${{ secrets.REACT_APP_SUPABASE_ANON_KEY }}
        run: npm run build
        
      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@4.1.4
        with:
          branch: gh-pages
          folder: build
```

### In Environment Files

For local development, you should use a `.env` file that is not committed to the repository. This file should contain the same environment variables as your GitHub Secrets.

Example `.env` file:

```
REACT_APP_SUPABASE_URL=https://xyzproject.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Managing Different Environments

If you need to manage different environments (development, staging, production), you can use environment-specific secrets.

### Setting Up Environment Secrets

1. **Navigate to environments**:
   - Go to your repository settings
   - Click on "Environments" in the left sidebar
   - Click "New environment"
   - Name your environment (e.g., "Production")
   - Click "Configure environment"

2. **Add environment secrets**:
   - Click "Add secret"
   - Enter the secret name and value
   - Click "Add secret"

3. **Update your workflow to use environment secrets**:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: Production
    
    steps:
      # Your deployment steps here
      - name: Build
        env:
          REACT_APP_SUPABASE_URL: ${{ secrets.REACT_APP_SUPABASE_URL }}
          REACT_APP_SUPABASE_ANON_KEY: ${{ secrets.REACT_APP_SUPABASE_ANON_KEY }}
        run: npm run build
```

## Rotating Secrets

It's a good practice to rotate your secrets periodically for security reasons. Here's how to update your secrets:

1. **Generate new credentials**:
   - For Supabase, generate a new API key in the Supabase dashboard
   - For social media APIs, generate new credentials in the respective developer portals

2. **Update the secret in GitHub**:
   - Go to your repository settings
   - Click on "Secrets and variables" and then "Actions"
   - Find the secret you want to update
   - Click "Update"
   - Enter the new value
   - Click "Update secret"

3. **Update your local environment**:
   - Update your local `.env` file with the new values

## Security Best Practices

Follow these best practices to keep your secrets secure:

1. **Limit access to secrets**:
   - Only give repository admin access to trusted collaborators
   - Use environment protection rules for production secrets

2. **Regularly rotate secrets**:
   - Update your secrets periodically
   - Immediately rotate secrets if you suspect they've been compromised

3. **Avoid logging secrets**:
   - Never log secrets in your application
   - Be careful with debugging tools that might expose environment variables

4. **Use the least privilege principle**:
   - For API keys, use the minimum permissions necessary
   - Create separate keys for different environments

5. **Monitor secret usage**:
   - Regularly review GitHub Actions logs
   - Set up alerts for unusual activity

## Troubleshooting

### Secret Not Available in Workflow

If a secret is not available in your workflow:

1. **Check the secret name**:
   - Ensure the secret name in your workflow matches exactly (case-sensitive)
   - Check for typos or extra spaces

2. **Verify the secret exists**:
   - Go to repository settings
   - Check that the secret is listed under "Actions secrets"

3. **Check workflow permissions**:
   - If using environment secrets, ensure the job specifies the correct environment
   - Check that the workflow has permission to access the secret

### Deployment Fails with Authentication Errors

If your deployment fails with authentication errors:

1. **Verify secret values**:
   - Check that your Supabase URL and anon key are correct
   - Ensure the keys are still valid and not expired

2. **Check for format issues**:
   - Some secrets may require specific formatting
   - Ensure there are no extra spaces or line breaks

3. **Look for encoding problems**:
   - Some special characters may need proper encoding
   - Try regenerating the key if you suspect encoding issues

## Conclusion

GitHub Secrets provide a secure way to manage sensitive information for your ClipFlowAI deployment. By following this guide, you've learned how to set up, use, and manage secrets for your repository.

Remember to keep your secrets secure, rotate them regularly, and follow security best practices to protect your application and user data.

## Next Steps

Now that you've set up your GitHub Secrets, you might want to:

- [Set up GitHub Pages deployment](github-pages.md)
- [Configure Supabase for your project](supabase-setup.md)
- [Learn about manual deployment options](manual-deployment.md)
