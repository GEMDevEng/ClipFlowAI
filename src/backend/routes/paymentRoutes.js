/**
 * Payment routes
 */
const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabaseClient');
const paymentController = require('../controllers/paymentController');

/**
 * @route   POST /api/payment/create-payment-intent
 * @desc    Create a payment intent
 * @access  Private
 */
router.post('/create-payment-intent', paymentController.createPaymentIntent);

/**
 * @route   POST /api/payment/create-checkout-session
 * @desc    Create a checkout session
 * @access  Private
 */
router.post('/create-checkout-session', paymentController.createCheckoutSession);

/**
 * @route   POST /api/payment/create-subscription
 * @desc    Create a subscription
 * @access  Private
 */
router.post('/create-subscription', paymentController.createSubscription);

/**
 * @route   POST /api/payment/create-customer
 * @desc    Create a customer
 * @access  Private
 */
router.post('/create-customer', paymentController.createCustomer);

/**
 * @route   POST /api/payment/webhook
 * @desc    Handle webhook events from Stripe
 * @access  Public
 */
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

/**
 * @route   GET /api/payment/plans
 * @desc    Get available plans
 * @access  Public
 */
router.get('/plans', async (req, res) => {
  try {
    // In a real implementation, this would fetch plans from the database
    // For now, we'll return mock data

    const plans = [
      {
        id: 'plan_basic',
        name: 'Basic',
        description: 'Basic plan with limited features',
        price: 9.99,
        features: [
          'Up to 10 videos per month',
          'Basic analytics',
          'Standard quality'
        ]
      },
      {
        id: 'plan_pro',
        name: 'Pro',
        description: 'Professional plan with advanced features',
        price: 19.99,
        features: [
          'Unlimited videos',
          'Advanced analytics',
          'HD quality',
          'Priority support'
        ]
      },
      {
        id: 'plan_enterprise',
        name: 'Enterprise',
        description: 'Enterprise plan with all features',
        price: 49.99,
        features: [
          'Unlimited videos',
          'Full analytics suite',
          '4K quality',
          '24/7 support',
          'Custom branding',
          'Team collaboration'
        ]
      }
    ];

    return res.status(200).json(plans);
  } catch (error) {
    console.error('Get plans error:', error);
    return res.status(500).json({ error: 'Server error fetching plans' });
  }
});

/**
 * @route   GET /api/payment/subscription/:userId
 * @desc    Get user subscription
 * @access  Private
 */
router.get('/subscription/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // In a real implementation, this would fetch the subscription from the database
    // For now, we'll return mock data

    const subscription = {
      id: 'sub123',
      userId,
      planId: 'plan_pro',
      status: 'active',
      currentPeriodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false
    };

    return res.status(200).json(subscription);
  } catch (error) {
    console.error('Get subscription error:', error);
    return res.status(500).json({ error: 'Server error fetching subscription' });
  }
});

module.exports = router;
