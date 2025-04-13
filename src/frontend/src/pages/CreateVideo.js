import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideos } from '../context/VideoContext';
import { useAuth } from '../context/AuthContext';
import { textToSpeech } from '../services/speechService';
import { generateVideo, generateCaptions } from '../services/videoProcessor';
import './CreateVideo.css';

const CreateVideo = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { createVideo, uploadVideo, uploadThumbnail } = useVideos();

  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [platforms, setPlatforms] = useState({
    tiktok: true,
    instagram: true,
    youtube: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');

  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !prompt.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (!backgroundImage) {
      setError('Please upload a background image');
      return;
    }

    // Check if at least one platform is selected
    if (!platforms.tiktok && !platforms.instagram && !platforms.youtube) {
      setError('Please select at least one platform');
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);
    setProgressMessage('Starting video creation...');

    try {
      // 1. Create initial video record in database
      setProgressMessage('Creating video record...');
      setProgress(10);

      const selectedPlatforms = Object.keys(platforms).filter(key => platforms[key]);

      const videoData = {
        title,
        prompt,
        platforms: selectedPlatforms,
        status: 'processing'
      };

      const newVideo = await createVideo(videoData);

      // 2. Generate speech from prompt
      setProgressMessage('Generating speech from text...');
      setProgress(20);

      let audioBlob;
      try {
        audioBlob = await textToSpeech(prompt);
      } catch (error) {
        console.error('Error generating speech:', error);
        // Use a fallback audio if speech generation fails
        audioBlob = new Blob([''], { type: 'audio/mp3' });
      }

      // 3. Generate captions
      setProgressMessage('Generating captions...');
      setProgress(40);

      // Estimate audio duration (in a real app, you'd calculate this properly)
      const estimatedDuration = prompt.split(' ').length * 0.5; // rough estimate: 0.5 seconds per word
      const captions = generateCaptions(prompt, estimatedDuration);

      // 4. Generate video
      setProgressMessage('Generating video...');
      setProgress(60);

      const videoBlob = await generateVideo(backgroundImage, audioBlob, captions);

      // 5. Upload video to storage
      setProgressMessage('Uploading video...');
      setProgress(80);

      // Create a File object from the Blob
      const videoFile = new File([videoBlob], `${title.replace(/\s+/g, '-')}.mp4`, { type: 'video/mp4' });
      const videoUrl = await uploadVideo(videoFile);

      // 6. Upload thumbnail (using the background image)
      setProgressMessage('Uploading thumbnail...');
      setProgress(90);

      const thumbnailUrl = await uploadThumbnail(backgroundImage);

      // 7. Update video record with URLs
      setProgressMessage('Finalizing...');
      setProgress(95);

      // In a real app, you would update the video record with the URLs
      // For now, we'll just simulate completion

      setProgress(100);
      setProgressMessage('Video created successfully!');

      // Redirect to the video details page
      setTimeout(() => {
        navigate(`/videos/${newVideo.id}`);
      }, 1000);

    } catch (err) {
      console.error('Error creating video:', err);
      setError('Failed to create video. Please try again.');
      setLoading(false);
    }
  };

  const handlePlatformChange = (platform) => {
    setPlatforms({
      ...platforms,
      [platform]: !platforms[platform]
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setBackgroundImage(file);
      setError(null);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="create-video">
      <h1 className="page-title">Create New Video</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="card">
        {loading ? (
          <div className="progress-container">
            <h3>{progressMessage}</h3>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p>{progress}% complete</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Video Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your video"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prompt">Video Prompt</label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want in your video..."
                required
              ></textarea>
              <p className="form-help">
                Be specific about the content, style, and tone you want for your video.
              </p>
            </div>

            <div className="form-group">
              <label>Background Image</label>
              <div className="image-upload-container">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />

                {backgroundImage ? (
                  <div className="image-preview">
                    <img
                      src={URL.createObjectURL(backgroundImage)}
                      alt="Background"
                    />
                    <button
                      type="button"
                      className="change-image-btn"
                      onClick={handleBrowseClick}
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <div className="image-upload-placeholder" onClick={handleBrowseClick}>
                    <i className="upload-icon">📷</i>
                    <p>Click to upload a background image</p>
                    <span>JPG, PNG or GIF, max 5MB</span>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Publish To</label>
              <div className="platforms-selection">
                <div className="platform-option">
                  <input
                    type="checkbox"
                    id="tiktok"
                    checked={platforms.tiktok}
                    onChange={() => handlePlatformChange('tiktok')}
                  />
                  <label htmlFor="tiktok">TikTok</label>
                </div>

                <div className="platform-option">
                  <input
                    type="checkbox"
                    id="instagram"
                    checked={platforms.instagram}
                    onChange={() => handlePlatformChange('instagram')}
                  />
                  <label htmlFor="instagram">Instagram Reels</label>
                </div>

                <div className="platform-option">
                  <input
                    type="checkbox"
                    id="youtube"
                    checked={platforms.youtube}
                    onChange={() => handlePlatformChange('youtube')}
                  />
                  <label htmlFor="youtube">YouTube Shorts</label>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Create Video
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateVideo;
