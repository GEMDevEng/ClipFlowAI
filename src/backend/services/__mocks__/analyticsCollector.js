/**
 * Mock implementation of the analytics collector service
 */

/**
 * Start the analytics collection process
 */
const startCollector = async () => {
  console.log('Mock analytics collector started');
  return true;
};

/**
 * Stop the analytics collection process
 */
const stopCollector = async () => {
  console.log('Mock analytics collector stopped');
  return true;
};

/**
 * Collect analytics data for all published videos
 */
const collectAnalytics = async () => {
  console.log('Mock analytics collection completed');
  return {
    processed: 5,
    updated: 3,
    failed: 0
  };
};

/**
 * Store analytics record in the database
 * @param {string} videoId - Video ID
 * @param {string} userId - User ID
 * @param {string} platform - Platform name
 * @param {object} metrics - Analytics metrics
 * @returns {Promise<object>} - Stored record
 */
const storeAnalyticsRecord = async (videoId, userId, platform, metrics) => {
  return {
    id: 'mock-analytics-id',
    video_id: videoId,
    user_id: userId,
    platform,
    views: metrics.views || 0,
    likes: metrics.likes || 0,
    shares: metrics.shares || 0,
    comments: metrics.comments || 0,
    date: new Date().toISOString()
  };
};

/**
 * Fetch metrics from a platform
 * @param {string} platform - Platform name
 * @param {string} url - URL to the published content
 * @returns {Promise<object>} - Metrics data
 */
const fetchPlatformMetrics = async (platform, url) => {
  return {
    views: 1000,
    likes: 100,
    shares: 50,
    comments: 25,
    platform
  };
};

module.exports = {
  startCollector,
  stopCollector,
  collectAnalytics,
  storeAnalyticsRecord,
  fetchPlatformMetrics
};
