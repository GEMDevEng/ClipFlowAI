import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

/**
 * Video processing service using FFmpeg
 * This service handles all video processing operations on the client side
 */

// Initialize FFmpeg
let ffmpeg = null;
let ffmpegLoaded = false;

/**
 * Initialize FFmpeg
 * @returns {Promise<object>} - FFmpeg instance
 */
export const initFFmpeg = async () => {
  if (ffmpegLoaded) return ffmpeg;

  try {
    ffmpeg = createFFmpeg({
      log: process.env.NODE_ENV === 'development',
      corePath: 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/ffmpeg-core.js',
    });

    await ffmpeg.load();
    ffmpegLoaded = true;
    console.log('FFmpeg loaded successfully');
    return ffmpeg;
  } catch (error) {
    console.error('Error loading FFmpeg:', error);
    throw new Error('Failed to load FFmpeg. Please check your internet connection and try again.');
  }
};

/**
 * Generate a thumbnail from a video
 * @param {File} videoFile - Video file
 * @param {number} timeInSeconds - Time in seconds to capture thumbnail
 * @returns {Promise<Blob>} - Thumbnail blob
 */
export const generateThumbnail = async (videoFile, timeInSeconds = 0) => {
  try {
    if (!ffmpegLoaded) await initFFmpeg();

    const inputFileName = 'input.mp4';
    const outputFileName = 'thumbnail.jpg';

    // Write the video file to memory
    ffmpeg.FS('writeFile', inputFileName, await fetchFile(videoFile));

    // Generate thumbnail
    await ffmpeg.run(
      '-i', inputFileName,
      '-ss', `${timeInSeconds}`,
      '-frames:v', '1',
      outputFileName
    );

    // Read the thumbnail file
    const data = ffmpeg.FS('readFile', outputFileName);

    // Create a blob from the data
    const blob = new Blob([data.buffer], { type: 'image/jpeg' });

    // Clean up
    ffmpeg.FS('unlink', inputFileName);
    ffmpeg.FS('unlink', outputFileName);

    return blob;
  } catch (error) {
    console.error('Generate thumbnail error:', error);
    throw new Error(`Thumbnail generation failed: ${error.message}`);
  }
};

/**
 * Trim a video
 * @param {File} videoFile - Video file
 * @param {number} startTime - Start time in seconds
 * @param {number} duration - Duration in seconds
 * @returns {Promise<Blob>} - Trimmed video blob
 */
export const trimVideo = async (videoFile, startTime, duration) => {
  try {
    if (!ffmpegLoaded) await initFFmpeg();

    const inputFileName = 'input.mp4';
    const outputFileName = 'output.mp4';

    // Write the video file to memory
    ffmpeg.FS('writeFile', inputFileName, await fetchFile(videoFile));

    // Trim video
    await ffmpeg.run(
      '-i', inputFileName,
      '-ss', `${startTime}`,
      '-t', `${duration}`,
      '-c', 'copy',
      outputFileName
    );

    // Read the output file
    const data = ffmpeg.FS('readFile', outputFileName);

    // Create a blob from the data
    const blob = new Blob([data.buffer], { type: 'video/mp4' });

    // Clean up
    ffmpeg.FS('unlink', inputFileName);
    ffmpeg.FS('unlink', outputFileName);

    return blob;
  } catch (error) {
    console.error('Trim video error:', error);
    throw new Error(`Video trimming failed: ${error.message}`);
  }
};

/**
 * Add subtitles to a video
 * @param {File} videoFile - Video file
 * @param {string} subtitlesText - Subtitles in SRT format
 * @returns {Promise<Blob>} - Video with subtitles blob
 */
export const addSubtitles = async (videoFile, subtitlesText) => {
  try {
    if (!ffmpegLoaded) await initFFmpeg();

    const inputFileName = 'input.mp4';
    const subtitlesFileName = 'subtitles.srt';
    const outputFileName = 'output.mp4';

    // Write the video file to memory
    ffmpeg.FS('writeFile', inputFileName, await fetchFile(videoFile));

    // Write the subtitles file to memory
    ffmpeg.FS('writeFile', subtitlesFileName, new TextEncoder().encode(subtitlesText));

    // Add subtitles
    await ffmpeg.run(
      '-i', inputFileName,
      '-vf', `subtitles=${subtitlesFileName}`,
      '-c:a', 'copy',
      outputFileName
    );

    // Read the output file
    const data = ffmpeg.FS('readFile', outputFileName);

    // Create a blob from the data
    const blob = new Blob([data.buffer], { type: 'video/mp4' });

    // Clean up
    ffmpeg.FS('unlink', inputFileName);
    ffmpeg.FS('unlink', subtitlesFileName);
    ffmpeg.FS('unlink', outputFileName);

    return blob;
  } catch (error) {
    console.error('Add subtitles error:', error);
    throw new Error(`Adding subtitles failed: ${error.message}`);
  }
};

/**
 * Merge video and audio
 * @param {File} videoFile - Video file
 * @param {File} audioFile - Audio file
 * @returns {Promise<Blob>} - Merged video blob
 */
export const mergeVideoAndAudio = async (videoFile, audioFile) => {
  try {
    if (!ffmpegLoaded) await initFFmpeg();

    const videoFileName = 'input.mp4';
    const audioFileName = 'audio.mp3';
    const outputFileName = 'output.mp4';

    // Write the files to memory
    ffmpeg.FS('writeFile', videoFileName, await fetchFile(videoFile));
    ffmpeg.FS('writeFile', audioFileName, await fetchFile(audioFile));

    // Merge video and audio
    await ffmpeg.run(
      '-i', videoFileName,
      '-i', audioFileName,
      '-c:v', 'copy',
      '-map', '0:v:0',
      '-map', '1:a:0',
      outputFileName
    );

    // Read the output file
    const data = ffmpeg.FS('readFile', outputFileName);

    // Create a blob from the data
    const blob = new Blob([data.buffer], { type: 'video/mp4' });

    // Clean up
    ffmpeg.FS('unlink', videoFileName);
    ffmpeg.FS('unlink', audioFileName);
    ffmpeg.FS('unlink', outputFileName);

    return blob;
  } catch (error) {
    console.error('Merge video and audio error:', error);
    throw new Error(`Merging video and audio failed: ${error.message}`);
  }
};

/**
 * Resize video for a specific platform
 * @param {File} videoFile - Video file
 * @param {string} platform - Platform name
 * @returns {Promise<Blob>} - Resized video blob
 */
export const resizeVideoForPlatform = async (videoFile, platform) => {
  try {
    if (!ffmpegLoaded) await initFFmpeg();

    const inputFileName = 'input.mp4';
    const outputFileName = 'output.mp4';

    // Write the video file to memory
    ffmpeg.FS('writeFile', inputFileName, await fetchFile(videoFile));

    // Set dimensions based on platform
    let dimensions = '1080:1920'; // Default to vertical (9:16)

    switch (platform.toLowerCase()) {
      case 'youtube':
        dimensions = '1920:1080'; // 16:9
        break;
      case 'instagram':
      case 'tiktok':
        dimensions = '1080:1920'; // 9:16
        break;
      case 'facebook':
        dimensions = '1280:720'; // 16:9
        break;
      case 'twitter':
        dimensions = '1280:720'; // 16:9
        break;
      default:
        dimensions = '1080:1920'; // Default to vertical (9:16)
    }

    // Resize video
    await ffmpeg.run(
      '-i', inputFileName,
      '-vf', `scale=${dimensions}:force_original_aspect_ratio=decrease,pad=${dimensions}:(ow-iw)/2:(oh-ih)/2`,
      '-c:a', 'copy',
      outputFileName
    );

    // Read the output file
    const data = ffmpeg.FS('readFile', outputFileName);

    // Create a blob from the data
    const blob = new Blob([data.buffer], { type: 'video/mp4' });

    // Clean up
    ffmpeg.FS('unlink', inputFileName);
    ffmpeg.FS('unlink', outputFileName);

    return blob;
  } catch (error) {
    console.error('Resize video error:', error);
    throw new Error(`Video resizing failed: ${error.message}`);
  }
};

/**
 * Generate a video from text prompt
 * @param {object} options - Video generation options
 * @param {File} options.imageFile - Background image for the video
 * @param {File} options.audioFile - Audio file for the video (voiceover)
 * @param {string} options.subtitlesText - Subtitles in SRT format
 * @param {string} options.musicOption - Background music option (default, upbeat, relaxed, dramatic, none)
 * @param {Function} options.onProgress - Progress callback function
 * @returns {Promise<Blob>} - The generated video as a Blob
 */
export const generateVideo = async ({
  imageFile,
  audioFile,
  subtitlesText,
  musicOption = 'default',
  onProgress = () => {}
}) => {
  try {
    // Load FFmpeg if not already loaded
    if (!ffmpegLoaded) {
      await initFFmpeg();
    }

    // Report progress
    onProgress(10, 'Preparing files...');

    // Write files to memory
    ffmpeg.FS('writeFile', 'background.jpg', await fetchFile(imageFile));
    ffmpeg.FS('writeFile', 'audio.mp3', await fetchFile(audioFile));

    // Write subtitles file
    ffmpeg.FS('writeFile', 'subtitles.srt', new TextEncoder().encode(subtitlesText));

    onProgress(30, 'Processing audio...');

    // Determine background music file based on option
    let musicFile = null;
    if (musicOption !== 'none') {
      // In a real implementation, we would have different music files
      // For now, we'll use a placeholder approach
      musicFile = `music_${musicOption}.mp3`;

      // In a production app, these would be actual music files stored in the app
      // For this implementation, we'll simulate having the music files
      const musicData = new Uint8Array(8); // Placeholder
      ffmpeg.FS('writeFile', musicFile, musicData);
    }

    onProgress(50, 'Generating video...');

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

    onProgress(90, 'Finalizing video...');

    // Read the result
    const data = ffmpeg.FS('readFile', 'output.mp4');

    // Clean up files
    ffmpeg.FS('unlink', 'background.jpg');
    ffmpeg.FS('unlink', 'audio.mp3');
    ffmpeg.FS('unlink', 'subtitles.srt');
    if (musicFile) {
      ffmpeg.FS('unlink', musicFile);
    }
    ffmpeg.FS('unlink', 'output.mp4');

    onProgress(100, 'Video generated successfully!');

    // Create a Blob from the data
    return new Blob([data.buffer], { type: 'video/mp4' });
  } catch (error) {
    console.error('Error generating video:', error);
    throw new Error(`Video generation failed: ${error.message}`);
  }
};

/**
 * Generate captions from audio
 * @param {File} audioFile - Audio file
 * @returns {Promise<string>} - Captions in SRT format
 */
export const generateCaptions = async (audioFile) => {
  // In a real implementation, this would use a speech-to-text service
  // For now, we'll return mock captions
  return `1
00:00:00,000 --> 00:00:03,000
This is the first caption

2
00:00:03,000 --> 00:00:06,000
This is the second caption

3
00:00:06,000 --> 00:00:09,000
This is the third caption`;
};

// Default export for easier importing
export default {
  initFFmpeg,
  generateVideo,
  generateThumbnail,
  trimVideo,
  addSubtitles,
  mergeVideoAndAudio,
  resizeVideoForPlatform,
  generateCaptions
};
