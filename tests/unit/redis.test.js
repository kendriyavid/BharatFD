import Faq from "../../models/faq.js";
import { updateFaqIdsInCache } from "../../utils/redisFaqState.js";
import Redis from 'ioredis'; // Jest mocked Redis

describe("Redis Caching", () => {
  let redis;

  beforeAll(async () => {
    await Faq.create({
      faqId: "FAQ0001",
      question: "What is Redis?",
      response: "Redis is an in-memory data store.",
    });

    redis = new Redis();
  });

  afterAll(async () => {
    await Faq.deleteMany({});
    await redis.flushall(); 
  });

  it("should update FAQ IDs in Redis cache", async () => {
    await updateFaqIdsInCache();

    const cachedFaqIds = await redis.get("faqIds:en");

    expect(cachedFaqIds).toBeDefined();
    expect(JSON.parse(cachedFaqIds)).toContain("FAQ0001");
  });
});
