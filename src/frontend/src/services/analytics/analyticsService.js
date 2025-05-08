import { supabase } from '../../config/supabase';
import * as databaseService from '../database/databaseService';

// Table name
const VIDEOS_TABLE = 'videos';
const ANALYTICS_TABLE = 'analytics';

/**
 * Analytics service for ClipFlowAI
 * This service provides methods for retrieving and analyzing video performance data
 */

/**
 * Get analytics for a specific video
 * @param {string} videoId - Video ID
 * @returns {Promise<object>} - Analytics data
 */
export const getVideoAnalytics = async (videoId) => {
  try {
    // First try to get analytics from the analytics table using our database service
    const analyticsData = await databaseService.getVideoAnalytics(videoId);

    // Get the current analytics from the videos table
    const { data: currentData, error: currentError } = await supabase
      .from(VIDEOS_TABLE)
      .select('views, likes, shares')
      .eq('id', videoId)
      .single();

    if (currentError) {
      throw currentError;
    }

    return {
      current: currentData || { views: 0, likes: 0, shares: 0 },
      history: analyticsData || []
    };
  } catch (error) {
    console.error('Get video analytics error:', error);
    // Return default values if there's an error
    return {
      current: { views: 0, likes: 0, shares: 0 },
      history: []
    };
  }
};

/**
 * Get overall analytics for all videos of a user
 * @param {string} userId - User ID
 * @returns {Promise<object>} - Overall analytics data
 */
export const getOverallAnalytics = async (userId) => {
  try {
    // Get analytics from the videos table for all user's videos
    const { data, error } = await supabase
      .from(VIDEOS_TABLE)
      .select('id, title, views, likes, shares, created_at')
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    let totalViews = 0;
    let totalLikes = 0;
    let totalShares = 0;
    let videoStats = [];

    // Sum up the analytics data
    data.forEach(item => {
      totalViews += item.views || 0;
      totalLikes += item.likes || 0;
      totalShares += item.shares || 0;

      videoStats.push({
        id: item.id,
        title: item.title,
        views: item.views || 0,
        likes: item.likes || 0,
        shares: item.shares || 0,
        created_at: item.created_at
      });
    });

    // Sort videos by views (descending)
    videoStats.sort((a, b) => b.views - a.views);

    return {
      totals: { totalViews, totalLikes, totalShares },
      videoStats
    };
  } catch (error) {
    console.error('Get overall analytics error:', error);
    // Return default values if there's an error
    return {
      totals: { totalViews: 0, totalLikes: 0, totalShares: 0 },
      videoStats: []
    };
  }
};

/**
 * Get analytics history for a specific time period
 * @param {string} userId - User ID
 * @param {string} period - Time period (day, week, month, year)
 * @returns {Promise<Array>} - Analytics history data
 */
export const getAnalyticsHistory = async (userId, period = 'week') => {
  try {
    // Calculate the start date based on the period
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7); // Default to week
    }

    // Get all videos for the user
    const { data: videos, error: videosError } = await supabase
      .from(VIDEOS_TABLE)
      .select('id')
      .eq('user_id', userId);

    if (videosError) {
      throw videosError;
    }

    if (!videos || videos.length === 0) {
      return [];
    }

    const videoIds = videos.map(video => video.id);

    // Get analytics history for these videos
    const { data: history, error: historyError } = await supabase
      .from(ANALYTICS_TABLE)
      .select('*')
      .in('video_id', videoIds)
      .gte('date', startDate.toISOString())
      .order('date', { ascending: true });

    if (historyError) {
      throw historyError;
    }

    // Group analytics by date
    const groupedByDate = {};

    history.forEach(item => {
      const date = item.date.split('T')[0]; // Extract YYYY-MM-DD

      if (!groupedByDate[date]) {
        groupedByDate[date] = {
          date,
          views: 0,
          likes: 0,
          shares: 0
        };
      }

      groupedByDate[date].views += item.views || 0;
      groupedByDate[date].likes += item.likes || 0;
      groupedByDate[date].shares += item.shares || 0;
    });

    // Convert to array and sort by date
    return Object.values(groupedByDate).sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch (error) {
    console.error('Get analytics history error:', error);
    return [];
  }
};
