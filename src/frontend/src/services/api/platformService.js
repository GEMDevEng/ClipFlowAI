import { supabase } from '../../config/supabase';

// Table name
const PLATFORMS_TABLE = 'platforms';

/**
 * Platform service for Supabase
 */

/**
 * Get all platforms for a video
 * @param {string} videoId - Video ID
 * @returns {Promise<Array>} - Array of platform objects
 */
export const getPlatformsByVideoId = async (videoId) => {
  try {
    const { data, error } = await supabase
      .from(PLATFORMS_TABLE)
      .select('*')
      .eq('video_id', videoId);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Get platforms by video ID error:', error);
    throw error;
  }
};

/**
 * Create a new platform
 * @param {object} platformData - Platform data
 * @returns {Promise<object>} - Created platform object
 */
export const createPlatform = async (platformData) => {
  try {
    const { data, error } = await supabase
      .from(PLATFORMS_TABLE)
      .insert([platformData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Create platform error:', error);
    throw error;
  }
};

/**
 * Update platform status
 * @param {string} videoId - Video ID
 * @param {string} platform - Platform name
 * @param {string} status - New status
 * @param {string} publishedUrl - URL where the video was published
 * @returns {Promise<object>} - Updated platform object
 */
export const updatePlatformStatus = async (videoId, platform, status, publishedUrl = null) => {
  try {
    const updates = {
      status,
      updated_at: new Date().toISOString()
    };

    if (publishedUrl) {
      updates.published_url = publishedUrl;
      updates.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from(PLATFORMS_TABLE)
      .update(updates)
      .eq('video_id', videoId)
      .eq('name', platform)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Update platform status error:', error);
    throw error;
  }
};

/**
 * Delete a platform
 * @param {string} id - Platform ID
 * @returns {Promise<void>}
 */
export const deletePlatform = async (id) => {
  try {
    const { error } = await supabase
      .from(PLATFORMS_TABLE)
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Delete platform error:', error);
    throw error;
  }
};

/**
 * Delete all platforms for a video
 * @param {string} videoId - Video ID
 * @returns {Promise<void>}
 */
export const deletePlatformsByVideoId = async (videoId) => {
  try {
    const { error } = await supabase
      .from(PLATFORMS_TABLE)
      .delete()
      .eq('video_id', videoId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Delete platforms by video ID error:', error);
    throw error;
  }
};

/**
 * Get platform statistics
 * @param {string} userId - User ID
 * @returns {Promise<object>} - Platform statistics
 */
export const getPlatformStatistics = async (userId) => {
  try {
    // Get all platforms for user's videos
    const { data: videos, error: videosError } = await supabase
      .from('videos')
      .select('id')
      .eq('user_id', userId);

    if (videosError) {
      throw videosError;
    }

    if (!videos || videos.length === 0) {
      return {};
    }

    const videoIds = videos.map(video => video.id);

    // Get platforms for these videos
    const { data: platforms, error: platformsError } = await supabase
      .from(PLATFORMS_TABLE)
      .select('name, status')
      .in('video_id', videoIds);

    if (platformsError) {
      throw platformsError;
    }

    // Count platforms by name and status
    const statistics = {};
    platforms.forEach(platform => {
      if (!statistics[platform.name]) {
        statistics[platform.name] = {
          total: 0,
          pending: 0,
          published: 0,
          failed: 0
        };
      }

      statistics[platform.name].total += 1;
      statistics[platform.name][platform.status] = (statistics[platform.name][platform.status] || 0) + 1;
    });

    return statistics;
  } catch (error) {
    console.error('Get platform statistics error:', error);
    throw error;
  }
};
