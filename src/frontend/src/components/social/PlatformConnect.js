import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { disconnectPlatform, refreshPlatformToken } from '../../services/socialMediaService';

/**
 * Component for connecting to social media platforms
 * @returns {JSX.Element} - PlatformConnect component
 */
const PlatformConnect = () => {
  const { currentUser } = useAuth();
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Platform configuration
  const platformConfig = {
    youtube: {
      name: 'YouTube',
      icon: 'fab fa-youtube',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-600',
      scopes: ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube.readonly']
    },
    tiktok: {
      name: 'TikTok',
      icon: 'fab fa-tiktok',
      color: 'text-black',
      bgColor: 'bg-gray-100',
      borderColor: 'border-black',
      scopes: ['user.info.basic', 'video.upload', 'video.list']
    },
    instagram: {
      name: 'Instagram',
      icon: 'fab fa-instagram',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-600',
      scopes: ['user_profile', 'user_media']
    }
  };

  // Load platforms on component mount
  useEffect(() => {
    if (currentUser) {
      loadPlatforms();
    }
  }, [currentUser]);

  /**
   * Load connected platforms for the current user
   */
  const loadPlatforms = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch the user's connected platforms
      // For now, we'll use mock data
      const mockPlatforms = [
        {
          id: 'platform-youtube-123',
          platform: 'youtube',
          connected: true,
          username: 'YourChannel',
          profile_url: 'https://youtube.com/channel/123',
          expires_at: new Date(Date.now() + 3600000).toISOString()
        },
        {
          id: 'platform-tiktok-123',
          platform: 'tiktok',
          connected: false
        },
        {
          id: 'platform-instagram-123',
          platform: 'instagram',
          connected: false
        }
      ];

      setPlatforms(mockPlatforms);
    } catch (error) {
      console.error('Error loading platforms:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle connecting to a platform
   * @param {string} platform - Platform name
   */
  const handleConnect = async (platform) => {
    try {
      // Open the OAuth flow in a popup window
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const redirectUri = `${window.location.origin}/oauth/callback`;
      const authUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/social/oauth/${platform}?redirect_uri=${encodeURIComponent(redirectUri)}`;

      const popup = window.open(
        authUrl,
        `Connect to ${platformConfig[platform].name}`,
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Poll the popup to check when it's closed
      const checkPopup = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(checkPopup);
          loadPlatforms(); // Reload platforms after connection
        }
      }, 500);
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
      alert(`Error connecting to ${platformConfig[platform].name}: ${error.message}`);
    }
  };

  /**
   * Handle disconnecting from a platform
   * @param {string} platformId - Platform ID
   * @param {string} platformName - Platform name
   */
  const handleDisconnect = async (platformId, platformName) => {
    try {
      await disconnectPlatform(currentUser.id, platformId);
      alert(`Disconnected from ${platformName}`);
      loadPlatforms(); // Reload platforms after disconnection
    } catch (error) {
      console.error(`Error disconnecting from ${platformName}:`, error);
      alert(`Error disconnecting from ${platformName}: ${error.message}`);
    }
  };

  /**
   * Handle refreshing a platform token
   * @param {string} platformId - Platform ID
   * @param {string} platformName - Platform name
   */
  const handleRefresh = async (platformId, platformName) => {
    try {
      await refreshPlatformToken(currentUser.id, platformId);
      alert(`Refreshed ${platformName} connection`);
      loadPlatforms(); // Reload platforms after refresh
    } catch (error) {
      console.error(`Error refreshing ${platformName} token:`, error);
      alert(`Error refreshing ${platformName} connection: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        <p className="mt-4">Loading platforms...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Connect Social Media Platforms</h2>
      <p className="mb-6">
        Connect your social media accounts to publish videos directly from ClipFlowAI.
      </p>

      <div className="space-y-4">
        {Object.keys(platformConfig).map(platformKey => {
          const platform = platforms.find(p => p.platform === platformKey);
          const config = platformConfig[platformKey];
          const isConnected = platform?.connected;

          return (
            <div
              key={platformKey}
              className={`p-4 border rounded-md ${isConnected ? `${config.borderColor} border-2` : 'border-gray-200'}`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <i className={`${config.icon} ${config.color} text-xl mr-3`}></i>
                  <div>
                    <p className="font-semibold">{config.name}</p>
                    {isConnected && (
                      <p className="text-sm text-gray-600">
                        Connected as {platform.username}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {isConnected ? (
                    <>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Connected
                      </span>
                      <button
                        className="px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded hover:bg-blue-50 flex items-center"
                        onClick={() => handleRefresh(platform.id, config.name)}
                      >
                        <i className="fas fa-sync-alt mr-1"></i>
                        Refresh
                      </button>
                      <button
                        className="px-3 py-1 text-sm border border-red-500 text-red-500 rounded hover:bg-red-50 flex items-center"
                        onClick={() => handleDisconnect(platform.id, config.name)}
                      >
                        <i className="fas fa-times mr-1"></i>
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                      onClick={() => handleConnect(platformKey)}
                    >
                      <i className="fas fa-check mr-2"></i>
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlatformConnect;
