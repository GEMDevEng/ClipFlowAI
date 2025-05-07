import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VideoCard from './VideoCard';
import { VIDEO_STATUS } from '../../config/constants';

// Mock formatDate function
jest.mock('../../utils/helpers', () => ({
  formatDate: jest.fn().mockReturnValue('January 1, 2023')
}));

describe('VideoCard Component', () => {
  const mockVideo = {
    id: 'video123',
    title: 'Test Video',
    thumbnail_url: 'https://example.com/thumbnail.jpg',
    duration: 125, // 2:05
    status: VIDEO_STATUS.COMPLETED,
    created_at: '2023-01-01T12:00:00Z',
    platforms: [
      { name: 'youtube' },
      { name: 'tiktok' }
    ]
  };

  const renderWithRouter = (ui) => {
    return render(
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    );
  };

  test('renders video card with all information', () => {
    renderWithRouter(<VideoCard video={mockVideo} />);
    
    // Check title
    expect(screen.getByText('Test Video')).toBeInTheDocument();
    
    // Check thumbnail
    const thumbnail = screen.getByAltText('Test Video');
    expect(thumbnail).toBeInTheDocument();
    expect(thumbnail).toHaveAttribute('src', 'https://example.com/thumbnail.jpg');
    
    // Check duration
    expect(screen.getByText('2:05')).toBeInTheDocument();
    
    // Check status
    expect(screen.getByText(VIDEO_STATUS.COMPLETED)).toBeInTheDocument();
    
    // Check created date
    expect(screen.getByText(/Created:/)).toBeInTheDocument();
    
    // Check platforms
    expect(screen.getByText(/Platforms:/)).toBeInTheDocument();
    expect(screen.getByText(/youtube, tiktok/)).toBeInTheDocument();
    
    // Check view details link
    const detailsLink = screen.getByText('View Details');
    expect(detailsLink).toBeInTheDocument();
    expect(detailsLink).toHaveAttribute('href', '/videos/video123');
  });

  test('renders placeholder when no thumbnail is available', () => {
    const videoWithoutThumbnail = { ...mockVideo, thumbnail_url: null };
    renderWithRouter(<VideoCard video={videoWithoutThumbnail} />);
    
    expect(screen.getByText('No Thumbnail')).toBeInTheDocument();
  });

  test('does not render duration when not provided', () => {
    const videoWithoutDuration = { ...mockVideo, duration: null };
    renderWithRouter(<VideoCard video={videoWithoutDuration} />);
    
    expect(screen.queryByText('2:05')).not.toBeInTheDocument();
  });

  test('calls onDelete when delete button is clicked', () => {
    const mockOnDelete = jest.fn();
    renderWithRouter(<VideoCard video={mockVideo} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByLabelText('Delete video');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith('video123');
  });

  test('does not render delete button when onDelete is not provided', () => {
    renderWithRouter(<VideoCard video={mockVideo} />);
    
    expect(screen.queryByLabelText('Delete video')).not.toBeInTheDocument();
  });

  test('returns null when no video is provided', () => {
    const { container } = renderWithRouter(<VideoCard />);
    
    expect(container.firstChild).toBeNull();
  });

  test('applies correct status color class based on video status', () => {
    // Test different statuses
    const statuses = [
      { status: VIDEO_STATUS.PENDING, className: 'text-yellow-500' },
      { status: VIDEO_STATUS.PROCESSING, className: 'text-blue-500' },
      { status: VIDEO_STATUS.COMPLETED, className: 'text-green-500' },
      { status: VIDEO_STATUS.PUBLISHED, className: 'text-purple-500' },
      { status: VIDEO_STATUS.FAILED, className: 'text-red-500' },
      { status: 'unknown', className: 'text-gray-500' }
    ];

    statuses.forEach(({ status, className }) => {
      const videoWithStatus = { ...mockVideo, status };
      const { container, unmount } = renderWithRouter(<VideoCard video={videoWithStatus} />);
      
      const statusElement = container.querySelector(`.${className}`);
      expect(statusElement).toBeInTheDocument();
      expect(statusElement).toHaveTextContent(status || 'Unknown');
      
      unmount();
    });
  });
});
