const request = require('supertest');
const express = require('express');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const postsRoutes = require('../routes/posts');
const { ObjectId } = require('mongodb');

const app = express();
app.use(express.json());

let mongoServer;
let mockClient;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    mockClient = new MongoClient(uri, { useUnifiedTopology: true });
    await mockClient.connect();
    
    const db = mockClient.db('uart_data');
    
    // Clear existing data
    await db.collection('Posts').deleteMany({});
    await db.collection('Responses').deleteMany({});
  
    // Insert test data
    const postResult = await db.collection('Posts').insertOne({
      _id: new ObjectId('123456789012345678901234'),
      title: 'Test Post',
      content: 'Test Content',
      authorId: 'testuser',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  
    // console.log('Inserted post:', postResult.insertedId);
  
    const responseResult = await db.collection('Responses').insertOne({
      _id: new ObjectId('123456789012345678901235'),
      postId: '123456789012345678901234',
      content: 'Test Response',
      authorId: 'responder',
      createdAt: new Date(),
      likes: [],
      dislikes: []
    });
  
    // console.log('Inserted response:', responseResult.insertedId);
  
    app.use('/posts', postsRoutes(mockClient));
});

beforeEach(async () => {
    const db = mockClient.db('uart_data');
    await db.collection('Posts').deleteMany({});
    await db.collection('Responses').deleteMany({});
  
    await db.collection('Posts').insertOne({
      _id: new ObjectId('123456789012345678901234'),
      title: 'Test Post',
      content: 'Test Content',
      authorId: 'testuser',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  
    await db.collection('Responses').insertOne({
      _id: new ObjectId('123456789012345678901235'),
      postId: '123456789012345678901234',
      content: 'Test Response',
      authorId: 'responder',
      createdAt: new Date(),
      likes: [],
      dislikes: []
    });
  });
  
  

afterAll(async () => {
  await mockClient.close();
  await mongoServer.stop();
});

describe('Posts API', () => {
  test('should create a new post', async () => {
    const newPost = {
      title: 'New Post',
      content: 'New Content',
      authorId: 'testuser'
    };

    const response = await request(app).post('/posts').send(newPost);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Post created');
  });

  test('should get all posts', async () => {
    const response = await request(app).get('/posts');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('should create a response to a post', async () => {
    const newResponse = {
      postId: '123456789012345678901234',
      content: 'Test Response',
      authorId: 'responder'
    };

    const response = await request(app).post('/posts/responses').send(newResponse);
    expect(response.status).toBe(201);
    expect(response.body.content).toBe('Test Response');
  });

  test('should delete a post', async () => {
    const response = await request(app).delete('/posts/123456789012345678901234');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Post deleted');
  });

  test('should delete a response', async () => {
    const responseId = '123456789012345678901235';
    const response = await request(app).delete(`/posts/responses/${responseId}`).send({ username: 'responder' });
    // console.log('Delete response result:', response.body);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Response deleted');
  });

  test('should get post details with responses', async () => {
    const postId = '123456789012345678901234';
    const response = await request(app).get(`/posts/${postId}`);
    // console.log('Get post details result:', response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('post');
    expect(response.body).toHaveProperty('responses');
  });

  test('should like a response', async () => {
    const newResponse = {
      postId: '123456789012345678901234',
      content: 'Test Response',
      authorId: 'responder'
    };
    const createRes = await request(app).post('/posts/responses').send(newResponse);
    const responseId = createRes.body._id;

    const response = await request(app).post(`/posts/responses/${responseId}/like`).send({ userId: 'liker' });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Response liked');
  });

  test('should dislike a response', async () => {
    const newResponse = {
      postId: '123456789012345678901234',
      content: 'Test Response',
      authorId: 'responder'
    };
    const createRes = await request(app).post('/posts/responses').send(newResponse);
    const responseId = createRes.body._id;

    const response = await request(app).post(`/posts/responses/${responseId}/dislike`).send({ userId: 'disliker' });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Response disliked');
  });

  test('should unlike a response', async () => {
    const newResponse = {
      postId: '123456789012345678901234',
      content: 'Test Response',
      authorId: 'responder'
    };
    const createRes = await request(app).post('/posts/responses').send(newResponse);
    const responseId = createRes.body._id;

    await request(app).post(`/posts/responses/${responseId}/like`).send({ userId: 'liker' });
    const response = await request(app).post(`/posts/responses/${responseId}/unlike`).send({ userId: 'liker' });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Like removed');
  });

  test('should undislike a response', async () => {
    const newResponse = {
      postId: '123456789012345678901234',
      content: 'Test Response',
      authorId: 'responder'
    };
    const createRes = await request(app).post('/posts/responses').send(newResponse);
    const responseId = createRes.body._id;

    await request(app).post(`/posts/responses/${responseId}/dislike`).send({ userId: 'disliker' });
    const response = await request(app).post(`/posts/responses/${responseId}/undislike`).send({ userId: 'disliker' });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Dislike removed');
  });
});