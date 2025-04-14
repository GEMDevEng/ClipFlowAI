# Manual Deployment

This guide provides instructions for manually deploying ClipFlowAI to various hosting platforms. While GitHub Pages is the recommended deployment method for a $0 budget approach, there may be cases where you want to deploy to other platforms or need more control over the deployment process.

## Prerequisites

Before proceeding with manual deployment, ensure you have:

1. A complete build of the ClipFlowAI application
2. Node.js and npm installed on your machine
3. Access to your chosen hosting platform
4. Necessary environment variables and API keys

## Building the Application

First, you need to create a production build of the application:

1. Clone the repository (if you haven't already):
   ```bash
   git clone https://github.com/GEMDevEng/ClipFlowAI.git
   cd ClipFlowAI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your environment variables:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Build the application:
   ```bash
   npm run build
   ```

This will create a `build` directory containing the production-ready files.

## Deployment Options

### Option 1: Manual Deployment to GitHub Pages

If you prefer to manually deploy to GitHub Pages instead of using the automated workflow:

1. Install the `gh-pages` package if not already installed:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add the following scripts to your `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

3. Add the homepage field to your `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/ClipFlowAI"
   ```

4. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

### Option 2: Deployment to Netlify

Netlify offers a generous free tier that works well for static sites:

#### Using the Netlify CLI

1. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize your site:
   ```bash
   netlify init
   ```

4. Deploy your site:
   ```bash
   netlify deploy --prod
   ```

#### Using the Netlify UI

1. Go to [Netlify](https://app.netlify.com/) and sign up or log in
2. Click "New site from Git"
3. Connect to your GitHub repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
5. Click "Deploy site"

#### Environment Variables in Netlify

To set up environment variables in Netlify:

1. Go to your site dashboard
2. Navigate to Site settings > Build & deploy > Environment
3. Click "Edit variables"
4. Add your environment variables:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`

### Option 3: Deployment to Vercel

Vercel is another excellent platform with a free tier:

#### Using the Vercel CLI

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy your site:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

#### Using the Vercel UI

1. Go to [Vercel](https://vercel.com/) and sign up or log in
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Click "Deploy"

#### Environment Variables in Vercel

To set up environment variables in Vercel:

1. Go to your project dashboard
2. Navigate to Settings > Environment Variables
3. Add your environment variables:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`

### Option 4: Deployment to Firebase Hosting

Firebase Hosting offers a free tier with some limitations:

1. Install the Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize your project:
   ```bash
   firebase init
   ```
   - Select "Hosting"
   - Select your Firebase project or create a new one
   - Specify `build` as your public directory
   - Configure as a single-page app: Yes
   - Set up automatic builds and deploys with GitHub: No (for manual deployment)

4. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

### Option 5: Deployment to AWS S3 + CloudFront

For more advanced users, AWS offers a way to host static websites:

1. Install the AWS CLI and configure it with your credentials:
   ```bash
   pip install awscli
   aws configure
   ```

2. Create an S3 bucket:
   ```bash
   aws s3 mb s3://your-bucket-name
   ```

3. Configure the bucket for static website hosting:
   ```bash
   aws s3 website s3://your-bucket-name --index-document index.html --error-document index.html
   ```

4. Set bucket policy for public access:
   ```bash
   aws s3api put-bucket-policy --bucket your-bucket-name --policy file://bucket-policy.json
   ```
   
   Create a `bucket-policy.json` file with:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```

5. Upload your build files:
   ```bash
   aws s3 sync build/ s3://your-bucket-name --acl public-read
   ```

6. (Optional) Set up CloudFront for CDN:
   - Go to the AWS Management Console
   - Navigate to CloudFront
   - Create a new distribution
   - Set your S3 bucket as the origin
   - Configure cache settings as needed

## Handling Routing in Single-Page Applications

ClipFlowAI is a single-page application (SPA), which means it uses client-side routing. When deploying manually, you need to ensure that all routes redirect to `index.html`:

### For GitHub Pages

Create a `404.html` file in the `public` directory with a script to redirect to the main page:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <script>
    sessionStorage.redirect = location.href;
  </script>
  <meta http-equiv="refresh" content="0;URL='/'">
</head>
<body>
  Redirecting...
</body>
</html>
```

Then, add this script to your `index.html`:

```html
<script>
  (function() {
    var redirect = sessionStorage.redirect;
    delete sessionStorage.redirect;
    if (redirect && redirect != location.href) {
      history.replaceState(null, null, redirect);
    }
  })();
</script>
```

### For Netlify

Create a `_redirects` file in the `public` directory:

```
/*    /index.html   200
```

### For Vercel

Create a `vercel.json` file in the root directory:

```json
{
  "routes": [
    { "src": "/[^.]+", "dest": "/", "status": 200 }
  ]
}
```

### For Firebase Hosting

The `firebase.json` file should include:

```json
{
  "hosting": {
    "public": "build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### For AWS S3 + CloudFront

Configure error pages in CloudFront:
- Error Code: 403
- Response Page Path: /index.html
- HTTP Response Code: 200

## Environment Variables

When deploying manually, you need to ensure that environment variables are properly set:

1. **Development Variables**: Store in a `.env` file (not committed to Git)
2. **Production Variables**: Set in your hosting platform's environment settings

### Creating a .env File

Create a `.env` file in the root directory:

```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

For different environments, you can use:
- `.env.development` for development
- `.env.production` for production
- `.env.local` for local overrides (not committed to Git)

## Custom Domain Configuration

If you want to use a custom domain instead of the default hosting URL:

### GitHub Pages

1. Go to your repository settings
2. Scroll down to the "GitHub Pages" section
3. Under "Custom domain", enter your domain
4. Click "Save"
5. Configure your domain's DNS settings:
   - Type: CNAME
   - Name: www (or subdomain)
   - Value: yourusername.github.io

### Netlify

1. Go to your site dashboard
2. Click "Domain settings"
3. Click "Add custom domain"
4. Enter your domain name
5. Follow the instructions to configure DNS

### Vercel

1. Go to your project dashboard
2. Click "Settings" > "Domains"
3. Enter your domain name
4. Follow the instructions to configure DNS

### Firebase Hosting

1. In the Firebase console, go to Hosting
2. Click "Connect domain"
3. Enter your domain name
4. Follow the instructions to verify ownership and configure DNS

### AWS CloudFront

1. In the CloudFront console, select your distribution
2. Click "Edit"
3. Under "Alternate Domain Names (CNAMEs)", add your domain
4. Set up SSL certificate using AWS Certificate Manager
5. Update your DNS settings to point to the CloudFront distribution

## Continuous Deployment

For automated deployments when you push changes:

### GitHub Actions for Custom Platforms

Create a `.github/workflows/deploy.yml` file:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
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
        
      # Deploy to your chosen platform
      # Example for Netlify:
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Troubleshooting

### 404 Errors After Deployment

If you're getting 404 errors when navigating to routes:

1. Ensure you've configured routing correctly for your hosting platform
2. Check that the build process completed successfully
3. Verify that all files were uploaded to the hosting platform
4. Clear your browser cache and try again

### Environment Variables Not Working

If your environment variables aren't being recognized:

1. Ensure they are prefixed with `REACT_APP_` for Create React App
2. Verify they are correctly set in your hosting platform
3. Rebuild the application after setting the variables
4. Check for typos in variable names

### CORS Issues

If you're experiencing CORS issues with Supabase:

1. Go to your Supabase project settings
2. Navigate to API settings
3. Add your deployed URL to the allowed origins

### Build Failures

If your build is failing:

1. Check the build logs for specific errors
2. Ensure all dependencies are installed
3. Verify that your Node.js version is compatible
4. Try building locally first to identify issues

## Conclusion

Manual deployment gives you more control over the deployment process and allows you to choose the hosting platform that best fits your needs. While GitHub Pages is recommended for a $0 budget approach, other platforms like Netlify, Vercel, Firebase, and AWS offer additional features that might be beneficial for your specific use case.

Remember to properly configure environment variables, handle routing for your single-page application, and set up continuous deployment for a smoother workflow.

## Next Steps

After successfully deploying your application, you might want to:

- [Set up a custom domain](custom-domain.md)
- [Configure Supabase for your project](supabase-setup.md)
- [Learn about testing your deployment](testing-guide.md)
