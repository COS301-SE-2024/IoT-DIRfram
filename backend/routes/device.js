const express = require('express');
const router = express.Router();

module.exports = (client) => {
  const db = client.db('your-database-name'); // Replace with your database name
  const devicesCollection = db.collection('devices');

  // Retrieve Data
  router.get('/retrieve', async (req, res) => {
    try {
      const data = await devicesCollection.find().toArray();
      res.json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // Store Data
  router.post('/store', async (req, res) => {
    try {
      const newData = req.body;
      await devicesCollection.insertOne(newData);
      res.status(201).send('Data stored');
    } catch (err) {
      res.status(500).json(err);
    }
  });

  return router;
};
