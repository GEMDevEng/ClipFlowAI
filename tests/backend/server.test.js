const request = require('supertest');
const app = require('../../src/backend/server');

describe('Server API', () => {
  it('should respond with welcome message on root route', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Welcome to ClipFlowAI API');
  });

  // Add more tests for API endpoints
});
