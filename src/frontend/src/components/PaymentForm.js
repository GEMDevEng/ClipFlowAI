import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createPaymentIntent, formatPrice } from '../services/paymentService';
import './PaymentForm.css';

const PaymentForm = ({ amount, onSuccess, onError, metadata = {}, buttonText = 'Pay Now' }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    // Create a payment intent when the component mounts
    const fetchPaymentIntent = async () => {
      try {
        const { clientSecret } = await createPaymentIntent(amount, 'usd', metadata);
        setClientSecret(clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        setError('Failed to initialize payment. Please try again.');
        if (onError) onError(error);
      }
    };

    if (amount > 0) {
      fetchPaymentIntent();
    }
  }, [amount, metadata, onError]);

  const handleChange = (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    setProcessing(true);

    try {
      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (payload.error) {
        setError(`Payment failed: ${payload.error.message}`);
        if (onError) onError(payload.error);
      } else {
        setError(null);
        setSucceeded(true);
        if (onSuccess) onSuccess(payload.paymentIntent);
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      setError('An unexpected error occurred. Please try again.');
      if (onError) onError(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="payment-form-container">
      <div className="payment-amount">
        <h3>Payment Amount</h3>
        <p className="amount">{formatPrice(amount)}</p>
      </div>

      <form id="payment-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="card-element">Credit or debit card</label>
          <div className="card-element-container">
            <CardElement
              id="card-element"
              onChange={handleChange}
              options={{
                style: {
                  base: {
                    color: '#32325d',
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                    fontSmoothing: 'antialiased',
                    fontSize: '16px',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#fa755a',
                    iconColor: '#fa755a',
                  },
                },
              }}
            />
          </div>
        </div>

        {error && (
          <div className="card-error" role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={processing || disabled || succeeded || !clientSecret}
          className={`payment-button ${(processing || disabled || succeeded || !clientSecret) ? 'disabled' : ''}`}
        >
          {processing ? (
            <div className="spinner"></div>
          ) : succeeded ? (
            'Payment Successful'
          ) : (
            buttonText
          )}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
