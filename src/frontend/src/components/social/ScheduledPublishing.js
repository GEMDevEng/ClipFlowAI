import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { publishVideo, getScheduledVideos } from '../../services/socialMediaService';

/**
 * Component for managing scheduled publishing
 * @returns {JSX.Element} - ScheduledPublishing component
 */
const ScheduledPublishing = () => {
  const { currentUser } = useAuth();
  const [scheduledVideos, setScheduledVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  /**
   * Load scheduled videos for the current user
   */
  const loadScheduledVideos = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      // Get scheduled videos from the API
      const videos = await getScheduledVideos(currentUser.id);
      setScheduledVideos(videos);
    } catch (error) {
      console.error('Error loading scheduled videos:', error);
      // Fallback to mock data if API fails
      const mockScheduledVideos = [
        {
          id: 'video-1',
          title: 'How to Make a Perfect Cup of Coffee',
          scheduled_publish: true,
          scheduled_publish_time: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
          scheduled_platforms: ['youtube', 'tiktok'],
          thumbnail_url: 'https://example.com/thumbnails/coffee.jpg',
          status: 'processing'
        },
        {
          id: 'video-2',
          title: 'Top 10 Travel Destinations for 2023',
          scheduled_publish: true,
          scheduled_publish_time: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
          scheduled_platforms: ['instagram'],
          thumbnail_url: 'https://example.com/thumbnails/travel.jpg',
          status: 'processing'
        },
        {
          id: 'video-3',
          title: 'Easy Workout Routine for Beginners',
          scheduled_publish: true,
          scheduled_publish_time: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
          scheduled_platforms: ['youtube', 'tiktok', 'instagram'],
          thumbnail_url: 'https://example.com/thumbnails/workout.jpg',
          status: 'processing'
        }
      ];
      setScheduledVideos(mockScheduledVideos);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Load scheduled videos on component mount
  useEffect(() => {
    if (currentUser) {
      loadScheduledVideos();
    }
  }, [currentUser, loadScheduledVideos]);



  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} - Formatted date
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // State for publishing status
  const [publishingStatus, setPublishingStatus] = useState({
    isPublishing: false,
    videoId: null,
    success: null,
    error: null
  });

  /**
   * Handle publishing a video now
   */
  const handlePublishNow = async () => {
    if (!selectedVideo || !currentUser) return;

    try {
      // Close the dialog
      setShowConfirmDialog(false);

      // Get the platforms from the scheduled video
      const platforms = selectedVideo.scheduled_platforms || [];

      if (platforms.length === 0) {
        setPublishingStatus({
          isPublishing: false,
          videoId: selectedVideo.id,
          success: false,
          error: 'No platforms selected for publishing'
        });
        return;
      }

      // Set publishing status
      setPublishingStatus({
        isPublishing: true,
        videoId: selectedVideo.id,
        success: null,
        error: null
      });

      // Call the API to publish the video
      await publishVideo(currentUser.id, selectedVideo.id, platforms);

      // Update the video in the list to show it's published
      setScheduledVideos(prev => prev.filter(v => v.id !== selectedVideo.id));

      // Set success status
      setPublishingStatus({
        isPublishing: false,
        videoId: selectedVideo.id,
        success: true,
        error: null
      });

      // Clear status after 5 seconds
      setTimeout(() => {
        setPublishingStatus({
          isPublishing: false,
          videoId: null,
          success: null,
          error: null
        });
      }, 5000);

      // Reload the scheduled videos list
      loadScheduledVideos();
    } catch (error) {
      console.error('Error publishing video:', error);

      // Set error status
      setPublishingStatus({
        isPublishing: false,
        videoId: selectedVideo.id,
        success: false,
        error: error.message || 'Unknown error'
      });
    }
  };

  // State for cancellation status
  const [cancelStatus, setCancelStatus] = useState({
    isCanceling: false,
    videoId: null,
    success: null,
    error: null
  });

  /**
   * Handle canceling a scheduled publishing
   * @param {Object} video - Video to cancel
   */
  const handleCancelScheduled = async (video) => {
    if (!currentUser) return;

    try {
      // Set canceling status
      setCancelStatus({
        isCanceling: true,
        videoId: video.id,
        success: null,
        error: null
      });

      // Call the API to cancel the scheduled publishing
      const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/social/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          video_id: video.id,
          platforms: [],
          scheduled_time: null,
          scheduled_publish: false,
          user_id: currentUser.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel scheduled publishing');
      }

      // Remove the video from the list
      setScheduledVideos(prev => prev.filter(v => v.id !== video.id));

      // Set success status
      setCancelStatus({
        isCanceling: false,
        videoId: video.id,
        success: true,
        error: null
      });

      // Clear status after 5 seconds
      setTimeout(() => {
        setCancelStatus({
          isCanceling: false,
          videoId: null,
          success: null,
          error: null
        });
      }, 5000);

      // Reload the scheduled videos list
      loadScheduledVideos();
    } catch (error) {
      console.error('Error canceling scheduled publishing:', error);

      // Set error status
      setCancelStatus({
        isCanceling: false,
        videoId: video.id,
        success: false,
        error: error.message || 'Unknown error'
      });
    }
  };

  /**
   * Open the publish now dialog
   * @param {Object} video - Video to publish
   */
  const openPublishDialog = (video) => {
    setSelectedVideo(video);
    setShowConfirmDialog(true);
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        <p className="mt-4">Loading scheduled videos...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Scheduled Publishing</h2>
        <button
          onClick={loadScheduledVideos}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Refreshing...</span>
            </>
          ) : (
            <>
              <i className="fas fa-sync-alt mr-2" aria-hidden="true"></i>
              <span>Refresh</span>
            </>
          )}
        </button>
      </div>

      {/* Status notifications */}
      {publishingStatus.success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md flex items-center">
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Video published successfully!</span>
        </div>
      )}

      {publishingStatus.error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md flex items-center">
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Error publishing video: {publishingStatus.error}</span>
        </div>
      )}

      {cancelStatus.success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md flex items-center">
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Scheduled publishing canceled successfully!</span>
        </div>
      )}

      {cancelStatus.error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md flex items-center">
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Error canceling scheduled publishing: {cancelStatus.error}</span>
        </div>
      )}

      {scheduledVideos.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-md">
          <p>No scheduled videos found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platforms</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled For</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scheduledVideos.map((video) => (
                <tr key={video.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{video.title}</div>
                    <div className="text-sm text-gray-500">ID: {video.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      {(video.scheduled_platforms || []).map(platform => {
                        let platformStyle = '';

                        if (platform === 'youtube') {
                          platformStyle = 'bg-red-100 text-red-800';
                        } else if (platform === 'tiktok') {
                          platformStyle = 'bg-gray-100 text-gray-800';
                        } else {
                          platformStyle = 'bg-purple-100 text-purple-800';
                        }

                        return (
                          <span
                            key={platform}
                            className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center ${platformStyle}`}
                          >
                            <i className={`fab fa-${platform} mr-1`} aria-hidden="true"></i>
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(video.scheduled_publish_time)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                        onClick={() => openPublishDialog(video)}
                        disabled={publishingStatus.isPublishing || cancelStatus.isCanceling}
                      >
                        {publishingStatus.isPublishing && publishingStatus.videoId === video.id ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Publishing...</span>
                          </>
                        ) : (
                          <>
                            <i className="fas fa-play mr-1" aria-hidden="true"></i>
                            <span>Publish Now</span>
                          </>
                        )}
                      </button>
                      <button
                        className="px-3 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 flex items-center"
                        disabled={publishingStatus.isPublishing || cancelStatus.isCanceling}
                      >
                        <i className="fas fa-edit mr-1" aria-hidden="true"></i>
                        <span>Edit</span>
                      </button>
                      <button
                        className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50 flex items-center"
                        onClick={() => handleCancelScheduled(video)}
                        disabled={publishingStatus.isPublishing || cancelStatus.isCanceling}
                      >
                        {cancelStatus.isCanceling && cancelStatus.videoId === video.id ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Canceling...</span>
                          </>
                        ) : (
                          <>
                            <i className="fas fa-trash mr-1" aria-hidden="true"></i>
                            <span>Cancel</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Publish Now Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Publish Video Now</h3>
            <p className="mb-6">
              Are you sure you want to publish "{selectedVideo?.title}" now?
              This will override the scheduled publishing time.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handlePublishNow}
              >
                Publish Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduledPublishing;
