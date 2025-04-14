const {
  publishToTikTok,
  publishToInstagram,
  publishToYouTube,
  publishToAllPlatforms,
  checkAndPublishScheduled,
  processScheduledPublishing
} = require('../../../src/backend/services/socialMediaPublisher');

describe('socialMediaPublisher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('publishToTikTok', () => {
    it('should publish a video to TikTok', async () => {
      // Call the function
      const videoData = { title: 'Test Video', prompt: 'This is a test' };
      const result = await publishToTikTok(videoData);

      // Check the result
      expect(result).toHaveProperty('platform', 'tiktok');
      expect(result).toHaveProperty('status', 'published');
      expect(result).toHaveProperty('publishedUrl');
      expect(result).toHaveProperty('publishedAt');
    });

    it('should handle errors during TikTok publishing', async () => {
      // Mock a failure
      jest.spyOn(global, 'setTimeout').mockImplementation((callback) => {
        throw new Error('TikTok API error');
      });

      // Call the function
      const videoData = { title: 'Test Video', prompt: 'This is a test' };
      const result = await publishToTikTok(videoData);

      // Check the result
      expect(result).toHaveProperty('platform', 'tiktok');
      expect(result).toHaveProperty('status', 'failed');
      expect(result).toHaveProperty('error', 'TikTok API error');
    });
  });

  describe('publishToInstagram', () => {
    it('should publish a video to Instagram', async () => {
      // Call the function
      const videoData = { title: 'Test Video', prompt: 'This is a test' };
      const result = await publishToInstagram(videoData);

      // Check the result
      expect(result).toHaveProperty('platform', 'instagram');
      expect(result).toHaveProperty('status', 'published');
      expect(result).toHaveProperty('publishedUrl');
      expect(result).toHaveProperty('publishedAt');
    });

    it('should handle errors during Instagram publishing', async () => {
      // Mock a failure
      jest.spyOn(global, 'setTimeout').mockImplementation((callback) => {
        throw new Error('Instagram API error');
      });

      // Call the function
      const videoData = { title: 'Test Video', prompt: 'This is a test' };
      const result = await publishToInstagram(videoData);

      // Check the result
      expect(result).toHaveProperty('platform', 'instagram');
      expect(result).toHaveProperty('status', 'failed');
      expect(result).toHaveProperty('error', 'Instagram API error');
    });
  });

  describe('publishToYouTube', () => {
    it('should publish a video to YouTube', async () => {
      // Call the function
      const videoData = { title: 'Test Video', prompt: 'This is a test' };
      const result = await publishToYouTube(videoData);

      // Check the result
      expect(result).toHaveProperty('platform', 'youtube');
      expect(result).toHaveProperty('status', 'published');
      expect(result).toHaveProperty('publishedUrl');
      expect(result).toHaveProperty('publishedAt');
    });

    it('should handle errors during YouTube publishing', async () => {
      // Mock a failure
      jest.spyOn(global, 'setTimeout').mockImplementation((callback) => {
        throw new Error('YouTube API error');
      });

      // Call the function
      const videoData = { title: 'Test Video', prompt: 'This is a test' };
      const result = await publishToYouTube(videoData);

      // Check the result
      expect(result).toHaveProperty('platform', 'youtube');
      expect(result).toHaveProperty('status', 'failed');
      expect(result).toHaveProperty('error', 'YouTube API error');
    });
  });

  describe('publishToAllPlatforms', () => {
    it('should publish a video to all specified platforms', async () => {
      // Call the function
      const videoData = { title: 'Test Video', prompt: 'This is a test' };
      const platforms = ['tiktok', 'instagram', 'youtube'];
      const results = await publishToAllPlatforms(videoData, platforms);

      // Check the results
      expect(results).toHaveLength(3);
      expect(results[0]).toHaveProperty('platform', 'tiktok');
      expect(results[1]).toHaveProperty('platform', 'instagram');
      expect(results[2]).toHaveProperty('platform', 'youtube');
    });

    it('should only publish to the specified platforms', async () => {
      // Call the function
      const videoData = { title: 'Test Video', prompt: 'This is a test' };
      const platforms = ['tiktok', 'youtube']; // No Instagram
      const results = await publishToAllPlatforms(videoData, platforms);

      // Check the results
      expect(results).toHaveLength(2);
      expect(results[0]).toHaveProperty('platform', 'tiktok');
      expect(results[1]).toHaveProperty('platform', 'youtube');
    });
  });

  describe('checkAndPublishScheduled', () => {
    it('should not publish if the video is not scheduled', async () => {
      // Call the function
      const videoData = { title: 'Test Video', scheduled_publish: false };
      const result = await checkAndPublishScheduled(videoData);

      // Check the result
      expect(result).toBeNull();
    });

    it('should not publish if the scheduled time is in the future', async () => {
      // Set up a future scheduled time
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1); // Tomorrow

      // Call the function
      const videoData = {
        title: 'Test Video',
        scheduled_publish: true,
        scheduled_publish_time: futureDate.toISOString()
      };
      const result = await checkAndPublishScheduled(videoData);

      // Check the result
      expect(result).toBeNull();
    });

    it('should publish if the scheduled time has passed', async () => {
      // Set up a past scheduled time
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1); // Yesterday

      // Mock publishToAllPlatforms
      const mockPublishResult = [{ platform: 'tiktok', status: 'published' }];
      const originalPublishToAllPlatforms = publishToAllPlatforms;
      global.publishToAllPlatforms = jest.fn().mockResolvedValue(mockPublishResult);

      // Call the function
      const videoData = {
        title: 'Test Video',
        scheduled_publish: true,
        scheduled_publish_time: pastDate.toISOString(),
        platforms: ['tiktok']
      };
      const result = await checkAndPublishScheduled(videoData);

      // Check the result
      expect(result).toEqual(mockPublishResult);
      expect(global.publishToAllPlatforms).toHaveBeenCalledWith(videoData, videoData.platforms);

      // Restore the original function
      global.publishToAllPlatforms = originalPublishToAllPlatforms;
    });

    it('should handle errors during publishing', async () => {
      // Set up a past scheduled time
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1); // Yesterday

      // Mock publishToAllPlatforms to throw an error
      const originalPublishToAllPlatforms = publishToAllPlatforms;
      global.publishToAllPlatforms = jest.fn().mockRejectedValue(new Error('Publishing error'));

      // Call the function
      const videoData = {
        title: 'Test Video',
        scheduled_publish: true,
        scheduled_publish_time: pastDate.toISOString(),
        platforms: ['tiktok']
      };
      const result = await checkAndPublishScheduled(videoData);

      // Check the result
      expect(result).toHaveProperty('status', 'failed');
      expect(result).toHaveProperty('error', 'Publishing error');

      // Restore the original function
      global.publishToAllPlatforms = originalPublishToAllPlatforms;
    });
  });

  describe('processScheduledPublishing', () => {
    it('should process all scheduled videos', async () => {
      // Mock checkAndPublishScheduled
      const mockResults = [
        { platform: 'tiktok', status: 'published' },
        { platform: 'instagram', status: 'published' }
      ];
      const originalCheckAndPublishScheduled = checkAndPublishScheduled;
      global.checkAndPublishScheduled = jest.fn()
        .mockResolvedValueOnce(mockResults)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockResults);

      // Call the function
      const videos = [
        { id: '1', title: 'Video 1' },
        { id: '2', title: 'Video 2' },
        { id: '3', title: 'Video 3' }
      ];
      const results = await processScheduledPublishing(videos);

      // Check the results
      expect(results).toHaveLength(2);
      expect(results[0]).toHaveProperty('videoId', '1');
      expect(results[0]).toHaveProperty('results', mockResults);
      expect(results[1]).toHaveProperty('videoId', '3');
      expect(results[1]).toHaveProperty('results', mockResults);

      // Restore the original function
      global.checkAndPublishScheduled = originalCheckAndPublishScheduled;
    });

    it('should handle empty video array', async () => {
      // Call the function
      const videos = [];
      const results = await processScheduledPublishing(videos);

      // Check the results
      expect(results).toHaveLength(0);
    });
  });
});
