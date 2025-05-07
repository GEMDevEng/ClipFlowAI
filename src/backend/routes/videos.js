/**
 * Video routes
 */
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { supabase } = require('../config/supabaseClient');
const { processVideo } = require('../services/videoProcessor');
const { publishToAllPlatforms } = require('../services/socialMediaPublisher');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /mp4|mov|avi|wmv|flv|mkv/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only video files are allowed'));
  }
});

/**
 * @route   POST /api/videos/upload
 * @desc    Upload a new video
 * @access  Private
 */
router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    const { title, description, userId } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Upload to Supabase storage
    const fileStream = fs.createReadStream(file.path);
    const fileName = `${userId}/${Date.now()}-${path.basename(file.originalname)}`;
    
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(fileName, fileStream, {
        contentType: file.mimetype,
        cacheControl: '3600'
      });
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('videos')
      .getPublicUrl(data.path);
    
    // Create video record in database
    const { data: videoData, error: videoError } = await supabase
      .from('videos')
      .insert({
        title: title || 'Untitled Video',
        description: description || '',
        user_id: userId,
        original_url: urlData.publicUrl,
        status: 'pending',
        created_at: new Date().toISOString()
      });
    
    if (videoError) {
      return res.status(500).json({ error: videoError.message });
    }
    
    // Clean up local file
    fs.unlink(file.path, (err) => {
      if (err) console.error('Error deleting local file:', err);
    });
    
    return res.status(200).json(videoData);
  } catch (error) {
    console.error('Video upload error:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/videos/process
 * @desc    Process a video
 * @access  Private
 */
router.post('/process', async (req, res) => {
  try {
    const { videoId } = req.body;
    
    if (!videoId) {
      return res.status(400).json({ error: 'Video ID is required' });
    }
    
    const processedVideo = await processVideo(videoId);
    
    return res.status(200).json(processedVideo);
  } catch (error) {
    console.error('Video processing error:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/videos/publish
 * @desc    Publish a video to social media platforms
 * @access  Private
 */
router.post('/publish', async (req, res) => {
  try {
    const { videoId, platforms } = req.body;
    
    if (!videoId) {
      return res.status(400).json({ error: 'Video ID is required' });
    }
    
    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return res.status(400).json({ error: 'At least one platform is required' });
    }
    
    // Get video data
    const { data: videoData, error: videoError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();
    
    if (videoError) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    // Publish to platforms
    const results = await publishToAllPlatforms(videoData, platforms);
    
    // Update video status
    await supabase
      .from('videos')
      .update({
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', videoId);
    
    return res.status(200).json(results);
  } catch (error) {
    console.error('Video publishing error:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/videos/:id
 * @desc    Get a video by ID
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get video data
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        platforms (*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Get video error:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
