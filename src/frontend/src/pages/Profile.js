import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uploadAvatar } from '../services/storageService';
import './Profile.css';

const Profile = () => {
  const { currentUser, updateUserProfile, logout } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.user_metadata?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.user_metadata?.avatarUrl || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  // Effect to update state when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.user_metadata?.displayName || '');
      setEmail(currentUser.email || '');
      setAvatarUrl(currentUser.user_metadata?.avatarUrl || '');
    }
  }, [currentUser]);

  // Handle avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setAvatarFile(file);
    }
  };

  // Upload avatar using the storage service
  const handleAvatarUpload = async () => {
    if (!avatarFile) return null;

    try {
      setUploadLoading(true);
      setError('');

      // Upload the avatar using the storage service
      const publicUrl = await uploadAvatar(avatarFile, currentUser.id);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError('Error uploading avatar. Please try again.');
      return null;
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!displayName.trim()) {
      setError('Display name cannot be empty');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);

      // Upload avatar if a new one was selected
      let newAvatarUrl = avatarUrl;
      if (avatarFile) {
        const uploadedUrl = await handleAvatarUpload();
        if (uploadedUrl) {
          newAvatarUrl = uploadedUrl;
        }
      }

      // Update user profile
      await updateUserProfile(displayName, newAvatarUrl);

      // Reset the file input
      setAvatarFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setSuccess('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      setError('Failed to log out');
      console.error(error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Your Profile</h1>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="profile-info">
          <div className="profile-avatar">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                {displayName?.charAt(0) || email?.charAt(0) || '?'}
              </div>
            )}
            <div className="avatar-upload">
              <label htmlFor="avatar-input" className="avatar-upload-label">
                Change Photo
              </label>
              <input
                type="file"
                id="avatar-input"
                accept="image/*"
                onChange={handleAvatarChange}
                ref={fileInputRef}
                className="avatar-input"
              />
            </div>
          </div>

          <div className="profile-details">
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Account created:</strong> {currentUser?.created_at ? new Date(currentUser.created_at).toLocaleDateString() : 'Unknown'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="displayName">Display Name</label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || uploadLoading}
          >
            {loading || uploadLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>

        <div className="profile-actions">
          <button
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
