const request = require('supertest');
const app = require('../../index.js'); // Adjust the path to your app entry point
const Faq = require('../../models/faq');

describe('FAQ Fetching', () => {
  beforeAll(async () => {
    // Create a test FAQ
    await Faq.create({
      faqId: 'FAQ0001',
      question: 'What is Express.js?',
      response: 'Express.js is a web framework for Node.js.',
    });
  });

  afterAll(async () => {
    await Faq.deleteMany({});
  });

  it('should fetch all FAQs', async () => {
    const response = await request(app).get('/api/faqs/fetchall');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('question');
    expect(response.body[0]).toHaveProperty('response');
  });

  it('should fetch a specific FAQ by ID', async () => {
    const response = await request(app).get('/api/faqs/FAQ0001');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('question');
    expect(response.body).toHaveProperty('response');
  });
});