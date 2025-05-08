import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * AnalyticsFilters component for filtering analytics data
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onFilterChange - Callback when filters change
 * @param {Array} props.platforms - Available platforms
 * @param {Array} props.metrics - Available metrics
 * @param {Object} props.initialFilters - Initial filter values
 * @returns {JSX.Element} - AnalyticsFilters component
 */
const AnalyticsFilters = ({ 
  onFilterChange, 
  platforms = [], 
  metrics = ['views', 'likes', 'shares', 'comments'],
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState({
    platform: initialFilters.platform || '',
    metrics: initialFilters.metrics || metrics,
    sortBy: initialFilters.sortBy || 'date',
    sortOrder: initialFilters.sortOrder || 'desc'
  });

  // Apply filters when they change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  /**
   * Handle filter change
   * @param {Object} e - Event object
   */
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Handle metric toggle
   * @param {string} metric - Metric to toggle
   */
  const handleMetricToggle = (metric) => {
    setFilters(prev => {
      const currentMetrics = [...prev.metrics];
      
      if (currentMetrics.includes(metric)) {
        // Remove metric if it's already selected
        return { 
          ...prev, 
          metrics: currentMetrics.filter(m => m !== metric) 
        };
      } else {
        // Add metric if it's not selected
        return { 
          ...prev, 
          metrics: [...currentMetrics, metric] 
        };
      }
    });
  };

  /**
   * Handle sort change
   * @param {string} sortBy - Field to sort by
   */
  const handleSortChange = (sortBy) => {
    setFilters(prev => {
      // If clicking the same field, toggle order
      if (prev.sortBy === sortBy) {
        return {
          ...prev,
          sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
        };
      }
      
      // Otherwise, set new sort field with default desc order
      return {
        ...prev,
        sortBy,
        sortOrder: 'desc'
      };
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Filters</h3>
      
      <div className="space-y-4">
        {/* Platform filter */}
        <div>
          <label htmlFor="platform-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Platform
          </label>
          <select
            id="platform-filter"
            name="platform"
            value={filters.platform}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">All Platforms</option>
            {platforms.map(platform => (
              <option key={platform.id || platform} value={platform.id || platform}>
                {platform.name || platform}
              </option>
            ))}
          </select>
        </div>
        
        {/* Metrics filter */}
        <div>
          <p className="block text-sm font-medium text-gray-700 mb-1">Metrics</p>
          <div className="flex flex-wrap gap-2">
            {metrics.map(metric => (
              <button
                key={metric}
                onClick={() => handleMetricToggle(metric)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.metrics.includes(metric)
                    ? 'bg-purple-100 text-purple-800 border border-purple-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-300'
                }`}
              >
                {metric.charAt(0).toUpperCase() + metric.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Sort options */}
        <div>
          <p className="block text-sm font-medium text-gray-700 mb-1">Sort By</p>
          <div className="flex flex-wrap gap-2">
            {['date', 'views', 'likes', 'shares'].map(sortOption => (
              <button
                key={sortOption}
                onClick={() => handleSortChange(sortOption)}
                className={`px-3 py-1 rounded-full text-sm flex items-center ${
                  filters.sortBy === sortOption
                    ? 'bg-purple-100 text-purple-800 border border-purple-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-300'
                }`}
              >
                {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
                {filters.sortBy === sortOption && (
                  <span className="ml-1">
                    {filters.sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

AnalyticsFilters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  platforms: PropTypes.array,
  metrics: PropTypes.array,
  initialFilters: PropTypes.object
};

export default AnalyticsFilters;
