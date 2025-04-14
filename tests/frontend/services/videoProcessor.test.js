import { generateVideo, generateCaptions, transcribeAudio } from '../../../src/frontend/src/services/videoProcessor';
import { createFFmpeg } from '@ffmpeg/ffmpeg';

// Mock the @ffmpeg/ffmpeg module
jest.mock('@ffmpeg/ffmpeg', () => ({
  createFFmpeg: jest.fn().mockReturnValue({
    load: jest.fn().mockResolvedValue(undefined),
    FS: jest.fn().mockImplementation((command, filename, data) => {
      if (command === 'readFile') {
        return { buffer: new ArrayBuffer(8) };
      }
    }),
    run: jest.fn().mockResolvedValue(undefined)
  }),
  fetchFile: jest.fn().mockResolvedValue(new Uint8Array())
}));

describe('videoProcessor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateVideo', () => {
    it('should generate a video from image, audio, and captions', async () => {
      // Create mock files and captions
      const mockImageFile = new File([''], 'image.jpg', { type: 'image/jpeg' });
      const mockAudioFile = new File([''], 'audio.mp3', { type: 'audio/mp3' });
      const mockCaptions = [
        { text: 'Caption 1', startTime: 0, endTime: 3 },
        { text: 'Caption 2', startTime: 3, endTime: 6 }
      ];
      const mockMusicOption = 'default';

      // Call the function
      const result = await generateVideo(mockImageFile, mockAudioFile, mockCaptions, mockMusicOption);

      // Check that FFmpeg was loaded
      expect(createFFmpeg).toHaveBeenCalled();
      
      // Check that the result is a Blob with the correct type
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe('video/mp4');
    });

    it('should handle errors during video generation', async () => {
      // Mock FFmpeg to throw an error
      createFFmpeg.mockReturnValueOnce({
        load: jest.fn().mockRejectedValue(new Error('FFmpeg error')),
        FS: jest.fn(),
        run: jest.fn()
      });

      // Create mock files and captions
      const mockImageFile = new File([''], 'image.jpg', { type: 'image/jpeg' });
      const mockAudioFile = new File([''], 'audio.mp3', { type: 'audio/mp3' });
      const mockCaptions = [
        { text: 'Caption 1', startTime: 0, endTime: 3 }
      ];

      // Call the function and expect it to throw
      await expect(generateVideo(mockImageFile, mockAudioFile, mockCaptions)).rejects.toThrow('Video generation failed');
    });
  });

  describe('generateCaptions', () => {
    it('should generate captions from text with timestamps', () => {
      const text = 'This is the first sentence. This is the second sentence.';
      const duration = 10; // 10 seconds

      const result = generateCaptions(text, duration);

      // Check that we have the correct number of captions
      expect(result).toHaveLength(2);
      
      // Check that each caption has the correct properties
      expect(result[0]).toHaveProperty('text', 'This is the first sentence.');
      expect(result[0]).toHaveProperty('startTime');
      expect(result[0]).toHaveProperty('endTime');
      
      expect(result[1]).toHaveProperty('text', 'This is the second sentence.');
      expect(result[1]).toHaveProperty('startTime');
      expect(result[1]).toHaveProperty('endTime');
      
      // Check that the timestamps are correct
      expect(result[0].startTime).toBe(0);
      expect(result[0].endTime).toBe(5);
      expect(result[1].startTime).toBe(5);
      expect(result[1].endTime).toBe(10);
    });

    it('should handle a single sentence', () => {
      const text = 'This is a single sentence.';
      const duration = 5; // 5 seconds

      const result = generateCaptions(text, duration);

      // Check that we have one caption
      expect(result).toHaveLength(1);
      
      // Check that the caption has the correct properties
      expect(result[0]).toHaveProperty('text', 'This is a single sentence.');
      expect(result[0].startTime).toBe(0);
      expect(result[0].endTime).toBe(5);
    });
  });

  describe('transcribeAudio', () => {
    it('should return a mock transcription', async () => {
      const mockAudioFile = new File([''], 'audio.mp3', { type: 'audio/mp3' });

      const result = await transcribeAudio(mockAudioFile);

      // Check that we get the mock result
      expect(result).toBe('This is a mock transcription of the audio file.');
    });
  });
});
