/**
 * YouTube API Client
 * 
 * This service handles the integration with YouTube API for video uploads and management.
 */
const { google } = require('googleapis');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const { supabase } = require('../../config/supabaseClient');

// YouTube API configuration
const youtube = google.youtube('v3');

/**
 * Get OAuth2 client for YouTube
 * @param {string} accessToken - Access token
 * @param {string} refreshToken - Refresh token
 * @returns {OAuth2Client} - OAuth2 client
 */
const getOAuth2Client = (accessToken, refreshToken) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  });

  return oauth2Client;
};

/**
 * Upload a video to YouTube
 * @param {string} videoUrl - URL of the video to upload
 * @param {Object} metadata - Video metadata (title, description, tags, etc.)
 * @param {Object} tokens - OAuth tokens (access_token, refresh_token)
 * @returns {Promise<Object>} - Upload result
 */
const uploadVideo = async (videoUrl, metadata, tokens) => {
  try {
    console.log(`Uploading video to YouTube: ${metadata.title}`);
    
    // Create OAuth2 client
    const oauth2Client = getOAuth2Client(tokens.access_token, tokens.refresh_token);
    
    // Download the video to a temporary file
    const tempFilePath = path.join(os.tmpdir(), `youtube-upload-${uuidv4()}.mp4`);
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
    
    // Prepare video metadata
    const requestBody = {
      snippet: {
        title: metadata.title,
        description: metadata.description || '',
        tags: metadata.tags || [],
        categoryId: metadata.categoryId || '22' // People & Blogs
      },
      status: {
        privacyStatus: metadata.privacyStatus || 'public',
        selfDeclaredMadeForKids: false
      }
    };
    
    // Upload the video
    const media = {
      body: fs.createReadStream(tempFilePath)
    };
    
    const res = await youtube.videos.insert({
      auth: oauth2Client,
      part: 'snippet,status',
      requestBody,
      media
    });
    
    // Clean up the temporary file
    fs.unlinkSync(tempFilePath);
    
    return {
      platform: 'youtube',
      status: 'published',
      publishedUrl: `https://youtube.com/watch?v=${res.data.id}`,
      publishedAt: new Date().toISOString(),
      platformVideoId: res.data.id
    };
  } catch (error) {
    console.error('Error uploading to YouTube:', error.message);
    return {
      platform: 'youtube',
      status: 'failed',
      error: error.message
    };
  }
};

/**
 * Get video status from YouTube
 * @param {string} videoId - YouTube video ID
 * @param {Object} tokens - OAuth tokens (access_token, refresh_token)
 * @returns {Promise<Object>} - Video status
 */
const getVideoStatus = async (videoId, tokens) => {
  try {
    // Create OAuth2 client
    const oauth2Client = getOAuth2Client(tokens.access_token, tokens.refresh_token);
    
    // Get video status
    const res = await youtube.videos.get({
      auth: oauth2Client,
      part: 'status,statistics',
      id: videoId
    });
    
    if (!res.data.items || res.data.items.length === 0) {
      throw new Error('Video not found');
    }
    
    const video = res.data.items[0];
    
    return {
      platform: 'youtube',
      status: video.status.uploadStatus,
      statistics: {
        views: video.statistics.viewCount,
        likes: video.statistics.likeCount,
        comments: video.statistics.commentCount
      },
      privacyStatus: video.status.privacyStatus
    };
  } catch (error) {
    console.error('Error getting YouTube video status:', error.message);
    return {
      platform: 'youtube',
      status: 'error',
      error: error.message
    };
  }
};

/**
 * Get analytics for a YouTube video
 * @param {string} videoId - YouTube video ID
 * @param {Object} tokens - OAuth tokens (access_token, refresh_token)
 * @returns {Promise<Object>} - Video analytics
 */
const getVideoAnalytics = async (videoId, tokens) => {
  try {
    // Create OAuth2 client
    const oauth2Client = getOAuth2Client(tokens.access_token, tokens.refresh_token);
    
    // Get video analytics
    const youtubeAnalytics = google.youtubeAnalytics('v2');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Last 30 days
    
    const endDate = new Date();
    
    const res = await youtubeAnalytics.reports.query({
      auth: oauth2Client,
      ids: 'channel==MINE',
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      metrics: 'views,likes,dislikes,comments,shares',
      dimensions: 'day',
      filters: `video==${videoId}`
    });
    
    return {
      platform: 'youtube',
      analytics: res.data
    };
  } catch (error) {
    console.error('Error getting YouTube video analytics:', error.message);
    return {
      platform: 'youtube',
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
