import { supabase } from '../../config/supabase';

/**
 * Database service for Supabase
 * This service provides methods for interacting with the Supabase database
 */

/**
 * Check if a table exists in the database
 * @param {string} tableName - Name of the table to check
 * @returns {Promise<boolean>} - True if the table exists, false otherwise
 */
export const checkTableExists = async (tableName) => {
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', tableName);

    if (error) {
      console.error(`Error checking if table ${tableName} exists:`, error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
};

/**
 * Get all videos for the current user
 * @returns {Promise<Array>} - Array of videos
 */
export const getUserVideos = async () => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        video_tags (
          id,
          tag_id,
          tags (
            id,
            name
          )
        ),
        video_publications (
          id,
          platform_name,
          status,
          published_at,
          scheduled_for,
          views,
          likes,
          shares,
          comments
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting user videos:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error getting user videos:', error);
    throw error;
  }
};

/**
 * Get a video by ID
 * @param {string} videoId - ID of the video to get
 * @returns {Promise<object|null>} - Video data or null if not found
 */
export const getVideoById = async (videoId) => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        video_tags (
          id,
          tag_id,
          tags (
            id,
            name
          )
        ),
        video_publications (
          id,
          platform_name,
          status,
          published_at,
          scheduled_for,
          views,
          likes,
          shares,
          comments
        )
      `)
      .eq('id', videoId)
      .single();

    if (error) {
      console.error(`Error getting video with ID ${videoId}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error getting video with ID ${videoId}:`, error);
    throw error;
  }
};

/**
 * Create a new video
 * @param {object} videoData - Video data
 * @returns {Promise<object>} - Created video data
 */
export const createVideo = async (videoData) => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .insert([videoData])
      .select();

    if (error) {
      console.error('Error creating video:', error);
      throw error;
    }

    return data[0];
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  }
};

/**
 * Update a video
 * @param {string} videoId - ID of the video to update
 * @param {object} updates - Video updates
 * @returns {Promise<object>} - Updated video data
 */
export const updateVideo = async (videoId, updates) => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .update(updates)
      .eq('id', videoId)
      .select();

    if (error) {
      console.error(`Error updating video with ID ${videoId}:`, error);
      throw error;
    }

    return data[0];
  } catch (error) {
    console.error(`Error updating video with ID ${videoId}:`, error);
    throw error;
  }
};

/**
 * Delete a video
 * @param {string} videoId - ID of the video to delete
 * @returns {Promise<void>}
 */
export const deleteVideo = async (videoId) => {
  try {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId);

    if (error) {
      console.error(`Error deleting video with ID ${videoId}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Error deleting video with ID ${videoId}:`, error);
    throw error;
  }
};

/**
 * Get all platform connections for the current user
 * @returns {Promise<Array>} - Array of platform connections
 */
export const getUserPlatformConnections = async () => {
  try {
    const { data, error } = await supabase
      .from('platform_connections')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting user platform connections:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error getting user platform connections:', error);
    throw error;
  }
};

/**
 * Create a new platform connection
 * @param {object} connectionData - Platform connection data
 * @returns {Promise<object>} - Created platform connection data
 */
export const createPlatformConnection = async (connectionData) => {
  try {
    const { data, error } = await supabase
      .from('platform_connections')
      .insert([connectionData])
      .select();

    if (error) {
      console.error('Error creating platform connection:', error);
      throw error;
    }

    return data[0];
  } catch (error) {
    console.error('Error creating platform connection:', error);
    throw error;
  }
};

/**
 * Delete a platform connection
 * @param {string} connectionId - ID of the platform connection to delete
 * @returns {Promise<void>}
 */
export const deletePlatformConnection = async (connectionId) => {
  try {
    const { error } = await supabase
      .from('platform_connections')
      .delete()
      .eq('id', connectionId);

    if (error) {
      console.error(`Error deleting platform connection with ID ${connectionId}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Error deleting platform connection with ID ${connectionId}:`, error);
    throw error;
  }
};

/**
 * Get analytics data for a video
 * @param {string} videoId - ID of the video to get analytics for
 * @returns {Promise<Array>} - Array of analytics data
 */
export const getVideoAnalytics = async (videoId) => {
  try {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('video_id', videoId)
      .order('date', { ascending: false });

    if (error) {
      console.error(`Error getting analytics for video with ID ${videoId}:`, error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error(`Error getting analytics for video with ID ${videoId}:`, error);
    throw error;
  }
};

export default {
  checkTableExists,
  getUserVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  getUserPlatformConnections,
  createPlatformConnection,
  deletePlatformConnection,
  getVideoAnalytics
};
