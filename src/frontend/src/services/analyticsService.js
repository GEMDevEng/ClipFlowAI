import { supabase } from '../config/supabase';

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
 * Get analytics data for a specific video
 * @param {string} videoId - Video ID
 * @returns {Promise<object>} - Analytics data
 */
export const getVideoAnalytics = async (videoId) => {
  try {
    // 1. Get the video's platform publications
    const { data: platforms, error: platformsError } = await supabase
      .from('platforms')
      .select('name, published_url')
      .eq('video_id', videoId);

    if (platformsError) throw platformsError;

    // 2. Get the latest analytics data for each platform
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('analytics')
      .select('platform, views, likes, shares, comments')
      .eq('video_id', videoId)
      .order('date', { ascending: false })
      .limit(platforms.length);

    if (analyticsError) throw analyticsError;

    // 3. Combine the data
    const combinedData = {
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0,
      platforms: {}
    };

    analyticsData.forEach((data) => {
      // Add to totals
      combinedData.views += data.views;
      combinedData.likes += data.likes;
      combinedData.shares += data.shares;
      combinedData.comments += data.comments;

      // Store platform-specific data
      combinedData.platforms[data.platform] = {
        views: data.views,
        likes: data.likes,
        shares: data.shares,
        comments: data.comments,
        platform: data.platform
      };
    });

    return combinedData;
  } catch (error) {
    console.error('Error fetching video analytics:', error);
    // Return default data if there's an error
    return {
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0,
      platforms: {}
    };
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
    const { error: checkError } = await supabase
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
    // Get analytics data grouped by platform
    const { data, error } = await supabase
      .from('analytics')
      .select('platform, views, likes, shares, comments')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;

    // Group by platform and sum the metrics
    const platformMap = {};

    data.forEach(item => {
      if (!platformMap[item.platform]) {
        platformMap[item.platform] = {
          platform: item.platform,
          views: 0,
          likes: 0,
          shares: 0,
          comments: 0
        };
      }

      // Only add the latest data for each platform
      if (!platformMap[item.platform].counted) {
        platformMap[item.platform].views += item.views;
        platformMap[item.platform].likes += item.likes;
        platformMap[item.platform].shares += item.shares;
        platformMap[item.platform].comments += item.comments;
        platformMap[item.platform].counted = true;
      }
    });

    // Convert the map to an array
    const result = Object.values(platformMap);

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
    // Get analytics data for the specified time period
    const { data, error } = await supabase
      .from('analytics')
      .select('date, views, likes, shares')
      .eq('user_id', userId)
      .gte('date', new Date(new Date().setDate(new Date().getDate() - days)).toISOString())
      .order('date', { ascending: true });

    if (error) throw error;

    // Group by date and sum the metrics
    const dateMap = {};

    data.forEach(item => {
      const dateStr = item.date.split('T')[0];

      if (!dateMap[dateStr]) {
        dateMap[dateStr] = {
          date: dateStr,
          views: 0,
          likes: 0,
          shares: 0
        };
      }

      dateMap[dateStr].views += item.views;
      dateMap[dateStr].likes += item.likes;
      dateMap[dateStr].shares += item.shares;
    });

    // Convert the map to an array and ensure all dates are included
    const result = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      if (dateMap[dateStr]) {
        result.push(dateMap[dateStr]);
      } else {
        // Add a zero entry for dates with no data
        result.push({
          date: dateStr,
          views: 0,
          likes: 0,
          shares: 0
        });
      }
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
  let likesRatio, sharesRatio, commentsRatio;

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
    default:
      // Use default values for other platforms
      viewsMultiplier = 1.0;
      likesRatio = 0.2;
      sharesRatio = 0.05;
      commentsRatio = 0.03;
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
