import { supabase } from '../supabase/config';

/**
 * Fetch analytics data for a specific video from social media platforms
 * @param {string} videoId - Video ID
 * @returns {Promise<object>} - Analytics data
 */
export const fetchVideoAnalytics = async (videoId) => {
  try {
    // In a real implementation, this would call APIs for each platform
    // For now, we'll simulate fetching data
    
    // 1. Get the video's platform publications
    const { data: platforms, error: platformsError } = await supabase
      .from('platforms')
      .select('name, published_url')
      .eq('video_id', videoId);
    
    if (platformsError) throw platformsError;
    
    // 2. For each platform, fetch analytics (simulated)
    const analyticsData = await Promise.all(
      platforms.map(async (platform) => {
        // In a real implementation, this would call the platform's API
        // For now, return simulated data
        return simulatePlatformAnalytics(platform.name, videoId);
      })
    );
    
    // 3. Combine the data
    const combinedData = {
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0,
      platforms: {}
    };
    
    analyticsData.forEach((data, index) => {
      const platformName = platforms[index].name;
      
      // Add to totals
      combinedData.views += data.views;
      combinedData.likes += data.likes;
      combinedData.shares += data.shares;
      combinedData.comments += data.comments;
      
      // Store platform-specific data
      combinedData.platforms[platformName] = data;
    });
    
    // 4. Update the video record with the totals
    await updateVideoAnalytics(videoId, {
      views: combinedData.views,
      likes: combinedData.likes,
      shares: combinedData.shares
    });
    
    return combinedData;
  } catch (error) {
    console.error('Error fetching video analytics:', error);
    throw error;
  }
};

/**
 * Update analytics data for a video
 * @param {string} videoId - Video ID
 * @param {object} analyticsData - Analytics data to update
 * @returns {Promise<void>}
 */
export const updateVideoAnalytics = async (videoId, analyticsData) => {
  try {
    const { error } = await supabase
      .from('videos')
      .update({
        views: analyticsData.views,
        likes: analyticsData.likes,
        shares: analyticsData.shares,
        updated_at: new Date().toISOString()
      })
      .eq('id', videoId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating video analytics:', error);
    throw error;
  }
};

/**
 * Store detailed analytics data in the analytics table
 * @param {string} videoId - Video ID
 * @param {string} userId - User ID
 * @param {string} platform - Platform name
 * @param {object} analyticsData - Analytics data to store
 * @returns {Promise<object>} - Stored analytics record
 */
export const storeAnalyticsRecord = async (videoId, userId, platform, analyticsData) => {
  try {
    // Check if the analytics table exists
    const { count, error: checkError } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true });
    
    // If the table doesn't exist or there's an error, return without storing
    if (checkError) {
      console.warn('Analytics table not available:', checkError.message);
      return null;
    }
    
    // Store the analytics record
    const { data, error } = await supabase
      .from('analytics')
      .insert([{
        video_id: videoId,
        user_id: userId,
        platform,
        views: analyticsData.views,
        likes: analyticsData.likes,
        shares: analyticsData.shares,
        comments: analyticsData.comments,
        date: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error storing analytics record:', error);
    // Don't throw the error, just log it and continue
    return null;
  }
};

/**
 * Get analytics data for all videos of a user, grouped by platform
 * @param {string} userId - User ID
 * @returns {Promise<object>} - Analytics data by platform
 */
export const getAnalyticsByPlatform = async (userId) => {
  try {
    // Get all videos for the user
    const { data: videos, error: videosError } = await supabase
      .from('videos')
      .select(`
        id,
        platforms (
          name,
          status
        )
      `)
      .eq('user_id', userId);
    
    if (videosError) throw videosError;
    
    // Get all platforms used by the user
    const platforms = new Set();
    videos.forEach(video => {
      video.platforms.forEach(platform => {
        if (platform.status === 'published') {
          platforms.add(platform.name);
        }
      });
    });
    
    // For each platform, get analytics data (simulated)
    const result = [];
    for (const platform of platforms) {
      // In a real implementation, this would aggregate data from the analytics table
      // For now, return simulated data
      result.push({
        platform,
        views: Math.floor(Math.random() * 2000) + 500,
        likes: Math.floor(Math.random() * 500) + 100,
        shares: Math.floor(Math.random() * 200) + 50
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error getting analytics by platform:', error);
    return [];
  }
};

/**
 * Get analytics data for a user's videos over time
 * @param {string} userId - User ID
 * @param {number} days - Number of days to include
 * @returns {Promise<Array>} - Array of data points with date and metrics
 */
export const getAnalyticsOverTime = async (userId, days = 7) => {
  try {
    // In a real implementation, this would query the analytics table
    // For now, return simulated data
    
    const result = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate some random data with an upward trend
      const baseViews = 50 + (days - i) * 10;
      const randomFactor = Math.random() * 0.5 + 0.75; // 0.75 to 1.25
      
      result.push({
        date: date.toISOString().split('T')[0],
        views: Math.floor(baseViews * randomFactor),
        likes: Math.floor(baseViews * 0.3 * randomFactor),
        shares: Math.floor(baseViews * 0.1 * randomFactor)
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error getting analytics over time:', error);
    return [];
  }
};

/**
 * Simulate fetching analytics data from a platform
 * @param {string} platform - Platform name
 * @param {string} videoId - Video ID
 * @returns {Promise<object>} - Simulated analytics data
 */
const simulatePlatformAnalytics = async (platform, videoId) => {
  // Generate random data based on the platform
  let viewsMultiplier = 1;
  let likesRatio = 0.3;
  let sharesRatio = 0.1;
  let commentsRatio = 0.05;
  
  switch (platform.toLowerCase()) {
    case 'tiktok':
      viewsMultiplier = 2.5;
      likesRatio = 0.4;
      sharesRatio = 0.15;
      commentsRatio = 0.08;
      break;
    case 'youtube':
      viewsMultiplier = 1.8;
      likesRatio = 0.25;
      sharesRatio = 0.05;
      commentsRatio = 0.1;
      break;
    case 'instagram':
      viewsMultiplier = 2.2;
      likesRatio = 0.45;
      sharesRatio = 0.12;
      commentsRatio = 0.07;
      break;
    case 'facebook':
      viewsMultiplier = 1.5;
      likesRatio = 0.2;
      sharesRatio = 0.08;
      commentsRatio = 0.06;
      break;
  }
  
  // Base views (using the videoId to ensure consistency)
  const videoIdSum = videoId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const baseViews = (videoIdSum % 500) + 100;
  
  // Calculate metrics
  const views = Math.floor(baseViews * viewsMultiplier);
  const likes = Math.floor(views * likesRatio);
  const shares = Math.floor(views * sharesRatio);
  const comments = Math.floor(views * commentsRatio);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    views,
    likes,
    shares,
    comments,
    platform
  };
};
