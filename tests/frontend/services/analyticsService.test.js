import { 
  getVideoAnalytics,
  getOverallAnalytics,
  getAnalyticsHistory,
  fetchVideoAnalytics,
  updateVideoAnalytics,
  storeAnalyticsRecord,
  getAnalyticsByPlatform,
  getAnalyticsOverTime
} from '../../../src/frontend/src/services/analytics/analyticsService';
import { supabase } from '../../../src/frontend/src/config/supabase';

// Mock the Supabase client
jest.mock('../../../src/frontend/src/config/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn()
  }
}));

describe('Analytics Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getVideoAnalytics', () => {
    it('should get analytics for a specific video', async () => {
      // Mock successful responses
      const mockAnalyticsData = [
        { date: '2023-01-01', views: 100, likes: 30, shares: 10 },
        { date: '2023-01-02', views: 200, likes: 60, shares: 20 }
      ];
      
      const mockCurrentData = { views: 300, likes: 90, shares: 30 };
      
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnValue({
          data: mockAnalyticsData,
          error: null
        })
      });
      
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue({
          data: mockCurrentData,
          error: null
        })
      });

      // Call the function
      const result = await getVideoAnalytics('video123');

      // Verify the result
      expect(result).toEqual({
        current: mockCurrentData,
        history: mockAnalyticsData
      });
      
      // Verify that Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('analytics');
      expect(supabase.from).toHaveBeenCalledWith('videos');
    });

    it('should handle errors and return default values', async () => {
      // Mock error response
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnValue({
          data: null,
          error: new Error('Database error')
        })
      });
      
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnValue({
          data: null,
          error: new Error('Database error')
        })
      });

      // Call the function
      const result = await getVideoAnalytics('video123');

      // Verify the result contains default values
      expect(result).toEqual({
        current: { views: 0, likes: 0, shares: 0 },
        history: []
      });
      
      // Verify that the error was logged
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getOverallAnalytics', () => {
    it('should get overall analytics for all videos of a user', async () => {
      // Mock successful response
      const mockVideosData = [
        { id: 'video1', title: 'Video 1', views: 100, likes: 30, shares: 10, created_at: '2023-01-01' },
        { id: 'video2', title: 'Video 2', views: 200, likes: 60, shares: 20, created_at: '2023-01-02' }
      ];
      
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnValue({
          data: mockVideosData,
          error: null
        })
      });

      // Call the function
      const result = await getOverallAnalytics('user123');

      // Verify the result
      expect(result).toEqual({
        totals: { totalViews: 300, totalLikes: 90, totalShares: 30 },
        videoStats: [
          { id: 'video2', title: 'Video 2', views: 200, likes: 60, shares: 20, created_at: '2023-01-02' },
          { id: 'video1', title: 'Video 1', views: 100, likes: 30, shares: 10, created_at: '2023-01-01' }
        ]
      });
      
      // Verify that Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('videos');
    });

    it('should handle errors and return default values', async () => {
      // Mock error response
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnValue({
          data: null,
          error: new Error('Database error')
        })
      });

      // Call the function
      const result = await getOverallAnalytics('user123');

      // Verify the result contains default values
      expect(result).toEqual({
        totals: { totalViews: 0, totalLikes: 0, totalShares: 0 },
        videoStats: []
      });
      
      // Verify that the error was logged
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getAnalyticsHistory', () => {
    it('should get analytics history for a specific time period', async () => {
      // Mock successful responses
      const mockVideosData = [
        { id: 'video1' },
        { id: 'video2' }
      ];
      
      const mockHistoryData = [
        { video_id: 'video1', date: '2023-01-01T00:00:00Z', views: 100, likes: 30, shares: 10 },
        { video_id: 'video2', date: '2023-01-01T00:00:00Z', views: 200, likes: 60, shares: 20 },
        { video_id: 'video1', date: '2023-01-02T00:00:00Z', views: 150, likes: 45, shares: 15 },
        { video_id: 'video2', date: '2023-01-02T00:00:00Z', views: 250, likes: 75, shares: 25 }
      ];
      
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnValue({
          data: mockVideosData,
          error: null
        })
      });
      
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnValue({
          data: mockHistoryData,
          error: null
        })
      });

      // Call the function
      const result = await getAnalyticsHistory('user123', 'week');

      // Verify the result
      expect(result).toEqual([
        { date: '2023-01-01', views: 300, likes: 90, shares: 30 },
        { date: '2023-01-02', views: 400, likes: 120, shares: 40 }
      ]);
      
      // Verify that Supabase was called correctly
      expect(supabase.from).toHaveBeenCalledWith('videos');
      expect(supabase.from).toHaveBeenCalledWith('analytics');
    });

    it('should return empty array if user has no videos', async () => {
      // Mock empty videos response
      supabase.from.mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnValue({
          data: [],
          error: null
        })
      });

      // Call the function
      const result = await getAnalyticsHistory('user123', 'week');

      // Verify the result is an empty array
      expect(result).toEqual([]);
    });
  });

  // Additional tests for other functions would follow the same pattern
});
