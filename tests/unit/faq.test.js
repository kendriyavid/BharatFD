import request from "supertest";
import app from "../../index.js"; 
import Faq from "../../models/faq.js";
import User from "../../models/user.js"
import bcrypt from "bcryptjs";
import mongoose from "mongoose"; 

describe('FAQ CRUD Operations', () => {
  let faqId;
  let token;

  beforeAll(async () => {
    await Faq.deleteMany({});
    await User.create({
      username: "admin",
      email: "admin@example.com",
      password: await bcrypt.hash("password123", 10),
      role: "admin",
    });
    const response = await request(app)
      .post("/adminlogin")
      .send({ email: "admin@example.com", password: "password123" });
    token = response.body.accessToken;
    console.log("JWT Token:", token); 
  });

  it('should create a new FAQ', async () => {
    const response = await request(app)
      .post('/api/admin/faq')
      .set("Authorization", `Bearer ${token}`) 
      .send({ question: 'What is Node.js?', response: 'Node.js is a runtime environment for JavaScript.' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('FAQ created successfully');
    expect(response.body.faq).toHaveProperty('faqId');

    faqId = response.body.faq.faqId; 
  });

  it('should update an existing FAQ', async () => {
    const response = await request(app)
      .patch(`/api/admin/faq/${faqId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ question: 'What is Node.js?', response: 'Node.js is a powerful runtime environment for JavaScript.' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('FAQ updated successfully');
    expect(response.body.faq.response).toBe('Node.js is a powerful runtime environment for JavaScript.');
  });

  it('should delete an existing FAQ', async () => {
    const response = await request(app)
      .delete(`/api/admin/faq/${faqId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('FAQ deleted successfully');
  });
});

afterAll(async () => {
  await mongoose.disconnect(); 
});
