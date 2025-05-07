import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnalyticsDashboard from './AnalyticsDashboard';
import { getOverallAnalytics, getAnalyticsHistory, getAnalyticsByPlatform } from '../../services/analytics/analyticsService';
import { useAuth } from '../../context/AuthContext';

// Mock the required modules
jest.mock('../../services/analytics/analyticsService');
jest.mock('../../context/AuthContext');
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart">Line Chart</div>,
  Bar: () => <div data-testid="bar-chart">Bar Chart</div>,
  Pie: () => <div data-testid="pie-chart">Pie Chart</div>
}));

describe('AnalyticsDashboard Component', () => {
  // Mock data
  const mockUser = { id: 'user123', email: 'test@example.com' };
  const mockOverallAnalytics = {
    totals: {
      totalViews: 1000,
      totalLikes: 300,
      totalShares: 150
    },
    videoStats: [
      { id: 'video1', title: 'Video 1', views: 500, likes: 150, shares: 75 },
      { id: 'video2', title: 'Video 2', views: 300, likes: 90, shares: 45 },
      { id: 'video3', title: 'Video 3', views: 200, likes: 60, shares: 30 }
    ]
  };
  
  const mockHistoryData = [
    { date: '2023-01-01', views: 100, likes: 30, shares: 15 },
    { date: '2023-01-02', views: 150, likes: 45, shares: 22 },
    { date: '2023-01-03', views: 200, likes: 60, shares: 30 },
    { date: '2023-01-04', views: 250, likes: 75, shares: 37 },
    { date: '2023-01-05', views: 300, likes: 90, shares: 45 }
  ];
  
  const mockPlatformData = {
    youtube: { views: 500, likes: 150, shares: 75 },
    tiktok: { views: 300, likes: 90, shares: 45 },
    instagram: { views: 200, likes: 60, shares: 30 }
  };
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock the auth context
    useAuth.mockReturnValue({
      user: mockUser,
      loading: false
    });
    
    // Mock the analytics service
    getOverallAnalytics.mockResolvedValue(mockOverallAnalytics);
    getAnalyticsHistory.mockResolvedValue(mockHistoryData);
    getAnalyticsByPlatform.mockResolvedValue(mockPlatformData);
  });
  
  it('renders the analytics dashboard with loading state', () => {
    // Mock loading state
    getOverallAnalytics.mockReturnValueOnce(new Promise(() => {}));
    
    render(<AnalyticsDashboard />);
    
    // Check that loading indicator is shown
    expect(screen.getByText(/loading analytics/i)).toBeInTheDocument();
  });
  
  it('renders the analytics dashboard with data', async () => {
    render(<AnalyticsDashboard />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(getOverallAnalytics).toHaveBeenCalledWith(mockUser.id);
    });
    
    // Check that the overall metrics are displayed
    expect(screen.getByText(/total views/i)).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText(/total likes/i)).toBeInTheDocument();
    expect(screen.getByText('300')).toBeInTheDocument();
    expect(screen.getByText(/total shares/i)).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    
    // Check that the charts are rendered
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    
    // Check that the video stats table is rendered
    expect(screen.getByText('Video 1')).toBeInTheDocument();
    expect(screen.getByText('Video 2')).toBeInTheDocument();
    expect(screen.getByText('Video 3')).toBeInTheDocument();
  });
  
  it('changes the time period for analytics history', async () => {
    render(<AnalyticsDashboard />);
    
    // Wait for initial data to load
    await waitFor(() => {
      expect(getAnalyticsHistory).toHaveBeenCalledWith(mockUser.id, 'week');
    });
    
    // Change the time period to month
    const timePeriodSelect = screen.getByLabelText(/time period/i);
    userEvent.selectOptions(timePeriodSelect, 'month');
    
    // Check that the analytics history was fetched with the new time period
    await waitFor(() => {
      expect(getAnalyticsHistory).toHaveBeenCalledWith(mockUser.id, 'month');
    });
  });
  
  it('handles errors during data fetching', async () => {
    // Mock an error during data fetching
    getOverallAnalytics.mockRejectedValue(new Error('Failed to fetch analytics'));
    
    render(<AnalyticsDashboard />);
    
    // Wait for error to be handled
    await waitFor(() => {
      expect(screen.getByText(/error loading analytics/i)).toBeInTheDocument();
    });
  });
  
  it('displays no data message when there are no analytics', async () => {
    // Mock empty analytics data
    getOverallAnalytics.mockResolvedValue({
      totals: { totalViews: 0, totalLikes: 0, totalShares: 0 },
      videoStats: []
    });
    getAnalyticsHistory.mockResolvedValue([]);
    getAnalyticsByPlatform.mockResolvedValue({});
    
    render(<AnalyticsDashboard />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(getOverallAnalytics).toHaveBeenCalled();
    });
    
    // Check that no data message is displayed
    expect(screen.getByText(/no analytics data available/i)).toBeInTheDocument();
  });
});
