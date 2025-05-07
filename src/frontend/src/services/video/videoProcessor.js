import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

/**
 * Video processing service using FFmpeg
 */

// Initialize FFmpeg
let ffmpeg = null;

/**
 * Initialize FFmpeg
 * @returns {Promise<void>}
 */
export const initFFmpeg = async () => {
  if (ffmpeg) return;
  
  ffmpeg = createFFmpeg({
    log: process.env.NODE_ENV === 'development',
    corePath: 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/ffmpeg-core.js',
  });
  
  await ffmpeg.load();
  console.log('FFmpeg loaded');
};

/**
 * Generate a thumbnail from a video
 * @param {File} videoFile - Video file
 * @param {number} timeInSeconds - Time in seconds to capture thumbnail
 * @returns {Promise<Blob>} - Thumbnail blob
 */
export const generateThumbnail = async (videoFile, timeInSeconds = 0) => {
  try {
    if (!ffmpeg) await initFFmpeg();
    
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
    throw error;
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
    if (!ffmpeg) await initFFmpeg();
    
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
    throw error;
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
    if (!ffmpeg) await initFFmpeg();
    
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
    throw error;
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
    if (!ffmpeg) await initFFmpeg();
    
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
    throw error;
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
    if (!ffmpeg) await initFFmpeg();
    
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
    throw error;
  }
};
