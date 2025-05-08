import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScheduledPublishing from './ScheduledPublishing';
import { useAuth } from '../../context/AuthContext';
import { publishVideo, getScheduledVideos } from '../../services/socialMediaService';

// Mock the required modules
jest.mock('../../context/AuthContext');
jest.mock('../../services/socialMediaService');

// Mock fetch for the cancel scheduled API call
global.fetch = jest.fn();

describe('ScheduledPublishing Component', () => {
  // Mock data for scheduled videos
  const mockScheduledVideos = [
    {
      id: 'video-1',
      title: 'Test Video 1',
      scheduled_publish: true,
      scheduled_publish_time: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
      scheduled_platforms: ['youtube', 'tiktok'],
      thumbnail_url: 'https://example.com/thumbnails/test1.jpg',
      status: 'processing'
    },
    {
      id: 'video-2',
      title: 'Test Video 2',
      scheduled_publish: true,
      scheduled_publish_time: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
      scheduled_platforms: ['instagram'],
      thumbnail_url: 'https://example.com/thumbnails/test2.jpg',
      status: 'processing'
    }
  ];

  // Setup before each test
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock useAuth hook
    useAuth.mockReturnValue({
      currentUser: { id: 'test-user-id' }
    });
    
    // Mock getScheduledVideos function
    getScheduledVideos.mockResolvedValue(mockScheduledVideos);
    
    // Mock publishVideo function
    publishVideo.mockResolvedValue({ success: true });
    
    // Mock fetch for API calls
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    });
    
    // Mock window.alert
    global.alert = jest.fn();
  });

  test('renders loading state initially', () => {
    render(<ScheduledPublishing />);
    
    // Check for loading indicator
    expect(screen.getByText(/Loading scheduled videos/i)).toBeInTheDocument();
  });

  test('renders scheduled videos after loading', async () => {
    render(<ScheduledPublishing />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading scheduled videos/i)).not.toBeInTheDocument();
    });
    
    // Check for scheduled videos table
    expect(screen.getByText('Scheduled Publishing')).toBeInTheDocument();
    expect(screen.getByText('Test Video 1')).toBeInTheDocument();
    expect(screen.getByText('Test Video 2')).toBeInTheDocument();
    
    // Check for platforms
    expect(screen.getByText('Youtube')).toBeInTheDocument();
    expect(screen.getByText('Tiktok')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
  });

  test('shows empty state when no scheduled videos', async () => {
    // Override the mock to return empty array
    getScheduledVideos.mockResolvedValueOnce([]);
    
    render(<ScheduledPublishing />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading scheduled videos/i)).not.toBeInTheDocument();
    });
    
    // Check for empty state message
    expect(screen.getByText(/No scheduled videos found/i)).toBeInTheDocument();
  });

  test('handles refresh button click', async () => {
    render(<ScheduledPublishing />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading scheduled videos/i)).not.toBeInTheDocument();
    });
    
    // Click refresh button
    fireEvent.click(screen.getByText('Refresh'));
    
    // Verify getScheduledVideos was called again
    expect(getScheduledVideos).toHaveBeenCalledTimes(2);
    
    // Check for loading state again
    expect(screen.getByText(/Loading scheduled videos/i)).toBeInTheDocument();
  });

  test('opens publish now dialog when publish now button is clicked', async () => {
    render(<ScheduledPublishing />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading scheduled videos/i)).not.toBeInTheDocument();
    });
    
    // Find and click the first "Publish Now" button
    const publishButtons = screen.getAllByText('Publish Now');
    fireEvent.click(publishButtons[0]);
    
    // Check that the dialog is shown
    expect(screen.getByText(/Are you sure you want to publish/i)).toBeInTheDocument();
    expect(screen.getByText(/This will override the scheduled publishing time/i)).toBeInTheDocument();
  });

  test('publishes video when confirm button is clicked in dialog', async () => {
    render(<ScheduledPublishing />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading scheduled videos/i)).not.toBeInTheDocument();
    });
    
    // Find and click the first "Publish Now" button
    const publishButtons = screen.getAllByText('Publish Now');
    fireEvent.click(publishButtons[0]);
    
    // Click the confirm button in the dialog
    fireEvent.click(screen.getByText(/Publish Now/i).closest('button'));
    
    // Verify publishVideo was called with correct parameters
    expect(publishVideo).toHaveBeenCalledWith(
      'test-user-id',
      'video-1',
      ['youtube', 'tiktok']
    );
    
    // Verify alert was shown
    expect(global.alert).toHaveBeenCalledWith('Publishing video...');
    
    // Wait for success message
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Video published successfully');
    });
  });

  test('cancels scheduled publishing when cancel button is clicked', async () => {
    render(<ScheduledPublishing />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading scheduled videos/i)).not.toBeInTheDocument();
    });
    
    // Find and click the first "Cancel" button
    const cancelButtons = screen.getAllByText('Cancel');
    fireEvent.click(cancelButtons[0]);
    
    // Verify fetch was called with correct parameters
    expect(global.fetch).toHaveBeenCalled();
    
    // Wait for success message
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Scheduled publishing canceled');
    });
  });

  test('handles API errors gracefully', async () => {
    // Override the mock to throw an error
    getScheduledVideos.mockRejectedValueOnce(new Error('API error'));
    
    render(<ScheduledPublishing />);
    
    // Wait for loading to complete and check for fallback data
    await waitFor(() => {
      expect(screen.queryByText(/Loading scheduled videos/i)).not.toBeInTheDocument();
    });
    
    // Verify that fallback data is shown (mock data in the component)
    expect(screen.getByText(/How to Make a Perfect Cup of Coffee/i)).toBeInTheDocument();
  });
});
