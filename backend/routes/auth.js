const express = require('express');
const router = express.Router();
const crypto = require('crypto');

module.exports = (client) => {
  const db = client.db('sample_mflix'); // Use the sample_mflix database
  const usersCollection = db.collection('users');

  const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
  };

  // Register User
  router.post('/register', async (req, res) => {
    try {
      const newUser = req.body;
      console.log('Received new user:', newUser); // Log received data
      newUser.password = hashPassword(newUser.password); // Hash the password
      await usersCollection.insertOne(newUser);
      console.log('User registered successfully');
      res.status(201).json({ message: 'User registered' }); // Send JSON response
    } catch (err) {
      console.error('Error registering user:', err);
      res.status(500).json(err);
    }
  });

  // Authenticate User
  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = hashPassword(password);
      const user = await usersCollection.findOne({ username, password: hashedPassword });
      if (user) {
        res.json({ message: 'Login successful', username: user.username });
      } else {
        res.status(400).send('Invalid credentials');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // Check if Username Exists
  router.post('/check-username', async (req, res) => {
    try {
      const { username } = req.body;
      const user = await usersCollection.findOne({ username });
      if (user) {
        res.status(400).send('Username already exists');
      } else {
        res.send('Username available');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // Check if Email Exists
  router.post('/check-email', async (req, res) => {
    try {
      const { email } = req.body;
      const user = await usersCollection.findOne({ email });
      if (user) {
        res.status(400).send('Email already exists');
      } else {
        res.send('Email available');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

  return router;
};
