/**
 * End-to-end tests for the complete user journey
 */
const { signUp, signIn, getCurrentUser } = require('../../src/frontend/src/services/auth/authService');
const { createUserProfile } = require('../../src/frontend/src/services/user/userService');
const { generateVideo, generateVoiceover, generateCaptions } = require('../../src/backend/services/videoGenerator');
const { storeVideo, updateVideo, getVideoById, getUserVideos } = require('../../src/backend/services/videoService');
const { publishToAllPlatforms } = require('../../src/backend/services/socialMediaPublisher');
const { storeAnalyticsRecord, getVideoAnalytics } = require('../../src/backend/services/analyticsCollector');

// Mock all the required services
jest.mock('../../src/frontend/src/services/auth/authService');
jest.mock('../../src/frontend/src/services/user/userService');
jest.mock('../../src/backend/services/videoGenerator');
jest.mock('../../src/backend/services/videoService');
jest.mock('../../src/backend/services/socialMediaPublisher');
jest.mock('../../src/backend/services/analyticsCollector');

describe('Complete User Journey', () => {
  // Test user data
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    bio: 'A test user account'
  };
  
  // Test video data
  const testVideo = {
    prompt: 'Create a video about AI technology',
    title: 'AI Technology Explained'
  };
  
  // Mock IDs
  const userId = 'user123';
  const videoId = 'video123';
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the authentication functions
    signUp.mockResolvedValue({ user: { id: userId, email: testUser.email } });
    signIn.mockResolvedValue({ user: { id: userId, email: testUser.email } });
    getCurrentUser.mockResolvedValue({ id: userId, email: testUser.email });
    
    // Mock the user profile functions
    createUserProfile.mockResolvedValue({
      id: 'profile123',
      user_id: userId,
      name: testUser.name,
      bio: testUser.bio
    });
    
    // Mock the video generation functions
    generateVideo.mockResolvedValue({
      title: testVideo.title,
      prompt: testVideo.prompt,
      status: 'completed',
      duration: 45,
      videoUrl: 'https://example.com/video.mp4',
      thumbnailUrl: 'https://example.com/thumbnail.jpg'
    });
    
    generateVoiceover.mockResolvedValue('https://example.com/voiceover.mp3');
    
    generateCaptions.mockResolvedValue([
      { text: 'This is the first caption', startTime: 0, endTime: 3 },
      { text: 'This is the second caption', startTime: 3, endTime: 6 }
    ]);
    
    // Mock the video service functions
    storeVideo.mockResolvedValue({ id: videoId });
    
    updateVideo.mockResolvedValue({
      id: videoId,
      status: 'ready'
    });
    
    getVideoById.mockResolvedValue({
      id: videoId,
      title: testVideo.title,
      prompt: testVideo.prompt,
      status: 'ready',
      duration: 45,
      videoUrl: 'https://example.com/video.mp4',
      thumbnailUrl: 'https://example.com/thumbnail.jpg',
      voiceoverUrl: 'https://example.com/voiceover.mp3',
      captions: [
        { text: 'This is the first caption', startTime: 0, endTime: 3 },
        { text: 'This is the second caption', startTime: 3, endTime: 6 }
      ],
      userId,
      createdAt: new Date().toISOString(),
      publishedAt: null
    });
    
    getUserVideos.mockResolvedValue([
      {
        id: videoId,
        title: testVideo.title,
        status: 'ready',
        thumbnailUrl: 'https://example.com/thumbnail.jpg',
        createdAt: new Date().toISOString()
      }
    ]);
    
    // Mock the social media publisher functions
    publishToAllPlatforms.mockResolvedValue([
      {
        platform: 'youtube',
        status: 'published',
        publishedUrl: 'https://youtube.com/watch?v=abc123'
      },
      {
        platform: 'tiktok',
        status: 'published',
        publishedUrl: 'https://tiktok.com/@user/video/123456'
      }
    ]);
    
    // Mock the analytics functions
    storeAnalyticsRecord.mockResolvedValue({
      id: 'analytics123',
      video_id: videoId,
      user_id: userId,
      platform: 'youtube',
      views: 100,
      likes: 30,
      shares: 10,
      date: new Date().toISOString()
    });
    
    getVideoAnalytics.mockResolvedValue({
      current: { views: 100, likes: 30, shares: 10 },
      history: [
        { date: '2023-01-01', views: 50, likes: 15, shares: 5 },
        { date: '2023-01-02', views: 100, likes: 30, shares: 10 }
      ]
    });
  });

  it('should complete the full user journey from registration to analytics', async () => {
    // Step 1: User Registration
    const signUpResult = await signUp(testUser.email, testUser.password, {
      name: testUser.name,
      bio: testUser.bio
    });
    expect(signUpResult).toHaveProperty('user.id', userId);
    
    // Step 2: Create User Profile
    const profile = await createUserProfile(userId, {
      name: testUser.name,
      bio: testUser.bio
    });
    expect(profile).toHaveProperty('user_id', userId);
    
    // Step 3: User Login
    const signInResult = await signIn(testUser.email, testUser.password);
    expect(signInResult).toHaveProperty('user.id', userId);
    
    // Step 4: Generate Video
    const videoData = await generateVideo(testVideo.prompt, testVideo.title);
    expect(videoData).toHaveProperty('title', testVideo.title);
    
    // Step 5: Store Video
    const { id: newVideoId } = await storeVideo({
      ...videoData,
      userId,
      status: 'processing'
    });
    expect(newVideoId).toBe(videoId);
    
    // Step 6: Generate Voiceover
    const voiceoverUrl = await generateVoiceover(testVideo.prompt);
    expect(voiceoverUrl).toBe('https://example.com/voiceover.mp3');
    
    // Step 7: Generate Captions
    const captions = await generateCaptions(voiceoverUrl);
    expect(captions).toHaveLength(2);
    
    // Step 8: Update Video
    await updateVideo(videoId, {
      voiceoverUrl,
      captions,
      status: 'ready'
    });
    
    // Step 9: Get Video
    const video = await getVideoById(videoId);
    expect(video).toHaveProperty('id', videoId);
    expect(video).toHaveProperty('status', 'ready');
    
    // Step 10: Get User Videos
    const userVideos = await getUserVideos(userId);
    expect(userVideos).toHaveLength(1);
    expect(userVideos[0]).toHaveProperty('id', videoId);
    
    // Step 11: Publish Video
    const publishResults = await publishToAllPlatforms(video, ['youtube', 'tiktok']);
    expect(publishResults).toHaveLength(2);
    expect(publishResults[0]).toHaveProperty('platform', 'youtube');
    expect(publishResults[0]).toHaveProperty('status', 'published');
    
    // Step 12: Store Analytics
    const analyticsRecord = await storeAnalyticsRecord(
      videoId,
      userId,
      'youtube',
      { views: 100, likes: 30, shares: 10 }
    );
    expect(analyticsRecord).toHaveProperty('video_id', videoId);
    
    // Step 13: Get Analytics
    const analytics = await getVideoAnalytics(videoId);
    expect(analytics).toHaveProperty('current');
    expect(analytics).toHaveProperty('history');
    expect(analytics.current).toHaveProperty('views', 100);
  });
});
