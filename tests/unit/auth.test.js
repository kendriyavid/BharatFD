const request = require('supertest');
const app = require('../../index.js'); 
const User = require('../../models/user');
const bcrypt = require('bcryptjs');

describe('POST /adminlogin', () => {
  beforeAll(async () => {
    await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'admin',
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it('should return a valid access token for correct credentials', async () => {
    const response = await request(app)
      .post('/adminlogin')
      .send({ email: 'admin@example.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
  });

  it('should return 400 for invalid credentials', async () => {
    const response = await request(app)
      .post('/adminlogin')
      .send({ email: 'admin@example.com', password: 'wrongpassword' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid credentials');
  });
});