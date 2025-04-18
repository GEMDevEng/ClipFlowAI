import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CreateVideo from './pages/CreateVideo';
import VideoDetails from './pages/VideoDetails';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics'; // Import Analytics page
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { VideoProvider } from './context/VideoContext';
import './App.css';

function App() {
  // Get the base URL for GitHub Pages
  const basename = process.env.PUBLIC_URL || '';

  return (
    <AuthProvider>
      <VideoProvider>
        <div className="App">
          <Header />
          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/create" element={
                <PrivateRoute>
                  <CreateVideo />
                </PrivateRoute>
              } />
              <Route path="/videos/:id" element={
                <PrivateRoute>
                  <VideoDetails />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                {/* Add Analytics Route */}
                <Route path="/analytics" element={
                  <PrivateRoute>
                    <Analytics />
                  </PrivateRoute>
                } />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </main>
          <Footer />
        </div>
      </VideoProvider>
    </AuthProvider>
  );
}

export default App;
