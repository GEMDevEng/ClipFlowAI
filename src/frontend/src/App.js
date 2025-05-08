import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CreateVideo from './pages/CreateVideo';
import VideoDetails from './pages/VideoDetails';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import SocialMediaPage from './pages/SocialMediaPage';
import Subscription from './pages/Subscription';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PrivateRoute from './components/common/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { VideoProvider } from './context/VideoContext';
import { ROUTES } from './config/constants';
import { initFFmpeg } from './services/video/videoProcessor';
import { initializeDatabase } from './services/database/databaseInitializer';
import './App.css';

// Load Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

/**
 * Main App component
 * @returns {JSX.Element} - App component
 */
function App() {
  // Initialize FFmpeg and database when the app loads
  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize FFmpeg
        await initFFmpeg();
        console.log('FFmpeg initialized successfully');

        // Initialize database
        const dbInitialized = await initializeDatabase();
        if (dbInitialized) {
          console.log('Database initialized successfully');
        } else {
          console.warn('Database initialization failed. Some features may not work correctly.');
        }
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initialize();
  }, []);

  return (
    <AuthProvider>
      <VideoProvider>
        <Elements stripe={stripePromise}>
          <div className="App min-h-screen flex flex-col">
            <Header />
            <main className="container mx-auto px-4 flex-grow">
              <Routes>
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.SIGNUP} element={<Signup />} />
                <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
                <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />

                <Route path={ROUTES.DASHBOARD} element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />

                <Route path={ROUTES.CREATE_VIDEO} element={
                  <PrivateRoute>
                    <CreateVideo />
                  </PrivateRoute>
                } />

                <Route path={ROUTES.VIDEO_DETAILS} element={
                  <PrivateRoute>
                    <VideoDetails />
                  </PrivateRoute>
                } />

                <Route path={ROUTES.PROFILE} element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />

                <Route path={ROUTES.ANALYTICS} element={
                  <PrivateRoute>
                    <Analytics />
                  </PrivateRoute>
                } />

                <Route path={ROUTES.SOCIAL_MEDIA} element={
                  <PrivateRoute>
                    <SocialMediaPage />
                  </PrivateRoute>
                } />

                <Route path={ROUTES.SUBSCRIPTION} element={
                  <PrivateRoute>
                    <Subscription />
                  </PrivateRoute>
                } />

                <Route path={ROUTES.SUBSCRIPTION_SUCCESS} element={
                  <PrivateRoute>
                    <Subscription />
                  </PrivateRoute>
                } />

                <Route path={ROUTES.SUBSCRIPTION_CANCEL} element={
                  <PrivateRoute>
                    <Subscription />
                  </PrivateRoute>
                } />

                <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
                <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Elements>
      </VideoProvider>
    </AuthProvider>
  );
}

export default App;
