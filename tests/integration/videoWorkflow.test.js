/**
 * Integration test for the video upload and processing workflow
 */
const request = require('supertest');
const { createServer } = require('../../src/backend/server');
const { supabase } = require('../../src/backend/config/supabaseClient');
const { processVideo } = require('../../src/backend/services/videoProcessor');
const { publishToAllPlatforms } = require('../../src/backend/services/socialMediaPublisher');

// Mock Supabase
jest.mock('../../src/backend/config/supabaseClient', () => ({
  supabase: {
    storage: {
      from: jest.fn().mockReturnThis(),
      upload: jest.fn().mockResolvedValue({ data: { path: 'videos/test-video.mp4' }, error: null }),
      getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/test-video.mp4' } })
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnValue({ data: { id: 'video123' }, error: null }),
    update: jest.fn().mockReturnValue({ data: { id: 'video123' }, error: null })
  }
}));

// Mock video processor
jest.mock('../../src/backend/services/videoProcessor', () => ({
  processVideo: jest.fn().mockResolvedValue({
    id: 'video123',
    status: 'completed',
    thumbnail_url: 'https://example.com/thumbnail.jpg',
    processed_url: 'https://example.com/processed-video.mp4',
    duration: 120
  })
}));

// Mock social media publisher
jest.mock('../../src/backend/services/socialMediaPublisher', () => ({
  publishToAllPlatforms: jest.fn().mockResolvedValue([
    { platform: 'youtube', status: 'published', url: 'https://youtube.com/watch?v=123' },
    { platform: 'tiktok', status: 'published', url: 'https://tiktok.com/@user/video/123' }
  ])
}));

// Mock file system
jest.mock('fs', () => ({
  promises: {
    writeFile: jest.fn().mockResolvedValue(),
    readFile: jest.fn().mockResolvedValue(Buffer.from('test file content')),
    unlink: jest.fn().mockResolvedValue()
  },
  createWriteStream: jest.fn().mockReturnValue({
    write: jest.fn(),
    end: jest.fn(),
    on: jest.fn().mockImplementation(function(event, callback) {
      if (event === 'finish') {
        callback();
      }
      return this;
    })
  }),
  existsSync: jest.fn().mockReturnValue(true),
  mkdirSync: jest.fn()
}));

describe('Video Upload and Processing Workflow', () => {
  let app;
  let server;
  
  beforeAll(() => {
    const { app: expressApp, server: httpServer } = createServer();
    app = expressApp;
    server = httpServer;
  });
  
  afterAll((done) => {
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should upload, process, and publish a video', async () => {
    // Step 1: Upload a video
    const uploadResponse = await request(app)
      .post('/api/videos/upload')
      .attach('video', Buffer.from('test video content'), {
        filename: 'test-video.mp4',
        contentType: 'video/mp4'
      })
      .field('title', 'Test Video')
      .field('description', 'This is a test video')
      .field('userId', 'user123');
    
    expect(uploadResponse.status).toBe(200);
    expect(uploadResponse.body).toHaveProperty('id', 'video123');
    expect(uploadResponse.body).toHaveProperty('status', 'pending');
    
    // Step 2: Process the video
    const processResponse = await request(app)
      .post('/api/videos/process')
      .send({ videoId: 'video123' });
    
    expect(processResponse.status).toBe(200);
    expect(processResponse.body).toHaveProperty('id', 'video123');
    expect(processResponse.body).toHaveProperty('status', 'completed');
    expect(processResponse.body).toHaveProperty('thumbnail_url');
    expect(processResponse.body).toHaveProperty('processed_url');
    
    // Verify that processVideo was called with the correct parameters
    expect(processVideo).toHaveBeenCalledWith('video123');
    
    // Step 3: Publish the video
    const publishResponse = await request(app)
      .post('/api/videos/publish')
      .send({
        videoId: 'video123',
        platforms: ['youtube', 'tiktok']
      });
    
    expect(publishResponse.status).toBe(200);
    expect(publishResponse.body).toHaveLength(2);
    expect(publishResponse.body[0]).toHaveProperty('platform', 'youtube');
    expect(publishResponse.body[0]).toHaveProperty('status', 'published');
    expect(publishResponse.body[1]).toHaveProperty('platform', 'tiktok');
    expect(publishResponse.body[1]).toHaveProperty('status', 'published');
    
    // Verify that publishToAllPlatforms was called with the correct parameters
    expect(publishToAllPlatforms).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'video123' }),
      ['youtube', 'tiktok']
    );
    
    // Step 4: Get the video details
    const getResponse = await request(app)
      .get('/api/videos/video123');
    
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toHaveProperty('id', 'video123');
    expect(getResponse.body).toHaveProperty('status', 'published');
    expect(getResponse.body).toHaveProperty('platforms');
    expect(getResponse.body.platforms).toHaveLength(2);
  });
  
  it('should handle errors during video upload', async () => {
    // Mock Supabase to return an error
    supabase.storage.upload.mockResolvedValueOnce({
      data: null,
      error: { message: 'Upload failed' }
    });
    
    const response = await request(app)
      .post('/api/videos/upload')
      .attach('video', Buffer.from('test video content'), {
        filename: 'test-video.mp4',
        contentType: 'video/mp4'
      })
      .field('title', 'Test Video')
      .field('description', 'This is a test video')
      .field('userId', 'user123');
    
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('Upload failed');
  });
  
  it('should handle errors during video processing', async () => {
    // Mock processVideo to throw an error
    processVideo.mockRejectedValueOnce(new Error('Processing failed'));
    
    const response = await request(app)
      .post('/api/videos/process')
      .send({ videoId: 'video123' });
    
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('Processing failed');
  });
  
  it('should handle errors during video publishing', async () => {
    // Mock publishToAllPlatforms to throw an error
    publishToAllPlatforms.mockRejectedValueOnce(new Error('Publishing failed'));
    
    const response = await request(app)
      .post('/api/videos/publish')
      .send({
        videoId: 'video123',
        platforms: ['youtube', 'tiktok']
      });
    
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('Publishing failed');
  });
});
