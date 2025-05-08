import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * ExportAnalytics component for exporting analytics data
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Analytics data to export
 * @param {string} props.filename - Default filename for export
 * @returns {JSX.Element} - ExportAnalytics component
 */
const ExportAnalytics = ({ data, filename = 'analytics-export' }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [isExporting, setIsExporting] = useState(false);

  /**
   * Handle export format change
   * @param {Object} e - Event object
   */
  const handleFormatChange = (e) => {
    setExportFormat(e.target.value);
  };

  /**
   * Export data in CSV format
   * @param {Array} data - Data to export
   * @returns {string} - CSV string
   */
  const exportAsCSV = (data) => {
    if (!data || !data.length) return '';
    
    // Get headers from first data item
    const headers = Object.keys(data[0]);
    
    // Create CSV header row
    const headerRow = headers.join(',');
    
    // Create data rows
    const rows = data.map(item => {
      return headers.map(header => {
        // Handle special cases (objects, arrays, etc.)
        const value = item[header];
        
        if (typeof value === 'object' && value !== null) {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        
        // Handle strings with commas
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        
        return value;
      }).join(',');
    });
    
    // Combine header and rows
    return [headerRow, ...rows].join('\n');
  };

  /**
   * Export data in JSON format
   * @param {Array} data - Data to export
   * @returns {string} - JSON string
   */
  const exportAsJSON = (data) => {
    return JSON.stringify(data, null, 2);
  };

  /**
   * Handle export button click
   */
  const handleExport = () => {
    if (!data || !data.length) {
      alert('No data to export');
      return;
    }
    
    setIsExporting(true);
    
    try {
      // Prepare data based on format
      let exportData;
      let mimeType;
      let fileExtension;
      
      if (exportFormat === 'csv') {
        exportData = exportAsCSV(data);
        mimeType = 'text/csv';
        fileExtension = 'csv';
      } else {
        exportData = exportAsJSON(data);
        mimeType = 'application/json';
        fileExtension = 'json';
      }
      
      // Create blob and download link
      const blob = new Blob([exportData], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Set download attributes
      link.href = url;
      link.download = `${filename}-${new Date().toISOString().split('T')[0]}.${fileExtension}`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Export Data</h3>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={exportFormat}
          onChange={handleFormatChange}
          className="p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="csv">CSV</option>
          <option value="json">JSON</option>
        </select>
        
        <button
          onClick={handleExport}
          disabled={isExporting || !data || !data.length}
          className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isExporting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Exporting...
            </>
          ) : (
            <>
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export {exportFormat.toUpperCase()}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

ExportAnalytics.propTypes = {
  data: PropTypes.array.isRequired,
  filename: PropTypes.string
};

export default ExportAnalytics;
