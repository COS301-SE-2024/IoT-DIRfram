const express = require('express');
const router = express.Router();

module.exports = (client) => {
  const db = client.db('uart_data'); 
  const clientDB = client.db('Auth'); 
  const piDevicesCollection = db.collection('pi_devices'); 
  const usersCollection = clientDB.collection('Users');
  const usersToDevicesCollection = db.collection('users_devices');
  const deviceFilesCollection = db.collection('file_data');

  router.get('/devices', async (req, res) => {
    try {
      //Find all devices in pi_devices database
      const devices = await piDevicesCollection.find().toArray();
      res.json(devices);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch devices' });
    }
  });

  router.get('/getDeviceName', async (req, res) => { 
    try {
      const { device_id } = req.body;

      //Find device in pi_devices database
      const device = await piDevicesCollection.findOne({
        _id: device_id,
      });

      if (!device) {
        return res.status(400).json({ error: 'Device not found' });
      }

      //Construct json
      const deviceDetails = {
        device_name: device.device_name,
      };

      res.json(deviceDetails);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch device name' });
    }
  });
  
  router.get('/devicesForUser', async (req, res) => {
    try {
      const { username } = req.body;

      //Find user in Auth database
      const user = await usersCollection.findOne({
        username,
      });

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      //Find devices assigned to user
      const devices = await usersToDevicesCollection
        .find({ username })
        .toArray();
      
      const deviceIds = devices.map((device) => device.device_id);

      //Find device details
      const devicesDetails = await piDevicesCollection
        .find({ _id: { $in: deviceIds } })
        .toArray();

      res.json(devicesDetails);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch devices' });
    }
  });

  router.get('/getDeviceFiles', async (req, res) => {
    try{
      const { device_id } = req.query;

      //Find files for device
      const files = await deviceFilesCollection
        .find({ device_serial_number: device_id })
        .toArray();

      res.json(files);
    }
    catch (err) {
      res.status(500).json({ error: 'Failed to fetch files' });
    }
  });

  router.post('/addDevice', async (req, res) => {
    try {
      const { device_id, deviceName } = req.body;

      //Check if device already exists
      const device = await piDevicesCollection.findOne({
        _id: device_id,
      });

      if (device) {
        return res.status(400).json({ error: 'Device already exists' });
      }

      //Add device to pi_devices database
      await piDevicesCollection.insertOne({
        _id: device_id,
        deviceName,
      });

      return res.status(200).json({ message: 'Device added' });
    } 
    catch (err) {
      res.status(500).json({ error: 'Failed to add device' });
    }

  });

  router.post('/addDeviceToUser', async (req, res) => {
    try {
      const { device_id, username } = req.body;

      //Find user in Auth database
      const user = await usersCollection.findOne({
        username,
      });

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      //Find device in pi_devices database
      const device = await piDevicesCollection.findOne({
        _id: device_id,
      });

      if (!device) {
        return res.status(400).json({ error: 'Device does not exist' });
      }

      //Check if device is already assigned to user
      const userToDevice = await usersToDevicesCollection.findOne({
        username,
        device_id,
      });

      if (userToDevice) {
        return res.status(400).json({ error: 'Device already assigned to user' });
      }

      //Add device to user
      await usersToDevicesCollection.insertOne({
        username,
        device_id,
      });

      return res.status(200).json({ message: 'Device added to user' });

    } catch (err) {
      res.status(500).json({ error: 'Failed to add device' });
    }
  });

  router.post('/removeDeviceFromUser', async (req, res) => {
    try {
      const { device_id, username } = req.body;

      //Find user in Auth database
      const user = await usersCollection.findOne({
        username,
      });

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      //Find device in pi_devices database
      const device = await piDevicesCollection.findOne({
        _id: device_id,
      });

      if (!device) {
        return res.status(400).json({ error: 'Device does not exist' });
      }

      //Check if device is assigned to user
      const userToDevice = await usersToDevicesCollection.findOne({
        username,
        device_id,
      });

      if (!userToDevice) {
        return res.status(400).json({ error: 'Device not assigned to user' });
      }

      //Remove device from user
      await usersToDevicesCollection.deleteOne({
        username,
        device_id,
      });

      return res.status(200).json({ message: 'Device removed from user' });

    } catch (err) {
      res.status(500).json({ error: 'Failed to remove device' });
    }
  });

  router.post('/deleteDevice', async (req, res) => {
    try {
      const { device_id } = req.body;

      //Find device in pi_devices database
      const device = await piDevicesCollection.findOne({
        _id: device_id,
      });

      if (!device) {
        return res.status(400).json({ error: 'Device does not exist' });
      }

      //Delete device from pi_devices database
      await piDevicesCollection.deleteOne({
        _id: device_id,
      });

      //Delete device from users_devices database
      await usersToDevicesCollection.deleteMany({
        device_id,
      });

      return res.status(200).json({ message: 'Device deleted' });

    } catch (err) {
      res.status(500).json({ error: 'Failed to delete device' });
    }
  });

  router.delete('/deleteFile', async (req, res) => {
    try {
      const { file_id } = req.body;
      console.log(file_id);

      var mongoose = require('mongoose');
      var id = new mongoose.Types.ObjectId(file_id);
      //Find file in file_data database
      const file = await deviceFilesCollection.findOne({
        _id: id,
      });
      console.log(file);
      if (!file) {
        return res.status(400).json({ error: 'File does not exist' });
      }
      
      //Delete file from file_data database
      await deviceFilesCollection.deleteOne({
        _id: id,
      });

      return res.status(200).json({ message: 'File deleted' });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete file' });
    }
  });

  return router;
};
