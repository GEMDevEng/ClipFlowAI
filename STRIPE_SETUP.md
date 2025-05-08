# Stripe Integration Setup Guide for ClipFlowAI

This guide will walk you through setting up Stripe integration for the ClipFlowAI project to enable payment processing.

## Prerequisites

- A Stripe account (sign up at [Stripe](https://stripe.com/))
- Basic knowledge of API keys and environment variables

## Step 1: Create a Stripe Account

1. Sign up or log in to [Stripe](https://stripe.com/)
2. Complete the account setup process

## Step 2: Get API Keys

1. Go to the [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to "Developers" > "API keys"
3. You'll see two types of keys:
   - **Publishable key**: Used in the frontend to initialize Stripe.js
   - **Secret key**: Used in the backend to make API calls to Stripe
4. For development, use the test keys provided
5. Copy both keys to a secure location

## Step 3: Set Up Webhook Endpoint

1. In the Stripe Dashboard, go to "Developers" > "Webhooks"
2. Click "Add endpoint"
3. Enter your webhook URL (e.g., `https://your-domain.com/api/payment/webhook`)
4. Select the events you want to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click "Add endpoint"
6. Copy the "Signing secret" for webhook verification

## Step 4: Configure Environment Variables

1. Create or update the `.env` file in the root directory of your project
2. Add the following environment variables:

```
# Stripe API Keys
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_signing_secret

# Frontend Environment Variables
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

3. Replace the placeholder values with your actual API keys

## Step 5: Create Products and Prices in Stripe

### Option 1: Using the Stripe Dashboard

1. Go to the [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to "Products"
3. Click "Add product"
4. Fill in the product details:
   - Name (e.g., "Basic Plan")
   - Description
   - Images (optional)
5. Add pricing information:
   - Price (e.g., $9.99)
   - Billing period (one-time or recurring)
   - Currency (e.g., USD)
6. Click "Save product"
7. Repeat for each product/plan you want to offer

### Option 2: Using the Stripe API

You can also create products and prices programmatically using the Stripe API. Here's an example:

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a product
const product = await stripe.products.create({
  name: 'Basic Plan',
  description: 'Basic plan with limited features',
});

// Create a price for the product
const price = await stripe.prices.create({
  product: product.id,
  unit_amount: 999, // $9.99 in cents
  currency: 'usd',
  recurring: {
    interval: 'month',
  },
});

console.log('Product created:', product.id);
console.log('Price created:', price.id);
```

## Step 6: Test the Integration

1. Start the backend server:
```
npm run start
```

2. Start the frontend development server:
```
cd src/frontend && npm start
```

3. Navigate to the "Create Video" page or "Subscription" page
4. Try to make a payment using Stripe's test cards:
   - Use card number `4242 4242 4242 4242` for successful payments
   - Use card number `4000 0000 0000 0002` for declined payments
   - Any future date for expiry and any 3-digit CVC

## Troubleshooting

### API Key Issues

If you encounter errors related to API keys:

1. Verify that your API keys are correctly set in the `.env` file
2. Make sure you're using the correct keys (test keys for development, live keys for production)
3. Check that the environment variables are being properly loaded

### Payment Processing Issues

If payments are not being processed correctly:

1. Check the browser console and server logs for error messages
2. Verify that you're using the correct test card numbers
3. Make sure your webhook endpoint is correctly configured
4. Check the Stripe Dashboard for any failed payments or events

### Webhook Issues

If webhooks are not being received:

1. Make sure your server is publicly accessible (use a service like ngrok for local development)
2. Verify that the webhook signing secret is correctly set
3. Check that you've selected the correct events to listen for
4. Use the "Test webhook" feature in the Stripe Dashboard to send test events

## Resources

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe.js Documentation](https://stripe.com/docs/js)
- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe Testing Documentation](https://stripe.com/docs/testing)
