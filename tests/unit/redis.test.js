
const redisClient = require('../../utils/redisClient');
const Faq = require('../../models/faq');
const { updateFaqIdsInCache } = require('../../utils/redisFaqState');

describe('Redis Caching', () => {
  beforeAll(async () => {
    // Create a test FAQ
    await Faq.create({
      faqId: 'FAQ0001',
      question: 'What is Redis?',
      response: 'Redis is an in-memory data store.',
    });
  });

  afterAll(async () => {
    await Faq.deleteMany({});
    await redisClient.flushall();
  });

  it('should update FAQ IDs in Redis cache', async () => {
    await updateFaqIdsInCache();

    const cachedFaqIds = await redisClient.get('faqIds:en');
    expect(cachedFaqIds).toBeDefined();
    expect(JSON.parse(cachedFaqIds)).toContain('FAQ0001');
  });
});