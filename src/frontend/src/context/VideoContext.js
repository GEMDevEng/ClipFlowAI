import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as firebaseService from '../services/firebaseService';

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
          const fetchedVideos = await firebaseService.getAllVideos(currentUser.uid);
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
        userId: currentUser.uid,
        userDisplayName: currentUser.displayName || 'Anonymous'
      };
      
      // Create video in Firebase
      const newVideo = await firebaseService.createVideo(videoWithUser);
      
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
      return await firebaseService.getVideoById(id);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Update a video
  const updateVideo = async (id, videoData) => {
    try {
      setError(null);
      
      // Update video in Firebase
      const updatedVideo = await firebaseService.updateVideo(id, videoData);
      
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
      
      // Delete video from Firebase
      await firebaseService.deleteVideo(id);
      
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
      
      return await firebaseService.uploadVideo(videoFile, currentUser.uid);
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
      
      return await firebaseService.uploadThumbnail(imageFile, currentUser.uid);
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
    uploadThumbnail
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
