const request = require('supertest');
const express = require('express');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const deviceRoutes = require('../routes/device');

const app = express();
app.use(express.json());
var mongoose = require('mongoose');
var testID = new mongoose.Types.ObjectId();

let mongoServer;
let mockClient;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  mockClient = new MongoClient(uri, { useUnifiedTopology: true });
  await mockClient.connect();
  app.use('/device', deviceRoutes(mockClient));
  //Create a test user
  const db = mockClient.db('Auth');
  const usersCollection = db.collection('Users');
  await usersCollection.insertOne({
    username: 'testuser',
    email: 'testuser@gmail.com',
    password: 'password123',
    salt:'placeholder',
  });
  //Create a test device
  await mockClient.db('uart_data').collection('pi_devices').insertOne({
    _id: 'device123',
    device_name: 'Test Device',
  });
  //Create a test device file
  await mockClient.db('uart_data').collection('file_data').insertOne({
    _id: testID,
    device_id: 'device123',
    filename: 'testfile.txt',
    data: 'test data',
  });
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
      device_id: 'device1234',
      deviceName: 'Test Device',
    };

    const response = await request(app).post('/device/addDevice').send(newDevice);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Device added');
  });

  test('should fetch files for a device', async () => {
    const response = await request(app).get('/device/getDeviceFiles?device_id=device1234');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('should add a device to a user', async () => {
    const response = await request(app).post('/device/addDeviceToUser').send({ device_id: 'device123', username: 'testuser' });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Device added to user');
  });

  test('should remove a device from a user', async () => {
    //First add device to user
    await request(app).post('/device/addDeviceToUser').send({ device_id: 'device123', username: 'testuser' });

    const response = await request(app).post('/device/removeDeviceFromUser').send({ device_id: 'device123', username: 'testuser' });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Device removed from user');
  });

  test('should delete a device', async () => {
    const response = await request(app).post('/device/deleteDevice').send({ device_id: 'device123' });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Device deleted');
  });

  test('should return an error when trying to delete a non-existent device', async () => {
    const response = await request(app).post('/device/deleteDevice').send({ device_id: 'device' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Device does not exist');
  });

  test('should retrieve devices for user', async () => {
    const response = await request(app).get('/device/devicesForUser').send({ username: 'testuser' });
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('should delete a device file', async () => {
    const response = await request(app).delete('/device/deleteFile').send({ file_id: testID });
    expect(response.status).toBe(200);
  });
});
