import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as databaseService from '../services/databaseService';
import * as storageService from '../services/storageService';

// Create context
const VideoContext = createContext();

// Provider component
export const VideoProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch videos when user changes
  useEffect(() => {
    const fetchVideos = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          setError(null);
          const fetchedVideos = await databaseService.getAllVideos(currentUser.id);
          setVideos(fetchedVideos);
        } catch (error) {
          setError('Failed to fetch videos');
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        setVideos([]);
        setLoading(false);
      }
    };

    fetchVideos();
  }, [currentUser]);

  // Create a new video
  const createVideo = async (videoData) => {
    try {
      setError(null);

      if (!currentUser) {
        throw new Error('You must be logged in to create a video');
      }

      // Add user ID to video data
      const videoWithUser = {
        ...videoData,
        user_id: currentUser.id,
        user_display_name: currentUser.user_metadata?.displayName || currentUser.email.split('@')[0]
      };

      // Create video in Supabase
      const newVideo = await databaseService.createVideo(videoWithUser);

      // Update local state
      setVideos(prevVideos => [newVideo, ...prevVideos]);

      return newVideo;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Get a video by ID
  const getVideoById = async (id) => {
    try {
      setError(null);
      return await databaseService.getVideoById(id);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Update a video
  const updateVideo = async (id, videoData) => {
    try {
      setError(null);

      // Update video in Supabase
      const updatedVideo = await databaseService.updateVideo(id, videoData);

      // Update local state
      setVideos(prevVideos =>
        prevVideos.map(video =>
          video.id === id ? { ...video, ...updatedVideo } : video
        )
      );

      return updatedVideo;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Delete a video
  const deleteVideo = async (id) => {
    try {
      setError(null);

      // Delete video from Supabase
      await databaseService.deleteVideo(id);

      // Update local state
      setVideos(prevVideos => prevVideos.filter(video => video.id !== id));
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Upload a video file
  const uploadVideo = async (videoFile) => {
    try {
      setError(null);

      if (!currentUser) {
        throw new Error('You must be logged in to upload a video');
      }

      return await storageService.uploadVideo(videoFile, currentUser.id);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Upload a thumbnail image
  const uploadThumbnail = async (imageFile) => {
    try {
      setError(null);

      if (!currentUser) {
        throw new Error('You must be logged in to upload a thumbnail');
      }

      return await storageService.uploadThumbnail(imageFile, currentUser.id);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Get analytics for a specific video
  const getVideoAnalytics = async (videoId) => {
    try {
      setError(null);
      return await databaseService.getVideoAnalytics(videoId);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Get overall analytics for all videos of a user
  const getOverallAnalytics = async () => {
    try {
      setError(null);
      if (!currentUser) {
        throw new Error('You must be logged in to view analytics');
      }
      return await databaseService.getOverallAnalytics(currentUser.id);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const value = {
    videos,
    loading,
    error,
    createVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    uploadVideo,
    uploadThumbnail,
    getVideoAnalytics,
    getOverallAnalytics
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};

// Custom hook to use video context
export const useVideos = () => {
  return useContext(VideoContext);
};
