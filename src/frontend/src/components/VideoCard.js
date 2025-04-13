import React from 'react';
import { Link } from 'react-router-dom';
import './VideoCard.css';

const VideoCard = ({ video }) => {
  return (
    <div className="video-card">
      <div className="video-thumbnail">
        {video.thumbnailUrl ? (
          <img src={video.thumbnailUrl} alt={video.title} />
        ) : (
          <div className="placeholder-thumbnail">
            <span>No Thumbnail</span>
          </div>
        )}
        <div className="video-duration">{formatDuration(video.duration || 0)}</div>
      </div>
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <p className="video-status">Status: <span className={`status-${video.status}`}>{video.status}</span></p>
        <p className="video-date">Created: {new Date(video.createdAt).toLocaleDateString()}</p>
        <Link to={`/videos/${video._id}`} className="btn btn-sm">
          View Details
        </Link>
      </div>
    </div>
  );
};

// Helper function to format duration in seconds to MM:SS
const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

export default VideoCard;
