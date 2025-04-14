import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Analytics from './Analytics';
// Context is mocked below

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
    videos: [{ id: 'video1' }, { id: 'video2' }],
    getOverallAnalytics: jest.fn().mockResolvedValue({ totalViews: 1000, totalLikes: 300, totalShares: 100 }),
    loading: false,
    error: null
  }),
  VideoProvider: ({ children }) => <div>{children}</div>
}));

// Mock the analytics service
jest.mock('../services/analyticsService', () => ({
  getAnalyticsOverTime: jest.fn().mockResolvedValue([
    { date: '2023-01-01', views: 100, likes: 30, shares: 10 },
    { date: '2023-01-02', views: 200, likes: 60, shares: 20 }
  ]),
  getAnalyticsByPlatform: jest.fn().mockResolvedValue([
    { platform: 'TikTok', views: 500, likes: 150, shares: 50 },
    { platform: 'YouTube', views: 300, likes: 90, shares: 30 }
  ])
}));

test('renders the Analytics component', () => {
  render(
    <BrowserRouter>
      <Analytics />
    </BrowserRouter>
  );

  // Check for loading state
  const loadingElement = screen.getByText(/Loading analytics/i);
  expect(loadingElement).toBeInTheDocument();
});
