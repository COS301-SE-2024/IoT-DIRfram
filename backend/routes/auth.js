const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

module.exports = (client) => {
  const db = client.db('Auth');
  const usersCollection = db.collection('Users');

  const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
  };

  router.post('/register', async (req, res) => {
    try {
      const { username, email, password, confirmPassword } = req.body;

      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }

      const hashedPassword = hashPassword(password);

      const newUser = {
        username,
        email,
        password: hashedPassword,
      };

      console.log('Received new user:', newUser);

      await usersCollection.insertOne(newUser);
      console.log('User registered successfully');
      res.status(201).json({ message: 'User registered' });
    } catch (err) {
      console.error('Error registering user:', err);
      res.status(500).json(err);
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = hashPassword(password);
      const user = await usersCollection.findOne({ username, password: hashedPassword });
      if (user) {
        const sessionId = uuidv4(); //unique session id
        res.json({ message: 'Login successful', sessionId });
      } else {
        res.status(400).send('Invalid credentials');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

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
