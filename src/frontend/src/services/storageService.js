import { supabase } from '../supabase/config';

// Storage bucket names
const VIDEOS_BUCKET = 'videos';
const THUMBNAILS_BUCKET = 'thumbnails';

/**
 * Upload a video file to Supabase Storage
 * @param {File} file - Video file to upload
 * @param {string} userId - User ID
 * @returns {Promise<string>} - Public URL of the uploaded file
 */
export const uploadVideo = async (file, userId) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from(VIDEOS_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw error;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(VIDEOS_BUCKET)
    .getPublicUrl(data.path);

  return publicUrl;
};

/**
 * Upload a thumbnail image to Supabase Storage
 * @param {File} file - Image file to upload
 * @param {string} userId - User ID
 * @returns {Promise<string>} - Public URL of the uploaded file
 */
export const uploadThumbnail = async (file, userId) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from(THUMBNAILS_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw error;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(THUMBNAILS_BUCKET)
    .getPublicUrl(data.path);

  return publicUrl;
};

/**
 * Delete a file from Supabase Storage
 * @param {string} bucket - Storage bucket name
 * @param {string} path - File path
 * @returns {Promise<void>}
 */
export const deleteFile = async (bucket, path) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    throw error;
  }
};

/**
 * Delete a video file
 * @param {string} url - Public URL of the video
 * @returns {Promise<void>}
 */
export const deleteVideo = async (url) => {
  // Extract path from URL
  const path = url.split(`${VIDEOS_BUCKET}/`)[1];
  
  if (!path) {
    throw new Error('Invalid video URL');
  }

  return deleteFile(VIDEOS_BUCKET, path);
};

/**
 * Delete a thumbnail image
 * @param {string} url - Public URL of the thumbnail
 * @returns {Promise<void>}
 */
export const deleteThumbnail = async (url) => {
  // Extract path from URL
  const path = url.split(`${THUMBNAILS_BUCKET}/`)[1];
  
  if (!path) {
    throw new Error('Invalid thumbnail URL');
  }

  return deleteFile(THUMBNAILS_BUCKET, path);
};
