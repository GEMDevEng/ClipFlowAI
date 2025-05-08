const axios = require('axios');
const dotenv = require('dotenv');
const { supabase } = require('../config/supabaseClient');
const youtubeClient = require('./platforms/youtubeClient');
const tiktokClient = require('./platforms/tiktokClient');
const instagramClient = require('./platforms/instagramClient');

dotenv.config();

/**
 * Publish a video to TikTok
 * @param {Object} videoData - The video data
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - The publishing result
 */
const publishToTikTok = async (videoData, options = {}) => {
  try {
    console.log(`Publishing video to TikTok: ${videoData.title}`);

    // Get the user's TikTok platform connection
    const { data: platformData, error: platformError } = await supabase
      .from('social_platforms')
      .select('*')
      .eq('user_id', videoData.user_id)
      .eq('platform', 'tiktok')
      .single();

    if (platformError || !platformData) {
      throw new Error('TikTok platform not connected');
    }

    // Check if the tokens are valid
    if (!platformData.access_token) {
      throw new Error('TikTok access token not found');
    }

    // Prepare metadata
    const metadata = {
      title: videoData.title,
      description: options.description || videoData.description || '',
      username: platformData.username,
      privacyStatus: options.privacyStatus || 'PUBLIC'
    };

    // Upload the video
    const result = await tiktokClient.uploadVideo(
      videoData.video_url,
      metadata,
      {
        access_token: platformData.access_token,
        refresh_token: platformData.refresh_token
      }
    );

    // Save the publishing result to the database
    if (result.status === 'published') {
      await supabase
        .from('publishing_history')
        .insert({
          user_id: videoData.user_id,
          video_id: videoData.id,
          platform: 'tiktok',
          platform_video_id: result.platformVideoId,
          published_url: result.publishedUrl,
          published_at: result.publishedAt,
          status: result.status
        });
    }

    return result;
  } catch (error) {
    console.error('Error publishing to TikTok:', error.message);
    return {
      platform: 'tiktok',
      status: 'failed',
      error: error.message
    };
  }
};

/**
 * Publish a video to Instagram Reels
 * @param {Object} videoData - The video data
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - The publishing result
 */
const publishToInstagram = async (videoData, options = {}) => {
  try {
    console.log(`Publishing video to Instagram Reels: ${videoData.title}`);

    // Get the user's Instagram platform connection
    const { data: platformData, error: platformError } = await supabase
      .from('social_platforms')
      .select('*')
      .eq('user_id', videoData.user_id)
      .eq('platform', 'instagram')
      .single();

    if (platformError || !platformData) {
      throw new Error('Instagram platform not connected');
    }

    // Check if the tokens are valid
    if (!platformData.access_token) {
      throw new Error('Instagram access token not found');
    }

    // Prepare metadata
    const metadata = {
      title: videoData.title,
      description: options.description || videoData.description || '',
      username: platformData.username
    };

    // Upload the video
    const result = await instagramClient.uploadVideo(
      videoData.video_url,
      metadata,
      {
        access_token: platformData.access_token,
        refresh_token: platformData.refresh_token
      }
    );

    // Save the publishing result to the database
    if (result.status === 'published') {
      await supabase
        .from('publishing_history')
        .insert({
          user_id: videoData.user_id,
          video_id: videoData.id,
          platform: 'instagram',
          platform_video_id: result.platformVideoId,
          published_url: result.publishedUrl,
          published_at: result.publishedAt,
          status: result.status
        });
    }

    return result;
  } catch (error) {
    console.error('Error publishing to Instagram:', error.message);
    return {
      platform: 'instagram',
      status: 'failed',
      error: error.message
    };
  }
};

/**
 * Publish a video to YouTube Shorts
 * @param {Object} videoData - The video data
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - The publishing result
 */
const publishToYouTube = async (videoData, options = {}) => {
  try {
    console.log(`Publishing video to YouTube Shorts: ${videoData.title}`);

    // Get the user's YouTube platform connection
    const { data: platformData, error: platformError } = await supabase
      .from('social_platforms')
      .select('*')
      .eq('user_id', videoData.user_id)
      .eq('platform', 'youtube')
      .single();

    if (platformError || !platformData) {
      throw new Error('YouTube platform not connected');
    }

    // Check if the tokens are valid
    if (!platformData.access_token) {
      throw new Error('YouTube access token not found');
    }

    // Prepare metadata
    const metadata = {
      title: videoData.title,
      description: options.description || videoData.description || '',
      tags: options.tags || ['ClipFlowAI', 'shorts'],
      categoryId: options.categoryId || '22', // People & Blogs
      privacyStatus: options.privacyStatus || 'public'
    };

    // Upload the video
    const result = await youtubeClient.uploadVideo(
      videoData.video_url,
      metadata,
      {
        access_token: platformData.access_token,
        refresh_token: platformData.refresh_token
      }
    );

    // Save the publishing result to the database
    if (result.status === 'published') {
      await supabase
        .from('publishing_history')
        .insert({
          user_id: videoData.user_id,
          video_id: videoData.id,
          platform: 'youtube',
          platform_video_id: result.platformVideoId,
          published_url: result.publishedUrl,
          published_at: result.publishedAt,
          status: result.status
        });
    }

    return result;
  } catch (error) {
    console.error('Error publishing to YouTube:', error.message);
    return {
      platform: 'youtube',
      status: 'failed',
      error: error.message
    };
  }
};

/**
 * Publish a video to multiple platforms
 * @param {Object} videoData - The video data
 * @param {Array} platforms - Array of platform names to publish to
 * @param {Object} options - Additional options for each platform
 * @returns {Promise<Array>} - Array of publishing results
 */
const publishToAllPlatforms = async (videoData, platforms = ['tiktok', 'instagram', 'youtube'], options = {}) => {
  const results = [];

  if (platforms.includes('tiktok')) {
    const tiktokResult = await publishToTikTok(videoData, options.tiktok || {});
    results.push(tiktokResult);
  }

  if (platforms.includes('instagram')) {
    const instagramResult = await publishToInstagram(videoData, options.instagram || {});
    results.push(instagramResult);
  }

  if (platforms.includes('youtube')) {
    const youtubeResult = await publishToYouTube(videoData, options.youtube || {});
    results.push(youtubeResult);
  }

  return results;
};

// Helper function to generate a random ID
const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * Check if a video is scheduled to be published and publish it if it's time
 * @param {Object} videoData - The video data with scheduling information
 * @returns {Promise<Object>} - The publishing result or null if not scheduled
 */
const checkAndPublishScheduled = async (videoData) => {
  try {
    // If the video is not scheduled to be published, return null
    if (!videoData.scheduled_publish) {
      return null;
    }

    // If the video doesn't have a scheduled publish time, return null
    if (!videoData.scheduled_publish_time) {
      return null;
    }

    // Get the current time and the scheduled publish time
    const currentTime = new Date();
    const scheduledTime = new Date(videoData.scheduled_publish_time);

    // If it's not time to publish yet, return null
    if (currentTime < scheduledTime) {
      return null;
    }

    // If it's time to publish, publish to all platforms
    console.log(`Publishing scheduled video: ${videoData.title}`);
    return await publishToAllPlatforms(videoData, videoData.platforms);
  } catch (error) {
    console.error('Error checking scheduled publishing:', error.message);
    return {
      status: 'failed',
      error: error.message
    };
  }
};

/**
 * Check all scheduled videos and publish them if it's time
 * @param {Array} videos - Array of video data with scheduling information
 * @returns {Promise<Array>} - Array of publishing results
 */
const processScheduledPublishing = async (videos) => {
  const results = [];

  for (const video of videos) {
    const result = await checkAndPublishScheduled(video);
    if (result) {
      results.push({
        videoId: video.id,
        results: result
      });
    }
  }

  return results;
};

/**
 * Get video status from multiple platforms
 * @param {string} videoId - The video ID
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} - The video statuses
 */
const getVideoStatusFromPlatforms = async (videoId, userId) => {
  try {
    // Get publishing history for this video
    const { data: publishingHistory, error: historyError } = await supabase
      .from('publishing_history')
      .select('*')
      .eq('video_id', videoId);

    if (historyError) {
      throw new Error('Failed to get publishing history');
    }

    if (!publishingHistory || publishingHistory.length === 0) {
      return [];
    }

    const statuses = [];

    // Get status from each platform
    for (const history of publishingHistory) {
      // Get platform connection
      const { data: platformData, error: platformError } = await supabase
        .from('social_platforms')
        .select('*')
        .eq('user_id', userId)
        .eq('platform', history.platform)
        .single();

      if (platformError || !platformData) {
        statuses.push({
          platform: history.platform,
          status: 'error',
          error: 'Platform not connected'
        });
        continue;
      }

      // Get status from platform
      let status;
      switch (history.platform) {
        case 'tiktok':
          status = await tiktokClient.getVideoStatus(
            history.platform_video_id,
            {
              access_token: platformData.access_token,
              refresh_token: platformData.refresh_token
            }
          );
          break;
        case 'instagram':
          status = await instagramClient.getVideoStatus(
            history.platform_video_id,
            {
              access_token: platformData.access_token,
              refresh_token: platformData.refresh_token
            }
          );
          break;
        case 'youtube':
          status = await youtubeClient.getVideoStatus(
            history.platform_video_id,
            {
              access_token: platformData.access_token,
              refresh_token: platformData.refresh_token
            }
          );
          break;
        default:
          status = {
            platform: history.platform,
            status: 'unknown'
          };
      }

      statuses.push({
        ...status,
        publishedUrl: history.published_url,
        publishedAt: history.published_at
      });
    }

    return statuses;
  } catch (error) {
    console.error('Error getting video status from platforms:', error.message);
    throw new Error(`Failed to get video status: ${error.message}`);
  }
};

/**
 * Get video analytics from multiple platforms
 * @param {string} videoId - The video ID
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} - The video analytics
 */
const getVideoAnalyticsFromPlatforms = async (videoId, userId) => {
  try {
    // Get publishing history for this video
    const { data: publishingHistory, error: historyError } = await supabase
      .from('publishing_history')
      .select('*')
      .eq('video_id', videoId);

    if (historyError) {
      throw new Error('Failed to get publishing history');
    }

    if (!publishingHistory || publishingHistory.length === 0) {
      return [];
    }

    const analytics = [];

    // Get analytics from each platform
    for (const history of publishingHistory) {
      // Get platform connection
      const { data: platformData, error: platformError } = await supabase
        .from('social_platforms')
        .select('*')
        .eq('user_id', userId)
        .eq('platform', history.platform)
        .single();

      if (platformError || !platformData) {
        analytics.push({
          platform: history.platform,
          status: 'error',
          error: 'Platform not connected'
        });
        continue;
      }

      // Get analytics from platform
      let result;
      switch (history.platform) {
        case 'tiktok':
          result = await tiktokClient.getVideoAnalytics(
            history.platform_video_id,
            {
              access_token: platformData.access_token,
              refresh_token: platformData.refresh_token
            }
          );
          break;
        case 'instagram':
          result = await instagramClient.getVideoAnalytics(
            history.platform_video_id,
            {
              access_token: platformData.access_token,
              refresh_token: platformData.refresh_token
            }
          );
          break;
        case 'youtube':
          result = await youtubeClient.getVideoAnalytics(
            history.platform_video_id,
            {
              access_token: platformData.access_token,
              refresh_token: platformData.refresh_token
            }
          );
          break;
        default:
          result = {
            platform: history.platform,
            status: 'unknown'
          };
      }

      analytics.push({
        ...result,
        publishedUrl: history.published_url,
        publishedAt: history.published_at
      });
    }

    return analytics;
  } catch (error) {
    console.error('Error getting video analytics from platforms:', error.message);
    throw new Error(`Failed to get video analytics: ${error.message}`);
  }
};

module.exports = {
  publishToTikTok,
  publishToInstagram,
  publishToYouTube,
  publishToAllPlatforms,
  checkAndPublishScheduled,
  processScheduledPublishing,
  getVideoStatusFromPlatforms,
  getVideoAnalyticsFromPlatforms
};
