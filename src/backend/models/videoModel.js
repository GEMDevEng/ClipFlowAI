const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  prompt: {
    type: String,
    required: [true, 'Prompt is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  videoUrl: {
    type: String,
    trim: true
  },
  thumbnailUrl: {
    type: String,
    trim: true
  },
  duration: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  publishedAt: {
    type: Date
  },
  platforms: [{
    name: {
      type: String,
      enum: ['tiktok', 'instagram', 'youtube'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'published', 'failed'],
      default: 'pending'
    },
    publishedUrl: {
      type: String,
      trim: true
    },
    publishedAt: {
      type: Date
    }
  }]
});

module.exports = mongoose.model('Video', videoSchema);
