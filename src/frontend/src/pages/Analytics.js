import React, { useState, useEffect } from 'react';
import './Analytics.css';
import { useVideos } from '../context/VideoContext';
import { useAuth } from '../context/AuthContext';
import ViewsChart from '../components/charts/ViewsChart';
import PlatformChart from '../components/charts/PlatformChart';
import * as analyticsService from '../services/analyticsService';

const Analytics = () => {
  const { currentUser } = useAuth();
  const { videos, getOverallAnalytics, loading, error } = useVideos();

  const [analytics, setAnalytics] = useState({ totalViews: 0, totalLikes: 0, totalShares: 0 });
  const [timeData, setTimeData] = useState([]);
  const [platformData, setPlatformData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        if (currentUser) {
          // Get overall analytics
          const data = await getOverallAnalytics();
          setAnalytics(data);

          // Get analytics over time
          const timeSeriesData = await analyticsService.getAnalyticsOverTime(currentUser.id, 7);
          setTimeData(timeSeriesData);

          // Get analytics by platform
          const platformAnalytics = await analyticsService.getAnalyticsByPlatform(currentUser.id);
          setPlatformData(platformAnalytics);
        }
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [currentUser, getOverallAnalytics]);

  if (loading || isLoading) {
    return <div className="loading">Loading analytics...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="analytics-page">
      <h1 className="page-title">Video Analytics</h1>

      <div className="analytics-summary">
        <div className="summary-card">
          <h2>Total Videos</h2>
          <p>{videos.length}</p>
        </div>
        <div className="summary-card">
          <h2>Total Views</h2>
          <p>{analytics.totalViews.toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h2>Total Likes</h2>
          <p>{analytics.totalLikes.toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h2>Total Shares</h2>
          <p>{analytics.totalShares.toLocaleString()}</p>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="chart-card card">
          <ViewsChart data={timeData} />
        </div>
        <div className="chart-card card">
          <PlatformChart data={platformData} />
        </div>
      </div>

      <div className="analytics-insights card">
        <h2>Insights & Recommendations</h2>
        <ul>
          {platformData && platformData.length > 0 ? (
            <>
              <li>
                {platformData.sort((a, b) => b.views - a.views)[0].platform} is your best performing platform with
                {platformData.sort((a, b) => b.views - a.views)[0].views.toLocaleString()} views.
              </li>
              <li>
                Your engagement rate is {Math.round((analytics.totalLikes / analytics.totalViews) * 100)}%
                {(analytics.totalLikes / analytics.totalViews) > 0.1 ? '(excellent)' : (analytics.totalLikes / analytics.totalViews) > 0.05 ? '(good)' : '(needs improvement)'}.
              </li>
              <li>
                {timeData && timeData.length > 0 && timeData[timeData.length - 1].views > timeData[0].views ?
                  'Your views are trending upward. Keep up the good work!' :
                  'Try posting more consistently to increase your views.'}
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
