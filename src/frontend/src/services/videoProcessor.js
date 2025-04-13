import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

// Create FFmpeg instance
const ffmpeg = createFFmpeg({
  log: true,
  corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
});

// Load FFmpeg
let ffmpegLoaded = false;
const loadFFmpeg = async () => {
  if (!ffmpegLoaded) {
    await ffmpeg.load();
    ffmpegLoaded = true;
    console.log('FFmpeg loaded');
  }
  return ffmpeg;
};

/**
 * Generate a video from images and audio
 * @param {File} imageFile - Background image for the video
 * @param {File} audioFile - Audio file for the video
 * @param {Array} captions - Array of caption objects with text and timestamps
 * @returns {Promise<Blob>} - The generated video as a Blob
 */
export const generateVideo = async (imageFile, audioFile, captions) => {
  try {
    // Load FFmpeg
    const ffmpeg = await loadFFmpeg();
    
    // Write files to memory
    ffmpeg.FS('writeFile', 'background.jpg', await fetchFile(imageFile));
    ffmpeg.FS('writeFile', 'audio.mp3', await fetchFile(audioFile));
    
    // Generate subtitles file (SRT format)
    let subtitlesContent = '';
    captions.forEach((caption, index) => {
      const startTime = formatTime(caption.startTime);
      const endTime = formatTime(caption.endTime);
      
      subtitlesContent += `${index + 1}\n`;
      subtitlesContent += `${startTime} --> ${endTime}\n`;
      subtitlesContent += `${caption.text}\n\n`;
    });
    
    ffmpeg.FS('writeFile', 'subtitles.srt', subtitlesContent);
    
    // Get audio duration
    await ffmpeg.run(
      '-i', 'audio.mp3',
      '-f', 'null',
      '-'
    );
    
    // Generate video with image, audio, and subtitles
    await ffmpeg.run(
      '-loop', '1',
      '-i', 'background.jpg',
      '-i', 'audio.mp3',
      '-vf', 'subtitles=subtitles.srt:force_style=\'FontSize=24,PrimaryColour=&HFFFFFF&,OutlineColour=&H000000&,BorderStyle=3\'',
      '-c:v', 'libx264',
      '-tune', 'stillimage',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-pix_fmt', 'yuv420p',
      '-shortest',
      'output.mp4'
    );
    
    // Read the result
    const data = ffmpeg.FS('readFile', 'output.mp4');
    
    // Create a Blob from the data
    return new Blob([data.buffer], { type: 'video/mp4' });
  } catch (error) {
    console.error('Error generating video:', error);
    throw new Error('Video generation failed');
  }
};

/**
 * Convert audio to text using Web Speech API
 * @param {File} audioFile - Audio file to transcribe
 * @returns {Promise<string>} - Transcribed text
 */
export const transcribeAudio = async (audioFile) => {
  try {
    // This is a placeholder for actual transcription
    // Web Speech API doesn't directly support file transcription
    // In a real implementation, you would use a service like Google Speech-to-Text
    
    // For now, we'll just return a mock result
    return "This is a mock transcription of the audio file.";
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error('Audio transcription failed');
  }
};

/**
 * Generate captions from text with timestamps
 * @param {string} text - Text to generate captions from
 * @param {number} duration - Duration of the audio in seconds
 * @returns {Array} - Array of caption objects with text and timestamps
 */
export const generateCaptions = (text, duration) => {
  // Split text into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  // Calculate time per sentence
  const timePerSentence = duration / sentences.length;
  
  // Generate captions with timestamps
  return sentences.map((sentence, index) => {
    const startTime = index * timePerSentence;
    const endTime = (index + 1) * timePerSentence;
    
    return {
      text: sentence.trim(),
      startTime,
      endTime
    };
  });
};

/**
 * Format time in seconds to SRT format (HH:MM:SS,mmm)
 * @param {number} seconds - Time in seconds
 * @returns {string} - Formatted time
 */
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`;
};
