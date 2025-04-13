const request = require('supertest');
const app = require('../../src/backend/server');

describe('Video Controller', () => {
  it('should get all videos', async () => {
    const res = await request(app).get('/api/videos');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Get all videos');
  });

  it('should get a video by ID', async () => {
    const res = await request(app).get('/api/videos/123');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Get video with ID: 123');
  });

  it('should create a new video', async () => {
    const videoData = {
      title: 'Test Video',
      prompt: 'This is a test prompt'
    };
    
    const res = await request(app)
      .post('/api/videos')
      .send(videoData);
      
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Video created');
    expect(res.body.data).toEqual(videoData);
  });

  it('should update a video', async () => {
    const videoData = {
      title: 'Updated Test Video'
    };
    
    const res = await request(app)
      .put('/api/videos/123')
      .send(videoData);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Update video with ID: 123');
    expect(res.body.data).toEqual(videoData);
  });

  it('should delete a video', async () => {
    const res = await request(app).delete('/api/videos/123');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Delete video with ID: 123');
  });

  it('should generate a video from prompt', async () => {
    const promptData = {
      prompt: 'Generate a test video'
    };
    
    const res = await request(app)
      .post('/api/videos/generate')
      .send(promptData);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Video generation started');
    expect(res.body).toHaveProperty('prompt', promptData.prompt);
  });

  it('should return error if prompt is missing for video generation', async () => {
    const res = await request(app)
      .post('/api/videos/generate')
      .send({});
      
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Prompt is required');
  });
});
