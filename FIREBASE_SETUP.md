# Firebase Setup Guide for ClipFlowAI

This guide will walk you through setting up Firebase for the ClipFlowAI project.

## Prerequisites

- A Google account
- A GitHub account
- Basic knowledge of web development

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter "ClipFlowAI" as the project name
4. Choose whether to enable Google Analytics (recommended)
5. Accept the terms and click "Create project"
6. Wait for the project to be created, then click "Continue"

## Step 2: Register Your Web App

1. On the Firebase project dashboard, click the web icon (</>) to add a web app
2. Enter "ClipFlowAI Web" as the app nickname
3. Check the box for "Also set up Firebase Hosting"
4. Click "Register app"
5. Copy the Firebase configuration object (we'll need this later)
6. Click "Next" and then "Continue to console"

## Step 3: Set Up Authentication

1. In the Firebase console, go to "Authentication" from the left sidebar
2. Click "Get started"
3. Enable the following sign-in methods:
   - Email/Password
   - Google
4. For each method, click "Enable" and configure the necessary settings
5. Save your changes

## Step 4: Set Up Firestore Database

1. In the Firebase console, go to "Firestore Database" from the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for now (we'll update security rules later)
4. Select a location closest to your target audience
5. Click "Enable"

## Step 5: Set Up Storage

1. In the Firebase console, go to "Storage" from the left sidebar
2. Click "Get started"
3. Choose "Start in test mode" for now
4. Click "Next" and then "Done"

## Step 6: Configure Security Rules

### Firestore Rules

1. Go to "Firestore Database" > "Rules" tab
2. Replace the default rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /videos/{videoId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

### Storage Rules

1. Go to "Storage" > "Rules" tab
2. Replace the default rules with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /videos/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /thumbnails/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

## Step 7: Add Firebase Configuration to Your Project

1. Create a `.env` file in the `src/frontend` directory
2. Add the following environment variables with your Firebase configuration:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Step 8: Deploy to Firebase Hosting (Alternative to GitHub Pages)

If you prefer to use Firebase Hosting instead of GitHub Pages:

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   - Select Hosting
   - Select your Firebase project
   - Set "src/frontend/build" as the public directory
   - Configure as a single-page app: Yes
   - Set up automatic builds and deploys with GitHub: No (for now)

4. Build your project:
   ```bash
   npm run build
   ```

5. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

## Troubleshooting

- **CORS Issues**: If you encounter CORS issues, make sure your Firebase project has the correct domain listed in the Authentication > Sign-in method > Authorized domains section.
- **Authentication Errors**: Ensure that you've enabled the authentication methods you're trying to use.
- **Storage Access Denied**: Check your Storage rules to ensure they allow the operations you're trying to perform.
- **Firestore Access Denied**: Check your Firestore rules to ensure they allow the operations you're trying to perform.
