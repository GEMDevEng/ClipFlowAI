/**
 * Social Media Routes
 *
 * This file contains routes for social media integration and publishing.
 */
const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabaseClient');
const {
  connectPlatform,
  disconnectPlatform,
  getPlatformStatus,
  refreshPlatformToken,
  getOAuthUrl
} = require('../services/socialMediaIntegration');
const {
  publishToAllPlatforms,
  processScheduledPublishing
} = require('../services/socialMediaPublisher');

/**
 * @route GET /api/social/platforms
 * @desc Get all connected platforms for a user
 * @access Private
 */
router.get('/platforms', async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    // Get platforms from Supabase
    const { data, error } = await supabase
      .from('social_platforms')
      .select('*')
      .eq('user_id', user_id);

    if (error) {
      console.error('Error getting platforms:', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.json({ success: true, platforms: data });
  } catch (error) {
    console.error('Error in /platforms route:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/social/oauth/:platform
 * @desc Get OAuth URL for a platform
 * @access Private
 */
router.get('/oauth/:platform', (req, res) => {
  try {
    const { platform } = req.params;
    const { redirect_uri } = req.query;

    if (!platform) {
      return res.status(400).json({ success: false, error: 'Platform is required' });
    }

    if (!redirect_uri) {
      return res.status(400).json({ success: false, error: 'Redirect URI is required' });
    }

    const oauthUrl = getOAuthUrl(platform, redirect_uri);

    return res.json({ success: true, url: oauthUrl });
  } catch (error) {
    console.error('Error in /oauth route:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route POST /api/social/connect
 * @desc Connect to a social media platform
 * @access Private
 */
router.post('/connect', async (req, res) => {
  try {
    const { user_id, platform, auth_code } = req.body;

    if (!user_id || !platform || !auth_code) {
      return res.status(400).json({
        success: false,
        error: 'User ID, platform, and auth code are required'
      });
    }

    const result = await connectPlatform(user_id, platform, auth_code);

    return res.json(result);
  } catch (error) {
    console.error('Error in /connect route:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route POST /api/social/disconnect
 * @desc Disconnect from a social media platform
 * @access Private
 */
router.post('/disconnect', async (req, res) => {
  try {
    const { user_id, platform_id } = req.body;

    if (!user_id || !platform_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID and platform ID are required'
      });
    }

    const result = await disconnectPlatform(user_id, platform_id);

    return res.json(result);
  } catch (error) {
    console.error('Error in /disconnect route:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/social/status/:platformId
 * @desc Get the status of a connected platform
 * @access Private
 */
router.get('/status/:platformId', async (req, res) => {
  try {
    const { platformId } = req.params;
    const { user_id } = req.query;

    if (!user_id || !platformId) {
      return res.status(400).json({
        success: false,
        error: 'User ID and platform ID are required'
      });
    }

    const result = await getPlatformStatus(user_id, platformId);

    return res.json(result);
  } catch (error) {
    console.error('Error in /status route:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route POST /api/social/refresh
 * @desc Refresh the access token for a platform
 * @access Private
 */
router.post('/refresh', async (req, res) => {
  try {
    const { user_id, platform_id } = req.body;

    if (!user_id || !platform_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID and platform ID are required'
      });
    }

    // Get the refresh token from Supabase
    const { data, error } = await supabase
      .from('social_platforms')
      .select('refresh_token')
      .eq('id', platform_id)
      .eq('user_id', user_id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: 'Platform not found'
      });
    }

    const result = await refreshPlatformToken(user_id, platform_id, data.refresh_token);

    return res.json(result);
  } catch (error) {
    console.error('Error in /refresh route:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route POST /api/social/publish
 * @desc Publish a video to social media platforms
 * @access Private
 */
router.post('/publish', async (req, res) => {
  try {
    const { user_id, video_id, platforms, options } = req.body;

    if (!user_id || !video_id || !platforms || !Array.isArray(platforms)) {
      return res.status(400).json({
        success: false,
        error: 'User ID, video ID, and platforms array are required'
      });
    }

    // Get the video data from Supabase
    const { data: videoData, error: videoError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', video_id)
      .eq('user_id', user_id)
      .single();

    if (videoError || !videoData) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }

    // Publish to all platforms
    const results = await publishToAllPlatforms(videoData, platforms, options);

    return res.json({ success: true, results });
  } catch (error) {
    console.error('Error in /publish route:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route POST /api/social/schedule
 * @desc Schedule a video for publishing
 * @access Private
 */
router.post('/schedule', async (req, res) => {
  try {
    const { user_id, video_id, platforms, publish_date, options } = req.body;

    if (!user_id || !video_id || !platforms || !Array.isArray(platforms) || !publish_date) {
      return res.status(400).json({
        success: false,
        error: 'User ID, video ID, platforms array, and publish date are required'
      });
    }

    // Update the video in Supabase
    const { data, error } = await supabase
      .from('videos')
      .update({
        scheduled_publish: true,
        scheduled_publish_time: publish_date,
        platforms,
        publish_options: options
      })
      .eq('id', video_id)
      .eq('user_id', user_id);

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    return res.json({
      success: true,
      message: 'Video scheduled for publishing',
      scheduled_time: publish_date
    });
  } catch (error) {
    console.error('Error in /schedule route:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/social/history
 * @desc Get publishing history for a user
 * @access Private
 */
router.get('/history', async (req, res) => {
  try {
    const { user_id, platform, status, start_date, end_date, limit = 10, offset = 0 } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Build the query
    let query = supabase
      .from('publishing_history')
      .select('*')
      .eq('user_id', user_id)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Add filters if provided
    if (platform) {
      query = query.eq('platform', platform);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (start_date) {
      query = query.gte('published_at', start_date);
    }

    if (end_date) {
      query = query.lte('published_at', end_date);
    }

    // Execute the query
    const { data, error, count } = await query;

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    return res.json({
      success: true,
      history: data,
      total: count,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error in /history route:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route POST /api/social/publish
 * @desc Publish a video to social media platforms
 * @access Private
 */
router.post('/publish', async (req, res) => {
  try {
    const { video_id, platforms, options } = req.body;

    if (!video_id || !platforms || !Array.isArray(platforms)) {
      return res.status(400).json({
        success: false,
        error: 'Video ID and platforms array are required'
      });
    }

    // Get the video data
    const { data: videoData, error: videoError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', video_id)
      .single();

    if (videoError || !videoData) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }

    // Publish to platforms
    const results = await publishToAllPlatforms(videoData, platforms, options || {});

    // Update the video record with publishing information
    await supabase
      .from('videos')
      .update({
        published: true,
        published_at: new Date().toISOString(),
        published_platforms: platforms
      })
      .eq('id', video_id);

    return res.json({ success: true, results });
  } catch (error) {
    console.error('Error in /publish route:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/social/video-status/:videoId
 * @desc Get the status of a video on all platforms
 * @access Private
 */
router.get('/video-status/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const { user_id } = req.query;

    if (!videoId || !user_id) {
      return res.status(400).json({
        success: false,
        error: 'Video ID and user ID are required'
      });
    }

    // Get video status from platforms
    const { data: videoData, error: videoError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();

    if (videoError || !videoData) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }

    // Get publishing history
    const { data: publishingHistory, error: historyError } = await supabase
      .from('publishing_history')
      .select('*')
      .eq('video_id', videoId);

    if (historyError) {
      console.error('Error getting publishing history:', historyError);
      return res.status(500).json({
        success: false,
        error: 'Error getting publishing history'
      });
    }

    return res.json({
      success: true,
      video: videoData,
      publishing_history: publishingHistory || []
    });
  } catch (error) {
    console.error('Error in /video-status route:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route POST /api/social/schedule
 * @desc Schedule a video for publishing
 * @access Private
 */
router.post('/schedule', async (req, res) => {
  try {
    const { video_id, platforms, scheduled_time, options } = req.body;

    if (!video_id || !platforms || !Array.isArray(platforms) || !scheduled_time) {
      return res.status(400).json({
        success: false,
        error: 'Video ID, platforms array, and scheduled time are required'
      });
    }

    // Update the video record with scheduling information
    const { data, error } = await supabase
      .from('videos')
      .update({
        scheduled_publish: true,
        scheduled_publish_time: scheduled_time,
        scheduled_platforms: platforms,
        scheduled_options: options || {}
      })
      .eq('id', video_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating video with scheduling info:', error);
      return res.status(500).json({
        success: false,
        error: 'Error scheduling video'
      });
    }

    return res.json({ success: true, video: data });
  } catch (error) {
    console.error('Error in /schedule route:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/social/scheduled
 * @desc Get all scheduled videos
 * @access Private
 */
router.get('/scheduled', async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Get scheduled videos
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', user_id)
      .eq('scheduled_publish', true)
      .order('scheduled_publish_time', { ascending: true });

    if (error) {
      console.error('Error getting scheduled videos:', error);
      return res.status(500).json({
        success: false,
        error: 'Error getting scheduled videos'
      });
    }

    return res.json({ success: true, videos: data || [] });
  } catch (error) {
    console.error('Error in /scheduled route:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
