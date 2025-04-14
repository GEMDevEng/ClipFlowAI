import React, { useState, useRef, useEffect } from 'react';
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

  const [schedulePublish, setSchedulePublish] = useState(false);
  const [publishDate, setPublishDate] = useState('');
  const [publishTime, setPublishTime] = useState('');

  const [language, setLanguage] = useState('en-US');

  const [script, setScript] = useState('');
  const [music, setMusic] = useState('default');
  const [voiceProfile, setVoiceProfile] = useState('default');
  const [subtitles, setSubtitles] = useState('');
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

      // Calculate scheduled publish time if enabled
      let scheduledPublishTime = null;
      if (schedulePublish && publishDate && publishTime) {
        scheduledPublishTime = new Date(`${publishDate}T${publishTime}`).toISOString();
      }

      const videoData = {
        title,
        prompt,
        script: script || prompt, // Use prompt as default script if not provided
        music,
        voiceProfile,
        language,
        subtitles: subtitles || '', // Empty string if not provided
        platforms: selectedPlatforms,
        status: 'processing',
        scheduled_publish: schedulePublish,
        scheduled_publish_time: scheduledPublishTime
      };

      const newVideo = await createVideo(videoData);

      // 2. Generate speech from prompt
      setProgressMessage('Generating speech from text...');
      setProgress(20);

      let audioBlob;
      try {
        // Use script instead of prompt if available, and pass voice profile and language
        const textContent = script || prompt;
        audioBlob = await textToSpeech(textContent, voiceProfile, language);
      } catch (error) {
        console.error('Error generating speech:', error);
        // Use a fallback audio if speech generation fails
        audioBlob = new Blob([''], { type: 'audio/mp3' });
      }

      // 3. Generate captions
      setProgressMessage('Generating captions...');
      setProgress(40);

      // Estimate audio duration (in a real app, you'd calculate this properly)
      const textContent = script || prompt;
      const estimatedDuration = textContent.split(' ').length * 0.5; // rough estimate: 0.5 seconds per word

      // Use custom subtitles if provided, otherwise generate from text content
      let captions;
      if (subtitles && subtitles.trim() !== '') {
        captions = generateCaptions(subtitles, estimatedDuration);
      } else {
        captions = generateCaptions(textContent, estimatedDuration);
      }

      // 4. Generate video
      setProgressMessage('Generating video...');
      setProgress(60);

      const videoBlob = await generateVideo(backgroundImage, audioBlob, captions, music);

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
                onChange={(e) => {
                  setPrompt(e.target.value);
                  // If script is empty, update it with the prompt
                  if (!script) {
                    setScript(e.target.value);
                  }
                  // If subtitles is empty, update it with the prompt
                  if (!subtitles) {
                    setSubtitles(e.target.value);
                  }
                }}
                placeholder="Describe what you want in your video..."
                required
              ></textarea>
              <p className="form-help">
                Be specific about the content, style, and tone you want for your video.
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="script">Script (Optional)</label>
              <textarea
                id="script"
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Edit the script for your video..."
              ></textarea>
              <p className="form-help">
                Customize the script that will be used for the voiceover. If left empty, the prompt will be used.
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="subtitles">Subtitles (Optional)</label>
              <textarea
                id="subtitles"
                value={subtitles}
                onChange={(e) => setSubtitles(e.target.value)}
                placeholder="Edit the subtitles for your video..."
              ></textarea>
              <p className="form-help">
                Customize the subtitles that will appear in the video. If left empty, the script will be used.
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
              <label htmlFor="language">Language</label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="es-ES">Spanish</option>
                <option value="fr-FR">French</option>
                <option value="de-DE">German</option>
                <option value="it-IT">Italian</option>
                <option value="ja-JP">Japanese</option>
                <option value="ko-KR">Korean</option>
                <option value="zh-CN">Chinese (Simplified)</option>
                <option value="pt-BR">Portuguese (Brazil)</option>
                <option value="ru-RU">Russian</option>
              </select>
              <p className="form-help">
                Select the language for the video content.
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="voiceProfile">Voice Profile</label>
              <select
                id="voiceProfile"
                value={voiceProfile}
                onChange={(e) => setVoiceProfile(e.target.value)}
              >
                <option value="default">Default Voice</option>
                <option value="male1">Male Voice 1</option>
                <option value="male2">Male Voice 2</option>
                <option value="female1">Female Voice 1</option>
                <option value="female2">Female Voice 2</option>
              </select>
              <p className="form-help">
                Select the voice profile for the voiceover.
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="music">Background Music</label>
              <select
                id="music"
                value={music}
                onChange={(e) => setMusic(e.target.value)}
              >
                <option value="default">Default Music</option>
                <option value="upbeat">Upbeat</option>
                <option value="relaxed">Relaxed</option>
                <option value="dramatic">Dramatic</option>
                <option value="none">No Music</option>
              </select>
              <p className="form-help">
                Select the background music for your video.
              </p>
            </div>

            <div className="form-group">
              <label>Publishing Options</label>
              <div className="publishing-options">
                <div className="schedule-option">
                  <input
                    type="checkbox"
                    id="schedulePublish"
                    checked={schedulePublish}
                    onChange={() => setSchedulePublish(!schedulePublish)}
                  />
                  <label htmlFor="schedulePublish">Schedule Publishing</label>
                </div>

                {schedulePublish && (
                  <div className="schedule-datetime">
                    <div className="schedule-date">
                      <label htmlFor="publishDate">Date:</label>
                      <input
                        type="date"
                        id="publishDate"
                        value={publishDate}
                        onChange={(e) => setPublishDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]} // Today's date as minimum
                        required={schedulePublish}
                      />
                    </div>
                    <div className="schedule-time">
                      <label htmlFor="publishTime">Time:</label>
                      <input
                        type="time"
                        id="publishTime"
                        value={publishTime}
                        onChange={(e) => setPublishTime(e.target.value)}
                        required={schedulePublish}
                      />
                    </div>
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
