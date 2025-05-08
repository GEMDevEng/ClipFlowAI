import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

// Create FFmpeg instance
const ffmpeg = new FFmpeg();
const config = {
  log: true
};

// Load FFmpeg
let ffmpegLoaded = false;
const loadFFmpeg = async () => {
  if (!ffmpegLoaded) {
    await ffmpeg.load(config);
    ffmpegLoaded = true;
    console.log('FFmpeg loaded');
  }
  return ffmpeg;
};

/**
 * Generate a video using RunwayML and process it with FFmpeg
 * @param {File} imageFile - Background image for the video
 * @param {File} audioFile - Audio file for the video
 * @param {Array} captions - Array of caption objects with text and timestamps
 * @param {Object} options - Additional options for video generation
 * @returns {Promise<Object>} - The generated video data including URL and metadata
 */
export const generateVideo = async (
  imageFile,
  audioFile,
  captions,
  options = {}
) => {
  try {
    const {
      title = 'Untitled Video',
      prompt = '',
      music = 'default',
      voiceProfile = 'default',
      language = 'en-US',
      script = '',
      subtitles = ''
    } = options;

    console.log('Starting video generation process...');

    // Step 1: Process the audio and image locally using FFmpeg
    console.log('Processing audio and image with FFmpeg...');
    const processedVideoBlob = await processVideoLocally(imageFile, audioFile, captions, music);

    // Step 2: Upload the processed video to a temporary storage
    console.log('Uploading processed video...');
    const processedVideoFile = new File([processedVideoBlob], `${title.replace(/\s+/g, '-')}_processed.mp4`, { type: 'video/mp4' });
    const processedVideoUrl = await uploadToTempStorage(processedVideoFile);

    // Step 3: Generate the final video using RunwayML API
    console.log('Generating final video with RunwayML...');
    const videoData = await callRunwayMLAPI(prompt, title, {
      music,
      voiceProfile,
      language,
      script: script || prompt,
      subtitles: subtitles || '',
      processedVideoUrl
    });

    return videoData;
  } catch (error) {
    console.error('Error in video generation process:', error);
    throw new Error(`Video generation failed: ${error.message}`);
  }
};

/**
 * Process video locally using FFmpeg
 * @param {File} imageFile - Background image for the video
 * @param {File} audioFile - Audio file for the video
 * @param {Array} captions - Array of caption objects with text and timestamps
 * @param {string} musicOption - Music option (default, upbeat, relaxed, dramatic, none)
 * @returns {Promise<Blob>} - The processed video as a Blob
 */
const processVideoLocally = async (imageFile, audioFile, captions, musicOption = 'default') => {
  try {
    // Load FFmpeg
    const ffmpeg = await loadFFmpeg();

    // Write files to memory
    ffmpeg.FS('writeFile', 'background.jpg', await fetchFile(imageFile));
    ffmpeg.FS('writeFile', 'audio.mp3', await fetchFile(audioFile));

    // Handle background music based on selected option
    let musicFile = null;
    if (musicOption !== 'none') {
      // Map of music options to actual music files
      const musicUrls = {
        'default': '/assets/music/default.mp3',
        'upbeat': '/assets/music/upbeat.mp3',
        'relaxed': '/assets/music/relaxed.mp3',
        'dramatic': '/assets/music/dramatic.mp3'
      };

      try {
        // Fetch the music file
        const musicUrl = musicUrls[musicOption] || musicUrls['default'];
        const musicResponse = await fetch(musicUrl);
        const musicData = await musicResponse.arrayBuffer();

        ffmpeg.FS('writeFile', 'music.mp3', new Uint8Array(musicData));
        musicFile = 'music.mp3';
      } catch (error) {
        console.error('Error loading music file:', error);
        // Create a silent audio file as fallback
        const silentAudio = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
        ffmpeg.FS('writeFile', 'music.mp3', silentAudio);
        musicFile = 'music.mp3';
      }
    }

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

    // Generate video with image, audio, subtitles, and optional background music
    if (musicFile) {
      // With background music - mix the voiceover and music
      await ffmpeg.run(
        '-loop', '1',
        '-i', 'background.jpg',
        '-i', 'audio.mp3',  // Voiceover
        '-i', musicFile,    // Background music
        '-filter_complex', '[1:a]volume=1.0[a1];[2:a]volume=0.3[a2];[a1][a2]amix=inputs=2:duration=longest[aout]',
        '-map', '0:v',
        '-map', '[aout]',
        '-vf', 'subtitles=subtitles.srt:force_style=\'FontSize=24,PrimaryColour=&HFFFFFF&,OutlineColour=&H000000&,BorderStyle=3\'',
        '-c:v', 'libx264',
        '-tune', 'stillimage',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-pix_fmt', 'yuv420p',
        '-shortest',
        'output.mp4'
      );
    } else {
      // Without background music - just use the voiceover
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
    }

    // Read the result
    const data = ffmpeg.FS('readFile', 'output.mp4');

    // Create a Blob from the data
    return new Blob([data.buffer], { type: 'video/mp4' });
  } catch (error) {
    console.error('Error processing video locally:', error);
    throw new Error(`Local video processing failed: ${error.message}`);
  }
};

/**
 * Upload a file to temporary storage
 * @param {File} file - The file to upload
 * @returns {Promise<string>} - The URL of the uploaded file
 */
const uploadToTempStorage = async (file) => {
  try {
    // In a real implementation, you would upload the file to a storage service
    // For now, we'll create a mock URL

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return a mock URL
    return URL.createObjectURL(file);
  } catch (error) {
    console.error('Error uploading to temp storage:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

/**
 * Call RunwayML API to generate a video
 * @param {string} prompt - The text prompt for video generation
 * @param {string} title - The title of the video
 * @param {Object} options - Additional options for video generation
 * @returns {Promise<Object>} - The generated video data
 */
const callRunwayMLAPI = async (prompt, title, options = {}) => {
  try {
    // In a real implementation, you would make an API call to your backend
    // which would then call the RunwayML API

    // For now, we'll simulate the API call
    console.log(`Calling RunwayML API with prompt: ${prompt}`);
    console.log('Options:', options);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Return mock video data
    return {
      title,
      prompt,
      status: 'completed',
      duration: Math.floor(Math.random() * 30) + 30, // Random duration between 30-60 seconds
      videoUrl: options.processedVideoUrl || 'https://example.com/video.mp4',
      thumbnailUrl: 'https://example.com/thumbnail.jpg',
      createdAt: new Date().toISOString(),
      publishedAt: null, // Not published yet
      options
    };
  } catch (error) {
    console.error('Error calling RunwayML API:', error);
    throw new Error(`RunwayML API call failed: ${error.message}`);
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

    console.log('Transcribing audio file:', audioFile.name);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For now, we'll just return a mock result
    return "This is a mock transcription of the audio file.";
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error(`Audio transcription failed: ${error.message}`);
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
