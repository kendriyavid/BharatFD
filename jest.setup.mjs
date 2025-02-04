import dotenv from "dotenv";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import RedisMock from "redis-mock"; 
import { jest } from "@jest/globals";

dotenv.config();

jest.mock('ioredis', () => {
  return jest.fn(() => ({
    connect: jest.fn().mockResolvedValue(undefined),
    get: jest.fn().mockImplementation((key) => {
      if (key === 'faqIds:en') {
        return JSON.stringify(['FAQ0001']);
      }
      return null; 
    }),
    set: jest.fn().mockResolvedValue('OK'),
    quit: jest.fn().mockResolvedValue(undefined),
    ping: jest.fn().mockResolvedValue('PONG'),
    flushall: jest.fn(), 
    setex: jest.fn().mockResolvedValue('OK'),  
  }));

});

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  await new Promise(resolve => setTimeout(resolve, 1000));
});

