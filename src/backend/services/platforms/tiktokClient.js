/**
 * TikTok API Client
 * 
 * This service handles the integration with TikTok API for video uploads and management.
 */
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const { supabase } = require('../../config/supabaseClient');

// TikTok API base URL
const TIKTOK_API_BASE_URL = 'https://open.tiktokapis.com/v2';

/**
 * Upload a video to TikTok
 * @param {string} videoUrl - URL of the video to upload
 * @param {Object} metadata - Video metadata (title, description, tags, etc.)
 * @param {Object} tokens - OAuth tokens (access_token, refresh_token)
 * @returns {Promise<Object>} - Upload result
 */
const uploadVideo = async (videoUrl, metadata, tokens) => {
  try {
    console.log(`Uploading video to TikTok: ${metadata.title}`);
    
    // Download the video to a temporary file
    const tempFilePath = path.join(os.tmpdir(), `tiktok-upload-${uuidv4()}.mp4`);
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
    
    // Step 1: Initialize upload
    const initResponse = await axios.post(
      `${TIKTOK_API_BASE_URL}/video/upload/`,
      {
        source_info: {
          source: 'PULL_FROM_URL',
          video_size: fs.statSync(tempFilePath).size,
          chunk_size: 0,
          total_chunk_count: 1
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const { upload_id } = initResponse.data.data;
    
    // Step 2: Upload video
    const formData = new FormData();
    formData.append('video', fs.createReadStream(tempFilePath));
    
    await axios.post(
      `${TIKTOK_API_BASE_URL}/video/upload/?upload_id=${upload_id}`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
          ...formData.getHeaders()
        }
      }
    );
    
    // Step 3: Create post
    const createPostResponse = await axios.post(
      `${TIKTOK_API_BASE_URL}/video/publish/`,
      {
        upload_id,
        title: metadata.title,
        description: metadata.description || '',
        privacy_level: metadata.privacyStatus || 'PUBLIC',
        disable_comment: false,
        disable_duet: false,
        disable_stitch: false,
        brand_content_toggle: false,
        brand_organic_toggle: false,
        auto_add_music: true,
        auto_add_text: true
      },
      {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Clean up the temporary file
    fs.unlinkSync(tempFilePath);
    
    const { video_id } = createPostResponse.data.data;
    
    return {
      platform: 'tiktok',
      status: 'published',
      publishedUrl: `https://www.tiktok.com/@${metadata.username}/video/${video_id}`,
      publishedAt: new Date().toISOString(),
      platformVideoId: video_id
    };
  } catch (error) {
    console.error('Error uploading to TikTok:', error.message);
    return {
      platform: 'tiktok',
      status: 'failed',
      error: error.message
    };
  }
};

/**
 * Get video status from TikTok
 * @param {string} videoId - TikTok video ID
 * @param {Object} tokens - OAuth tokens (access_token, refresh_token)
 * @returns {Promise<Object>} - Video status
 */
const getVideoStatus = async (videoId, tokens) => {
  try {
    // Get video status
    const res = await axios.get(
      `${TIKTOK_API_BASE_URL}/video/query/?fields=id,create_time,cover_image_url,share_url,video_description,duration,height,width,title,like_count,comment_count,share_count,view_count,status`,
      {
        params: {
          video_ids: [videoId]
        },
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`
        }
      }
    );
    
    if (!res.data.data.videos || res.data.data.videos.length === 0) {
      throw new Error('Video not found');
    }
    
    const video = res.data.data.videos[0];
    
    return {
      platform: 'tiktok',
      status: video.status,
      statistics: {
        views: video.view_count,
        likes: video.like_count,
        comments: video.comment_count,
        shares: video.share_count
      }
    };
  } catch (error) {
    console.error('Error getting TikTok video status:', error.message);
    return {
      platform: 'tiktok',
      status: 'error',
      error: error.message
    };
  }
};

/**
 * Get analytics for a TikTok video
 * @param {string} videoId - TikTok video ID
 * @param {Object} tokens - OAuth tokens (access_token, refresh_token)
 * @returns {Promise<Object>} - Video analytics
 */
const getVideoAnalytics = async (videoId, tokens) => {
  try {
    // Get video analytics
    const res = await axios.get(
      `${TIKTOK_API_BASE_URL}/research/video/query/`,
      {
        params: {
          fields: 'video_id,like_count,comment_count,share_count,view_count,engagement_rate',
          video_ids: [videoId]
        },
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`
        }
      }
    );
    
    return {
      platform: 'tiktok',
      analytics: res.data.data
    };
  } catch (error) {
    console.error('Error getting TikTok video analytics:', error.message);
    return {
      platform: 'tiktok',
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
