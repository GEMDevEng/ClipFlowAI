/**
 * Video routes
 */

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const videoController = require('../controllers/videoController');

// Get all videos for a user
router.get('/', verifyToken, videoController.getAllVideos);

// Get a video by ID
router.get('/:id', verifyToken, videoController.getVideoById);

// Create a new video
router.post('/', verifyToken, videoController.createVideo);

// Update a video
router.put('/:id', verifyToken, videoController.updateVideo);

// Delete a video
router.delete('/:id', verifyToken, videoController.deleteVideo);

// Upload a video file
router.post('/upload', verifyToken, videoController.uploadVideo);

// Process a video
router.post('/:id/process', verifyToken, videoController.processVideo);

// Publish a video to platforms
router.post('/:id/publish', verifyToken, videoController.publishVideo);

// Get video analytics
router.get('/:id/analytics', verifyToken, videoController.getVideoAnalytics);

module.exports = router;
