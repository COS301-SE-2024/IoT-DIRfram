const express = require('express');
const router = express.Router();

module.exports = (client) => {
  const db = client.db('uart_data'); 
  const piDevicesCollection = db.collection('pi_devices'); 

  router.get('/devices', async (req, res) => {
    try {
      const devices = await piDevicesCollection.find({}).toArray();
      res.json(devices);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch devices' });
    }
  });

  return router;
};
