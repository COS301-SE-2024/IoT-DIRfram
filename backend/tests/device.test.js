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
  
  const Clientdb = mockClient.db('Auth');
  const usersCollection = Clientdb.collection('Users');
  await usersCollection.insertOne({
    username: 'testuser',
    email: 'testuser@gmail.com',
    password: 'password123',
    salt: 'placeholder',
  });

  const db = mockClient.db('uart_data');
  
  const piDevicesCollection = db.collection('pi_devices');
  await piDevicesCollection.insertOne({
    _id: 'device123',
    device_name: 'Test Device',
  });
  
  const deviceFilesCollection = db.collection('file_data');
  await deviceFilesCollection.insertOne({
    _id: testID,
    device_id: 'device123',
    filename: 'testfile.txt',
    data: 'test data',
  });

  const usersToDevicesCollection = db.collection('users_devices');
  await usersToDevicesCollection.insertOne({
    username: 'testuser',
    device_id: 'device123',
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
    expect(response.body).toEqual([
      {
        _id: 'device123',
        device_name: 'Test Device',
      },
    ]);
  });

  test('should fetch device name', async () => {
    const response = await request(app).get('/device/getDeviceName?device_id=device123');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ device_name: 'Test Device' });
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
    const response = await request(app).get('/device/getDeviceFiles?device1234');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
      _id: testID.toString(),
      device_id: 'device123',
      filename: 'testfile.txt',
      data: 'test data',
      },
    ]);
  });

  test('should add a device to a user', async () => { //should already be assigned
    const response = await request(app).post('/device/addDeviceToUser').send({ device_id: 'device1234', username: 'testuser' });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Device added to user');
  });

  test('should remove a device from a user', async () => {
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
    const response = await request(app).post('/device/deleteDevice').send({ device_id: 'nonexistentdevice' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Device does not exist');
  });

  test('should retrieve devices for user', async () => {
    //await request(app).post('/device/addDeviceToUser').send({ device_id: 'device123', username: 'testuser' });

    const response = await request(app).post('/device/devicesForUser').send({ username: 'testuser' });
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        _id: 'device1234',
        deviceName: 'Test Device',
      },
    ]);
  });

  test('should delete a device file', async () => {
    const response = await request(app).delete('/device/deleteFile').send({ file_id: testID.toString() });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('File deleted');
  });

  test('should return error for non-existent device in getDeviceName', async () => {
    const response = await request(app).get('/device/getDeviceName?something');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Device not found');
  });

  test('should return an error if username is not provided in devicesForUser', async () => {
    const response = await request(app).post('/device/devicesForUser').send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Username is required');
  });

  test('should return an error if device_id is missing in addDevice', async () => {
    const response = await request(app).post('/device/addDevice').send({ deviceName: 'New Device' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Device ID is required');
  });

  test('should return an error if deviceName is missing in addDevice', async () => {
    const response = await request(app).post('/device/addDevice').send({ device_id: 'device1234' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Device name is required');
  });

  test('should return an error if device_id is invalid in updateDeviceName', async () => {
    const response = await request(app).post('/device/updateDeviceName').send({ device_id: 'invalid_id', device_name: 'New Name', username: 'testuser' });
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Device not assigned to user');
  }); 

  test('should return an error if device_id is missing in updateDeviceName', async () => {
    const response = await request(app).post('/device/updateDeviceName').send({ device_name: 'New Name', username: 'testuser' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Device ID is required');
  });
  
  test('should return an error if device_name is missing in updateDeviceName', async () => {
    const response = await request(app).post('/device/updateDeviceName').send({ device_id: 'device123', username: 'testuser' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Device name is required');
  });
  
  test('should return an error if file_id is invalid in deleteFile', async () => {
    const response = await request(app).delete('/device/deleteFile').send({ file_id: testID });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('File does not exist');
  });
  
  
  
});
