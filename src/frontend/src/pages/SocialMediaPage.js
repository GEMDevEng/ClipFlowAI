import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import PlatformConnect from '../components/social/PlatformConnect';
import PublishingHistory from '../components/social/PublishingHistory';
import ScheduledPublishing from '../components/social/ScheduledPublishing';

/**
 * Social Media Page
 *
 * This page allows users to manage their social media connections,
 * view publishing history, and manage scheduled publishing.
 */
const SocialMediaPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Social Media Management
        </h1>
        <p className="text-gray-600">
          Connect your social media accounts, schedule posts, and track your publishing history.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 0
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(0)}
            >
              Connect Platforms
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 1
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(1)}
            >
              Publishing History
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 2
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(2)}
            >
              Scheduled Publishing
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 0 && <PlatformConnect />}
          {activeTab === 1 && <PublishingHistory />}
          {activeTab === 2 && <ScheduledPublishing />}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaPage;
