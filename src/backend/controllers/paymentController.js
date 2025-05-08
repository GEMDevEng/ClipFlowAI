/**
 * Payment Controller
 * 
 * This controller handles all payment-related requests.
 */

const stripeService = require('../services/stripeService');

/**
 * Create a payment intent
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }
    
    const paymentIntent = await stripeService.createPaymentIntent(amount, currency, metadata);
    
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};

/**
 * Create a checkout session
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const createCheckoutSession = async (req, res) => {
  try {
    const { 
      lineItems, 
      successUrl, 
      cancelUrl, 
      mode = 'payment', 
      metadata = {} 
    } = req.body;
    
    if (!lineItems || !successUrl || !cancelUrl) {
      return res.status(400).json({ 
        error: 'Line items, success URL, and cancel URL are required' 
      });
    }
    
    const session = await stripeService.createCheckoutSession(
      lineItems, 
      successUrl, 
      cancelUrl, 
      mode, 
      metadata
    );
    
    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

/**
 * Create a subscription
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const createSubscription = async (req, res) => {
  try {
    const { customerId, priceId, options = {} } = req.body;
    
    if (!customerId || !priceId) {
      return res.status(400).json({ error: 'Customer ID and price ID are required' });
    }
    
    const subscription = await stripeService.createSubscription(customerId, priceId, options);
    
    res.status(200).json({ subscription });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
};

/**
 * Create a customer
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const createCustomer = async (req, res) => {
  try {
    const { email, name, metadata = {} } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const customer = await stripeService.createCustomer(email, name, metadata);
    
    res.status(200).json({ customer });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

/**
 * Handle webhook events from Stripe
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    
    if (!signature) {
      return res.status(400).json({ error: 'Stripe signature is required' });
    }
    
    const event = stripeService.verifyWebhookSignature(req.rawBody, signature);
    
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent ${paymentIntent.id} succeeded`);
        // Update your database, send confirmation email, etc.
        break;
        
      case 'payment_intent.payment_failed':
        // Handle failed payment
        const failedPaymentIntent = event.data.object;
        console.log(`PaymentIntent ${failedPaymentIntent.id} failed`);
        // Update your database, notify the user, etc.
        break;
        
      case 'checkout.session.completed':
        // Handle completed checkout session
        const session = event.data.object;
        console.log(`Checkout session ${session.id} completed`);
        // Fulfill the order, update your database, etc.
        break;
        
      case 'customer.subscription.created':
        // Handle subscription creation
        const subscription = event.data.object;
        console.log(`Subscription ${subscription.id} created`);
        // Update your database, provision access, etc.
        break;
        
      case 'customer.subscription.updated':
        // Handle subscription update
        const updatedSubscription = event.data.object;
        console.log(`Subscription ${updatedSubscription.id} updated`);
        // Update your database, adjust access, etc.
        break;
        
      case 'customer.subscription.deleted':
        // Handle subscription deletion
        const deletedSubscription = event.data.object;
        console.log(`Subscription ${deletedSubscription.id} deleted`);
        // Update your database, revoke access, etc.
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
};

module.exports = {
  createPaymentIntent,
  createCheckoutSession,
  createSubscription,
  createCustomer,
  handleWebhook
};
