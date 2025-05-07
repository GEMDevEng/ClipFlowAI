import { supabase } from '../../config/supabase';
import { generateId } from '../../utils/helpers';

/**
 * Storage service for Supabase
 */

// Storage bucket names
const VIDEO_BUCKET = 'videos';
const THUMBNAIL_BUCKET = 'thumbnails';
const AUDIO_BUCKET = 'audio';

/**
 * Upload a video file to storage
 * @param {File} file - Video file to upload
 * @param {string} userId - User ID
 * @returns {Promise<string>} - URL of the uploaded video
 */
export const uploadVideo = async (file, userId) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${generateId()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload the file
    const { data, error } = await supabase.storage
      .from(VIDEO_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(VIDEO_BUCKET)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Upload video error:', error);
    throw error;
  }
};

/**
 * Upload a thumbnail image to storage
 * @param {File} file - Image file to upload
 * @param {string} userId - User ID
 * @returns {Promise<string>} - URL of the uploaded thumbnail
 */
export const uploadThumbnail = async (file, userId) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${generateId()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload the file
    const { data, error } = await supabase.storage
      .from(THUMBNAIL_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(THUMBNAIL_BUCKET)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Upload thumbnail error:', error);
    throw error;
  }
};

/**
 * Upload an audio file to storage
 * @param {File} file - Audio file to upload
 * @param {string} userId - User ID
 * @returns {Promise<string>} - URL of the uploaded audio
 */
export const uploadAudio = async (file, userId) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${generateId()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload the file
    const { data, error } = await supabase.storage
      .from(AUDIO_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(AUDIO_BUCKET)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Upload audio error:', error);
    throw error;
  }
};

/**
 * Delete a file from storage
 * @param {string} url - URL of the file to delete
 * @returns {Promise<void>}
 */
export const deleteFile = async (url) => {
  try {
    if (!url) {
      throw new Error('No URL provided');
    }

    // Extract the bucket and path from the URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const bucket = pathParts[1];
    const filePath = pathParts.slice(2).join('/');

    // Delete the file
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Delete file error:', error);
    throw error;
  }
};

/**
 * Get a list of files in a bucket for a user
 * @param {string} bucket - Bucket name
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of file objects
 */
export const listFiles = async (bucket, userId) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(`${userId}`);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('List files error:', error);
    throw error;
  }
};
