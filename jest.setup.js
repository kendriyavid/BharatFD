const dotenv = require("dotenv");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

dotenv.config();

// Mock ioredis with redis-mock
jest.mock("ioredis", () => {
  const Redis = require("redis-mock");
  return Redis;
});

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});