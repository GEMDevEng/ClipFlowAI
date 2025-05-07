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
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of data points with platform, views, likes, and shares properties
 * @param {string} props.title - Chart title
 * @param {Array} props.metrics - Metrics to display (default: ['views', 'likes', 'shares'])
 * @param {Object} props.colors - Colors for each metric (default: { views: '#8884d8', likes: '#82ca9d', shares: '#ffc658' })
 * @param {Object} props.additionalProps - Additional props for the BarChart
 * @returns {JSX.Element} - PlatformChart component
 */
const PlatformChart = ({
  data = [],
  title = 'Performance by Platform',
  metrics = ['views', 'likes', 'shares'],
  colors = { views: '#8884d8', likes: '#82ca9d', shares: '#ffc658' },
  additionalProps = {}
}) => {
  // If no data is provided, use sample data
  const chartData = data.length > 0 ? data : [
    { platform: 'TikTok', views: 1200, likes: 350, shares: 120 },
    { platform: 'YouTube', views: 800, likes: 200, shares: 50 },
    { platform: 'Instagram', views: 1500, likes: 450, shares: 180 },
    { platform: 'Facebook', views: 600, likes: 150, shares: 40 },
  ];

  // Format value for tooltip
  const formatTooltipValue = (value) => {
    return value.toLocaleString();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          {...additionalProps}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="platform"
            stroke="#9ca3af"
            tick={{ fill: '#4b5563' }}
          />
          <YAxis
            stroke="#9ca3af"
            tick={{ fill: '#4b5563' }}
          />
          <Tooltip
            formatter={formatTooltipValue}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '10px' }}
          />
          {metrics.map((metric) => (
            <Bar
              key={metric}
              dataKey={metric}
              fill={colors[metric] || '#8884d8'}
              name={metric.charAt(0).toUpperCase() + metric.slice(1)}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlatformChart;
