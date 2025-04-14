import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import CreateVideo from '../../../src/frontend/src/pages/CreateVideo';
import { VideoProvider } from '../../../src/frontend/src/context/VideoContext';
import { AuthProvider } from '../../../src/frontend/src/context/AuthContext';
import * as videoProcessor from '../../../src/frontend/src/services/videoProcessor';
import * as speechService from '../../../src/frontend/src/services/speechService';

// Mock the necessary modules
jest.mock('../../../src/frontend/src/context/VideoContext', () => ({
  ...jest.requireActual('../../../src/frontend/src/context/VideoContext'),
  useVideos: jest.fn().mockReturnValue({
    createVideo: jest.fn().mockResolvedValue({ id: '123' }),
    uploadVideo: jest.fn().mockResolvedValue('https://example.com/video.mp4'),
    uploadThumbnail: jest.fn().mockResolvedValue('https://example.com/thumbnail.jpg')
  })
}));

jest.mock('../../../src/frontend/src/context/AuthContext', () => ({
  ...jest.requireActual('../../../src/frontend/src/context/AuthContext'),
  useAuth: jest.fn().mockReturnValue({
    currentUser: { id: 'user123', email: 'test@example.com' }
  })
}));

jest.mock('../../../src/frontend/src/services/videoProcessor', () => ({
  generateVideo: jest.fn().mockResolvedValue(new Blob([], { type: 'video/mp4' })),
  generateCaptions: jest.fn().mockReturnValue([
    { text: 'Caption 1', startTime: 0, endTime: 3 }
  ])
}));

jest.mock('../../../src/frontend/src/services/speechService', () => ({
  textToSpeech: jest.fn().mockResolvedValue(new Blob([], { type: 'audio/mp3' }))
}));

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Helper function to render the component with all providers
const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <VideoProvider>
          {ui}
        </VideoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('CreateVideo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock URL.createObjectURL
    global.URL.createObjectURL = jest.fn().mockReturnValue('blob:http://localhost/mock-url');
  });

  afterEach(() => {
    // Clean up URL.createObjectURL
    global.URL.createObjectURL.mockReset();
  });

  it('renders the form correctly', () => {
    renderWithProviders(<CreateVideo />);
    
    // Check that the form elements are rendered
    expect(screen.getByText('Create New Video')).toBeInTheDocument();
    expect(screen.getByLabelText('Video Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Video Prompt')).toBeInTheDocument();
    expect(screen.getByText('Background Image')).toBeInTheDocument();
    expect(screen.getByText('Voice Profile')).toBeInTheDocument();
    expect(screen.getByText('Background Music')).toBeInTheDocument();
    expect(screen.getByText('Publishing Options')).toBeInTheDocument();
    expect(screen.getByText('Publish To')).toBeInTheDocument();
  });

  it('validates form inputs', async () => {
    renderWithProviders(<CreateVideo />);
    
    // Try to submit the form without filling in required fields
    fireEvent.click(screen.getByText('Create Video'));
    
    // Check that validation errors are shown
    expect(screen.getByText('Please fill in all required fields')).toBeInTheDocument();
  });

  it('handles form submission correctly', async () => {
    renderWithProviders(<CreateVideo />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText('Video Title'), { target: { value: 'Test Video' } });
    fireEvent.change(screen.getByLabelText('Video Prompt'), { target: { value: 'This is a test prompt' } });
    
    // Mock file upload
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText('Background Image').querySelector('input[type="file"]');
    Object.defineProperty(fileInput, 'files', { value: [file] });
    fireEvent.change(fileInput);
    
    // Submit the form
    fireEvent.click(screen.getByText('Create Video'));
    
    // Wait for the form submission to complete
    await waitFor(() => {
      // Check that the necessary functions were called
      expect(videoProcessor.generateVideo).toHaveBeenCalled();
      expect(speechService.textToSpeech).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/videos/123');
    });
  });

  it('handles scheduling options correctly', async () => {
    renderWithProviders(<CreateVideo />);
    
    // Enable scheduling
    fireEvent.click(screen.getByLabelText('Schedule Publishing'));
    
    // Check that the date and time inputs are shown
    expect(screen.getByLabelText('Date:')).toBeInTheDocument();
    expect(screen.getByLabelText('Time:')).toBeInTheDocument();
    
    // Fill in the scheduling options
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    fireEvent.change(screen.getByLabelText('Date:'), { target: { value: tomorrowStr } });
    fireEvent.change(screen.getByLabelText('Time:'), { target: { value: '12:00' } });
    
    // Fill in the rest of the form
    fireEvent.change(screen.getByLabelText('Video Title'), { target: { value: 'Scheduled Video' } });
    fireEvent.change(screen.getByLabelText('Video Prompt'), { target: { value: 'This is a scheduled video' } });
    
    // Mock file upload
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText('Background Image').querySelector('input[type="file"]');
    Object.defineProperty(fileInput, 'files', { value: [file] });
    fireEvent.change(fileInput);
    
    // Submit the form
    fireEvent.click(screen.getByText('Create Video'));
    
    // Wait for the form submission to complete
    await waitFor(() => {
      // Check that the createVideo function was called with the scheduling options
      const { createVideo } = require('../../../src/frontend/src/context/VideoContext').useVideos();
      expect(createVideo).toHaveBeenCalledWith(
        expect.objectContaining({
          scheduled_publish: true,
          scheduled_publish_time: expect.any(String)
        })
      );
    });
  });

  it('handles customization options correctly', async () => {
    renderWithProviders(<CreateVideo />);
    
    // Fill in the customization options
    fireEvent.change(screen.getByLabelText('Script (Optional)'), { target: { value: 'This is a custom script' } });
    fireEvent.change(screen.getByLabelText('Subtitles (Optional)'), { target: { value: 'These are custom subtitles' } });
    
    // Select voice profile and music
    fireEvent.change(screen.getByLabelText('Voice Profile'), { target: { value: 'female1' } });
    fireEvent.change(screen.getByLabelText('Background Music'), { target: { value: 'upbeat' } });
    
    // Fill in the rest of the form
    fireEvent.change(screen.getByLabelText('Video Title'), { target: { value: 'Customized Video' } });
    fireEvent.change(screen.getByLabelText('Video Prompt'), { target: { value: 'This is a customized video' } });
    
    // Mock file upload
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText('Background Image').querySelector('input[type="file"]');
    Object.defineProperty(fileInput, 'files', { value: [file] });
    fireEvent.change(fileInput);
    
    // Submit the form
    fireEvent.click(screen.getByText('Create Video'));
    
    // Wait for the form submission to complete
    await waitFor(() => {
      // Check that the createVideo function was called with the customization options
      const { createVideo } = require('../../../src/frontend/src/context/VideoContext').useVideos();
      expect(createVideo).toHaveBeenCalledWith(
        expect.objectContaining({
          script: 'This is a custom script',
          subtitles: 'These are custom subtitles',
          voiceProfile: 'female1',
          music: 'upbeat'
        })
      );
      
      // Check that the textToSpeech function was called with the custom script and voice profile
      expect(speechService.textToSpeech).toHaveBeenCalledWith('This is a custom script', 'female1');
      
      // Check that the generateVideo function was called with the music option
      expect(videoProcessor.generateVideo).toHaveBeenCalledWith(
        expect.any(File),
        expect.any(Blob),
        expect.any(Array),
        'upbeat'
      );
    });
  });
});
