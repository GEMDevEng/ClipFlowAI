# ClipFlowAI Quick Start Guide

This guide will help you quickly set up and start using ClipFlowAI.

## 1. Clone the Repository

```bash
git clone https://github.com/GEMDevEng/ClipFlowAI.git
cd ClipFlowAI
```

## 2. Install Dependencies

```bash
npm run install:all
```

## 3. Set Up Firebase

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
2. Enable Authentication, Firestore, and Storage
3. Get your Firebase configuration

## 4. Configure Environment Variables

Create a `.env` file in the `src/frontend` directory:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## 5. Start the Development Server

```bash
npm start
```

## 6. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 7. Create Your First Video

1. Sign up for an account
2. Go to the "Create Video" page
3. Enter a title and prompt
4. Upload a background image
5. Select platforms for sharing
6. Click "Create Video"

## 8. Deploy to GitHub Pages

```bash
npm run deploy
```

## 9. Access Your Deployed Application

Your application will be available at:
```
https://gemdeveng.github.io/ClipFlowAI/
```

## 10. Next Steps

- Customize the application to fit your needs
- Set up proper Firebase security rules
- Add additional features
- Share your videos on social media

For more detailed information, refer to:
- README.md - Main project documentation
- FIREBASE_SETUP.md - Detailed Firebase setup instructions
- DEPLOYMENT_GUIDE.md - Comprehensive deployment guide
