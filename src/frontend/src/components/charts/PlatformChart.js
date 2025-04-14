import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

/**
 * PlatformChart component displays a bar chart of performance by platform
 * 
 * @param {Object} props Component props
 * @param {Array} props.data Array of data points with platform, views, likes, and shares properties
 * @param {string} props.title Chart title
 */
const PlatformChart = ({ data = [], title = 'Performance by Platform' }) => {
  // If no data is provided, use sample data
  const chartData = data.length > 0 ? data : [
    { platform: 'TikTok', views: 1200, likes: 350, shares: 120 },
    { platform: 'YouTube', views: 800, likes: 200, shares: 50 },
    { platform: 'Instagram', views: 1500, likes: 450, shares: 180 },
    { platform: 'Facebook', views: 600, likes: 150, shares: 40 },
  ];

  return (
    <div className="chart-container">
      <h2>{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="platform" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="views" fill="#8884d8" name="Views" />
          <Bar dataKey="likes" fill="#82ca9d" name="Likes" />
          <Bar dataKey="shares" fill="#ffc658" name="Shares" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlatformChart;
