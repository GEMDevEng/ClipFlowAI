import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SubscriptionPlans from '../components/SubscriptionPlans';
import { getSubscription } from '../services/paymentService';
import './Subscription.css';

const Subscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const subscriptionData = await getSubscription(currentUser.id);
        setSubscription(subscriptionData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching subscription:', error);
        setError('Failed to load subscription information. Please try again later.');
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [currentUser]);

  const handleManageSubscription = () => {
    // In a real implementation, this would redirect to a subscription management page
    // For now, we'll just log a message
    console.log('Manage subscription clicked');
  };

  const handleCancelSubscription = () => {
    // In a real implementation, this would show a confirmation dialog and then cancel the subscription
    // For now, we'll just log a message
    console.log('Cancel subscription clicked');
  };

  if (loading) {
    return (
      <div className="subscription-page">
        <div className="loading">Loading subscription information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="subscription-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="subscription-page">
      <h1 className="page-title">Subscription</h1>

      {subscription && subscription.status === 'active' ? (
        <div className="active-subscription">
          <div className="subscription-header">
            <h2>Active Subscription</h2>
            <div className="subscription-badge">Active</div>
          </div>

          <div className="subscription-details">
            <div className="detail-item">
              <span className="detail-label">Plan:</span>
              <span className="detail-value">{subscription.planId}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Started:</span>
              <span className="detail-value">
                {new Date(subscription.currentPeriodStart).toLocaleDateString()}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Renews:</span>
              <span className="detail-value">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className="detail-value status-active">Active</span>
            </div>
            {subscription.cancelAtPeriodEnd && (
              <div className="detail-item">
                <span className="detail-label">Cancellation:</span>
                <span className="detail-value status-cancelled">
                  Cancels at period end
                </span>
              </div>
            )}
          </div>

          <div className="subscription-actions">
            <button
              className="btn btn-primary"
              onClick={handleManageSubscription}
            >
              Manage Subscription
            </button>
            {!subscription.cancelAtPeriodEnd && (
              <button
                className="btn btn-danger"
                onClick={handleCancelSubscription}
              >
                Cancel Subscription
              </button>
            )}
          </div>
        </div>
      ) : (
        <SubscriptionPlans />
      )}
    </div>
  );
};

export default Subscription;
