import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

/**
 * ViewsChart component displays a line chart of views over time
 * 
 * @param {Object} props Component props
 * @param {Array} props.data Array of data points with date and views properties
 * @param {string} props.title Chart title
 */
const ViewsChart = ({ data = [], title = 'Views Over Time' }) => {
  // If no data is provided, use sample data
  const chartData = data.length > 0 ? data : [
    { date: '2023-01-01', views: 0 },
    { date: '2023-01-02', views: 10 },
    { date: '2023-01-03', views: 25 },
    { date: '2023-01-04', views: 40 },
    { date: '2023-01-05', views: 65 },
    { date: '2023-01-06', views: 90 },
    { date: '2023-01-07', views: 120 },
  ];

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="chart-container">
      <h2>{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
          />
          <YAxis />
          <Tooltip 
            formatter={(value) => [`${value} views`, 'Views']}
            labelFormatter={formatDate}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="views"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ViewsChart;
