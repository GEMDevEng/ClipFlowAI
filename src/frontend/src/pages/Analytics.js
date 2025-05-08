import React, { useState, useEffect, useCallback } from 'react';
import './Analytics.css';
import { useVideos } from '../context/VideoContext';
import { useAuth } from '../context/AuthContext';
import ViewsChart from '../components/charts/ViewsChart';
import PlatformChart from '../components/charts/PlatformChart';
import DateRangeSelector from '../components/charts/DateRangeSelector';
import AnalyticsFilters from '../components/charts/AnalyticsFilters';
import ExportAnalytics from '../components/charts/ExportAnalytics';
import * as analyticsService from '../services/analyticsService';

const Analytics = () => {
  const { currentUser } = useAuth();
  const { videos, getOverallAnalytics, loading, error } = useVideos();

  // Analytics data state
  const [analytics, setAnalytics] = useState({ totalViews: 0, totalLikes: 0, totalShares: 0 });
  const [timeData, setTimeData] = useState([]);
  const [platformData, setPlatformData] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtering state
  const [dateRange, setDateRange] = useState({ type: 'preset', value: '7days' });
  const [filters, setFilters] = useState({
    platform: '',
    metrics: ['views', 'likes', 'shares'],
    sortBy: 'date',
    sortOrder: 'desc'
  });

  /**
   * Fetch analytics data based on current filters
   */
  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      if (currentUser) {
        // Get overall analytics
        const data = await getOverallAnalytics();
        setAnalytics(data);

        // Determine date range in days
        let days = 7;
        if (dateRange.type === 'preset') {
          if (dateRange.value === '30days') days = 30;
          else if (dateRange.value === '90days') days = 90;
        } else if (dateRange.type === 'custom') {
          // Calculate days between start and end date
          const start = new Date(dateRange.value.start);
          const end = new Date(dateRange.value.end);
          days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        }

        // Get analytics over time with the specified date range
        const timeSeriesData = await analyticsService.getAnalyticsOverTime(
          currentUser.id,
          days,
          dateRange.type === 'custom' ? dateRange.value : null
        );
        setTimeData(timeSeriesData);
        setRawData(timeSeriesData);

        // Get analytics by platform with the specified filters
        const platformAnalytics = await analyticsService.getAnalyticsByPlatform(
          currentUser.id,
          filters.platform || null
        );
        setPlatformData(platformAnalytics);
      }
    } catch (err) {
      console.error("Failed to fetch analytics", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, getOverallAnalytics, dateRange, filters.platform]);

  // Fetch analytics when component mounts or filters change
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  /**
   * Handle date range change
   * @param {Object} range - New date range
   */
  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  /**
   * Handle filters change
   * @param {Object} newFilters - New filters
   */
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading || isLoading) {
    return <div className="loading">Loading analytics...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Get available platforms from platform data
  const availablePlatforms = platformData && platformData.length > 0
    ? [...new Set(platformData.map(item => item.platform))]
    : ['TikTok', 'YouTube', 'Instagram', 'Facebook'];

  return (
    <div className="analytics-page">
      <h1 className="page-title">Video Analytics</h1>

      {/* Analytics Controls */}
      <div className="analytics-controls grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <DateRangeSelector
          onRangeChange={handleDateRangeChange}
          defaultRange={dateRange.type === 'preset' ? dateRange.value : 'custom'}
        />
        <AnalyticsFilters
          onFilterChange={handleFilterChange}
          platforms={availablePlatforms}
          initialFilters={filters}
        />
      </div>

      {/* Analytics Summary */}
      <div className="analytics-summary">
        <div className="summary-card">
          <h2>Total Videos</h2>
          <p>{videos.length}</p>
        </div>
        <div className="summary-card">
          <h2>Total Views</h2>
          <p>{analytics.totalViews?.toLocaleString() || '0'}</p>
        </div>
        <div className="summary-card">
          <h2>Total Likes</h2>
          <p>{analytics.totalLikes?.toLocaleString() || '0'}</p>
        </div>
        <div className="summary-card">
          <h2>Total Shares</h2>
          <p>{analytics.totalShares?.toLocaleString() || '0'}</p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="analytics-charts">
        <div className="chart-card card">
          <ViewsChart
            data={timeData}
            title={`Views Over Time (${dateRange.type === 'preset'
              ? dateRange.value === '7days' ? 'Last 7 Days'
                : dateRange.value === '30days' ? 'Last 30 Days'
                : 'Last 90 Days'
              : 'Custom Range'
            })`}
            dataKey={filters.metrics[0] || 'views'}
          />
        </div>
        <div className="chart-card card">
          <PlatformChart
            data={platformData}
            metrics={filters.metrics}
          />
        </div>
      </div>

      {/* Export Analytics */}
      <div className="mb-6">
        <ExportAnalytics
          data={rawData}
          filename={`analytics-${dateRange.type === 'preset' ? dateRange.value : 'custom'}`}
        />
      </div>

      {/* Analytics Insights */}
      <div className="analytics-insights card">
        <h2>Insights & Recommendations</h2>
        <ul>
          {platformData && platformData.length > 0 ? (
            <>
              <li>
                {platformData.sort((a, b) => b.views - a.views)[0].platform} is your best performing platform with {' '}
                {platformData.sort((a, b) => b.views - a.views)[0].views.toLocaleString()} views.
              </li>
              <li>
                Your engagement rate is {Math.round((analytics.totalLikes / analytics.totalViews) * 100) || 0}%
                {(analytics.totalLikes / analytics.totalViews) > 0.1 ? ' (excellent)' : (analytics.totalLikes / analytics.totalViews) > 0.05 ? ' (good)' : ' (needs improvement)'}.
              </li>
              <li>
                {timeData && timeData.length > 0 && timeData[timeData.length - 1]?.views > timeData[0]?.views ?
                  'Your views are trending upward. Keep up the good work!' :
                  'Try posting more consistently to increase your views.'}
              </li>
              <li>
                The best time to post is {timeData && timeData.length > 0
                  ? 'between 6-8 PM based on your engagement patterns.'
                  : 'typically between 6-8 PM for most social platforms.'}
              </li>
            </>
          ) : (
            <li>Publish more videos to get personalized insights.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Analytics;
