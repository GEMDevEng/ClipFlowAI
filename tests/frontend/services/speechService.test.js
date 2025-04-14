import { textToSpeech, textToSpeechFallback } from '../../../src/frontend/src/services/speechService';

// Mock the Web Speech API
global.SpeechSynthesisUtterance = jest.fn().mockImplementation(() => ({
  lang: '',
  rate: 1.0,
  pitch: 1.0,
  onend: null,
  onerror: null
}));

global.speechSynthesis = {
  speak: jest.fn(),
  getVoices: jest.fn().mockReturnValue([
    { name: 'Male Voice', lang: 'en-US' },
    { name: 'Female Voice', lang: 'en-US' }
  ])
};

// Mock the MediaRecorder API
global.MediaRecorder = jest.fn().mockImplementation(() => ({
  start: jest.fn(),
  stop: jest.fn(),
  ondataavailable: null,
  onstop: null
}));

// Mock the AudioContext API
global.AudioContext = jest.fn().mockImplementation(() => ({
  createMediaStreamDestination: jest.fn().mockReturnValue({
    stream: {}
  })
}));

describe('speechService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('textToSpeech', () => {
    it('should convert text to speech', async () => {
      // Setup
      const text = 'Hello, world!';
      const voiceProfile = 'default';
      
      // Simulate the MediaRecorder events
      global.MediaRecorder.mockImplementationOnce(() => {
        const recorder = {
          start: jest.fn(),
          stop: jest.fn(),
          ondataavailable: null,
          onstop: null
        };
        
        // Simulate the stop event after a short delay
        setTimeout(() => {
          if (recorder.onstop) {
            recorder.onstop();
          }
        }, 10);
        
        return recorder;
      });
      
      // Simulate the SpeechSynthesisUtterance onend event
      global.SpeechSynthesisUtterance.mockImplementationOnce(() => {
        const utterance = {
          lang: '',
          rate: 1.0,
          pitch: 1.0,
          onend: null,
          onerror: null
        };
        
        // Simulate the onend event after a short delay
        setTimeout(() => {
          if (utterance.onend) {
            utterance.onend();
          }
        }, 5);
        
        return utterance;
      });

      // Call the function
      const result = await textToSpeech(text, voiceProfile);

      // Assertions
      expect(global.SpeechSynthesisUtterance).toHaveBeenCalledWith(text);
      expect(global.speechSynthesis.speak).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe('audio/mp3');
    });

    it('should handle browser not supporting speech synthesis', async () => {
      // Setup
      const text = 'Hello, world!';
      const voiceProfile = 'default';
      
      // Remove speechSynthesis from the global object
      const originalSpeechSynthesis = global.speechSynthesis;
      delete global.speechSynthesis;

      // Call the function and expect it to reject
      await expect(textToSpeech(text, voiceProfile)).rejects.toThrow('Your browser does not support speech synthesis');

      // Restore speechSynthesis
      global.speechSynthesis = originalSpeechSynthesis;
    });

    it('should handle speech synthesis errors', async () => {
      // Setup
      const text = 'Hello, world!';
      const voiceProfile = 'default';
      
      // Simulate an error in the SpeechSynthesisUtterance
      global.SpeechSynthesisUtterance.mockImplementationOnce(() => {
        const utterance = {
          lang: '',
          rate: 1.0,
          pitch: 1.0,
          onend: null,
          onerror: null
        };
        
        // Simulate the onerror event after a short delay
        setTimeout(() => {
          if (utterance.onerror) {
            utterance.onerror({ error: 'Test error' });
          }
        }, 5);
        
        return utterance;
      });

      // Call the function and expect it to reject
      await expect(textToSpeech(text, voiceProfile)).rejects.toThrow('Speech synthesis error: Test error');
    });
  });

  describe('textToSpeechFallback', () => {
    it('should return a mock audio blob', async () => {
      // Setup
      const text = 'Hello, world!';

      // Call the function
      const result = await textToSpeechFallback(text);

      // Assertions
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe('audio/mp3');
    });
  });
});
