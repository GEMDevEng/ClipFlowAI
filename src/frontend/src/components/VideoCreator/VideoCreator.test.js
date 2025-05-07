import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VideoCreator from './VideoCreator';
import { generateVideo } from '../../services/video/videoService';
import { useAuth } from '../../context/AuthContext';
import { useVideos } from '../../context/VideoContext';

// Mock the required modules
jest.mock('../../services/video/videoService');
jest.mock('../../context/AuthContext');
jest.mock('../../context/VideoContext');

describe('VideoCreator Component', () => {
  // Mock data
  const mockUser = { id: 'user123', email: 'test@example.com' };
  const mockAddVideo = jest.fn();
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock the auth context
    useAuth.mockReturnValue({
      user: mockUser,
      loading: false
    });
    
    // Mock the videos context
    useVideos.mockReturnValue({
      addVideo: mockAddVideo,
      loading: false
    });
    
    // Mock the video generation service
    generateVideo.mockResolvedValue({
      id: 'video123',
      title: 'Test Video',
      status: 'processing'
    });
  });
  
  it('renders the video creation form', () => {
    render(<VideoCreator />);
    
    // Check that the form elements are rendered
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/prompt/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
  });
  
  it('submits the form and creates a video', async () => {
    render(<VideoCreator />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Video' }
    });
    
    fireEvent.change(screen.getByLabelText(/prompt/i), {
      target: { value: 'Create a test video about AI' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    
    // Check that the loading state is shown
    expect(screen.getByText(/creating your video/i)).toBeInTheDocument();
    
    // Wait for the video to be created
    await waitFor(() => {
      expect(generateVideo).toHaveBeenCalledWith(
        'Create a test video about AI',
        'Test Video',
        mockUser.id
      );
      expect(mockAddVideo).toHaveBeenCalledWith({
        id: 'video123',
        title: 'Test Video',
        status: 'processing'
      });
    });
    
    // Check that success message is shown
    expect(screen.getByText(/video created successfully/i)).toBeInTheDocument();
  });
  
  it('displays validation errors for empty fields', async () => {
    render(<VideoCreator />);
    
    // Submit the form without filling it out
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    
    // Check that validation errors are shown
    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/prompt is required/i)).toBeInTheDocument();
    
    // Verify that the video generation service was not called
    expect(generateVideo).not.toHaveBeenCalled();
  });
  
  it('handles errors during video creation', async () => {
    // Mock an error during video generation
    generateVideo.mockRejectedValue(new Error('Failed to create video'));
    
    render(<VideoCreator />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Video' }
    });
    
    fireEvent.change(screen.getByLabelText(/prompt/i), {
      target: { value: 'Create a test video about AI' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    
    // Wait for the error to be handled
    await waitFor(() => {
      expect(screen.getByText(/failed to create video/i)).toBeInTheDocument();
    });
    
    // Verify that the video was not added
    expect(mockAddVideo).not.toHaveBeenCalled();
  });
  
  it('disables the form during submission', async () => {
    render(<VideoCreator />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Video' }
    });
    
    fireEvent.change(screen.getByLabelText(/prompt/i), {
      target: { value: 'Create a test video about AI' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    
    // Check that the form elements are disabled during submission
    expect(screen.getByLabelText(/title/i)).toBeDisabled();
    expect(screen.getByLabelText(/prompt/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /create/i })).toBeDisabled();
    
    // Wait for the submission to complete
    await waitFor(() => {
      expect(generateVideo).toHaveBeenCalled();
    });
  });
});
