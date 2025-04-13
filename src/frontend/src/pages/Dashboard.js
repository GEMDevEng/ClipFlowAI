import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import './Dashboard.css';

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // This would be replaced with an actual API call
    const fetchVideos = async () => {
      try {
        // Simulating API call with timeout
        setTimeout(() => {
          // Mock data
          const mockVideos = [
            {
              _id: '1',
              title: 'Top 10 Travel Hacks',
              status: 'completed',
              duration: 45,
              createdAt: '2023-08-15T10:30:00Z',
              thumbnailUrl: null
            },
            {
              _id: '2',
              title: 'Easy Cooking Tips',
              status: 'processing',
              duration: 30,
              createdAt: '2023-08-16T14:20:00Z',
              thumbnailUrl: null
            },
            {
              _id: '3',
              title: 'Fitness Routine for Beginners',
              status: 'pending',
              duration: 60,
              createdAt: '2023-08-17T09:15:00Z',
              thumbnailUrl: null
            }
          ];
          
          setVideos(mockVideos);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to fetch videos');
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const filteredVideos = videos.filter(video => {
    if (filter === 'all') return true;
    return video.status === filter;
  });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="page-title">Your Videos</h1>
        <Link to="/create" className="btn">
          Create New Video
        </Link>
      </div>

      <div className="filter-controls">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={`filter-btn ${filter === 'processing' ? 'active' : ''}`}
          onClick={() => setFilter('processing')}
        >
          Processing
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading videos...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : filteredVideos.length === 0 ? (
        <div className="no-videos">
          <p>No videos found.</p>
          {filter !== 'all' && (
            <p>Try changing the filter or create a new video.</p>
          )}
        </div>
      ) : (
        <div className="videos-grid">
          {filteredVideos.map(video => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
