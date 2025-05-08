/**
 * Stripe Payment Service
 * 
 * This service handles all interactions with the Stripe API for payment processing.
 */

const Stripe = require('stripe');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Stripe with the API key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create a product in Stripe
 * @param {string} name - The name of the product
 * @param {string} description - The description of the product
 * @returns {Promise<Object>} - The created product
 */
const createProduct = async (name, description) => {
  try {
    const product = await stripe.products.create({
      name,
      description,
    });
    
    return product;
  } catch (error) {
    console.error('Error creating Stripe product:', error.message);
    throw new Error(`Failed to create Stripe product: ${error.message}`);
  }
};

/**
 * Create a price for a product in Stripe
 * @param {string} productId - The ID of the product
 * @param {number} amount - The price amount in cents
 * @param {string} currency - The currency of the price (e.g., 'usd')
 * @param {Object} options - Additional options for the price
 * @returns {Promise<Object>} - The created price
 */
const createPrice = async (productId, amount, currency = 'usd', options = {}) => {
  try {
    const price = await stripe.prices.create({
      product: productId,
      unit_amount: amount,
      currency,
      ...options
    });
    
    return price;
  } catch (error) {
    console.error('Error creating Stripe price:', error.message);
    throw new Error(`Failed to create Stripe price: ${error.message}`);
  }
};

/**
 * Create a payment intent in Stripe
 * @param {number} amount - The amount to charge in cents
 * @param {string} currency - The currency to charge in (e.g., 'usd')
 * @param {Object} metadata - Additional metadata for the payment intent
 * @returns {Promise<Object>} - The created payment intent
 */
const createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
      payment_method_types: ['card'],
    });
    
    return paymentIntent;
  } catch (error) {
    console.error('Error creating Stripe payment intent:', error.message);
    throw new Error(`Failed to create Stripe payment intent: ${error.message}`);
  }
};

/**
 * Create a checkout session in Stripe
 * @param {Array} lineItems - The items to include in the checkout
 * @param {string} successUrl - The URL to redirect to on successful payment
 * @param {string} cancelUrl - The URL to redirect to on cancelled payment
 * @param {string} mode - The mode of the checkout (payment, subscription, setup)
 * @param {Object} metadata - Additional metadata for the checkout session
 * @returns {Promise<Object>} - The created checkout session
 */
const createCheckoutSession = async (lineItems, successUrl, cancelUrl, mode = 'payment', metadata = {}) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
    });
    
    return session;
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error.message);
    throw new Error(`Failed to create Stripe checkout session: ${error.message}`);
  }
};

/**
 * Retrieve a payment intent from Stripe
 * @param {string} paymentIntentId - The ID of the payment intent
 * @returns {Promise<Object>} - The payment intent
 */
const retrievePaymentIntent = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('Error retrieving Stripe payment intent:', error.message);
    throw new Error(`Failed to retrieve Stripe payment intent: ${error.message}`);
  }
};

/**
 * Create a subscription in Stripe
 * @param {string} customerId - The ID of the customer
 * @param {string} priceId - The ID of the price
 * @param {Object} options - Additional options for the subscription
 * @returns {Promise<Object>} - The created subscription
 */
const createSubscription = async (customerId, priceId, options = {}) => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      ...options
    });
    
    return subscription;
  } catch (error) {
    console.error('Error creating Stripe subscription:', error.message);
    throw new Error(`Failed to create Stripe subscription: ${error.message}`);
  }
};

/**
 * Create a customer in Stripe
 * @param {string} email - The email of the customer
 * @param {string} name - The name of the customer
 * @param {Object} metadata - Additional metadata for the customer
 * @returns {Promise<Object>} - The created customer
 */
const createCustomer = async (email, name, metadata = {}) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata,
    });
    
    return customer;
  } catch (error) {
    console.error('Error creating Stripe customer:', error.message);
    throw new Error(`Failed to create Stripe customer: ${error.message}`);
  }
};

/**
 * Verify a webhook signature from Stripe
 * @param {string} payload - The raw request payload
 * @param {string} signature - The signature from the Stripe-Signature header
 * @returns {Object} - The verified event
 */
const verifyWebhookSignature = (payload, signature) => {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    return event;
  } catch (error) {
    console.error('Error verifying Stripe webhook signature:', error.message);
    throw new Error(`Failed to verify Stripe webhook signature: ${error.message}`);
  }
};

module.exports = {
  createProduct,
  createPrice,
  createPaymentIntent,
  createCheckoutSession,
  retrievePaymentIntent,
  createSubscription,
  createCustomer,
  verifyWebhookSignature,
};
