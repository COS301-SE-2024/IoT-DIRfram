const request = require('supertest');
const express = require('express');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const deviceRoutes = require('../routes/device');

const app = express();
app.use(express.json());

let mongoServer;
let mockClient;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  mockClient = new MongoClient(uri, { useUnifiedTopology: true });
  await mockClient.connect();
  app.use('/device', deviceRoutes(mockClient));
});

afterAll(async () => {
  await mockClient.close();
  await mongoServer.stop();
});

describe('Device API', () => {
  test('should fetch all devices', async () => {
    const response = await request(app).get('/device/devices');
    expect(response.status).toBe(200);
  });

  test('should add a new device', async () => {
    const newDevice = {
      device_id: 'device123',
      deviceName: 'Test Device',
    };

    const response = await request(app).post('/device/addDevice').send(newDevice);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Device added');
  });

  //add more tests for other endpoints
});
