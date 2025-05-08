import { supabase } from '../../config/supabase';
import videoProcessor from './videoProcessor';
import * as databaseService from '../database/databaseService';

/**
 * Video service for ClipFlowAI
 * This service provides methods for creating, updating, and publishing videos
 */

/**
 * Generate a video from a prompt
 * @param {object} options - Video generation options
 * @param {string} options.prompt - Text prompt for the video
 * @param {File} options.imageFile - Background image for the video
 * @param {File} options.audioFile - Audio file for the video (voiceover)
 * @param {string} options.subtitlesText - Subtitles in SRT format
 * @param {string} options.musicOption - Background music option
 * @param {Function} options.onProgress - Progress callback function
 * @returns {Promise<Blob>} - Generated video as a Blob
 */
export const generateVideo = async (options) => {
  try {
    return await videoProcessor.generateVideo(options);
  } catch (error) {
    console.error('Error generating video:', error);
    throw error;
  }
};

/**
 * Upload a video to Supabase storage
 * @param {Blob} videoBlob - Video blob to upload
 * @param {string} fileName - File name for the video
 * @returns {Promise<string>} - URL of the uploaded video
 */
export const uploadVideo = async (videoBlob, fileName) => {
  try {
    const fileExt = fileName.split('.').pop();
    const filePath = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(filePath, videoBlob, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'video/mp4'
      });
    
    if (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
};

/**
 * Upload a thumbnail to Supabase storage
 * @param {Blob} thumbnailBlob - Thumbnail blob to upload
 * @param {string} videoId - ID of the video
 * @returns {Promise<string>} - URL of the uploaded thumbnail
 */
export const uploadThumbnail = async (thumbnailBlob, videoId) => {
  try {
    const filePath = `thumbnails/${videoId}_${Date.now()}.jpg`;
    
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(filePath, thumbnailBlob, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'image/jpeg'
      });
    
    if (error) {
      console.error('Error uploading thumbnail:', error);
      throw error;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    throw error;
  }
};

/**
 * Create a new video in the database
 * @param {object} videoData - Video data
 * @returns {Promise<object>} - Created video data
 */
export const createVideo = async (videoData) => {
  try {
    return await databaseService.createVideo(videoData);
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  }
};

/**
 * Get all videos for the current user
 * @returns {Promise<Array>} - Array of videos
 */
export const getUserVideos = async () => {
  try {
    return await databaseService.getUserVideos();
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
    return await databaseService.getVideoById(videoId);
  } catch (error) {
    console.error(`Error getting video with ID ${videoId}:`, error);
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
    return await databaseService.updateVideo(videoId, updates);
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
    await databaseService.deleteVideo(videoId);
  } catch (error) {
    console.error(`Error deleting video with ID ${videoId}:`, error);
    throw error;
  }
};

/**
 * Generate a thumbnail from a video
 * @param {File} videoFile - Video file
 * @param {number} timeInSeconds - Time in seconds to capture thumbnail
 * @returns {Promise<Blob>} - Thumbnail blob
 */
export const generateThumbnail = async (videoFile, timeInSeconds = 0) => {
  try {
    return await videoProcessor.generateThumbnail(videoFile, timeInSeconds);
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    throw error;
  }
};

/**
 * Generate captions from audio
 * @param {File} audioFile - Audio file
 * @returns {Promise<string>} - Captions in SRT format
 */
export const generateCaptions = async (audioFile) => {
  try {
    return await videoProcessor.generateCaptions(audioFile);
  } catch (error) {
    console.error('Error generating captions:', error);
    throw error;
  }
};

/**
 * Resize video for a specific platform
 * @param {File} videoFile - Video file
 * @param {string} platform - Platform name
 * @returns {Promise<Blob>} - Resized video blob
 */
export const resizeVideoForPlatform = async (videoFile, platform) => {
  try {
    return await videoProcessor.resizeVideoForPlatform(videoFile, platform);
  } catch (error) {
    console.error('Error resizing video:', error);
    throw error;
  }
};

/**
 * Publish a video to a platform
 * @param {string} videoId - ID of the video to publish
 * @param {string} platform - Platform to publish to
 * @param {object} options - Publishing options
 * @returns {Promise<object>} - Publication data
 */
export const publishVideo = async (videoId, platform, options = {}) => {
  try {
    // Get the video
    const video = await databaseService.getVideoById(videoId);
    if (!video) {
      throw new Error(`Video with ID ${videoId} not found`);
    }
    
    // Create a publication record
    const publicationData = {
      video_id: videoId,
      user_id: video.user_id,
      platform_name: platform,
      status: 'pending',
      scheduled_for: options.scheduledFor || null
    };
    
    // Insert the publication record
    const { data, error } = await supabase
      .from('video_publications')
      .insert([publicationData])
      .select();
    
    if (error) {
      console.error('Error creating publication record:', error);
      throw error;
    }
    
    return data[0];
  } catch (error) {
    console.error(`Error publishing video with ID ${videoId} to ${platform}:`, error);
    throw error;
  }
};

export default {
  generateVideo,
  uploadVideo,
  uploadThumbnail,
  createVideo,
  getUserVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  generateThumbnail,
  generateCaptions,
  resizeVideoForPlatform,
  publishVideo
};
