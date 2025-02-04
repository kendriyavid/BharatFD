import request from "supertest";
import app from "../../index.js"; // Ensure the correct path to your main app file
import Faq from "../../models/faq.js";
import mongoose from "mongoose";

describe("FAQ Fetching", () => {
  beforeAll(async () => {
    await Faq.create({
      faqId: "FAQ0001",
      question: "What is Express.js?",
      response: "Express.js is a web framework for Node.js.",
    });
  });

  afterAll(async () => {
    await Faq.deleteMany({});
    await mongoose.disconnect(); // Properly close the connection
  });

  it("should fetch all FAQs", async () => {
    const response = await request(app).get("/api/faqs/fetchall");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("question");
    expect(response.body[0]).toHaveProperty("response");
  });

  it("should fetch a specific FAQ by ID", async () => {
    const response = await request(app).get("/api/faqs/FAQ0001");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("question");
    expect(response.body).toHaveProperty("response");
  });
});
