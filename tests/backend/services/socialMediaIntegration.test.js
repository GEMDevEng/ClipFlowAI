/**
 * Tests for social media integration
 */
const axios = require('axios');
const { 
  connectPlatform, 
  disconnectPlatform, 
  getPlatformStatus, 
  refreshPlatformToken 
} = require('../../../src/backend/services/socialMediaIntegration');

// Mock axios
jest.mock('axios');

describe('Social Media Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('connectPlatform', () => {
    it('should connect to a social media platform', async () => {
      // Mock the axios response
      axios.post.mockResolvedValue({
        data: {
          success: true,
          platform_id: 'platform123',
          access_token: 'access-token-123',
          refresh_token: 'refresh-token-123',
          expires_at: new Date(Date.now() + 3600000).toISOString()
        }
      });

      // Call the function
      const userId = 'user123';
      const platform = 'youtube';
      const authCode = 'auth-code-123';
      const result = await connectPlatform(userId, platform, authCode);

      // Check the result
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('platform_id');
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(result).toHaveProperty('expires_at');

      // Check that axios was called correctly
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/oauth/token'),
        expect.objectContaining({
          code: authCode,
          grant_type: 'authorization_code',
          platform
        }),
        expect.any(Object)
      );
    });

    it('should handle errors during platform connection', async () => {
      // Mock an axios error
      const errorMessage = 'Invalid authorization code';
      axios.post.mockRejectedValue(new Error(errorMessage));

      // Call the function
      const userId = 'user123';
      const platform = 'youtube';
      const authCode = 'invalid-code';
      const result = await connectPlatform(userId, platform, authCode);

      // Check the result
      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('error', errorMessage);

      // Check that axios was called correctly
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/oauth/token'),
        expect.objectContaining({
          code: authCode,
          grant_type: 'authorization_code',
          platform
        }),
        expect.any(Object)
      );
    });
  });

  describe('disconnectPlatform', () => {
    it('should disconnect from a social media platform', async () => {
      // Mock the axios response
      axios.post.mockResolvedValue({
        data: {
          success: true
        }
      });

      // Call the function
      const userId = 'user123';
      const platformId = 'platform123';
      const result = await disconnectPlatform(userId, platformId);

      // Check the result
      expect(result).toHaveProperty('success', true);

      // Check that axios was called correctly
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/oauth/revoke'),
        expect.objectContaining({
          platform_id: platformId,
          user_id: userId
        }),
        expect.any(Object)
      );
    });

    it('should handle errors during platform disconnection', async () => {
      // Mock an axios error
      const errorMessage = 'Platform not found';
      axios.post.mockRejectedValue(new Error(errorMessage));

      // Call the function
      const userId = 'user123';
      const platformId = 'invalid-platform';
      const result = await disconnectPlatform(userId, platformId);

      // Check the result
      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('error', errorMessage);
    });
  });

  describe('getPlatformStatus', () => {
    it('should get the status of a connected platform', async () => {
      // Mock the axios response
      axios.get.mockResolvedValue({
        data: {
          success: true,
          platform_id: 'platform123',
          platform: 'youtube',
          connected: true,
          username: 'testuser',
          profile_url: 'https://youtube.com/user/testuser',
          expires_at: new Date(Date.now() + 3600000).toISOString()
        }
      });

      // Call the function
      const userId = 'user123';
      const platformId = 'platform123';
      const result = await getPlatformStatus(userId, platformId);

      // Check the result
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('platform_id', 'platform123');
      expect(result).toHaveProperty('platform', 'youtube');
      expect(result).toHaveProperty('connected', true);
      expect(result).toHaveProperty('username');
      expect(result).toHaveProperty('profile_url');
      expect(result).toHaveProperty('expires_at');

      // Check that axios was called correctly
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining(`/platforms/${platformId}`),
        expect.objectContaining({
          params: {
            user_id: userId
          }
        })
      );
    });

    it('should handle errors when getting platform status', async () => {
      // Mock an axios error
      const errorMessage = 'Platform not found';
      axios.get.mockRejectedValue(new Error(errorMessage));

      // Call the function
      const userId = 'user123';
      const platformId = 'invalid-platform';
      const result = await getPlatformStatus(userId, platformId);

      // Check the result
      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('error', errorMessage);
    });
  });

  describe('refreshPlatformToken', () => {
    it('should refresh the access token for a platform', async () => {
      // Mock the axios response
      axios.post.mockResolvedValue({
        data: {
          success: true,
          access_token: 'new-access-token-123',
          refresh_token: 'new-refresh-token-123',
          expires_at: new Date(Date.now() + 3600000).toISOString()
        }
      });

      // Call the function
      const userId = 'user123';
      const platformId = 'platform123';
      const refreshToken = 'refresh-token-123';
      const result = await refreshPlatformToken(userId, platformId, refreshToken);

      // Check the result
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('access_token', 'new-access-token-123');
      expect(result).toHaveProperty('refresh_token', 'new-refresh-token-123');
      expect(result).toHaveProperty('expires_at');

      // Check that axios was called correctly
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/oauth/refresh'),
        expect.objectContaining({
          platform_id: platformId,
          refresh_token: refreshToken,
          user_id: userId
        }),
        expect.any(Object)
      );
    });

    it('should handle errors during token refresh', async () => {
      // Mock an axios error
      const errorMessage = 'Invalid refresh token';
      axios.post.mockRejectedValue(new Error(errorMessage));

      // Call the function
      const userId = 'user123';
      const platformId = 'platform123';
      const refreshToken = 'invalid-refresh-token';
      const result = await refreshPlatformToken(userId, platformId, refreshToken);

      // Check the result
      expect(result).toHaveProperty('success', false);
      expect(result).toHaveProperty('error', errorMessage);
    });
  });
});
