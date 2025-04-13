/**
 * Generate speech from text using Web Speech API
 * @param {string} text - Text to convert to speech
 * @returns {Promise<Blob>} - Audio blob
 */
export const textToSpeech = (text) => {
  return new Promise((resolve, reject) => {
    // Check if browser supports speech synthesis
    if (!window.speechSynthesis) {
      reject(new Error('Your browser does not support speech synthesis'));
      return;
    }

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set properties
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Use MediaRecorder to capture the audio
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const destination = audioContext.createMediaStreamDestination();
    const mediaRecorder = new MediaRecorder(destination.stream);
    const chunks = [];
    
    // Set up event handlers
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/mp3' });
      resolve(blob);
    };
    
    // Start recording
    mediaRecorder.start();
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
    
    // When speech ends, stop recording
    utterance.onend = () => {
      mediaRecorder.stop();
    };
    
    // Handle errors
    utterance.onerror = (event) => {
      reject(new Error(`Speech synthesis error: ${event.error}`));
    };
  });
};

/**
 * Alternative implementation using RecordRTC for browsers that don't support MediaRecorder with audio
 * @param {string} text - Text to convert to speech
 * @returns {Promise<Blob>} - Audio blob
 */
export const textToSpeechFallback = (text) => {
  // This is a placeholder for a fallback implementation
  // In a real implementation, you might use a third-party service or library
  
  // For now, we'll just return a mock audio blob
  return new Promise((resolve) => {
    // Create a mock audio blob
    const mockAudioBlob = new Blob(['mock audio data'], { type: 'audio/mp3' });
    resolve(mockAudioBlob);
  });
};
