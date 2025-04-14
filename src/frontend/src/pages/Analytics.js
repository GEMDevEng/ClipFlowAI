import React, { useContext, useState, useEffect } from 'react';
import './Analytics.css';
import { useVideos } from '../context/VideoContext';
import { useAuth } from '../context/AuthContext';

const Analytics = () => {
  const { currentUser } = useAuth();
  const { videos, getOverallAnalytics, loading, error } = useVideos();

  const [analytics, setAnalytics] = useState({ totalViews: 0, totalLikes: 0, totalShares: 0 });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        if (currentUser) {
          const data = await getOverallAnalytics();
          setAnalytics(data);
        }
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      }
    };

    fetchAnalytics();
  }, [currentUser, getOverallAnalytics]);

  if (loading) {
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
        {/* Placeholder for charts */}
        <div className="chart-placeholder card">
          <h2>Views Over Time</h2>
          <p>(Chart will be displayed here)</p>
        </div>
        <div className="chart-placeholder card">
          <h2>Performance by Platform</h2>
          <p>(Chart will be displayed here)</p>
        </div>
      </div>

      <div className="analytics-insights card">
        <h2>Insights & Recommendations</h2>
        <ul>
          <li>Videos published on Tuesdays tend to get more views.</li>
          <li>Consider using shorter titles for better engagement on TikTok.</li>
          <li>Experiment with different background music styles.</li>
        </ul>
      </div>
    </div>
  );
};

export default Analytics;
