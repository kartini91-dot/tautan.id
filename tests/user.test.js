/**
 * User Authentication Tests
 * Testing registration, login, 2FA, dan password management
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../backend/server');
const User = require('../backend/models/User');

describe('Authentication API', () => {
  
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_LOCAL || 'mongodb://localhost:27017/tautan-id-test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    // Clean up dan disconnect
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  afterEach(async () => {
    // Clear users setelah setiap test
    await User.deleteMany({});
  });

  describe('POST /auth/register', () => {
    it('should register a new user with valid data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'John Doe',
          email: 'john@example.com',
          phoneNumber: '081234567890',
          password: 'SecurePass123!',
          passwordConfirm: 'SecurePass123!',
          role: 'buyer'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('john@example.com');
    });

    it('should return error for duplicate email', async () => {
      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'John Doe',
          email: 'john@example.com',
          phoneNumber: '081234567890',
          password: 'SecurePass123!',
          passwordConfirm: 'SecurePass123!',
          role: 'buyer'
        });

      // Try to create duplicate
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Jane Doe',
          email: 'john@example.com',
          phoneNumber: '081234567891',
          password: 'SecurePass123!',
          passwordConfirm: 'SecurePass123!',
          role: 'supplier'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return error for invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'John Doe',
          email: 'invalid-email',
          phoneNumber: '081234567890',
          password: 'SecurePass123!',
          passwordConfirm: 'SecurePass123!',
          role: 'buyer'
        });

      expect(res.statusCode).toBe(400);
    });

    it('should return error for weak password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'John Doe',
          email: 'john@example.com',
          phoneNumber: '081234567890',
          password: 'weak',
          passwordConfirm: 'weak',
          role: 'buyer'
        });

      expect(res.statusCode).toBe(400);
    });

    it('should return error for non-matching passwords', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'John Doe',
          email: 'john@example.com',
          phoneNumber: '081234567890',
          password: 'SecurePass123!',
          passwordConfirm: 'DifferentPass123!',
          role: 'buyer'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    const testUser = {
      fullName: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '081234567890',
      password: 'SecurePass123!',
      passwordConfirm: 'SecurePass123!',
      role: 'buyer'
    };

    beforeEach(async () => {
      // Create test user
      await request(app)
        .post('/api/auth/register')
        .send(testUser);
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'SecurePass123!'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('john@example.com');
    });

    it('should return error for invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'SecurePass123!'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return error for wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'WrongPassword123!'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should lock account after multiple failed attempts', async () => {
      // Attempt login 5 times with wrong password
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/auth/login')
          .send({
            email: 'john@example.com',
            password: 'WrongPassword!'
          });
      }

      // 6th attempt should be locked
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'SecurePass123!'
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toContain('terkunci');
    });
  });

  describe('GET /auth/me', () => {
    let token;

    beforeEach(async () => {
      // Register and login
      await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'John Doe',
          email: 'john@example.com',
          phoneNumber: '081234567890',
          password: 'SecurePass123!',
          passwordConfirm: 'SecurePass123!',
          role: 'buyer'
        });

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'SecurePass123!'
        });

      token = loginRes.body.data.token;
    });

    it('should get current user profile', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('john@example.com');
    });

    it('should return error without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.statusCode).toBe(401);
    });

    it('should return error with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /auth/forgot-password', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'John Doe',
          email: 'john@example.com',
          phoneNumber: '081234567890',
          password: 'SecurePass123!',
          passwordConfirm: 'SecurePass123!',
          role: 'buyer'
        });
    });

    it('should initiate password reset', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'john@example.com'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return success even for non-existent email (security)', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'nonexistent@example.com'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /auth/setup-2fa', () => {
    let token;

    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'John Doe',
          email: 'john@example.com',
          phoneNumber: '081234567890',
          password: 'SecurePass123!',
          passwordConfirm: 'SecurePass123!',
          role: 'buyer'
        });

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'SecurePass123!'
        });

      token = loginRes.body.data.token;
    });

    it('should setup 2FA', async () => {
      const res = await request(app)
        .post('/api/auth/setup-2fa')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.secret).toBeDefined();
      expect(res.body.data.qrCode).toBeDefined();
      expect(res.body.data.backupCodes).toBeDefined();
      expect(res.body.data.backupCodes).toHaveLength(10);
    });
  });

  describe('Membership Features', () => {
    it('should assign Basic membership to new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'John Doe',
          email: 'john@example.com',
          phoneNumber: '081234567890',
          password: 'SecurePass123!',
          passwordConfirm: 'SecurePass123!',
          role: 'buyer'
        });

      expect(res.body.data).toHaveProperty('userId');
      
      const user = await User.findById(res.body.data.userId);
      expect(user.membership).toBe('Basic');
    });

    it('should generate affiliate code for supplier', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'John Supplier',
          email: 'supplier@example.com',
          phoneNumber: '081234567890',
          password: 'SecurePass123!',
          passwordConfirm: 'SecurePass123!',
          role: 'supplier'
        });

      const user = await User.findById(res.body.data.userId);
      expect(user.affiliateCode).toBeDefined();
      expect(user.affiliateCode).toMatch(/^AFF-/);
    });
  });
});
