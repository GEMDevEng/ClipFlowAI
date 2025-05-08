import { 
  getVideoAnalytics,
  getOverallAnalytics,
  getAnalyticsOverTime,
  getAnalyticsByPlatform,
  storeAnalyticsRecord,
  updateVideoAnalytics,
  fetchVideoAnalytics
} from './analyticsService';
import { supabase } from '../config/supabase';

// Mock the Supabase client
jest.mock('../config/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn(),
    in: jest.fn().mockReturnThis()
  }
}));

// Mock console.error to prevent test output pollution
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});

describe('Analytics Service', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('getVideoAnalytics', () => {
    it('should return analytics data for a specific video', async () => {
      // Mock Supabase response
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnValue({
          data: [
            { platform: 'TikTok', views: 500, likes: 150, shares: 50, comments: 30 },
            { platform: 'YouTube', views: 300, likes: 90, shares: 30, comments: 20 }
          ],
          error: null
        })
      });

      // Call the function
      const result = await getVideoAnalytics('video123');

      // Verify the result
      expect(result).toEqual({
        views: 800,
        likes: 240,
        shares: 80,
        comments: 50,
        platforms: {
          TikTok: { platform: 'TikTok', views: 500, likes: 150, shares: 50, comments: 30 },
          YouTube: { platform: 'YouTube', views: 300, likes: 90, shares: 30, comments: 20 }
        }
      });
      
      // Verify that Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('platforms');
      expect(supabase.from).toHaveBeenCalledWith('analytics');
    });

    it('should handle errors and return default values', async () => {
      // Mock Supabase error response
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnValue({
          error: new Error('Database error')
        })
      });

      // Call the function
      const result = await getVideoAnalytics('video123');

      // Verify the result contains default values
      expect(result).toEqual({
        views: 0,
        likes: 0,
        shares: 0,
        comments: 0,
        platforms: {}
      });
      
      // Verify that the error was logged
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getAnalyticsOverTime', () => {
    it('should return analytics data over time with default days parameter', async () => {
      // Mock Supabase response
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnValue({
          data: [
            { date: '2023-01-01T00:00:00Z', views: 100, likes: 30, shares: 10, comments: 5 },
            { date: '2023-01-02T00:00:00Z', views: 200, likes: 60, shares: 20, comments: 10 }
          ],
          error: null
        })
      });

      // Call the function
      const result = await getAnalyticsOverTime('user123');

      // Verify the result
      expect(result.length).toBe(7); // 7 days is the default
      expect(result[0].date).toBeDefined();
      expect(result[0].views).toBeDefined();
      expect(result[0].likes).toBeDefined();
      expect(result[0].shares).toBeDefined();
      
      // Verify that Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('analytics');
      expect(supabase.eq).toHaveBeenCalledWith('user_id', 'user123');
    });

    it('should handle custom date range', async () => {
      // Mock Supabase response
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnValue({
          data: [
            { date: '2023-01-01T00:00:00Z', views: 100, likes: 30, shares: 10, comments: 5 },
            { date: '2023-01-02T00:00:00Z', views: 200, likes: 60, shares: 20, comments: 10 }
          ],
          error: null
        })
      });

      // Call the function with custom date range
      const customRange = {
        start: '2023-01-01',
        end: '2023-01-05'
      };
      const result = await getAnalyticsOverTime('user123', 30, customRange);

      // Verify the result
      expect(result.length).toBe(5); // 5 days in the custom range
      
      // Verify that Supabase was called correctly with the custom date range
      expect(supabase.from).toHaveBeenCalledWith('analytics');
      expect(supabase.eq).toHaveBeenCalledWith('user_id', 'user123');
      expect(supabase.gte).toHaveBeenCalled();
      expect(supabase.lte).toHaveBeenCalled();
    });
  });

  describe('getAnalyticsByPlatform', () => {
    it('should return analytics data grouped by platform', async () => {
      // Mock Supabase response
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnValue({
          data: [
            { platform: 'TikTok', views: 500, likes: 150, shares: 50, comments: 30 },
            { platform: 'YouTube', views: 300, likes: 90, shares: 30, comments: 20 },
            { platform: 'TikTok', views: 100, likes: 30, shares: 10, comments: 5 } // Duplicate platform to test grouping
          ],
          error: null
        })
      });

      // Call the function
      const result = await getAnalyticsByPlatform('user123');

      // Verify the result
      expect(result.length).toBe(2); // 2 unique platforms
      expect(result.find(p => p.platform === 'TikTok').views).toBe(500); // Only the first entry for each platform
      expect(result.find(p => p.platform === 'YouTube').views).toBe(300);
      
      // Verify that Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('analytics');
      expect(supabase.eq).toHaveBeenCalledWith('user_id', 'user123');
    });

    it('should filter by platform when specified', async () => {
      // Mock Supabase response
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnValue({
          data: [
            { platform: 'TikTok', views: 500, likes: 150, shares: 50, comments: 30 }
          ],
          error: null
        })
      });

      // Call the function with platform filter
      const result = await getAnalyticsByPlatform('user123', 'TikTok');

      // Verify the result
      expect(result.length).toBe(1);
      expect(result[0].platform).toBe('TikTok');
      
      // Verify that Supabase was called correctly with the platform filter
      expect(supabase.from).toHaveBeenCalledWith('analytics');
      expect(supabase.eq).toHaveBeenCalledWith('user_id', 'user123');
      expect(supabase.eq).toHaveBeenCalledWith('platform', 'TikTok');
    });
  });
});
