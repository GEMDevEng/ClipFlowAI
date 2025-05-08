import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * DateRangeSelector component for selecting date ranges for analytics
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onRangeChange - Callback when range changes
 * @param {string} props.defaultRange - Default selected range
 * @returns {JSX.Element} - DateRangeSelector component
 */
const DateRangeSelector = ({ onRangeChange, defaultRange = '7days' }) => {
  const [selectedRange, setSelectedRange] = useState(defaultRange);
  const [customRange, setCustomRange] = useState({ start: '', end: '' });
  const [showCustomRange, setShowCustomRange] = useState(false);

  // Predefined date ranges
  const ranges = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  /**
   * Handle range selection
   * @param {Object} e - Event object
   */
  const handleRangeChange = (e) => {
    const value = e.target.value;
    setSelectedRange(value);
    
    if (value === 'custom') {
      setShowCustomRange(true);
    } else {
      setShowCustomRange(false);
      onRangeChange({ type: 'preset', value });
    }
  };

  /**
   * Handle custom range change
   */
  const handleCustomRangeChange = (e) => {
    const { name, value } = e.target;
    setCustomRange(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Apply custom date range
   */
  const applyCustomRange = () => {
    if (customRange.start && customRange.end) {
      onRangeChange({ 
        type: 'custom', 
        value: customRange 
      });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Date Range</h3>
      
      <div className="mb-4">
        <select
          value={selectedRange}
          onChange={handleRangeChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        >
          {ranges.map(range => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>
      
      {showCustomRange && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                name="start"
                value={customRange.start}
                onChange={handleCustomRangeChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="end-date"
                name="end"
                value={customRange.end}
                onChange={handleCustomRangeChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
          <button
            onClick={applyCustomRange}
            disabled={!customRange.start || !customRange.end}
            className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply Range
          </button>
        </div>
      )}
    </div>
  );
};

DateRangeSelector.propTypes = {
  onRangeChange: PropTypes.func.isRequired,
  defaultRange: PropTypes.string
};

export default DateRangeSelector;
