/**
 * Social Media Service
 *
 * This service handles the integration with various social media platforms
 * through the backend API and provides sharing functionality.
 */
import axios from 'axios';
import { supabase } from '../config/supabase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Get all connected platforms for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of connected platforms
 */
export const getConnectedPlatforms = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('social_platforms')
      .select('*')
      .eq('user_id', userId);

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error('Error getting connected platforms:', error);
    throw error;
  }
};

/**
 * Connect to a social media platform
 * @param {string} userId - User ID
 * @param {string} platform - Platform name (youtube, tiktok, instagram, etc.)
 * @param {string} authCode - Authorization code from OAuth flow
 * @returns {Promise<Object>} - Connection result
 */
export const connectPlatform = async (userId, platform, authCode) => {
  try {
    const response = await axios.post(`${API_URL}/api/social/connect`, {
      user_id: userId,
      platform,
      auth_code: authCode
    });

    return response.data;
  } catch (error) {
    console.error(`Error connecting to ${platform}:`, error);
    throw error;
  }
};

/**
 * Disconnect from a social media platform
 * @param {string} userId - User ID
 * @param {string} platformId - Platform ID
 * @returns {Promise<Object>} - Disconnection result
 */
export const disconnectPlatform = async (userId, platformId) => {
  try {
    const response = await axios.post(`${API_URL}/api/social/disconnect`, {
      user_id: userId,
      platform_id: platformId
    });

    return response.data;
  } catch (error) {
    console.error(`Error disconnecting platform ${platformId}:`, error);
    throw error;
  }
};

/**
 * Get the status of a connected platform
 * @param {string} userId - User ID
 * @param {string} platformId - Platform ID
 * @returns {Promise<Object>} - Platform status
 */
export const getPlatformStatus = async (userId, platformId) => {
  try {
    const response = await axios.get(`${API_URL}/api/social/status/${platformId}`, {
      params: { user_id: userId }
    });

    return response.data;
  } catch (error) {
    console.error(`Error getting status for platform ${platformId}:`, error);
    throw error;
  }
};

/**
 * Refresh the access token for a platform
 * @param {string} userId - User ID
 * @param {string} platformId - Platform ID
 * @returns {Promise<Object>} - Refresh result
 */
export const refreshPlatformToken = async (userId, platformId) => {
  try {
    const response = await axios.post(`${API_URL}/api/social/refresh`, {
      user_id: userId,
      platform_id: platformId
    });

    return response.data;
  } catch (error) {
    console.error(`Error refreshing token for platform ${platformId}:`, error);
    throw error;
  }
};

/**
 * Publish a video to social media platforms
 * @param {string} userId - User ID
 * @param {string} videoId - Video ID
 * @param {Array<string>} platforms - Array of platform names to publish to
 * @param {Object} options - Publishing options
 * @returns {Promise<Object>} - Publishing result
 */
export const publishVideo = async (userId, videoId, platforms, options = {}) => {
  try {
    const response = await axios.post(`${API_URL}/api/social/publish`, {
      user_id: userId,
      video_id: videoId,
      platforms,
      options
    });

    return response.data;
  } catch (error) {
    console.error(`Error publishing video ${videoId}:`, error);
    throw error;
  }
};

/**
 * Schedule a video for publishing
 * @param {string} userId - User ID
 * @param {string} videoId - Video ID
 * @param {Array<string>} platforms - Array of platform names to publish to
 * @param {Date} publishDate - Date to publish the video
 * @param {Object} options - Publishing options
 * @returns {Promise<Object>} - Scheduling result
 */
export const scheduleVideo = async (userId, videoId, platforms, publishDate, options = {}) => {
  try {
    const response = await axios.post(`${API_URL}/api/social/schedule`, {
      user_id: userId,
      video_id: videoId,
      platforms,
      publish_date: publishDate.toISOString(),
      options
    });

    return response.data;
  } catch (error) {
    console.error(`Error scheduling video ${videoId}:`, error);
    throw error;
  }
};

/**
 * Get publishing history for a user
 * @param {string} userId - User ID
 * @param {Object} filters - Filters for the history
 * @returns {Promise<Array>} - Publishing history
 */
export const getPublishingHistory = async (userId, filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/api/social/history`, {
      params: {
        user_id: userId,
        ...filters
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error getting publishing history:', error);
    throw error;
  }
};

/**
 * Get video status on all platforms
 * @param {string} userId - User ID
 * @param {string} videoId - Video ID
 * @returns {Promise<Object>} - Video status data
 */
export const getVideoStatus = async (userId, videoId) => {
  try {
    const response = await axios.get(`${API_URL}/api/social/video-status/${videoId}`, {
      params: { user_id: userId }
    });

    return response.data;
  } catch (error) {
    console.error(`Error getting status for video ${videoId}:`, error);
    throw error;
  }
};

/**
 * Get video analytics from all platforms
 * @param {string} userId - User ID
 * @param {string} videoId - Video ID
 * @returns {Promise<Object>} - Video analytics data
 */
export const getVideoAnalytics = async (userId, videoId) => {
  try {
    const response = await axios.get(`${API_URL}/api/social/video-analytics/${videoId}`, {
      params: { user_id: userId }
    });

    return response.data;
  } catch (error) {
    console.error(`Error getting analytics for video ${videoId}:`, error);
    throw error;
  }
};

/**
 * Generate a TikTok sharing link
 * @param {string} videoUrl - URL of the video
 * @param {string} caption - Caption for the video
 * @returns {string} - TikTok sharing URL
 */
export const shareTikTok = (videoUrl, caption) => {
  // TikTok doesn't have a direct sharing URL structure for videos
  // This will open TikTok's upload page
  return 'https://www.tiktok.com/upload';
};

/**
 * Generate an Instagram sharing link
 * @param {string} videoUrl - URL of the video
 * @param {string} caption - Caption for the video
 * @returns {string} - Instagram sharing URL
 */
export const shareInstagram = (videoUrl, caption) => {
  // Instagram doesn't have a direct sharing URL structure for videos
  // This will open Instagram's website
  return 'https://www.instagram.com';
};

/**
 * Generate a YouTube sharing link
 * @param {string} videoUrl - URL of the video
 * @param {string} title - Title for the video
 * @param {string} description - Description for the video
 * @returns {string} - YouTube sharing URL
 */
export const shareYouTube = (videoUrl, title, description) => {
  // YouTube doesn't have a direct sharing URL structure for videos
  // This will open YouTube's upload page
  return 'https://www.youtube.com/upload';
};

/**
 * Generate a Twitter/X sharing link
 * @param {string} text - Text to share
 * @param {string} url - URL to share
 * @returns {string} - Twitter sharing URL
 */
export const shareTwitter = (text, url) => {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);
  return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
};

/**
 * Generate a Facebook sharing link
 * @param {string} url - URL to share
 * @returns {string} - Facebook sharing URL
 */
export const shareFacebook = (url) => {
  const encodedUrl = encodeURIComponent(url);
  return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
};

/**
 * Generate a LinkedIn sharing link
 * @param {string} url - URL to share
 * @param {string} title - Title for the post
 * @param {string} summary - Summary for the post
 * @returns {string} - LinkedIn sharing URL
 */
export const shareLinkedIn = (url, title, summary) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedSummary = encodeURIComponent(summary);
  return `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedSummary}`;
};

/**
 * Generate a WhatsApp sharing link
 * @param {string} text - Text to share
 * @param {string} url - URL to share
 * @returns {string} - WhatsApp sharing URL
 */
export const shareWhatsApp = (text, url) => {
  const encodedText = encodeURIComponent(`${text} ${url}`);
  return `https://wa.me/?text=${encodedText}`;
};

/**
 * Generate a Telegram sharing link
 * @param {string} text - Text to share
 * @param {string} url - URL to share
 * @returns {string} - Telegram sharing URL
 */
export const shareTelegram = (text, url) => {
  const encodedText = encodeURIComponent(`${text} ${url}`);
  return `https://t.me/share/url?url=${encodedText}`;
};
