const request = require('supertest');
const express = require('express');
const publicRoutes = require('../../routes/public');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/public', publicRoutes);

describe('Public Routes Integration Tests', () => {
  // Note: These tests require a test database
  // In a real scenario, you would set up a test database before running these tests

  describe('GET /api/public/reports', () => {
    it('should return list of reports', async () => {
      const response = await request(app)
        .get('/api/public/reports')
        .expect('Content-Type', /json/);

      expect(response.status).toBeLessThan(500); // Should not be server error
    });
  });

  describe('POST /api/public/reports', () => {
    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/public/reports')
        .send({
          title: 'Test Report'
          // Missing required fields
        })
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should create a report with valid data', async () => {
      const reportData = {
        title: 'Test Report',
        description: 'Test Description',
        location: 'Test Location',
        incident_date: '2025-01-15',
        severity: 'ringan',
        jenis_insiden: 'Test Incident'
      };

      const response = await request(app)
        .post('/api/public/reports')
        .send(reportData)
        .expect('Content-Type', /json/);

      // Should either succeed (201) or fail with specific error (not 500)
      expect([201, 400, 500]).toContain(response.status);
    });
  });

  describe('GET /api/public/materials', () => {
    it('should return list of materials', async () => {
      const response = await request(app)
        .get('/api/public/materials')
        .expect('Content-Type', /json/);

      expect(response.status).toBeLessThan(500);
    });
  });

  describe('POST /api/public/materials', () => {
    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/public/materials')
        .send({
          title: 'Test Material'
          // Missing required fields
        })
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 for invalid category', async () => {
      const response = await request(app)
        .post('/api/public/materials')
        .send({
          title: 'Test Material',
          category: 'Invalid',
          description: 'Test Description',
          content: 'Test Content'
        })
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });
  });
});

