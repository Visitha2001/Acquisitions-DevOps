import request from 'supertest';
import app from '#src/App.js';

describe('Api endpoints', () => {
  describe('GET /health', () => {
    it('should return 200 with health check response', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('memoryUsage');
    });
  });

  describe('GET /api', () => {
    it('should return api response', async () => {
      const response = await request(app).get('/api');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty(
        'message',
        'Acquisitions API is running...'
      );
    });
  });

  describe('GET /', () => {
    it('should return hello response', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Hello from acquisitions!');
    });
  });

  describe('GET /nonexisting', () => {
    it('should return not found response', async () => {
      const response = await request(app).get('/nonexisting');
      expect(response.status).toBe(404);
    });
  });
});
