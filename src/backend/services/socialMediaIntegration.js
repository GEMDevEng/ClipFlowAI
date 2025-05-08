/**
 * Social Media Integration Service
 * 
 * This service handles the integration with various social media platforms
 * through OAuth authentication and API calls.
 */
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// Base URL for the OAuth service
const OAUTH_BASE_URL = process.env.OAUTH_SERVICE_URL || 'https://api.clipflowai.com';

/**
 * Connect to a social media platform using OAuth
 * @param {string} userId - User ID
 * @param {string} platform - Platform name (youtube, tiktok, instagram, etc.)
 * @param {string} authCode - Authorization code from OAuth flow
 * @returns {Promise<Object>} - Connection result
 */
const connectPlatform = async (userId, platform, authCode) => {
  try {
    console.log(`Connecting user ${userId} to ${platform} with auth code`);

    // In a real implementation, this would call the OAuth service
    // For now, we'll simulate a successful connection
    const response = await axios.post(`${OAUTH_BASE_URL}/oauth/token`, {
      code: authCode,
      grant_type: 'authorization_code',
      platform,
      user_id: userId
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error(`Error connecting to ${platform}:`, error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Disconnect from a social media platform
 * @param {string} userId - User ID
 * @param {string} platformId - Platform ID
 * @returns {Promise<Object>} - Disconnection result
 */
const disconnectPlatform = async (userId, platformId) => {
  try {
    console.log(`Disconnecting user ${userId} from platform ${platformId}`);

    // In a real implementation, this would call the OAuth service
    // For now, we'll simulate a successful disconnection
    const response = await axios.post(`${OAUTH_BASE_URL}/oauth/revoke`, {
      platform_id: platformId,
      user_id: userId
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error(`Error disconnecting from platform ${platformId}:`, error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get the status of a connected platform
 * @param {string} userId - User ID
 * @param {string} platformId - Platform ID
 * @returns {Promise<Object>} - Platform status
 */
const getPlatformStatus = async (userId, platformId) => {
  try {
    console.log(`Getting status for platform ${platformId} for user ${userId}`);

    // In a real implementation, this would call the OAuth service
    // For now, we'll simulate a successful status check
    const response = await axios.get(`${OAUTH_BASE_URL}/platforms/${platformId}`, {
      params: {
        user_id: userId
      }
    });

    return response.data;
  } catch (error) {
    console.error(`Error getting status for platform ${platformId}:`, error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Refresh the access token for a platform
 * @param {string} userId - User ID
 * @param {string} platformId - Platform ID
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} - Refresh result
 */
const refreshPlatformToken = async (userId, platformId, refreshToken) => {
  try {
    console.log(`Refreshing token for platform ${platformId} for user ${userId}`);

    // In a real implementation, this would call the OAuth service
    // For now, we'll simulate a successful token refresh
    const response = await axios.post(`${OAUTH_BASE_URL}/oauth/refresh`, {
      platform_id: platformId,
      refresh_token: refreshToken,
      user_id: userId
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error(`Error refreshing token for platform ${platformId}:`, error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get the OAuth URL for a platform
 * @param {string} platform - Platform name
 * @param {string} redirectUri - Redirect URI after OAuth
 * @returns {string} - OAuth URL
 */
const getOAuthUrl = (platform, redirectUri) => {
  // In a real implementation, this would generate the correct OAuth URL
  // For now, we'll return a mock URL
  const clientId = process.env[`${platform.toUpperCase()}_CLIENT_ID`] || 'mock-client-id';
  const scope = getOAuthScope(platform);
  
  return `https://${platform}.com/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code`;
};

/**
 * Get the OAuth scope for a platform
 * @param {string} platform - Platform name
 * @returns {string} - OAuth scope
 */
const getOAuthScope = (platform) => {
  switch (platform) {
    case 'youtube':
      return 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly';
    case 'tiktok':
      return 'user.info.basic video.upload video.list';
    case 'instagram':
      return 'user_profile,user_media';
    default:
      return '';
  }
};

module.exports = {
  connectPlatform,
  disconnectPlatform,
  getPlatformStatus,
  refreshPlatformToken,
  getOAuthUrl
};
