import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Create Viral Videos with AI</h1>
            <p>
              ClipFlowAI automates the creation and publication of short-form videos for TikTok, Instagram Reels, and YouTube Shorts using advanced AI.
            </p>
            <div className="hero-buttons">
              <Link to="/create" className="btn btn-primary">
                Create Your First Video
              </Link>
              <Link to="/dashboard" className="btn btn-secondary">
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>How It Works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>1. Enter Your Prompt</h3>
              <p>
                Simply enter a text prompt describing the video you want to create.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>2. AI Generation</h3>
              <p>
                Our AI generates the video, voiceover, and captions based on your prompt.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>3. Publish Everywhere</h3>
              <p>
                Automatically publish to TikTok, Instagram Reels, and YouTube Shorts.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Ready to Create Viral Content?</h2>
          <p>
            Start generating engaging short-form videos with just a few clicks.
          </p>
          <Link to="/create" className="btn btn-primary">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
