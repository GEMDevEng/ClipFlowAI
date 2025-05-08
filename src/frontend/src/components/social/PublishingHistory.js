import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * Component for displaying publishing history
 * @returns {JSX.Element} - PublishingHistory component
 */
const PublishingHistory = () => {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    platform: '',
    status: '',
    timeframe: '30days'
  });

  /**
   * Load publishing history for the current user
   */
  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch the user's publishing history
      // For now, we'll use mock data
      const mockHistory = [
        {
          id: 'history-1',
          video_id: 'video-1',
          video_title: 'How to Make a Perfect Cup of Coffee',
          platform: 'youtube',
          status: 'published',
          published_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
          published_url: 'https://youtube.com/watch?v=abc123',
          views: 1250,
          likes: 87,
          comments: 15
        },
        {
          id: 'history-2',
          video_id: 'video-1',
          video_title: 'How to Make a Perfect Cup of Coffee',
          platform: 'tiktok',
          status: 'published',
          published_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
          published_url: 'https://tiktok.com/@user/video/abc123',
          views: 3500,
          likes: 245,
          comments: 42
        },
        {
          id: 'history-3',
          video_id: 'video-2',
          video_title: 'Top 10 Travel Destinations for 2023',
          platform: 'instagram',
          status: 'failed',
          published_at: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
          error: 'Authentication failed'
        }
      ];

      // Apply filters
      let filteredHistory = [...mockHistory];

      if (filters.platform) {
        filteredHistory = filteredHistory.filter(item => item.platform === filters.platform);
      }

      if (filters.status) {
        filteredHistory = filteredHistory.filter(item => item.status === filters.status);
      }

      setHistory(filteredHistory);
    } catch (error) {
      console.error('Error loading publishing history:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load history on component mount and when filters change
  useEffect(() => {
    if (currentUser) {
      loadHistory();
    }
  }, [currentUser, loadHistory]);



  /**
   * Handle filter change
   * @param {Object} e - Event object
   */
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Reset filters
   */
  const resetFilters = () => {
    setFilters({
      platform: '',
      status: '',
      timeframe: '30days'
    });
  };

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

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        <p className="mt-4">Loading publishing history...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Publishing History</h2>

      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-6 gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            name="platform"
            value={filters.platform}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">All Platforms</option>
            <option value="youtube">YouTube</option>
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
          </select>

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="failed">Failed</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadHistory}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <span>Refresh</span>
          </button>
          <button
            onClick={resetFilters}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-md">
          <p>No publishing history found with the current filters.</p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
          >
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metrics</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.video_title}</div>
                    <div className="text-sm text-gray-500">ID: {item.video_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {(() => {
                        let iconClass = '';

                        if (item.platform === 'youtube') {
                          iconClass = 'text-red-500';
                        } else if (item.platform === 'tiktok') {
                          iconClass = 'text-black';
                        } else {
                          iconClass = 'text-purple-500';
                        }

                        return <i className={`fab fa-${item.platform} mr-2 ${iconClass}`} aria-hidden="true"></i>;
                      })()}
                      <span className="text-sm text-gray-900 capitalize">{item.platform}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      let statusClass = '';

                      if (item.status === 'published') {
                        statusClass = 'bg-green-100 text-green-800';
                      } else if (item.status === 'failed') {
                        statusClass = 'bg-red-100 text-red-800';
                      } else {
                        statusClass = 'bg-yellow-100 text-yellow-800';
                      }

                      return (
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
                          {item.status}
                        </span>
                      );
                    })()}
                    {item.error && (
                      <div className="text-xs text-red-500 mt-1">
                        {item.error}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(item.published_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.status === 'published' ? (
                      <div className="text-sm text-gray-900">
                        <div>Views: {item.views}</div>
                        <div>Likes: {item.likes}</div>
                        <div>Comments: {item.comments}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {item.published_url && (
                      <a
                        href={item.published_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <span>View</span> <i className="fas fa-external-link-alt ml-1" aria-hidden="true"></i>
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PublishingHistory;
