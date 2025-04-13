import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './VideoDetails.css';

const VideoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This would be replaced with an actual API call
    const fetchVideoDetails = async () => {
      try {
        // Simulating API call with timeout
        setTimeout(() => {
          // Mock data based on the ID
          const mockVideo = {
            _id: id,
            title: 'Sample Video Title',
            prompt: 'This is a sample prompt for the video generation.',
            status: 'completed',
            duration: 45,
            createdAt: '2023-08-15T10:30:00Z',
            publishedAt: '2023-08-15T11:00:00Z',
            videoUrl: 'https://example.com/video.mp4',
            thumbnailUrl: null,
            platforms: [
              {
                name: 'tiktok',
                status: 'published',
                publishedUrl: 'https://tiktok.com/video/123456',
                publishedAt: '2023-08-15T11:05:00Z'
              },
              {
                name: 'instagram',
                status: 'published',
                publishedUrl: 'https://instagram.com/p/123456',
                publishedAt: '2023-08-15T11:10:00Z'
              },
              {
                name: 'youtube',
                status: 'published',
                publishedUrl: 'https://youtube.com/shorts/123456',
                publishedAt: '2023-08-15T11:15:00Z'
              }
            ]
          };
          
          setVideo(mockVideo);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to fetch video details');
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [id]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      // This would be replaced with an actual API call
      // Simulating API call with timeout
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    }
  };

  if (loading) {
    return <div className="loading">Loading video details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!video) {
    return <div className="error">Video not found</div>;
  }

  return (
    <div className="video-details">
      <div className="details-header">
        <h1 className="page-title">{video.title}</h1>
        <div className="details-actions">
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete Video
          </button>
        </div>
      </div>

      <div className="details-content">
        <div className="video-preview">
          {video.videoUrl ? (
            <video controls src={video.videoUrl}></video>
          ) : (
            <div className="video-placeholder">
              <p>Video is being processed...</p>
            </div>
          )}
        </div>

        <div className="details-info">
          <div className="card">
            <h2>Video Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className={`status-badge status-${video.status}`}>
                  {video.status}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Created:</span>
                <span>{new Date(video.createdAt).toLocaleString()}</span>
              </div>
              {video.publishedAt && (
                <div className="info-item">
                  <span className="info-label">Published:</span>
                  <span>{new Date(video.publishedAt).toLocaleString()}</span>
                </div>
              )}
              {video.duration && (
                <div className="info-item">
                  <span className="info-label">Duration:</span>
                  <span>{formatDuration(video.duration)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h2>Prompt</h2>
            <p className="prompt-text">{video.prompt}</p>
          </div>

          <div className="card">
            <h2>Publishing Status</h2>
            <div className="platforms-status">
              {video.platforms.map((platform) => (
                <div key={platform.name} className="platform-status">
                  <div className="platform-header">
                    <h3>{getPlatformName(platform.name)}</h3>
                    <span className={`status-badge status-${platform.status}`}>
                      {platform.status}
                    </span>
                  </div>
                  {platform.publishedUrl && (
                    <a
                      href={platform.publishedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="platform-link"
                    >
                      View on {getPlatformName(platform.name)}
                    </a>
                  )}
                  {platform.publishedAt && (
                    <p className="platform-date">
                      Published: {new Date(platform.publishedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
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

// Helper function to get platform display name
const getPlatformName = (platformKey) => {
  const platforms = {
    tiktok: 'TikTok',
    instagram: 'Instagram Reels',
    youtube: 'YouTube Shorts'
  };
  return platforms[platformKey] || platformKey;
};

export default VideoDetails;
