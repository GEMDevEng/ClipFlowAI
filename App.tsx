import React, { useState } from 'react';
import { Send, Video, Mail, Shield, PlayCircle } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    videoIdea: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    setFormData({ videoIdea: '', email: '' });
    
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            Turn Your Ideas into <span className="text-purple-600">Viral Videos</span>
          </h1>
          <p className="mt-6 text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
            Stop Wasting Time on Manual Video Creation. Describe Your Video Idea and Let AI Do the Rest!
          </p>
        </div>

        {/* Form Section */}
        <div className="mt-12 max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="videoIdea" className="block text-sm font-medium text-gray-700">
                  Describe your video idea:
                </label>
                <div className="mt-1">
                  <textarea
                    id="videoIdea"
                    name="videoIdea"
                    rows={4}
                    className="shadow-sm block w-full focus:ring-purple-500 focus:border-purple-500 sm:text-sm border border-gray-300 rounded-md"
                    placeholder="E.g., A golden retriever puppy playing fetch in a sunny park."
                    value={formData.videoIdea}
                    onChange={(e) => setFormData({ ...formData, videoIdea: e.target.value })}
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Be as specific as possible with your description. You can also include desired camera angles or any text you'd like to see on the video.
                </p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Your Email Address:
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="shadow-sm block w-full focus:ring-purple-500 focus:border-purple-500 sm:text-sm border border-gray-300 rounded-md"
                    placeholder="yourname@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  We'll email you a link to your completed video.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Generating...' : 'Generate My Video!'}
              </button>

              {showSuccess && (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <PlayCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Your video request has been submitted! Check your email soon.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* How it Works Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Simple 3-Step Video Creation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center px-4">
              <div className="flex justify-center mb-4">
                <Video className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Describe Your Video</h3>
              <p className="text-gray-600">Tell us your video idea in the form above.</p>
            </div>
            <div className="text-center px-4">
              <div className="flex justify-center mb-4">
                <Send className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Automated AI Generation</h3>
              <p className="text-gray-600">Our AI agent generates the video with voiceover and subtitles.</p>
            </div>
            <div className="text-center px-4">
              <div className="flex justify-center mb-4">
                <Mail className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Get Notified</h3>
              <p className="text-gray-600">Receive a download link in your email when your video is ready.</p>
            </div>
          </div>
        </div>

        {/* Platforms Section */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Perfect for All Major Platforms
          </h2>
          <div className="flex justify-center space-x-8">
            <span className="text-gray-600">Instagram Reels</span>
            <span className="text-gray-600">TikTok</span>
            <span className="text-gray-600">YouTube Shorts</span>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center">
          <div className="flex justify-center items-center text-sm text-gray-500">
            <Shield className="h-4 w-4 mr-2" />
            <a href="#" className="hover:text-purple-600">Privacy Policy</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;