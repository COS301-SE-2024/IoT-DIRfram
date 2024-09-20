const request = require('supertest');
const express = require('express');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const authRoutes = require('../routes/auth');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

let mongoServer;
let mockClient;

jest.mock('nodemailer');
jest.mock('jsonwebtoken');

const mockSendMail = jest.fn().mockResolvedValue({ response: 'Email sent' });
nodemailer.createTransport.mockReturnValue({ sendMail: mockSendMail });
process.env.JWT_SECRET = 'test_secret';
process.env.FRONTEND_URL = 'http://localhost:3000';

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

  test('should not register a user with an existing username', async () => {
    const newUser = {
      username: 'testuser',
      email: 'testuser2@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };
  
    const response = await request(app).post('/auth/register').send(newUser);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Username already taken');
  });

  test('should not register a user with an existing email', async () => {
    const newUser = {
      username: 'testuser2',
      email: 'testuser@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };
  
    const response = await request(app).post('/auth/register').send(newUser);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email already exists');
  });

  test('should not login with a non-existing username', async () => {
    const loginData = {
      username: 'nonexistinguser',
      password: 'password123',
    };
  
    const response = await request(app).post('/auth/login').send(loginData);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid credentials');
  });

  test('should fetch user data by username', async () => {
    const response = await request(app).post('/auth/getUserData').send({ username: 'testuser' });
    expect(response.status).toBe(200);
    expect(response.body.username).toBe('testuser');
    expect(response.body.email).toBe('testuser@example.com');
  });

  test('should update user details', async () => {
    const updateData = {
      currentUsername: 'testuser',
      newUsername: 'updateduser',
      newEmail: 'updateduser@example.com',
      newPassword: 'newpassword123',
      confirmNewPassword: 'newpassword123',
      name: 'Updated',
      surname: 'User',
      age: 30,
    };
  
    const response = await request(app).post('/auth/updateUserDetails').send(updateData);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User details updated');
    expect(response.body.updatedFields.username).toBe('updateduser');
    expect(response.body.updatedFields.email).toBe('updateduser@example.com');
  });
  
  test('should not update user to an existing username', async () => {
    //Place users in database
    const newUser = {
      username: 'anotheruser',
      email: 'email@1.com',
      password: 'password123',
      confirmPassword: 'password123',
    };
    await request(app).post('/auth/register').send(newUser);

    const newUser2 = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    const response2 = await request(app).post('/auth/register').send(newUser2);

  
    const updateData = {
      currentUsername: 'testuser',
      newUsername: 'anotheruser',
    };
  
    const response = await request(app).post('/auth/updateUserDetails').send(updateData);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Username already taken');
  });
  
  test('should not update user to an existing email', async () => {
    const newUser = {
      username: 'anotheruser1',
      email: 'anotheruser1@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };
    await request(app).post('/auth/register').send(newUser);

    const newUser2 = {
      username: 'testuser1',
      email: 'testuser1@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };
    await request(app).post('/auth/register').send(newUser2);

    const updateData = {
      currentUsername: 'testuser',
      newEmail: 'anotheruser1@example.com',
    };
  
    const response = await request(app).post('/auth/updateUserDetails').send(updateData);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email already taken');
  });
  
  test('should update notification settings', async () => {
    const updateData = {
      username: 'testuser',
      notifications: {
        newDataAvailable: true,
        newResponseToPosts: false
      }
    };
  
    const response = await request(app).post('/auth/updateNotifications').send(updateData);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Notification settings updated successfully.');
  });
  
  jest.mock('nodemailer');

  // test('should handle forgot password request', async () => {
  //   const response = await request(app).post('/auth/forgot-password').send({ email: 'testuser@example.com' });
  //   console.log('Forgot password result:', response.body);
  //   expect(response.status).toBe(200);
  //   expect(response.body.message).toBe('Password reset link sent');
  //   expect(mockSendMail).toHaveBeenCalled();
  // });  
  
  
  test('should reset password', async () => {
    process.env.JWT_SECRET = 'test_secret';
    jwt.verify.mockReturnValue({ email: 'testuser@example.com' });
  
    const resetData = {
      token: 'mockedToken',
      newPassword: 'newPassword123',
      confirmNewPassword: 'newPassword123'
    };
  
    const response = await request(app).post('/auth/reset-password').send(resetData);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Password reset successfully');
  });  
  

});
