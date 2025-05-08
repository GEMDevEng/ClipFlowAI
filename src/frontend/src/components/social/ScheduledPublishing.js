import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { publishVideo } from '../../services/socialMediaService';

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

  // We don't need platform configuration anymore as we're using Tailwind CSS classes directly

  /**
   * Load scheduled videos for the current user
   */
  const loadScheduledVideos = useCallback(async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch the user's scheduled videos
      // For now, we'll use mock data
      const mockScheduledVideos = [
        {
          id: 'video-1',
          title: 'How to Make a Perfect Cup of Coffee',
          scheduled_publish: true,
          scheduled_publish_time: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
          platforms: ['youtube', 'tiktok'],
          thumbnail_url: 'https://example.com/thumbnails/coffee.jpg',
          status: 'processing'
        },
        {
          id: 'video-2',
          title: 'Top 10 Travel Destinations for 2023',
          scheduled_publish: true,
          scheduled_publish_time: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
          platforms: ['instagram'],
          thumbnail_url: 'https://example.com/thumbnails/travel.jpg',
          status: 'processing'
        },
        {
          id: 'video-3',
          title: 'Easy Workout Routine for Beginners',
          scheduled_publish: true,
          scheduled_publish_time: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
          platforms: ['youtube', 'tiktok', 'instagram'],
          thumbnail_url: 'https://example.com/thumbnails/workout.jpg',
          status: 'processing'
        }
      ];

      setScheduledVideos(mockScheduledVideos);
    } catch (error) {
      console.error('Error loading scheduled videos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

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

  /**
   * Handle publishing a video now
   */
  const handlePublishNow = async () => {
    if (!selectedVideo) return;

    try {
      // Close the dialog
      setShowConfirmDialog(false);

      alert('Publishing video...');

      // In a real implementation, this would call the API to publish the video
      await publishVideo(currentUser.id, selectedVideo.id, selectedVideo.platforms);

      // Remove the video from the list
      setScheduledVideos(prev => prev.filter(v => v.id !== selectedVideo.id));

      alert('Video published successfully');
    } catch (error) {
      console.error('Error publishing video:', error);
      alert(`Error publishing video: ${error.message}`);
    }
  };

  /**
   * Handle canceling a scheduled publishing
   * @param {Object} video - Video to cancel
   */
  const handleCancelScheduled = async (video) => {
    try {
      // In a real implementation, this would call the API to cancel the scheduled publishing

      // Remove the video from the list
      setScheduledVideos(prev => prev.filter(v => v.id !== video.id));

      alert('Scheduled publishing canceled');
    } catch (error) {
      console.error('Error canceling scheduled publishing:', error);
      alert(`Error canceling scheduled publishing: ${error.message}`);
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
        >
          <i className="fas fa-sync-alt mr-2" aria-hidden="true"></i>
          <span>Refresh</span>
        </button>
      </div>

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
                      {video.platforms.map(platform => {
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
                      >
                        <i className="fas fa-play mr-1" aria-hidden="true"></i>
                        <span>Publish Now</span>
                      </button>
                      <button
                        className="px-3 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 flex items-center"
                      >
                        <i className="fas fa-edit mr-1" aria-hidden="true"></i>
                        <span>Edit</span>
                      </button>
                      <button
                        className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-50 flex items-center"
                        onClick={() => handleCancelScheduled(video)}
                      >
                        <i className="fas fa-trash mr-1" aria-hidden="true"></i>
                        <span>Cancel</span>
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
