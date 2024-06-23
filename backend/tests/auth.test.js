const request = require('supertest');
const express = require('express');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const authRoutes = require('../routes/auth');

const app = express();
app.use(express.json());

let mongoServer;
let mockClient;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  mockClient = new MongoClient(uri, { useUnifiedTopology: true });
  await mockClient.connect();
  app.use('/auth', authRoutes(mockClient));
});

afterAll(async () => {
  await mockClient.close();
  await mongoServer.stop();
});

describe('Auth API', () => {
  test('should register a new user', async () => {
    const newUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    const response = await request(app).post('/auth/register').send(newUser);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered');
  });

  test('should not register a user with mismatched passwords', async () => {
    const newUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
      confirmPassword: 'password124',
    };

    const response = await request(app).post('/auth/register').send(newUser);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Passwords do not match');
  });

  test('should login an existing user', async () => {
    const newUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    await request(app).post('/auth/register').send(newUser);

    const loginData = {
      username: 'testuser',
      password: 'password123',
    };

    const response = await request(app).post('/auth/login').send(loginData);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
  });

  test('should not login with invalid credentials', async () => {
    const loginData = {
      username: 'testuser',
      password: 'wrongpassword',
    };

    const response = await request(app).post('/auth/login').send(loginData);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid credentials');
  });

  test('should check if username exists', async () => {
    const newUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    await request(app).post('/auth/register').send(newUser);

    const response = await request(app).post('/auth/check-username').send({ username: 'testuser' });
    expect(response.status).toBe(400);
    expect(response.text).toBe('Username already exists');
  });

  test('should check if email exists', async () => {
    const newUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    await request(app).post('/auth/register').send(newUser);

    const response = await request(app).post('/auth/check-email').send({ email: 'testuser@example.com' });
    expect(response.status).toBe(400);
    expect(response.text).toBe('Email already exists');
  });
});
