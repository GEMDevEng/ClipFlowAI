/**
 * Notifications routes
 */
const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabaseClient');

/**
 * @route   GET /api/notifications/user/:id
 * @desc    Get notifications for a user
 * @access  Private
 */
router.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 20, offset = 0 } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Get notifications for the user
    const { data, error, count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', id)
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    return res.status(200).json({
      notifications: data,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/notifications
 * @desc    Create a new notification
 * @access  Private
 */
router.post('/', async (req, res) => {
  try {
    const { userId, type, message, data } = req.body;
    
    if (!userId || !type || !message) {
      return res.status(400).json({ error: 'User ID, type, and message are required' });
    }
    
    // Create notification
    const { data: notificationData, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        message,
        data: data || {},
        read: false,
        created_at: new Date().toISOString()
      });
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    return res.status(201).json(notificationData);
  } catch (error) {
    console.error('Create notification error:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @route   PUT /api/notifications/:id
 * @desc    Mark a notification as read
 * @access  Private
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { read } = req.body;
    
    if (read === undefined) {
      return res.status(400).json({ error: 'Read status is required' });
    }
    
    // Update notification
    const { data, error } = await supabase
      .from('notifications')
      .update({ read, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Update notification error:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @route   PUT /api/notifications/user/:id/read-all
 * @desc    Mark all notifications as read for a user
 * @access  Private
 */
router.put('/user/:id/read-all', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Update all notifications for the user
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true, updated_at: new Date().toISOString() })
      .eq('user_id', id)
      .eq('read', false);
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    return res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete a notification
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete notification
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    return res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
