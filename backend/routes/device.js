const express = require('express');
const router = express.Router();

module.exports = (client) => {
  const db = client.db('uart_data'); 
  const clientDB = client.db('Auth'); 
  const piDevicesCollection = db.collection('pi_devices'); 
  const usersCollection = clientDB.collection('Users');
  const usersToDevicesCollection = clientDB.collection('UsersToDevices');

  router.get('/devices', async (req, res) => {
    try {
      const devices = await piDevicesCollection.find({}).toArray();
      res.json(devices);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch devices' });
    }
  });

  router.post('/addDeviceToUser', async (req, res) => {
    try {
      const { deviceID, username } = req.body;

      //Find user in Auth database
      const user = await usersCollection.findOne({ username });

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      //Find device in pi_devices database
      const device = await piDevicesCollection.findOne({
        _id: deviceID,
      });

      if (!device) {
        return res.status(400).json({ error: 'Device does not exist' });
      }

      //Check if device is already assigned to user
      const userToDevice = await usersToDevicesCollection.findOne({
        username,
        deviceID,
      });

      if (userToDevice) {
        return res.status(400).json({ error: 'Device already assigned to user' });
      }

      //Add device to user
      await usersToDevicesCollection.insertOne({
        username,
        deviceID,
      });

    } catch (err) {
      res.status(500).json({ error: 'Failed to add device' });
    }
  });

  return router;
};
