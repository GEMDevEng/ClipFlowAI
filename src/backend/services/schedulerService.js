/**
 * Scheduler Service
 * 
 * This service handles the scheduling of video publishing to social media platforms.
 */
const cron = require('node-cron');
const { supabase } = require('../config/supabaseClient');
const { publishToAllPlatforms } = require('./socialMediaPublisher');

// Store active tasks
const activeTasks = new Map();

/**
 * Initialize the scheduler
 * @returns {void}
 */
const initializeScheduler = () => {
  console.log('Initializing scheduler service...');
  
  // Schedule a task to run every minute to check for videos to publish
  const schedulerTask = cron.schedule('* * * * *', async () => {
    try {
      await checkScheduledVideos();
    } catch (error) {
      console.error('Error checking scheduled videos:', error);
    }
  });
  
  // Store the task
  activeTasks.set('scheduler', schedulerTask);
  
  console.log('Scheduler service initialized');
};

/**
 * Check for videos that need to be published
 * @returns {Promise<void>}
 */
const checkScheduledVideos = async () => {
  try {
    console.log('Checking for scheduled videos...');
    
    // Get current time
    const now = new Date();
    
    // Get videos that are scheduled to be published and the scheduled time is in the past
    const { data: videos, error } = await supabase
      .from('videos')
      .select('*')
      .eq('scheduled_publish', true)
      .lt('scheduled_publish_time', now.toISOString());
    
    if (error) {
      console.error('Error fetching scheduled videos:', error);
      return;
    }
    
    if (!videos || videos.length === 0) {
      console.log('No videos to publish');
      return;
    }
    
    console.log(`Found ${videos.length} videos to publish`);
    
    // Publish each video
    for (const video of videos) {
      try {
        await publishScheduledVideo(video);
      } catch (publishError) {
        console.error(`Error publishing video ${video.id}:`, publishError);
      }
    }
  } catch (error) {
    console.error('Error in checkScheduledVideos:', error);
  }
};

/**
 * Publish a scheduled video
 * @param {Object} video - The video to publish
 * @returns {Promise<void>}
 */
const publishScheduledVideo = async (video) => {
  try {
    console.log(`Publishing scheduled video: ${video.id}`);
    
    // Check if the video has platforms to publish to
    if (!video.scheduled_platforms || video.scheduled_platforms.length === 0) {
      console.log(`Video ${video.id} has no platforms to publish to`);
      
      // Update the video to mark it as no longer scheduled
      await supabase
        .from('videos')
        .update({
          scheduled_publish: false,
          scheduled_publish_time: null,
          scheduled_platforms: null,
          scheduled_options: null
        })
        .eq('id', video.id);
      
      return;
    }
    
    // Publish the video to the scheduled platforms
    const results = await publishToAllPlatforms(
      video,
      video.scheduled_platforms,
      video.scheduled_options || {}
    );
    
    console.log(`Published video ${video.id} to ${video.scheduled_platforms.join(', ')}`);
    
    // Update the video to mark it as published and no longer scheduled
    await supabase
      .from('videos')
      .update({
        scheduled_publish: false,
        scheduled_publish_time: null,
        scheduled_platforms: null,
        scheduled_options: null,
        published: true,
        published_at: new Date().toISOString(),
        published_platforms: video.scheduled_platforms
      })
      .eq('id', video.id);
    
    // Save the publishing results
    for (const result of results) {
      if (result.status === 'published') {
        await supabase
          .from('publishing_history')
          .insert({
            user_id: video.user_id,
            video_id: video.id,
            platform: result.platform,
            platform_video_id: result.platformVideoId,
            published_url: result.publishedUrl,
            published_at: result.publishedAt,
            status: result.status
          });
      }
    }
  } catch (error) {
    console.error(`Error publishing scheduled video ${video.id}:`, error);
    
    // Update the video to mark it as failed
    await supabase
      .from('videos')
      .update({
        scheduled_publish: false,
        scheduled_publish_time: null,
        scheduled_platforms: null,
        scheduled_options: null,
        publish_error: error.message
      })
      .eq('id', video.id);
  }
};

/**
 * Schedule a video for publishing
 * @param {string} videoId - The video ID
 * @param {Array<string>} platforms - The platforms to publish to
 * @param {string} scheduledTime - The time to publish the video (ISO string)
 * @param {Object} options - Additional options for publishing
 * @returns {Promise<Object>} - The updated video
 */
const scheduleVideo = async (videoId, platforms, scheduledTime, options = {}) => {
  try {
    console.log(`Scheduling video ${videoId} for publishing at ${scheduledTime}`);
    
    // Update the video in the database
    const { data, error } = await supabase
      .from('videos')
      .update({
        scheduled_publish: true,
        scheduled_publish_time: scheduledTime,
        scheduled_platforms: platforms,
        scheduled_options: options
      })
      .eq('id', videoId)
      .select()
      .single();
    
    if (error) {
      console.error(`Error scheduling video ${videoId}:`, error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`Error in scheduleVideo for ${videoId}:`, error);
    throw error;
  }
};

/**
 * Cancel a scheduled video
 * @param {string} videoId - The video ID
 * @returns {Promise<Object>} - The updated video
 */
const cancelScheduledVideo = async (videoId) => {
  try {
    console.log(`Canceling scheduled publishing for video ${videoId}`);
    
    // Update the video in the database
    const { data, error } = await supabase
      .from('videos')
      .update({
        scheduled_publish: false,
        scheduled_publish_time: null,
        scheduled_platforms: null,
        scheduled_options: null
      })
      .eq('id', videoId)
      .select()
      .single();
    
    if (error) {
      console.error(`Error canceling scheduled video ${videoId}:`, error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`Error in cancelScheduledVideo for ${videoId}:`, error);
    throw error;
  }
};

/**
 * Stop all scheduler tasks
 * @returns {void}
 */
const stopScheduler = () => {
  console.log('Stopping scheduler service...');
  
  // Stop all active tasks
  for (const [name, task] of activeTasks.entries()) {
    console.log(`Stopping task: ${name}`);
    task.stop();
  }
  
  // Clear the tasks map
  activeTasks.clear();
  
  console.log('Scheduler service stopped');
};

module.exports = {
  initializeScheduler,
  checkScheduledVideos,
  publishScheduledVideo,
  scheduleVideo,
  cancelScheduledVideo,
  stopScheduler
};
