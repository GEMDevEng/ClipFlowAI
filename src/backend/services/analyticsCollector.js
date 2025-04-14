/**
 * Analytics Collector Service
 * 
 * This service periodically collects analytics data from social media platforms
 * and updates the database with the latest metrics.
 */

const axios = require('axios');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Start the analytics collection process
 * @param {number} intervalMinutes - Interval in minutes between collection runs
 */
const startCollector = (intervalMinutes = 60) => {
  console.log(`Starting analytics collector with ${intervalMinutes} minute interval`);
  
  // Run immediately on startup
  collectAnalytics();
  
  // Then run on the specified interval
  setInterval(collectAnalytics, intervalMinutes * 60 * 1000);
};

/**
 * Collect analytics data for all published videos
 */
const collectAnalytics = async () => {
  try {
    console.log('Starting analytics collection...');
    
    // Get all published videos with their platforms
    const { data: videos, error: videosError } = await supabase
      .from('videos')
      .select(`
        id,
        user_id,
        platforms (
          id,
          name,
          status,
          published_url
        )
      `)
      .eq('status', 'published');
    
    if (videosError) {
      throw videosError;
    }
    
    console.log(`Found ${videos.length} published videos to collect analytics for`);
    
    // Process each video
    for (const video of videos) {
      await processVideo(video);
    }
    
    console.log('Analytics collection completed');
  } catch (error) {
    console.error('Error collecting analytics:', error.message);
  }
};

/**
 * Process a single video's analytics
 * @param {object} video - Video object with platforms
 */
const processVideo = async (video) => {
  try {
    console.log(`Processing analytics for video ${video.id}`);
    
    let totalViews = 0;
    let totalLikes = 0;
    let totalShares = 0;
    
    // Process each platform
    for (const platform of video.platforms) {
      if (platform.status === 'published' && platform.published_url) {
        const metrics = await fetchPlatformMetrics(platform.name, platform.published_url);
        
        totalViews += metrics.views;
        totalLikes += metrics.likes;
        totalShares += metrics.shares;
        
        // Store detailed analytics in the analytics table
        await storeAnalyticsRecord(video.id, video.user_id, platform.name, metrics);
      }
    }
    
    // Update the video record with totals
    await updateVideoMetrics(video.id, totalViews, totalLikes, totalShares);
    
    console.log(`Updated metrics for video ${video.id}: ${totalViews} views, ${totalLikes} likes, ${totalShares} shares`);
  } catch (error) {
    console.error(`Error processing video ${video.id}:`, error.message);
  }
};

/**
 * Fetch metrics from a social media platform
 * @param {string} platformName - Name of the platform
 * @param {string} url - URL of the published video
 * @returns {Promise<object>} - Metrics object
 */
const fetchPlatformMetrics = async (platformName, url) => {
  // In a real implementation, this would call the platform's API
  // For now, return simulated data
  
  // Generate random metrics based on the platform
  let views, likes, shares, comments;
  
  switch (platformName.toLowerCase()) {
    case 'tiktok':
      views = Math.floor(Math.random() * 5000) + 1000;
      likes = Math.floor(views * 0.4);
      shares = Math.floor(views * 0.15);
      comments = Math.floor(views * 0.08);
      break;
    case 'youtube':
      views = Math.floor(Math.random() * 3000) + 500;
      likes = Math.floor(views * 0.25);
      shares = Math.floor(views * 0.05);
      comments = Math.floor(views * 0.1);
      break;
    case 'instagram':
      views = Math.floor(Math.random() * 4000) + 800;
      likes = Math.floor(views * 0.45);
      shares = Math.floor(views * 0.12);
      comments = Math.floor(views * 0.07);
      break;
    case 'facebook':
      views = Math.floor(Math.random() * 2500) + 300;
      likes = Math.floor(views * 0.2);
      shares = Math.floor(views * 0.08);
      comments = Math.floor(views * 0.06);
      break;
    default:
      views = Math.floor(Math.random() * 1000) + 100;
      likes = Math.floor(views * 0.3);
      shares = Math.floor(views * 0.1);
      comments = Math.floor(views * 0.05);
  }
  
  return {
    views,
    likes,
    shares,
    comments,
    platform: platformName,
    collected_at: new Date().toISOString()
  };
};

/**
 * Store analytics record in the database
 * @param {string} videoId - Video ID
 * @param {string} userId - User ID
 * @param {string} platform - Platform name
 * @param {object} metrics - Metrics object
 */
const storeAnalyticsRecord = async (videoId, userId, platform, metrics) => {
  try {
    // Check if the analytics table exists
    const { count, error: checkError } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true });
    
    // If the table doesn't exist or there's an error, return without storing
    if (checkError) {
      console.warn('Analytics table not available:', checkError.message);
      return;
    }
    
    // Store the analytics record
    const { error } = await supabase
      .from('analytics')
      .insert([{
        video_id: videoId,
        user_id: userId,
        platform,
        views: metrics.views,
        likes: metrics.likes,
        shares: metrics.shares,
        comments: metrics.comments,
        date: new Date().toISOString()
      }]);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error storing analytics record:', error.message);
  }
};

/**
 * Update video metrics in the database
 * @param {string} videoId - Video ID
 * @param {number} views - View count
 * @param {number} likes - Like count
 * @param {number} shares - Share count
 */
const updateVideoMetrics = async (videoId, views, likes, shares) => {
  try {
    const { error } = await supabase
      .from('videos')
      .update({
        views,
        likes,
        shares,
        updated_at: new Date().toISOString()
      })
      .eq('id', videoId);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error updating video metrics:', error.message);
  }
};

module.exports = {
  startCollector
};
