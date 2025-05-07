/**
 * Shared constants for both frontend and backend
 */

// API endpoints
exports.API_ENDPOINTS = {
  VIDEOS: '/api/videos',
  USERS: '/api/users',
  AUTH: '/api/auth',
  ANALYTICS: '/api/analytics',
  PAYMENT: '/api/payment',
  SOCIAL: '/api/social',
};

// Video platforms
exports.PLATFORMS = {
  YOUTUBE: 'youtube',
  TIKTOK: 'tiktok',
  INSTAGRAM: 'instagram',
  FACEBOOK: 'facebook',
  TWITTER: 'twitter',
};

// Video statuses
exports.VIDEO_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  PUBLISHED: 'published',
  FAILED: 'failed',
};

// Video languages
exports.LANGUAGES = {
  ENGLISH: 'english',
  SPANISH: 'spanish',
  FRENCH: 'french',
  GERMAN: 'german',
  CHINESE: 'chinese',
  JAPANESE: 'japanese',
};

// Voice profiles
exports.VOICE_PROFILES = {
  MALE_1: 'male_1',
  MALE_2: 'male_2',
  FEMALE_1: 'female_1',
  FEMALE_2: 'female_2',
  NEUTRAL: 'neutral',
};

// Analytics periods
exports.ANALYTICS_PERIODS = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

// Error messages
exports.ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password.',
    EMAIL_IN_USE: 'Email is already in use.',
    WEAK_PASSWORD: 'Password is too weak.',
    UNAUTHORIZED: 'You must be logged in to perform this action.',
  },
  VIDEO: {
    NOT_FOUND: 'Video not found.',
    UPLOAD_FAILED: 'Failed to upload video.',
    PROCESSING_FAILED: 'Failed to process video.',
  },
};

// Success messages
exports.SUCCESS_MESSAGES = {
  AUTH: {
    SIGNUP: 'Account created successfully.',
    LOGIN: 'Logged in successfully.',
    LOGOUT: 'Logged out successfully.',
    PASSWORD_RESET: 'Password reset email sent.',
  },
  VIDEO: {
    CREATED: 'Video created successfully.',
    UPDATED: 'Video updated successfully.',
    DELETED: 'Video deleted successfully.',
    PUBLISHED: 'Video published successfully.',
  },
};
