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
import { formatDate } from '../../utils/helpers';

/**
 * ViewsChart component displays a line chart of views over time
 *
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of data points with date and views properties
 * @param {string} props.title - Chart title
 * @param {string} props.dataKey - Data key to display (default: 'views')
 * @param {string} props.color - Line color (default: '#8884d8')
 * @param {Object} props.additionalProps - Additional props for the LineChart
 * @returns {JSX.Element} - ViewsChart component
 */
const ViewsChart = ({
  data = [],
  title = 'Views Over Time',
  dataKey = 'views',
  color = '#8884d8',
  additionalProps = {}
}) => {
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

  // Format date for display in chart
  const formatChartDate = (dateStr) => {
    return formatDate(dateStr, { month: 'short', day: 'numeric' });
  };

  // Format value for tooltip
  const formatTooltipValue = (value) => {
    return [`${value.toLocaleString()} ${dataKey}`, dataKey.charAt(0).toUpperCase() + dataKey.slice(1)];
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
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
            dataKey="date"
            tickFormatter={formatChartDate}
            stroke="#9ca3af"
            tick={{ fill: '#4b5563' }}
          />
          <YAxis
            stroke="#9ca3af"
            tick={{ fill: '#4b5563' }}
          />
          <Tooltip
            formatter={formatTooltipValue}
            labelFormatter={formatChartDate}
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
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            activeDot={{ r: 8, fill: color, stroke: '#fff' }}
            dot={{ r: 4, fill: color, stroke: '#fff', strokeWidth: 1 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ViewsChart;
