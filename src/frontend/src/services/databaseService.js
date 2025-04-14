import { supabase } from '../supabase/config';

// Table names
const VIDEOS_TABLE = 'videos';
const PLATFORMS_TABLE = 'platforms';

/**
 * Get all videos for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of video objects
 */
export const getAllVideos = async (userId) => {
  const { data, error } = await supabase
    .from(VIDEOS_TABLE)
    .select(`
      *,
      platforms:${PLATFORMS_TABLE}(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};

/**
 * Get a video by ID
 * @param {string} id - Video ID
 * @returns {Promise<object>} - Video object
 */
export const getVideoById = async (id) => {
  const { data, error } = await supabase
    .from(VIDEOS_TABLE)
    .select(`
      *,
      platforms:${PLATFORMS_TABLE}(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Create a new video
 * @param {object} videoData - Video data
 * @returns {Promise<object>} - Created video object
 */
export const createVideo = async (videoData) => {
  const { platforms, ...videoDetails } = videoData;
  
  // Insert video record
  const { data: video, error: videoError } = await supabase
    .from(VIDEOS_TABLE)
    .insert([
      {
        ...videoDetails,
        created_at: new Date().toISOString(),
        status: 'pending'
      }
    ])
    .select()
    .single();

  if (videoError) {
    throw videoError;
  }

  // If platforms are specified, insert platform records
  if (platforms && platforms.length > 0) {
    const platformRecords = platforms.map(platform => ({
      video_id: video.id,
      name: platform,
      status: 'pending'
    }));

    const { error: platformError } = await supabase
      .from(PLATFORMS_TABLE)
      .insert(platformRecords);

    if (platformError) {
      throw platformError;
    }
  }

  // Return the created video with platforms
  return getVideoById(video.id);
};

/**
 * Update a video
 * @param {string} id - Video ID
 * @param {object} videoData - Updated video data
 * @returns {Promise<object>} - Updated video object
 */
export const updateVideo = async (id, videoData) => {
  const { platforms, ...videoDetails } = videoData;
  
  // Update video record
  const { error: videoError } = await supabase
    .from(VIDEOS_TABLE)
    .update({
      ...videoDetails,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (videoError) {
    throw videoError;
  }

  // If platforms are specified, update platform records
  if (platforms && platforms.length > 0) {
    // First, delete existing platforms
    const { error: deleteError } = await supabase
      .from(PLATFORMS_TABLE)
      .delete()
      .eq('video_id', id);

    if (deleteError) {
      throw deleteError;
    }

    // Then, insert new platforms
    const platformRecords = platforms.map(platform => ({
      video_id: id,
      name: platform,
      status: 'pending'
    }));

    const { error: platformError } = await supabase
      .from(PLATFORMS_TABLE)
      .insert(platformRecords);

    if (platformError) {
      throw platformError;
    }
  }

  // Return the updated video with platforms
  return getVideoById(id);
};

/**
 * Delete a video
 * @param {string} id - Video ID
 * @returns {Promise<void>}
 */
export const deleteVideo = async (id) => {
  // First, delete associated platforms
  const { error: platformError } = await supabase
    .from(PLATFORMS_TABLE)
    .delete()
    .eq('video_id', id);

  if (platformError) {
    throw platformError;
  }

  // Then, delete the video
  const { error: videoError } = await supabase
    .from(VIDEOS_TABLE)
    .delete()
    .eq('id', id);

  if (videoError) {
    throw videoError;
  }
};

/**
 * Update video status
 * @param {string} id - Video ID
 * @param {string} status - New status
 * @returns {Promise<object>} - Updated video object
 */
export const updateVideoStatus = async (id, status) => {
  const { error } = await supabase
    .from(VIDEOS_TABLE)
    .update({ status })
    .eq('id', id);

  if (error) {
    throw error;
  }

  return getVideoById(id);
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
};
