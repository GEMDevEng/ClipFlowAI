import React, { createContext, useContext } from 'react';
import useVideosHook from '../hooks/useVideos';
import * as analyticsService from '../services/analytics/analyticsService';
import { useAuth } from './AuthContext';

// Create context
const VideoContext = createContext();

/**
 * Video provider component
 * @param {object} props - Component props
 * @returns {JSX.Element} - Provider component
 */
export const VideoProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const videosHook = useVideosHook();

  // Add analytics methods to the hook values
  const getVideoAnalytics = async (videoId) => {
    try {
      if (!videoId) {
        throw new Error('Video ID is required');
      }
      return await analyticsService.getVideoAnalytics(videoId);
    } catch (error) {
      console.error('Get video analytics error:', error);
      throw error;
    }
  };

  const getOverallAnalytics = async () => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to view analytics');
      }
      return await analyticsService.getOverallAnalytics(currentUser.id);
    } catch (error) {
      console.error('Get overall analytics error:', error);
      throw error;
    }
  };

  const getAnalyticsHistory = async (period = 'week') => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to view analytics history');
      }
      return await analyticsService.getAnalyticsHistory(currentUser.id, period);
    } catch (error) {
      console.error('Get analytics history error:', error);
      throw error;
    }
  };

  // Combine the hook values with analytics methods
  const value = {
    ...videosHook,
    getVideoAnalytics,
    getOverallAnalytics,
    getAnalyticsHistory
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};

/**
 * Custom hook to use video context
 * @returns {object} - Video context value
 */
export const useVideos = () => {
  const context = useContext(VideoContext);

  if (context === undefined) {
    throw new Error('useVideos must be used within a VideoProvider');
  }

  return context;
};
