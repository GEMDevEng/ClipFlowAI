/**
 * Configuration module for the backend
 */

// Load environment variables
require('dotenv').config();

// Configuration object
const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || '*',
  },
  
  // Supabase configuration
  supabase: {
    url: process.env.SUPABASE_URL || 'https://wkevcxbbnbtlndkkhtgr.supabase.co',
    anonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZXZjeGJibmJ0bG5ka2todGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NzQ5ODYsImV4cCI6MjA2MDE1MDk4Nn0.ZHQ10o6RMrENCu7TDqwauvaqZZLQ_ocli10XqRsHHyc',
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  // Video processing configuration
  video: {
    maxSize: process.env.MAX_VIDEO_SIZE || 100 * 1024 * 1024, // 100MB
    allowedTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'],
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
  },
  
  // Analytics configuration
  analytics: {
    enabled: process.env.ANALYTICS_ENABLED === 'true',
    trackingId: process.env.ANALYTICS_TRACKING_ID,
  },
  
  // Notification configuration
  notifications: {
    email: {
      enabled: process.env.EMAIL_NOTIFICATIONS_ENABLED === 'true',
      from: process.env.EMAIL_FROM || 'noreply@clipflowai.com',
      service: process.env.EMAIL_SERVICE || 'sendgrid',
      apiKey: process.env.EMAIL_API_KEY,
    },
    push: {
      enabled: process.env.PUSH_NOTIFICATIONS_ENABLED === 'true',
      vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
      vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
    },
  },
  
  // Social media configuration
  social: {
    youtube: {
      enabled: process.env.YOUTUBE_ENABLED === 'true',
      clientId: process.env.YOUTUBE_CLIENT_ID,
      clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
      redirectUri: process.env.YOUTUBE_REDIRECT_URI,
    },
    tiktok: {
      enabled: process.env.TIKTOK_ENABLED === 'true',
      clientKey: process.env.TIKTOK_CLIENT_KEY,
      clientSecret: process.env.TIKTOK_CLIENT_SECRET,
      redirectUri: process.env.TIKTOK_REDIRECT_URI,
    },
    instagram: {
      enabled: process.env.INSTAGRAM_ENABLED === 'true',
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      redirectUri: process.env.INSTAGRAM_REDIRECT_URI,
    },
    facebook: {
      enabled: process.env.FACEBOOK_ENABLED === 'true',
      appId: process.env.FACEBOOK_APP_ID,
      appSecret: process.env.FACEBOOK_APP_SECRET,
      redirectUri: process.env.FACEBOOK_REDIRECT_URI,
    },
    twitter: {
      enabled: process.env.TWITTER_ENABLED === 'true',
      apiKey: process.env.TWITTER_API_KEY,
      apiSecret: process.env.TWITTER_API_SECRET,
      redirectUri: process.env.TWITTER_REDIRECT_URI,
    },
  },
};

module.exports = config;
