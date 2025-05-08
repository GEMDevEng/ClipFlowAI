/**
 * Integration tests for the publishing flow
 */
const { supabase } = require('../../src/backend/config/supabaseClient');
const { scheduleVideo, cancelScheduledVideo } = require('../../src/backend/services/schedulerService');
const { publishToAllPlatforms } = require('../../src/backend/services/socialMediaPublisher');
const { checkScheduledVideos } = require('../../src/backend/services/schedulerService');

// Mock the Supabase client
jest.mock('../../src/backend/config/supabaseClient', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn()
  }
}));

// Mock the social media publisher
jest.mock('../../src/backend/services/socialMediaPublisher', () => ({
  publishToAllPlatforms: jest.fn()
}));

describe('Publishing Flow Integration Tests', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('Scheduling a video', () => {
    it('should schedule a video for future publishing', async () => {
      // Mock Supabase response for update
      supabase.from.mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            id: 'video123',
            title: 'Test Video',
            scheduled_publish: true,
            scheduled_publish_time: '2023-12-31T12:00:00Z',
            scheduled_platforms: ['youtube', 'tiktok'],
            user_id: 'user123'
          },
          error: null
        })
      });

      // Call the function
      const videoId = 'video123';
      const userId = 'user123';
      const platforms = ['youtube', 'tiktok'];
      const scheduledTime = '2023-12-31T12:00:00Z';
      const options = { title: 'Custom Title', description: 'Custom Description' };

      const result = await scheduleVideo(videoId, userId, platforms, scheduledTime, options);

      // Verify the result
      expect(result).toEqual({
        id: 'video123',
        title: 'Test Video',
        scheduled_publish: true,
        scheduled_publish_time: '2023-12-31T12:00:00Z',
        scheduled_platforms: ['youtube', 'tiktok'],
        user_id: 'user123'
      });

      // Verify that Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('videos');
      expect(supabase.update).toHaveBeenCalledWith({
        scheduled_publish: true,
        scheduled_publish_time: scheduledTime,
        scheduled_platforms: platforms,
        scheduled_options: options
      });
      expect(supabase.eq).toHaveBeenCalledWith('id', videoId);
    });

    it('should handle errors when scheduling a video', async () => {
      // Mock Supabase error response
      supabase.from.mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: new Error('Database error')
        })
      });

      // Call the function and expect it to throw
      const videoId = 'video123';
      const userId = 'user123';
      const platforms = ['youtube', 'tiktok'];
      const scheduledTime = '2023-12-31T12:00:00Z';

      await expect(scheduleVideo(videoId, userId, platforms, scheduledTime)).rejects.toThrow();
    });
  });

  describe('Canceling a scheduled video', () => {
    it('should cancel a scheduled video', async () => {
      // Mock Supabase response for update
      supabase.from.mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            id: 'video123',
            title: 'Test Video',
            scheduled_publish: false,
            scheduled_publish_time: null,
            scheduled_platforms: null,
            user_id: 'user123'
          },
          error: null
        })
      });

      // Call the function
      const videoId = 'video123';
      const result = await cancelScheduledVideo(videoId);

      // Verify the result
      expect(result).toEqual({
        id: 'video123',
        title: 'Test Video',
        scheduled_publish: false,
        scheduled_publish_time: null,
        scheduled_platforms: null,
        user_id: 'user123'
      });

      // Verify that Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('videos');
      expect(supabase.update).toHaveBeenCalledWith({
        scheduled_publish: false,
        scheduled_publish_time: null,
        scheduled_platforms: null,
        scheduled_options: null
      });
      expect(supabase.eq).toHaveBeenCalledWith('id', videoId);
    });
  });

  describe('Checking scheduled videos', () => {
    it('should publish videos that are scheduled for the past', async () => {
      // Mock current time
      const now = new Date();
      
      // Mock scheduled videos
      const mockVideos = [
        {
          id: 'video123',
          title: 'Test Video 1',
          user_id: 'user123',
          scheduled_publish: true,
          scheduled_publish_time: new Date(now.getTime() - 3600000).toISOString(), // 1 hour ago
          scheduled_platforms: ['youtube', 'tiktok']
        },
        {
          id: 'video456',
          title: 'Test Video 2',
          user_id: 'user123',
          scheduled_publish: true,
          scheduled_publish_time: new Date(now.getTime() - 7200000).toISOString(), // 2 hours ago
          scheduled_platforms: ['instagram']
        }
      ];

      // Mock Supabase response for select
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        lt: jest.fn().mockResolvedValue({
          data: mockVideos,
          error: null
        })
      });

      // Mock successful publishing
      publishToAllPlatforms.mockResolvedValue([
        { status: 'published', platform: 'youtube', platformVideoId: 'yt123', publishedUrl: 'https://youtube.com/watch?v=yt123' },
        { status: 'published', platform: 'tiktok', platformVideoId: 'tt123', publishedUrl: 'https://tiktok.com/@user/video/tt123' }
      ]);

      // Mock Supabase response for update
      supabase.from.mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: null
        })
      });

      // Mock Supabase response for insert
      supabase.from.mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue({
          data: null,
          error: null
        })
      });

      // Call the function
      await checkScheduledVideos();

      // Verify that Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('videos');
      expect(supabase.eq).toHaveBeenCalledWith('scheduled_publish', true);
      expect(supabase.lt).toHaveBeenCalled();
      
      // Verify that publishToAllPlatforms was called
      expect(publishToAllPlatforms).toHaveBeenCalled();
    });
  });
});
