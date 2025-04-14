/**
 * Generate speech from text using Web Speech API
 * @param {string} text - Text to convert to speech
 * @param {string} voiceProfile - Voice profile to use (default, male1, male2, female1, female2)
 * @param {string} language - Language code (e.g., 'en-US', 'es-ES', 'fr-FR')
 * @returns {Promise<Blob>} - Audio blob
 */
export const textToSpeech = (text, voiceProfile = 'default', language = 'en-US') => {
  return new Promise((resolve, reject) => {
    // Check if browser supports speech synthesis
    if (!window.speechSynthesis) {
      reject(new Error('Your browser does not support speech synthesis'));
      return;
    }

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);

    // Set properties based on voice profile and language
    utterance.lang = language;

    // Configure voice based on selected profile
    switch (voiceProfile) {
      case 'male1':
        utterance.rate = 0.9;
        utterance.pitch = 0.8;
        // Try to find a male voice in the selected language
        setTimeout(() => {
          const voices = window.speechSynthesis.getVoices();
          // First try to find a male voice in the selected language
          let maleVoice = voices.find(voice =>
            (voice.name.includes('Male') || voice.name.includes('male')) &&
            voice.lang === language
          );
          // If not found, try any male voice
          if (!maleVoice) {
            maleVoice = voices.find(voice =>
              voice.name.includes('Male') || voice.name.includes('male')
            );
          }
          if (maleVoice) utterance.voice = maleVoice;
        }, 0);
        break;
      case 'male2':
        utterance.rate = 1.1;
        utterance.pitch = 0.7;
        // Try to find another male voice in the selected language
        setTimeout(() => {
          const voices = window.speechSynthesis.getVoices();
          // First try to find male voices in the selected language
          let maleVoices = voices.filter(voice =>
            (voice.name.includes('Male') || voice.name.includes('male')) &&
            voice.lang === language
          );
          // If not found, try any male voices
          if (maleVoices.length === 0) {
            maleVoices = voices.filter(voice =>
              voice.name.includes('Male') || voice.name.includes('male')
            );
          }
          if (maleVoices.length > 1) utterance.voice = maleVoices[1];
          else if (maleVoices.length > 0) utterance.voice = maleVoices[0];
        }, 0);
        break;
      case 'female1':
        utterance.rate = 0.9;
        utterance.pitch = 1.2;
        // Try to find a female voice in the selected language
        setTimeout(() => {
          const voices = window.speechSynthesis.getVoices();
          // First try to find a female voice in the selected language
          let femaleVoice = voices.find(voice =>
            (voice.name.includes('Female') || voice.name.includes('female')) &&
            voice.lang === language
          );
          // If not found, try any female voice
          if (!femaleVoice) {
            femaleVoice = voices.find(voice =>
              voice.name.includes('Female') || voice.name.includes('female')
            );
          }
          if (femaleVoice) utterance.voice = femaleVoice;
        }, 0);
        break;
      case 'female2':
        utterance.rate = 1.1;
        utterance.pitch = 1.3;
        // Try to find another female voice in the selected language
        setTimeout(() => {
          const voices = window.speechSynthesis.getVoices();
          // First try to find female voices in the selected language
          let femaleVoices = voices.filter(voice =>
            (voice.name.includes('Female') || voice.name.includes('female')) &&
            voice.lang === language
          );
          // If not found, try any female voices
          if (femaleVoices.length === 0) {
            femaleVoices = voices.filter(voice =>
              voice.name.includes('Female') || voice.name.includes('female')
            );
          }
          if (femaleVoices.length > 1) utterance.voice = femaleVoices[1];
          else if (femaleVoices.length > 0) utterance.voice = femaleVoices[0];
        }, 0);
        break;
      default: // 'default'
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        // Try to find a voice in the selected language
        setTimeout(() => {
          const voices = window.speechSynthesis.getVoices();
          const languageVoice = voices.find(voice => voice.lang === language);
          if (languageVoice) utterance.voice = languageVoice;
        }, 0);
        break;
    }

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
