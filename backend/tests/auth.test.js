const request = require('supertest');
const mockSendMail = jest.fn((mailOptions, callback) => callback());
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: mockSendMail
  })
}));
jest.mock('jsonwebtoken');

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

  describe('Forgot Password Endpoint', () => {
    beforeEach(async () => {
      // Clear previous mock calls and implementations
      mockSendMail.mockClear();
      nodemailer.createTransport.mockClear();
      jwt.sign.mockClear();

      // Reset the in-memory database
      const db = mockClient.db();
      await db.collection('users').deleteMany({});

      // Register a test user
      const newUser = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };
      await request(app).post('/auth/register').send(newUser);
    });

    test('should handle forgot password request successfully', async () => {
      // Mock jwt.sign to return a fixed token
      jwt.sign.mockReturnValue('mockedToken');

      const response = await request(app)
        .post('/auth/forgot-password')
        .send({ email: 'testuser@example.com' });

      // Assertions
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Password reset link sent');
      expect(mockSendMail).toHaveBeenCalledTimes(1);

      // Verify the email content
      const mailOptions = mockSendMail.mock.calls[0][0];
      expect(mailOptions.to).toBe('testuser@example.com');
      expect(mailOptions.subject).toBe('Password Reset');
      expect(mailOptions.text).toContain('Click the link to reset your password');
      expect(mailOptions.text).toContain(process.env.FRONTEND_URL);
      expect(mailOptions.text).toContain('mockedToken');
    });

    test('should return 404 if email not found', async () => {
      const response = await request(app)
        .post('/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Email not found');
      expect(mockSendMail).not.toHaveBeenCalled();
    });

    test('should return 500 if email not sent', async () => {
      // Mock sendMail to throw an error
      mockSendMail.mockImplementationOnce((mailOptions, callback) => callback(new Error('Failed to send email')));

      const response = await request(app)
        .post('/auth/forgot-password')
        .send({ email: 'testuser@example.com' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Error sending email');
    });
  });
  

});
