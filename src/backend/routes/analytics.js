/**
 * Analytics routes
 */
const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabaseClient');

/**
 * @route   GET /api/analytics/video/:id
 * @desc    Get analytics for a specific video
 * @access  Private
 */
router.get('/video/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Video ID is required' });
    }
    
    // Get analytics data for the video
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('video_id', id)
      .order('date', { ascending: false });
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    // Process data to get totals and trends
    const totals = {
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0
    };
    
    const platformData = {};
    
    data.forEach(record => {
      totals.views += record.views || 0;
      totals.likes += record.likes || 0;
      totals.shares += record.shares || 0;
      totals.comments += record.comments || 0;
      
      if (!platformData[record.platform]) {
        platformData[record.platform] = {
          views: 0,
          likes: 0,
          shares: 0,
          comments: 0
        };
      }
      
      platformData[record.platform].views += record.views || 0;
      platformData[record.platform].likes += record.likes || 0;
      platformData[record.platform].shares += record.shares || 0;
      platformData[record.platform].comments += record.comments || 0;
    });
    
    return res.status(200).json({
      totals,
      platformData,
      records: data
    });
  } catch (error) {
    console.error('Get video analytics error:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/analytics/user/:id
 * @desc    Get analytics for a specific user
 * @access  Private
 */
router.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { period } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Define date range based on period
    let startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30); // Default to 30 days
    }
    
    // Get analytics data for the user
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('user_id', id)
      .gte('date', startDate.toISOString())
      .order('date', { ascending: false });
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    // Process data to get totals and trends
    const totals = {
      views: 0,
      likes: 0,
      shares: 0,
      comments: 0,
      videos: new Set()
    };
    
    const platformData = {};
    const dailyData = {};
    
    data.forEach(record => {
      totals.views += record.views || 0;
      totals.likes += record.likes || 0;
      totals.shares += record.shares || 0;
      totals.comments += record.comments || 0;
      totals.videos.add(record.video_id);
      
      // Platform breakdown
      if (!platformData[record.platform]) {
        platformData[record.platform] = {
          views: 0,
          likes: 0,
          shares: 0,
          comments: 0
        };
      }
      
      platformData[record.platform].views += record.views || 0;
      platformData[record.platform].likes += record.likes || 0;
      platformData[record.platform].shares += record.shares || 0;
      platformData[record.platform].comments += record.comments || 0;
      
      // Daily breakdown
      const date = record.date.split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = {
          views: 0,
          likes: 0,
          shares: 0,
          comments: 0
        };
      }
      
      dailyData[date].views += record.views || 0;
      dailyData[date].likes += record.likes || 0;
      dailyData[date].shares += record.shares || 0;
      dailyData[date].comments += record.comments || 0;
    });
    
    return res.status(200).json({
      totals: {
        ...totals,
        videos: totals.videos.size
      },
      platformData,
      dailyData,
      period
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
