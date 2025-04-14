import React, { useState } from 'react'; // Removed useEffect
import { Link } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { useVideos } from '../context/VideoContext'; // Import useVideos hook
import './Dashboard.css';

const Dashboard = () => {
  // Use state from VideoContext
  const { videos, loading, error } = useVideos(); 
  const [filter, setFilter] = useState('all');

  // No useEffect needed as VideoContext handles fetching

  const filteredVideos = videos.filter(video => {
    if (filter === 'all') return true;
    // Assuming video object has an 'id' property now, not '_id' based on VideoContext
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
          {/* Assuming video object has an 'id' property now, not '_id' */}
          {filteredVideos.map(video => (
            <VideoCard key={video.id} video={video} /> 
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
