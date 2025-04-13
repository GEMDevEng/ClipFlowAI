const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

// Get all videos
router.get('/', videoController.getAllVideos);

// Get a single video
router.get('/:id', videoController.getVideoById);

// Create a new video
router.post('/', videoController.createVideo);

// Update a video
router.put('/:id', videoController.updateVideo);

// Delete a video
router.delete('/:id', videoController.deleteVideo);

// Generate a video from prompt
router.post('/generate', videoController.generateVideo);

module.exports = router;
