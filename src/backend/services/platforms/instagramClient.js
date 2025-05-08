/**
 * Instagram API Client
 * 
 * This service handles the integration with Instagram API for video uploads and management.
 */
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const { supabase } = require('../../config/supabaseClient');

// Instagram Graph API base URL
const INSTAGRAM_API_BASE_URL = 'https://graph.facebook.com/v18.0';

/**
 * Upload a video to Instagram Reels
 * @param {string} videoUrl - URL of the video to upload
 * @param {Object} metadata - Video metadata (title, description, tags, etc.)
 * @param {Object} tokens - OAuth tokens (access_token, refresh_token)
 * @returns {Promise<Object>} - Upload result
 */
const uploadVideo = async (videoUrl, metadata, tokens) => {
  try {
    console.log(`Uploading video to Instagram Reels: ${metadata.title}`);
    
    // Download the video to a temporary file
    const tempFilePath = path.join(os.tmpdir(), `instagram-upload-${uuidv4()}.mp4`);
    const writer = fs.createWriteStream(tempFilePath);
    
    const response = await axios({
      url: videoUrl,
      method: 'GET',
      responseType: 'stream'
    });
    
    response.data.pipe(writer);
    
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    
    // Get Instagram account ID
    const accountResponse = await axios.get(
      `${INSTAGRAM_API_BASE_URL}/me/accounts`,
      {
        params: {
          access_token: tokens.access_token
        }
      }
    );
    
    const pageId = accountResponse.data.data[0].id;
    
    // Get Instagram business account ID
    const igAccountResponse = await axios.get(
      `${INSTAGRAM_API_BASE_URL}/${pageId}`,
      {
        params: {
          fields: 'instagram_business_account',
          access_token: tokens.access_token
        }
      }
    );
    
    const igAccountId = igAccountResponse.data.instagram_business_account.id;
    
    // Step 1: Create container
    const containerResponse = await axios.post(
      `${INSTAGRAM_API_BASE_URL}/${igAccountId}/media`,
      null,
      {
        params: {
          media_type: 'REELS',
          video_url: videoUrl,
          caption: metadata.description || metadata.title,
          access_token: tokens.access_token
        }
      }
    );
    
    const containerId = containerResponse.data.id;
    
    // Step 2: Publish container
    const publishResponse = await axios.post(
      `${INSTAGRAM_API_BASE_URL}/${igAccountId}/media_publish`,
      null,
      {
        params: {
          creation_id: containerId,
          access_token: tokens.access_token
        }
      }
    );
    
    // Clean up the temporary file
    fs.unlinkSync(tempFilePath);
    
    const mediaId = publishResponse.data.id;
    
    return {
      platform: 'instagram',
      status: 'published',
      publishedUrl: `https://www.instagram.com/p/${mediaId}`,
      publishedAt: new Date().toISOString(),
      platformVideoId: mediaId
    };
  } catch (error) {
    console.error('Error uploading to Instagram:', error.message);
    return {
      platform: 'instagram',
      status: 'failed',
      error: error.message
    };
  }
};

/**
 * Get video status from Instagram
 * @param {string} mediaId - Instagram media ID
 * @param {Object} tokens - OAuth tokens (access_token, refresh_token)
 * @returns {Promise<Object>} - Video status
 */
const getVideoStatus = async (mediaId, tokens) => {
  try {
    // Get video status
    const res = await axios.get(
      `${INSTAGRAM_API_BASE_URL}/${mediaId}`,
      {
        params: {
          fields: 'id,media_type,media_url,permalink,thumbnail_url,timestamp,caption,like_count,comments_count',
          access_token: tokens.access_token
        }
      }
    );
    
    return {
      platform: 'instagram',
      status: 'published', // Instagram doesn't provide a status field
      statistics: {
        likes: res.data.like_count,
        comments: res.data.comments_count
      }
    };
  } catch (error) {
    console.error('Error getting Instagram video status:', error.message);
    return {
      platform: 'instagram',
      status: 'error',
      error: error.message
    };
  }
};

/**
 * Get analytics for an Instagram video
 * @param {string} mediaId - Instagram media ID
 * @param {Object} tokens - OAuth tokens (access_token, refresh_token)
 * @returns {Promise<Object>} - Video analytics
 */
const getVideoAnalytics = async (mediaId, tokens) => {
  try {
    // Get Instagram account ID
    const accountResponse = await axios.get(
      `${INSTAGRAM_API_BASE_URL}/me/accounts`,
      {
        params: {
          access_token: tokens.access_token
        }
      }
    );
    
    const pageId = accountResponse.data.data[0].id;
    
    // Get Instagram business account ID
    const igAccountResponse = await axios.get(
      `${INSTAGRAM_API_BASE_URL}/${pageId}`,
      {
        params: {
          fields: 'instagram_business_account',
          access_token: tokens.access_token
        }
      }
    );
    
    const igAccountId = igAccountResponse.data.instagram_business_account.id;
    
    // Get video insights
    const res = await axios.get(
      `${INSTAGRAM_API_BASE_URL}/${mediaId}/insights`,
      {
        params: {
          metric: 'engagement,impressions,reach,saved,video_views',
          access_token: tokens.access_token
        }
      }
    );
    
    return {
      platform: 'instagram',
      analytics: res.data.data
    };
  } catch (error) {
    console.error('Error getting Instagram video analytics:', error.message);
    return {
      platform: 'instagram',
      status: 'error',
      error: error.message
    };
  }
};

module.exports = {
  uploadVideo,
  getVideoStatus,
  getVideoAnalytics
};
