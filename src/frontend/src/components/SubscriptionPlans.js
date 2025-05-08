import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlans, createCheckoutSession } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';
import './SubscriptionPlans.css';

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansData = await getPlans();
        setPlans(plansData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching plans:', error);
        setError('Failed to load subscription plans. Please try again later.');
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handleCheckout = async () => {
    if (!selectedPlan) {
      return;
    }

    if (!currentUser) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: '/subscription' } });
      return;
    }

    setProcessingCheckout(true);

    try {
      // Create line items for the checkout session
      const lineItems = [
        {
          price: selectedPlan.id, // In a real implementation, this would be the Stripe price ID
          quantity: 1,
        },
      ];

      // Create success and cancel URLs
      const successUrl = `${window.location.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/subscription/cancel`;

      // Create checkout session
      const { url } = await createCheckoutSession(
        lineItems,
        successUrl,
        cancelUrl,
        'subscription',
        { userId: currentUser.id }
      );

      // Redirect to checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError('Failed to process checkout. Please try again.');
      setProcessingCheckout(false);
    }
  };

  if (loading) {
    return (
      <div className="subscription-plans-container">
        <div className="loading">Loading plans...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="subscription-plans-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="subscription-plans-container">
      <h2>Choose a Subscription Plan</h2>
      <p className="plans-description">
        Select the plan that best fits your needs. All plans include access to our core features.
      </p>

      <div className="plans-grid">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`plan-card ${selectedPlan?.id === plan.id ? 'selected' : ''}`}
            onClick={() => handlePlanSelect(plan)}
          >
            <div className="plan-header">
              <h3>{plan.name}</h3>
              <p className="plan-price">${plan.price.toFixed(2)}<span>/month</span></p>
            </div>
            <p className="plan-description">{plan.description}</p>
            <ul className="plan-features">
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button
              className={`select-plan-button ${selectedPlan?.id === plan.id ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handlePlanSelect(plan);
              }}
            >
              {selectedPlan?.id === plan.id ? 'Selected' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>

      <div className="checkout-section">
        <button
          className="checkout-button"
          disabled={!selectedPlan || processingCheckout}
          onClick={handleCheckout}
        >
          {processingCheckout ? 'Processing...' : 'Subscribe Now'}
        </button>
        <p className="checkout-note">
          You can cancel or change your subscription at any time.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
