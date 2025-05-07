import { 
  initFFmpeg,
  generateThumbnail,
  trimVideo,
  addSubtitles,
  mergeVideoAndAudio,
  resizeVideoForPlatform
} from '../../../src/frontend/src/services/video/videoProcessor';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

// Mock the @ffmpeg/ffmpeg module
jest.mock('@ffmpeg/ffmpeg', () => {
  const mockFFmpeg = {
    load: jest.fn().mockResolvedValue(undefined),
    FS: jest.fn().mockImplementation((command, filename, data) => {
      if (command === 'readFile') {
        return { buffer: new ArrayBuffer(8) };
      }
      return undefined;
    }),
    run: jest.fn().mockResolvedValue(undefined)
  };
  
  return {
    createFFmpeg: jest.fn().mockReturnValue(mockFFmpeg),
    fetchFile: jest.fn().mockResolvedValue(new Uint8Array())
  };
});

describe('Video Processor Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initFFmpeg', () => {
    it('should initialize FFmpeg', async () => {
      await initFFmpeg();
      
      expect(createFFmpeg).toHaveBeenCalledWith({
        log: expect.any(Boolean),
        corePath: expect.any(String)
      });
      
      const mockFFmpeg = createFFmpeg.mock.results[0].value;
      expect(mockFFmpeg.load).toHaveBeenCalled();
    });

    it('should not initialize FFmpeg if already initialized', async () => {
      // First call to initialize
      await initFFmpeg();
      
      // Reset mocks
      jest.clearAllMocks();
      
      // Second call should not reinitialize
      await initFFmpeg();
      
      expect(createFFmpeg).not.toHaveBeenCalled();
    });
  });

  describe('generateThumbnail', () => {
    it('should generate a thumbnail from a video', async () => {
      const mockVideoFile = new File([''], 'video.mp4', { type: 'video/mp4' });
      const timeInSeconds = 5;
      
      const result = await generateThumbnail(mockVideoFile, timeInSeconds);
      
      // Check that FFmpeg was initialized
      expect(createFFmpeg).toHaveBeenCalled();
      
      const mockFFmpeg = createFFmpeg.mock.results[0].value;
      
      // Check that the video file was written to memory
      expect(mockFFmpeg.FS).toHaveBeenCalledWith('writeFile', 'input.mp4', expect.any(Uint8Array));
      
      // Check that FFmpeg was run with the correct arguments
      expect(mockFFmpeg.run).toHaveBeenCalledWith(
        '-i', 'input.mp4',
        '-ss', '5',
        '-frames:v', '1',
        'thumbnail.jpg'
      );
      
      // Check that the thumbnail was read from memory
      expect(mockFFmpeg.FS).toHaveBeenCalledWith('readFile', 'thumbnail.jpg');
      
      // Check that the files were cleaned up
      expect(mockFFmpeg.FS).toHaveBeenCalledWith('unlink', 'input.mp4');
      expect(mockFFmpeg.FS).toHaveBeenCalledWith('unlink', 'thumbnail.jpg');
      
      // Check that the result is a Blob with the correct type
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe('image/jpeg');
    });

    it('should handle errors during thumbnail generation', async () => {
      const mockVideoFile = new File([''], 'video.mp4', { type: 'video/mp4' });
      
      // Mock FFmpeg to throw an error
      const mockFFmpeg = createFFmpeg.mock.results[0].value;
      mockFFmpeg.run.mockRejectedValueOnce(new Error('FFmpeg error'));
      
      // Call the function and expect it to throw
      await expect(generateThumbnail(mockVideoFile)).rejects.toThrow('FFmpeg error');
    });
  });

  describe('trimVideo', () => {
    it('should trim a video', async () => {
      const mockVideoFile = new File([''], 'video.mp4', { type: 'video/mp4' });
      const startTime = 10;
      const duration = 30;
      
      const result = await trimVideo(mockVideoFile, startTime, duration);
      
      // Check that FFmpeg was initialized
      expect(createFFmpeg).toHaveBeenCalled();
      
      const mockFFmpeg = createFFmpeg.mock.results[0].value;
      
      // Check that the video file was written to memory
      expect(mockFFmpeg.FS).toHaveBeenCalledWith('writeFile', 'input.mp4', expect.any(Uint8Array));
      
      // Check that FFmpeg was run with the correct arguments
      expect(mockFFmpeg.run).toHaveBeenCalledWith(
        '-i', 'input.mp4',
        '-ss', '10',
        '-t', '30',
        '-c', 'copy',
        'output.mp4'
      );
      
      // Check that the output was read from memory
      expect(mockFFmpeg.FS).toHaveBeenCalledWith('readFile', 'output.mp4');
      
      // Check that the files were cleaned up
      expect(mockFFmpeg.FS).toHaveBeenCalledWith('unlink', 'input.mp4');
      expect(mockFFmpeg.FS).toHaveBeenCalledWith('unlink', 'output.mp4');
      
      // Check that the result is a Blob with the correct type
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe('video/mp4');
    });
  });

  describe('addSubtitles', () => {
    it('should add subtitles to a video', async () => {
      const mockVideoFile = new File([''], 'video.mp4', { type: 'video/mp4' });
      const subtitlesText = '1\n00:00:00,000 --> 00:00:03,000\nThis is a test subtitle\n\n';
      
      const result = await addSubtitles(mockVideoFile, subtitlesText);
      
      // Check that FFmpeg was initialized
      expect(createFFmpeg).toHaveBeenCalled();
      
      const mockFFmpeg = createFFmpeg.mock.results[0].value;
      
      // Check that the video file was written to memory
      expect(mockFFmpeg.FS).toHaveBeenCalledWith('writeFile', 'input.mp4', expect.any(Uint8Array));
      
      // Check that the subtitles file was written to memory
      expect(mockFFmpeg.FS).toHaveBeenCalledWith('writeFile', 'subtitles.srt', expect.any(Uint8Array));
      
      // Check that FFmpeg was run with the correct arguments
      expect(mockFFmpeg.run).toHaveBeenCalledWith(
        '-i', 'input.mp4',
        '-vf', 'subtitles=subtitles.srt',
        '-c:a', 'copy',
        'output.mp4'
      );
      
      // Check that the output was read from memory
      expect(mockFFmpeg.FS).toHaveBeenCalledWith('readFile', 'output.mp4');
      
      // Check that the files were cleaned up
      expect(mockFFmpeg.FS).toHaveBeenCalledWith('unlink', 'input.mp4');
      expect(mockFFmpeg.FS).toHaveBeenCalledWith('unlink', 'subtitles.srt');
      expect(mockFFmpeg.FS).toHaveBeenCalledWith('unlink', 'output.mp4');
      
      // Check that the result is a Blob with the correct type
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe('video/mp4');
    });
  });

  describe('resizeVideoForPlatform', () => {
    it('should resize a video for YouTube', async () => {
      const mockVideoFile = new File([''], 'video.mp4', { type: 'video/mp4' });
      const platform = 'youtube';
      
      const result = await resizeVideoForPlatform(mockVideoFile, platform);
      
      // Check that FFmpeg was initialized
      expect(createFFmpeg).toHaveBeenCalled();
      
      const mockFFmpeg = createFFmpeg.mock.results[0].value;
      
      // Check that FFmpeg was run with the correct dimensions for YouTube
      expect(mockFFmpeg.run).toHaveBeenCalledWith(
        '-i', 'input.mp4',
        '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2',
        '-c:a', 'copy',
        'output.mp4'
      );
      
      // Check that the result is a Blob with the correct type
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe('video/mp4');
    });

    it('should resize a video for TikTok', async () => {
      const mockVideoFile = new File([''], 'video.mp4', { type: 'video/mp4' });
      const platform = 'tiktok';
      
      const result = await resizeVideoForPlatform(mockVideoFile, platform);
      
      // Check that FFmpeg was initialized
      expect(createFFmpeg).toHaveBeenCalled();
      
      const mockFFmpeg = createFFmpeg.mock.results[0].value;
      
      // Check that FFmpeg was run with the correct dimensions for TikTok
      expect(mockFFmpeg.run).toHaveBeenCalledWith(
        '-i', 'input.mp4',
        '-vf', 'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2',
        '-c:a', 'copy',
        'output.mp4'
      );
      
      // Check that the result is a Blob with the correct type
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe('video/mp4');
    });
  });
});
