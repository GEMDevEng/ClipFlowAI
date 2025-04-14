import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { VideoProvider } from './context/VideoContext';

// Using HashRouter instead of BrowserRouter for GitHub Pages compatibility
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <VideoProvider>
          <App />
        </VideoProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);
