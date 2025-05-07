const { generateVideo, generateVoiceover, generateCaptions } = require('../../../src/backend/services/videoGenerator');
const axios = require('axios');

// Mock axios
jest.mock('axios');

describe('videoGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateVideo', () => {
    it('should generate a video from a prompt and title', async () => {
      // Call the function
      const prompt = 'This is a test prompt';
      const title = 'Test Video';
      const result = await generateVideo(prompt, title);

      // Check the result
      expect(result).toHaveProperty('title', title);
      expect(result).toHaveProperty('prompt', prompt);
      expect(result).toHaveProperty('status', 'completed');
      expect(result).toHaveProperty('duration');
      expect(result).toHaveProperty('videoUrl');
      expect(result).toHaveProperty('thumbnailUrl');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('publishedAt');
    });

    it('should handle errors during video generation', async () => {
      // Mock a failure
      const mockError = new Error('Video generation failed');
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(global, 'setTimeout').mockImplementation((callback) => {
        throw mockError;
      });

      // Call the function and expect it to throw
      const prompt = 'This is a test prompt';
      const title = 'Test Video';
      await expect(generateVideo(prompt, title)).rejects.toThrow('Video generation failed');

      // Check that the error was logged
      expect(console.error).toHaveBeenCalledWith('Error generating video:', mockError.message);
    });
  });

  describe('generateVoiceover', () => {
    it('should generate a voiceover from text', async () => {
      // Mock the setTimeout function to resolve immediately
      jest.spyOn(global, 'setTimeout').mockImplementation((callback) => {
        callback();
        return 123; // Return a timeout ID
      });

      // Call the function
      const text = 'This is a test text for voiceover';
      const result = await generateVoiceover(text);

      // Check the result
      expect(result).toBe('https://example.com/voiceover.mp3');
    });

    it('should handle errors during voiceover generation', async () => {
      // Mock a failure
      const mockError = new Error('Voiceover generation failed');
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(global, 'setTimeout').mockImplementation((callback) => {
        throw mockError;
      });

      // Call the function and expect it to throw
      const text = 'This is a test text for voiceover';
      await expect(generateVoiceover(text)).rejects.toThrow('Voiceover generation failed');

      // Check that the error was logged
      expect(console.error).toHaveBeenCalledWith('Error generating voiceover:', mockError.message);
    });
  });

  describe('generateCaptions', () => {
    it('should generate captions for an audio file', async () => {
      // Mock the setTimeout function to resolve immediately
      jest.spyOn(global, 'setTimeout').mockImplementation((callback) => {
        callback();
        return 123; // Return a timeout ID
      });

      // Call the function
      const audioUrl = 'https://example.com/audio.mp3';
      const result = await generateCaptions(audioUrl);

      // Check the result
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('text');
      expect(result[0]).toHaveProperty('startTime');
      expect(result[0]).toHaveProperty('endTime');
    });

    it('should handle errors during caption generation', async () => {
      // Mock a failure
      const mockError = new Error('Caption generation failed');
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(global, 'setTimeout').mockImplementation((callback) => {
        throw mockError;
      });

      // Call the function and expect it to throw
      const audioUrl = 'https://example.com/audio.mp3';
      await expect(generateCaptions(audioUrl)).rejects.toThrow('Caption generation failed');

      // Check that the error was logged
      expect(console.error).toHaveBeenCalledWith('Error generating captions:', mockError.message);
    });
  });
});
