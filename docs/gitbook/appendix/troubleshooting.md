# Troubleshooting

This guide provides solutions to common issues you might encounter when using ClipFlowAI.

## Installation Issues

### Node.js Version Errors

**Issue**: Error messages related to Node.js version compatibility.

**Solution**:
1. Check your Node.js version:
   ```bash
   node -v
   ```
2. Ensure you're using Node.js v14 or higher
3. If needed, update Node.js from [nodejs.org](https://nodejs.org/)

### Dependency Installation Failures

**Issue**: Errors when installing dependencies with npm.

**Solution**:
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```
2. Delete node_modules directory and package-lock.json:
   ```bash
   rm -rf node_modules package-lock.json
   ```
3. Reinstall dependencies:
   ```bash
   npm install
   ```

### Build Errors

**Issue**: Errors when building the application.

**Solution**:
1. Check for syntax errors in your code
2. Ensure all required environment variables are set
3. Try building with verbose output:
   ```bash
   npm run build -- --verbose
   ```

## Authentication Issues

### Can't Sign Up or Log In

**Issue**: Unable to create an account or log in.

**Solution**:
1. Check your Supabase URL and anon key in the `.env` file
2. Verify that authentication is enabled in your Supabase project
3. Check browser console for specific error messages
4. Try clearing browser cookies and cache

### Email Verification Not Working

**Issue**: Not receiving email verification links.

**Solution**:
1. Check spam/junk folder
2. Verify email settings in your Supabase project
3. Try using a different email address
4. Temporarily disable email confirmation in Supabase for testing

## Video Creation Issues

### Video Generation Fails

**Issue**: Video generation process fails or freezes.

**Solution**:
1. Check browser console for error messages
2. Ensure your browser supports WebAssembly
3. Try using a different browser (Chrome or Firefox recommended)
4. Close other applications to free up system resources
5. Try with a simpler prompt or smaller background image

### Text-to-Speech Not Working

**Issue**: No audio in generated videos.

**Solution**:
1. Check if your browser supports Web Speech API
2. Ensure your device has audio capabilities
3. Try a different browser
4. Check if your prompt contains valid text for speech synthesis

### Poor Video Quality

**Issue**: Generated videos have low quality or visual artifacts.

**Solution**:
1. Use higher resolution background images
2. Check your internet connection speed
3. Adjust video quality settings if available
4. Try generating a shorter video

## Storage Issues

### Can't Upload Files

**Issue**: Unable to upload background images or other files.

**Solution**:
1. Check file size (keep under 10MB)
2. Ensure file format is supported (JPG, PNG, MP4)
3. Verify storage bucket permissions in Supabase
4. Check browser console for specific error messages

### Videos Not Saving

**Issue**: Generated videos not appearing in dashboard.

**Solution**:
1. Check browser console for error messages
2. Verify Supabase storage permissions
3. Check database connection
4. Ensure you have sufficient storage quota in Supabase

## Deployment Issues

### GitHub Pages Deployment Fails

**Issue**: Unable to deploy to GitHub Pages.

**Solution**:
1. Check GitHub Actions logs for error messages
2. Verify GitHub repository settings
3. Ensure gh-pages package is installed
4. Check that your repository has the correct permissions

### 404 Errors After Deployment

**Issue**: Getting 404 errors when navigating to pages.

**Solution**:
1. Ensure you're using HashRouter instead of BrowserRouter
2. Check the `homepage` field in package.json
3. Verify that the 404.html file is properly set up
4. Check GitHub Pages settings in your repository

## Browser Compatibility Issues

**Issue**: Application doesn't work in certain browsers.

**Solution**:
1. Use a modern browser (Chrome, Firefox, Safari, Edge)
2. Update your browser to the latest version
3. Check browser console for specific error messages
4. Disable browser extensions that might interfere

## Supabase Connection Issues

**Issue**: Unable to connect to Supabase.

**Solution**:
1. Verify your Supabase URL and anon key
2. Check if your Supabase project is active
3. Add your domain to the allowed CORS origins in Supabase
4. Check network tab in browser developer tools for specific errors

## Performance Issues

**Issue**: Application runs slowly or crashes.

**Solution**:
1. Close other applications to free up system resources
2. Use a computer with better specifications
3. Try generating shorter videos
4. Clear browser cache and cookies
5. Disable browser extensions

## Still Having Issues?

If you're still experiencing problems after trying these solutions:

1. Check the [GitHub Issues](https://github.com/GEMDevEng/ClipFlowAI/issues) to see if others have reported the same problem
2. Create a new issue with detailed information about the problem
3. Include:
   - Steps to reproduce the issue
   - Expected behavior
   - Actual behavior
   - Screenshots or error messages
   - Browser and operating system information
