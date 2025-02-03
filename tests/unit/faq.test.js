const request = require('supertest');
const app = require('../../index.js'); // Adjust the path to your app entry point
const Faq = require('../../models/faq');

describe('FAQ CRUD Operations', () => {
  let faqId;

  beforeAll(async () => {
    // Clear the FAQ collection before tests
    await Faq.deleteMany({});
  });

  it('should create a new FAQ', async () => {
    const response = await request(app)
      .post('/api/admin/createfaq')
      .send({ question: 'What is Node.js?', response: 'Node.js is a runtime environment for JavaScript.' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('FAQ created successfully');
    expect(response.body.faq).toHaveProperty('faqId');

    faqId = response.body.faq.faqId; // Save FAQ ID for later tests
  });

  it('should update an existing FAQ', async () => {
    const response = await request(app)
      .patch(`/api/admin/updatefaq/${faqId}`)
      .send({ response: 'Node.js is a powerful runtime environment for JavaScript.' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('FAQ updated successfully');
    expect(response.body.faq.response).toBe('Node.js is a powerful runtime environment for JavaScript.');
  });

  it('should delete an existing FAQ', async () => {
    const response = await request(app)
      .delete(`/api/admin/deletefaq/${faqId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('FAQ deleted successfully');
  });
});