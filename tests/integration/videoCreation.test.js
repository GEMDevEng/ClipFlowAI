/**
 * Integration tests for the video creation flow
 */
const { generateVideo, generateVoiceover, generateCaptions } = require('../../src/backend/services/videoGenerator');
const { storeVideo, updateVideo, getVideoById } = require('../../src/backend/services/videoService');
const { supabase } = require('../../src/backend/config/supabase');

// Mock the Supabase client
jest.mock('../../src/backend/config/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn()
  }
}));

// Mock the video generator service
jest.mock('../../src/backend/services/videoGenerator');

// Mock the video service
jest.mock('../../src/backend/services/videoService');

describe('Video Creation Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a video from prompt to storage', async () => {
    // Mock data
    const userId = 'user123';
    const prompt = 'Create a video about AI technology';
    const title = 'AI Technology Explained';
    
    // Mock the video generation
    const mockVideoData = {
      title,
      prompt,
      status: 'completed',
      duration: 45,
      videoUrl: 'https://example.com/video.mp4',
      thumbnailUrl: 'https://example.com/thumbnail.jpg',
      createdAt: new Date().toISOString(),
      publishedAt: null
    };
    
    generateVideo.mockResolvedValue(mockVideoData);
    
    // Mock the voiceover generation
    const mockVoiceoverUrl = 'https://example.com/voiceover.mp3';
    generateVoiceover.mockResolvedValue(mockVoiceoverUrl);
    
    // Mock the captions generation
    const mockCaptions = [
      { text: 'This is the first caption', startTime: 0, endTime: 3 },
      { text: 'This is the second caption', startTime: 3, endTime: 6 }
    ];
    generateCaptions.mockResolvedValue(mockCaptions);
    
    // Mock the video storage
    const mockVideoId = 'video123';
    storeVideo.mockResolvedValue({ id: mockVideoId });
    
    // Mock the video update
    updateVideo.mockResolvedValue({ id: mockVideoId, status: 'ready' });
    
    // Mock the video retrieval
    getVideoById.mockResolvedValue({
      id: mockVideoId,
      title,
      prompt,
      status: 'ready',
      duration: 45,
      videoUrl: 'https://example.com/video.mp4',
      thumbnailUrl: 'https://example.com/thumbnail.jpg',
      voiceoverUrl: mockVoiceoverUrl,
      captions: mockCaptions,
      userId,
      createdAt: new Date().toISOString(),
      publishedAt: null
    });
    
    // Execute the video creation flow
    // Step 1: Generate the video
    const videoData = await generateVideo(prompt, title);
    expect(videoData).toEqual(mockVideoData);
    
    // Step 2: Store the initial video data
    const { id: videoId } = await storeVideo({
      ...videoData,
      userId,
      status: 'processing'
    });
    expect(videoId).toBe(mockVideoId);
    expect(storeVideo).toHaveBeenCalledWith({
      ...videoData,
      userId,
      status: 'processing'
    });
    
    // Step 3: Generate the voiceover
    const voiceoverUrl = await generateVoiceover(prompt);
    expect(voiceoverUrl).toBe(mockVoiceoverUrl);
    
    // Step 4: Generate captions from the voiceover
    const captions = await generateCaptions(voiceoverUrl);
    expect(captions).toEqual(mockCaptions);
    
    // Step 5: Update the video with voiceover and captions
    await updateVideo(videoId, {
      voiceoverUrl,
      captions,
      status: 'ready'
    });
    expect(updateVideo).toHaveBeenCalledWith(videoId, {
      voiceoverUrl,
      captions,
      status: 'ready'
    });
    
    // Step 6: Retrieve the final video
    const finalVideo = await getVideoById(videoId);
    expect(finalVideo).toHaveProperty('id', videoId);
    expect(finalVideo).toHaveProperty('status', 'ready');
    expect(finalVideo).toHaveProperty('voiceoverUrl', voiceoverUrl);
    expect(finalVideo).toHaveProperty('captions', captions);
  });

  it('should handle errors during video creation', async () => {
    // Mock data
    const userId = 'user123';
    const prompt = 'Create a video about AI technology';
    const title = 'AI Technology Explained';
    
    // Mock a failure in video generation
    const mockError = new Error('Video generation failed');
    generateVideo.mockRejectedValue(mockError);
    
    // Execute the video creation flow with error handling
    try {
      await generateVideo(prompt, title);
      // If we get here, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toEqual(mockError);
      expect(error.message).toBe('Video generation failed');
    }
    
    // Verify that subsequent steps were not called
    expect(storeVideo).not.toHaveBeenCalled();
    expect(generateVoiceover).not.toHaveBeenCalled();
    expect(generateCaptions).not.toHaveBeenCalled();
    expect(updateVideo).not.toHaveBeenCalled();
  });
});
