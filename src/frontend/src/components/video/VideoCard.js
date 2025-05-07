import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/helpers';
import { VIDEO_STATUS, ROUTES } from '../../config/constants';
import './VideoCard.css';

/**
 * Format duration in seconds to MM:SS
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration
 */
const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

/**
 * Get status color class based on video status
 * @param {string} status - Video status
 * @returns {string} - CSS class name
 */
const getStatusColorClass = (status) => {
  switch (status?.toLowerCase()) {
    case VIDEO_STATUS.PENDING:
      return 'text-yellow-500';
    case VIDEO_STATUS.PROCESSING:
      return 'text-blue-500';
    case VIDEO_STATUS.COMPLETED:
      return 'text-green-500';
    case VIDEO_STATUS.PUBLISHED:
      return 'text-purple-500';
    case VIDEO_STATUS.FAILED:
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

/**
 * VideoCard component
 * @param {object} props - Component props
 * @param {object} props.video - Video object
 * @param {function} props.onDelete - Delete handler function
 * @returns {JSX.Element} - VideoCard component
 */
const VideoCard = ({ video, onDelete }) => {
  if (!video) return null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48 bg-gray-100">
        {video.thumbnail_url ? (
          <img 
            src={video.thumbnail_url} 
            alt={video.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200">
            <span className="text-gray-500">No Thumbnail</span>
          </div>
        )}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
        )}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${getStatusColorClass(video.status)} bg-opacity-20 bg-current`}>
          {video.status || 'Unknown'}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 truncate" title={video.title}>
          {video.title}
        </h3>
        
        <div className="text-sm text-gray-600 mb-3">
          <p>Created: {formatDate(video.created_at, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
          {video.platforms && video.platforms.length > 0 && (
            <p className="mt-1">
              Platforms: {video.platforms.map(p => p.name).join(', ')}
            </p>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <Link 
            to={`/videos/${video.id}`} 
            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
          >
            View Details
          </Link>
          
          {onDelete && (
            <button 
              onClick={() => onDelete(video.id)} 
              className="text-red-500 hover:text-red-700 text-sm"
              aria-label="Delete video"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
