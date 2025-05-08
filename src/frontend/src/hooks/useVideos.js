import { useState, useEffect, useCallback } from 'react';
import videoService from '../services/video/videoService';
import useAuth from './useAuth';

/**
 * Custom hook for video operations
 * @returns {object} - Video state and methods
 */
const useVideos = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch videos when user changes
  useEffect(() => {
    const fetchVideos = async () => {
      if (user) {
        try {
          setLoading(true);
          setError(null);

          const fetchedVideos = await videoService.getUserVideos();
          setVideos(fetchedVideos);
        } catch (err) {
          console.error('Error fetching videos:', err);
          setError('Failed to fetch videos');
        } finally {
          setLoading(false);
        }
      } else {
        setVideos([]);
        setLoading(false);
      }
    };

    fetchVideos();
  }, [user]);

  // Get a video by ID
  const getVideoById = useCallback(async (id) => {
    try {
      setError(null);
      return await videoService.getVideoById(id);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Create a new video
  const createVideo = useCallback(async (videoData) => {
    try {
      setError(null);

      if (!user) {
        throw new Error('You must be logged in to create a video');
      }

      // Add user ID to video data
      const videoWithUser = {
        ...videoData,
        user_id: user.id,
        user_display_name: user.user_metadata?.displayName || user.email.split('@')[0]
      };

      // Create video in Supabase
      const newVideo = await videoService.createVideo(videoWithUser);

      // Update local state
      setVideos(prevVideos => [newVideo, ...prevVideos]);

      return newVideo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [user]);

  // Update a video
  const updateVideo = useCallback(async (id, videoData) => {
    try {
      setError(null);

      // Update video in Supabase
      const updatedVideo = await videoService.updateVideo(id, videoData);

      // Update local state
      setVideos(prevVideos =>
        prevVideos.map(video =>
          video.id === id ? { ...video, ...updatedVideo } : video
        )
      );

      return updatedVideo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Delete a video
  const deleteVideo = useCallback(async (id) => {
    try {
      setError(null);

      // Delete video from Supabase
      await videoService.deleteVideo(id);

      // Update local state
      setVideos(prevVideos => prevVideos.filter(video => video.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Upload a video file
  const uploadVideo = useCallback(async (videoBlob, fileName) => {
    try {
      setError(null);

      if (!user) {
        throw new Error('You must be logged in to upload a video');
      }

      return await videoService.uploadVideo(videoBlob, fileName);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [user]);

  // Upload a thumbnail image
  const uploadThumbnail = useCallback(async (thumbnailBlob, videoId) => {
    try {
      setError(null);

      if (!user) {
        throw new Error('You must be logged in to upload a thumbnail');
      }

      return await videoService.uploadThumbnail(thumbnailBlob, videoId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [user]);

  // Generate a video
  const generateVideo = useCallback(async (options) => {
    try {
      setError(null);

      if (!user) {
        throw new Error('You must be logged in to generate a video');
      }

      return await videoService.generateVideo(options);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [user]);

  // Generate a thumbnail
  const generateThumbnail = useCallback(async (videoFile, timeInSeconds = 0) => {
    try {
      setError(null);

      return await videoService.generateThumbnail(videoFile, timeInSeconds);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Generate captions
  const generateCaptions = useCallback(async (audioFile) => {
    try {
      setError(null);

      return await videoService.generateCaptions(audioFile);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Publish a video
  const publishVideo = useCallback(async (videoId, platform, options = {}) => {
    try {
      setError(null);

      if (!user) {
        throw new Error('You must be logged in to publish a video');
      }

      return await videoService.publishVideo(videoId, platform, options);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [user]);

  return {
    videos,
    loading,
    error,
    getVideoById,
    createVideo,
    updateVideo,
    deleteVideo,
    uploadVideo,
    uploadThumbnail,
    generateVideo,
    generateThumbnail,
    generateCaptions,
    publishVideo,
  };
};

export default useVideos;
