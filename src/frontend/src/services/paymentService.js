/**
 * Payment Service
 * 
 * This service handles all payment-related operations.
 */

import axios from 'axios';

/**
 * Create a payment intent
 * @param {number} amount - The amount to charge in cents
 * @param {string} currency - The currency to charge in (e.g., 'usd')
 * @param {Object} metadata - Additional metadata for the payment intent
 * @returns {Promise<Object>} - The payment intent client secret
 */
export const createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
  try {
    const response = await axios.post('/api/payment/create-payment-intent', {
      amount,
      currency,
      metadata
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error(error.response?.data?.error || 'Failed to create payment intent');
  }
};

/**
 * Create a checkout session
 * @param {Array} lineItems - The items to include in the checkout
 * @param {string} successUrl - The URL to redirect to on successful payment
 * @param {string} cancelUrl - The URL to redirect to on cancelled payment
 * @param {string} mode - The mode of the checkout (payment, subscription, setup)
 * @param {Object} metadata - Additional metadata for the checkout session
 * @returns {Promise<Object>} - The checkout session ID and URL
 */
export const createCheckoutSession = async (lineItems, successUrl, cancelUrl, mode = 'payment', metadata = {}) => {
  try {
    const response = await axios.post('/api/payment/create-checkout-session', {
      lineItems,
      successUrl,
      cancelUrl,
      mode,
      metadata
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error(error.response?.data?.error || 'Failed to create checkout session');
  }
};

/**
 * Create a subscription
 * @param {string} customerId - The ID of the customer
 * @param {string} priceId - The ID of the price
 * @param {Object} options - Additional options for the subscription
 * @returns {Promise<Object>} - The created subscription
 */
export const createSubscription = async (customerId, priceId, options = {}) => {
  try {
    const response = await axios.post('/api/payment/create-subscription', {
      customerId,
      priceId,
      options
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw new Error(error.response?.data?.error || 'Failed to create subscription');
  }
};

/**
 * Create a customer
 * @param {string} email - The email of the customer
 * @param {string} name - The name of the customer
 * @param {Object} metadata - Additional metadata for the customer
 * @returns {Promise<Object>} - The created customer
 */
export const createCustomer = async (email, name, metadata = {}) => {
  try {
    const response = await axios.post('/api/payment/create-customer', {
      email,
      name,
      metadata
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw new Error(error.response?.data?.error || 'Failed to create customer');
  }
};

/**
 * Get available plans
 * @returns {Promise<Array>} - The available plans
 */
export const getPlans = async () => {
  try {
    const response = await axios.get('/api/payment/plans');
    return response.data;
  } catch (error) {
    console.error('Error fetching plans:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch plans');
  }
};

/**
 * Get user subscription
 * @param {string} userId - The ID of the user
 * @returns {Promise<Object>} - The user's subscription
 */
export const getSubscription = async (userId) => {
  try {
    const response = await axios.get(`/api/payment/subscription/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch subscription');
  }
};

/**
 * Format price for display
 * @param {number} amount - The amount in cents
 * @param {string} currency - The currency code
 * @returns {string} - The formatted price
 */
export const formatPrice = (amount, currency = 'usd') => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2
  });
  
  return formatter.format(amount / 100);
};
