import React, { useState, useEffect } from 'react';
import { PLATFORMS, LANGUAGES, VOICE_PROFILES } from '../../config/constants';

/**
 * VideoForm component for creating and editing videos
 * 
 * @param {Object} props - Component props
 * @param {Object} props.initialData - Initial form data
 * @param {Function} props.onSubmit - Form submission handler
 * @param {boolean} props.isEditing - Whether the form is in edit mode
 * @param {boolean} props.isLoading - Whether the form is in loading state
 * @returns {JSX.Element} - VideoForm component
 */
const VideoForm = ({ 
  initialData = {}, 
  onSubmit, 
  isEditing = false,
  isLoading = false
}) => {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    script: '',
    platforms: [],
    language: LANGUAGES.ENGLISH,
    voiceProfile: VOICE_PROFILES.NEUTRAL,
    music: '',
    subtitles: true,
    thumbnailUrl: '',
    ...initialData
  });

  // Error state
  const [errors, setErrors] = useState({});

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(prevData => ({
        ...prevData,
        ...initialData
      }));
    }
  }, [initialData]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  // Handle platform selection
  const handlePlatformChange = (platform) => {
    setFormData(prevData => {
      const platforms = [...prevData.platforms];
      
      if (platforms.includes(platform)) {
        // Remove platform if already selected
        return {
          ...prevData,
          platforms: platforms.filter(p => p !== platform)
        };
      } else {
        // Add platform if not selected
        return {
          ...prevData,
          platforms: [...platforms, platform]
        };
      }
    });
    
    // Clear error for platforms
    if (errors.platforms) {
      setErrors(prevErrors => ({
        ...prevErrors,
        platforms: null
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Call onSubmit callback
    onSubmit(formData);
  };

  // Validate form
  const validateForm = (data) => {
    const errors = {};
    
    if (!data.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!data.script.trim()) {
      errors.script = 'Script is required';
    }
    
    if (data.platforms.length === 0) {
      errors.platforms = 'At least one platform must be selected';
    }
    
    return errors;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Video Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${errors.title ? 'border-red-500' : ''}`}
          placeholder="Enter a catchy title for your video"
          disabled={isLoading}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Describe your video"
          disabled={isLoading}
        />
      </div>

      {/* Script */}
      <div>
        <label htmlFor="script" className="block text-sm font-medium text-gray-700">
          Script <span className="text-red-500">*</span>
        </label>
        <textarea
          id="script"
          name="script"
          value={formData.script}
          onChange={handleChange}
          rows={6}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 ${errors.script ? 'border-red-500' : ''}`}
          placeholder="Write your video script here"
          disabled={isLoading}
        />
        {errors.script && (
          <p className="mt-1 text-sm text-red-500">{errors.script}</p>
        )}
      </div>

      {/* Platforms */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Platforms <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.values(PLATFORMS).map((platform) => (
            <div key={platform} className="flex items-center">
              <input
                type="checkbox"
                id={`platform-${platform}`}
                checked={formData.platforms.includes(platform)}
                onChange={() => handlePlatformChange(platform)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label htmlFor={`platform-${platform}`} className="ml-2 block text-sm text-gray-700">
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </label>
            </div>
          ))}
        </div>
        {errors.platforms && (
          <p className="mt-1 text-sm text-red-500">{errors.platforms}</p>
        )}
      </div>

      {/* Language and Voice Profile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">
            Language
          </label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            disabled={isLoading}
          >
            {Object.entries(LANGUAGES).map(([key, value]) => (
              <option key={key} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="voiceProfile" className="block text-sm font-medium text-gray-700">
            Voice Profile
          </label>
          <select
            id="voiceProfile"
            name="voiceProfile"
            value={formData.voiceProfile}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            disabled={isLoading}
          >
            {Object.entries(VOICE_PROFILES).map(([key, value]) => (
              <option key={key} value={value}>
                {value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Music and Subtitles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="music" className="block text-sm font-medium text-gray-700">
            Background Music
          </label>
          <input
            type="text"
            id="music"
            name="music"
            value={formData.music}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="Enter music URL or name"
            disabled={isLoading}
          />
        </div>
        
        <div className="flex items-center h-full pt-6">
          <input
            type="checkbox"
            id="subtitles"
            name="subtitles"
            checked={formData.subtitles}
            onChange={handleChange}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            disabled={isLoading}
          />
          <label htmlFor="subtitles" className="ml-2 block text-sm text-gray-700">
            Generate Subtitles
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            isEditing ? 'Update Video' : 'Create Video'
          )}
        </button>
      </div>
    </form>
  );
};

export default VideoForm;
