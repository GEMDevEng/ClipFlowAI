import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Analytics from './Analytics';
import * as analyticsService from '../services/analyticsService';

// Mock the context values
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: { id: 'test-user-id' },
    loading: false,
    error: null
  }),
  AuthProvider: ({ children }) => <div>{children}</div>
}));

jest.mock('../context/VideoContext', () => ({
  useVideos: () => ({
    videos: [{ id: 'video1', title: 'Test Video 1' }, { id: 'video2', title: 'Test Video 2' }],
    getOverallAnalytics: jest.fn().mockResolvedValue({
      totalViews: 1000,
      totalLikes: 300,
      totalShares: 100
    }),
    loading: false,
    error: null
  }),
  VideoProvider: ({ children }) => <div>{children}</div>
}));

// Mock the analytics service
jest.mock('../services/analyticsService', () => ({
  getAnalyticsOverTime: jest.fn(),
  getAnalyticsByPlatform: jest.fn(),
  storeAnalyticsRecord: jest.fn()
}));

describe('Analytics Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Setup default mock implementations
    analyticsService.getAnalyticsOverTime.mockResolvedValue([
      { date: '2023-01-01', views: 100, likes: 30, shares: 10 },
      { date: '2023-01-02', views: 200, likes: 60, shares: 20 }
    ]);

    analyticsService.getAnalyticsByPlatform.mockResolvedValue([
      { platform: 'TikTok', views: 500, likes: 150, shares: 50 },
      { platform: 'YouTube', views: 300, likes: 90, shares: 30 }
    ]);
  });

  test('renders the Analytics component with loading state', async () => {
    render(
      <BrowserRouter>
        <Analytics />
      </BrowserRouter>
    );

    // Check for loading state
    expect(screen.getByText(/Loading analytics/i)).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/Video Analytics/i)).toBeInTheDocument();
    });
  });

  test('displays analytics summary data correctly', async () => {
    render(
      <BrowserRouter>
        <Analytics />
      </BrowserRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/Video Analytics/i)).toBeInTheDocument();
    });

    // Check summary cards
    expect(screen.getByText(/Total Videos/i)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // 2 videos in mock
    expect(screen.getByText(/Total Views/i)).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText(/Total Likes/i)).toBeInTheDocument();
    expect(screen.getByText('300')).toBeInTheDocument();
    expect(screen.getByText(/Total Shares/i)).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  test('date range selector changes fetch parameters', async () => {
    render(
      <BrowserRouter>
        <Analytics />
      </BrowserRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/Video Analytics/i)).toBeInTheDocument();
    });

    // Find and change the date range selector
    const dateRangeSelect = screen.getByRole('combobox');
    fireEvent.change(dateRangeSelect, { target: { value: '30days' } });

    // Verify that getAnalyticsOverTime was called with the new date range
    await waitFor(() => {
      expect(analyticsService.getAnalyticsOverTime).toHaveBeenCalledWith(
        'test-user-id',
        30,
        null
      );
    });
  });

  test('handles error state gracefully', async () => {
    // Mock the VideoContext to return an error
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Override the mock to simulate an error
    require('../context/VideoContext').useVideos.mockReturnValue({
      videos: [],
      getOverallAnalytics: jest.fn(),
      loading: false,
      error: 'Failed to load analytics data'
    });

    render(
      <BrowserRouter>
        <Analytics />
      </BrowserRouter>
    );

    // Check for error message
    expect(screen.getByText(/Failed to load analytics data/i)).toBeInTheDocument();
  });
});
