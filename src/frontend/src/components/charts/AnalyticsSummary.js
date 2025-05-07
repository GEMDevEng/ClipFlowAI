import React from 'react';
import { formatNumber } from '../../utils/helpers';

/**
 * AnalyticsSummary component displays a summary of analytics metrics
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Analytics data with metrics
 * @param {Array} props.metrics - Metrics to display (default: ['views', 'likes', 'shares'])
 * @param {Object} props.icons - Icons for each metric
 * @param {Object} props.colors - Colors for each metric
 * @param {Object} props.labels - Labels for each metric
 * @returns {JSX.Element} - AnalyticsSummary component
 */
const AnalyticsSummary = ({ 
  data = {}, 
  metrics = ['views', 'likes', 'shares'],
  icons = {
    views: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
      </svg>
    ),
    likes: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
      </svg>
    ),
    shares: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
      </svg>
    ),
    comments: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
    ),
    videos: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
      </svg>
    )
  },
  colors = {
    views: 'text-blue-500 bg-blue-100',
    likes: 'text-red-500 bg-red-100',
    shares: 'text-green-500 bg-green-100',
    comments: 'text-purple-500 bg-purple-100',
    videos: 'text-yellow-500 bg-yellow-100'
  },
  labels = {
    views: 'Views',
    likes: 'Likes',
    shares: 'Shares',
    comments: 'Comments',
    videos: 'Videos'
  }
}) => {
  // Default data if not provided
  const defaultData = {
    views: 0,
    likes: 0,
    shares: 0,
    comments: 0,
    videos: 0
  };

  // Merge default data with provided data
  const mergedData = { ...defaultData, ...data };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {metrics.map((metric) => (
        <div key={metric} className="bg-white rounded-lg shadow-md p-4 flex items-center">
          <div className={`p-3 rounded-full mr-4 ${colors[metric] || 'text-gray-500 bg-gray-100'}`}>
            {icons[metric] || (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">{labels[metric] || metric}</p>
            <p className="text-2xl font-semibold">{formatNumber(mergedData[metric] || 0)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsSummary;
