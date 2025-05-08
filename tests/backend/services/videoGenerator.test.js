const { generateVideo, generateVoiceover, generateCaptions, generateCaptionsFromText } = require('../../../src/backend/services/videoGenerator');
const axios = require('axios');
const fs = require('fs');

// Mock axios
jest.mock('axios');

// Mock fs.writeFileSync
jest.mock('fs', () => ({
  writeFileSync: jest.fn()
}));

// Mock environment variables
process.env.RUNWAY_API_KEY = 'test_runway_api_key';
process.env.GOOGLE_TTS_API_KEY = 'test_google_tts_api_key';
process.env.GOOGLE_STT_API_KEY = 'test_google_stt_api_key';

describe('Video Generator Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateVideo', () => {
    it('should generate a video successfully', async () => {
      // Mock successful response from RunwayML API
      axios.post.mockResolvedValueOnce({
        status: 200,
        data: {
          output_url: 'https://example.com/video.mp4'
        }
      });

      const prompt = 'A beautiful sunset over the ocean';
      const title = 'Sunset Video';
      const options = {
        music: 'relaxed',
        voiceProfile: 'female1',
        language: 'en-US',
        script: 'A beautiful sunset over the ocean with waves crashing',
        subtitles: 'Sunset over ocean. Waves crashing.'
      };

      const result = await generateVideo(prompt, title, options);

      // Check that axios was called with the correct parameters
      expect(axios.post).toHaveBeenCalledWith(
        'https://api.runwayml.com/v1/text-to-video',
        expect.objectContaining({
          prompt,
          negative_prompt: "poor quality, blurry, distorted, pixelated",
        }),
        expect.objectContaining({
          headers: {
            'Authorization': 'Bearer test_runway_api_key',
            'Content-Type': 'application/json',
          }
        })
      );

      // Check the result
      expect(result).toEqual(expect.objectContaining({
        title,
        prompt,
        status: 'completed',
        videoUrl: 'https://example.com/video.mp4',
        options: expect.objectContaining(options)
      }));
    });

    it('should throw an error if RunwayML API key is not set', async () => {
      // Temporarily remove the API key
      const originalApiKey = process.env.RUNWAY_API_KEY;
      delete process.env.RUNWAY_API_KEY;

      const prompt = 'A beautiful sunset over the ocean';
      const title = 'Sunset Video';

      await expect(generateVideo(prompt, title)).rejects.toThrow('RUNWAY_API_KEY is not set in environment variables');

      // Restore the API key
      process.env.RUNWAY_API_KEY = originalApiKey;
    });

    it('should throw an error if RunwayML API returns an error', async () => {
      // Mock error response from RunwayML API
      axios.post.mockResolvedValueOnce({
        status: 400,
        statusText: 'Bad Request'
      });

      const prompt = 'A beautiful sunset over the ocean';
      const title = 'Sunset Video';

      await expect(generateVideo(prompt, title)).rejects.toThrow('RunwayML API error: 400 - Bad Request');
    });
  });

  describe('generateVoiceover', () => {
    it('should generate a voiceover successfully', async () => {
      // Mock successful response from Google TTS API
      axios.post.mockResolvedValueOnce({
        data: {
          audioContent: 'base64_encoded_audio_content'
        }
      });

      const text = 'This is a test voiceover';
      const voiceProfile = 'female1';
      const language = 'en-US';

      const result = await generateVoiceover(text, voiceProfile, language);

      // Check that axios was called with the correct parameters
      expect(axios.post).toHaveBeenCalledWith(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=test_google_tts_api_key`,
        expect.objectContaining({
          input: { text },
          voice: expect.objectContaining({
            languageCode: 'en-US',
            ssmlGender: 'FEMALE'
          }),
          audioConfig: expect.objectContaining({
            audioEncoding: 'MP3',
            pitch: 1.2
          })
        })
      );

      // Check that fs.writeFileSync was called
      expect(fs.writeFileSync).toHaveBeenCalled();

      // Check that the result is a URL
      expect(result).toMatch(/^https:\/\/storage\.example\.com\/voiceovers\/voiceover_\d+\.mp3$/);
    });

    it('should throw an error if Google TTS API key is not set', async () => {
      // Temporarily remove the API key
      const originalApiKey = process.env.GOOGLE_TTS_API_KEY;
      delete process.env.GOOGLE_TTS_API_KEY;

      const text = 'This is a test voiceover';

      await expect(generateVoiceover(text)).rejects.toThrow('GOOGLE_TTS_API_KEY is not set in environment variables');

      // Restore the API key
      process.env.GOOGLE_TTS_API_KEY = originalApiKey;
    });
  });

  describe('generateCaptions', () => {
    it('should generate captions from audio successfully', async () => {
      // Mock successful response from audio download
      axios.get.mockResolvedValueOnce({
        data: Buffer.from('mock audio data')
      });

      // Mock successful response from Google STT API
      axios.post.mockResolvedValueOnce({
        data: {
          results: [
            {
              alternatives: [
                {
                  words: [
                    { word: 'This', startTime: '0s', endTime: '0.5s' },
                    { word: 'is', startTime: '0.5s', endTime: '0.7s' },
                    { word: 'a', startTime: '0.7s', endTime: '0.8s' },
                    { word: 'test.', startTime: '0.8s', endTime: '1.2s' }
                  ]
                }
              ]
            }
          ]
        }
      });

      const audioUrl = 'https://example.com/audio.mp3';
      const text = 'This is a test.';
      const language = 'en-US';

      const result = await generateCaptions(audioUrl, text, language);

      // Check that axios was called with the correct parameters
      expect(axios.post).toHaveBeenCalledWith(
        `https://speech.googleapis.com/v1/speech:recognize?key=test_google_stt_api_key`,
        expect.objectContaining({
          config: expect.objectContaining({
            languageCode: 'en-US',
            enableWordTimeOffsets: true
          }),
          audio: expect.any(Object)
        })
      );

      // Check the result
      expect(result).toEqual([
        {
          text: 'This is a test.',
          startTime: 0,
          endTime: 1.2
        }
      ]);
    });

    it('should fall back to text-based caption generation if STT API fails', async () => {
      // Mock error response from audio download
      axios.get.mockRejectedValueOnce(new Error('Network error'));

      const audioUrl = 'https://example.com/audio.mp3';
      const text = 'This is a test.';
      const language = 'en-US';

      const result = await generateCaptions(audioUrl, text, language);

      // Check that the result is generated from text
      expect(result).toEqual([
        {
          text: 'This is a test.',
          startTime: 0,
          endTime: expect.any(Number)
        }
      ]);
    });
  });

  describe('generateCaptionsFromText', () => {
    it('should generate captions from text', () => {
      const text = 'This is the first sentence. This is the second sentence.';

      const result = generateCaptionsFromText(text);

      expect(result).toHaveLength(2);
      expect(result[0].text).toBe('This is the first sentence.');
      expect(result[1].text).toBe('This is the second sentence.');
      expect(result[0].startTime).toBe(0);
      expect(result[0].endTime).toBe(result[1].startTime);
    });
  });
});
