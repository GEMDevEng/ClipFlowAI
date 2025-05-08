/**
 * Application constants
 */

// API endpoints
export const API_ENDPOINTS = {
  VIDEOS: '/api/videos',
  USERS: '/api/users',
  AUTH: '/api/auth',
  ANALYTICS: '/api/analytics',
  PAYMENT: '/api/payment',
  SOCIAL: '/api/social',
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'clipflow_auth_token',
  USER_DATA: 'clipflow_user_data',
  THEME: 'clipflow_theme',
};

// Video platforms
export const PLATFORMS = {
  YOUTUBE: 'youtube',
  TIKTOK: 'tiktok',
  INSTAGRAM: 'instagram',
  FACEBOOK: 'facebook',
  TWITTER: 'twitter',
};

// Video statuses
export const VIDEO_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  PUBLISHED: 'published',
  FAILED: 'failed',
};

// Video languages
export const LANGUAGES = {
  ENGLISH: 'english',
  SPANISH: 'spanish',
  FRENCH: 'french',
  GERMAN: 'german',
  CHINESE: 'chinese',
  JAPANESE: 'japanese',
};

// Voice profiles
export const VOICE_PROFILES = {
  MALE_1: 'male_1',
  MALE_2: 'male_2',
  FEMALE_1: 'female_1',
  FEMALE_2: 'female_2',
  NEUTRAL: 'neutral',
};

// Analytics periods
export const ANALYTICS_PERIODS = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

// Error messages
export const ERROR_MESSAGES = {
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
export const SUCCESS_MESSAGES = {
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

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  CREATE_VIDEO: '/create',
  VIDEO_DETAILS: '/videos/:id',
  PROFILE: '/profile',
  ANALYTICS: '/analytics',
  SOCIAL_MEDIA: '/social',
  SUBSCRIPTION: '/subscription',
  SUBSCRIPTION_SUCCESS: '/subscription/success',
  SUBSCRIPTION_CANCEL: '/subscription/cancel',
  NOT_FOUND: '/404',
};

// Theme
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
};

// Export all constants
export default {
  API_ENDPOINTS,
  STORAGE_KEYS,
  PLATFORMS,
  VIDEO_STATUS,
  LANGUAGES,
  VOICE_PROFILES,
  ANALYTICS_PERIODS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ROUTES,
  THEME,
  PAGINATION,
};
