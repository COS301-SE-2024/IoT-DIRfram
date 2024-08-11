const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

module.exports = (client) => {
  const db = client.db('Auth'); 
  const usersCollection = db.collection('Users');

  const generateSalt = () => {
    return crypto.randomBytes(16).toString('hex');
  };

  const hashPassword = (password, salt) => {
    return crypto.createHash('sha256').update(password + salt).digest('hex');
  };

  router.post('/register', async (req, res) => {
    try {
      const { username, email, password, confirmPassword } = req.body;

      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }

      //Check e-mail
      const emailExists = await usersCollection.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      //Check username
      const usernameExists = await usersCollection.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({ message: 'Username already taken' });
      }

      const salt = generateSalt();
      const hashedPassword = hashPassword(password, salt);

      const newUser = {
        username,
        email,
        password: hashedPassword,
        salt: salt,
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
      const user = await usersCollection.findOne({ username });
      if (user) {
        const hashedPassword = hashPassword(password, user.salt);
        if (hashedPassword === user.password) {
          const sessionId = uuidv4();
          res.json({ message: 'Login successful', sessionId });
        } else {
          res.status(400).send('Invalid credentials');
        }
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

  router.get('/users', async (req, res) => {
    try {
      const users = await usersCollection.find().toArray();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.post('/getUserData', async (req, res) => {
    try {
      const { username } = req.body;
      const user = await usersCollection.findOne({ username: username });
      if (user) {
        res.json(user);
      } else {
        res.status(404).send('User not found');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.post('/updateUserDetails', async (req, res) => {
    try {
        const { currentUsername, newUsername, newEmail, newPassword, confirmNewPassword, name, surname, age } = req.body;
      
        // Validate that the current username is provided
        if (!currentUsername) {
            return res.status(400).json({ message: 'Current username is required' });
        }

        // Find the user in the database
        const user = await usersCollection.findOne({ username: currentUsername });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Initialize the update object
        const updateFields = {};

        // Handle username update
        if (newUsername && newUsername !== currentUsername) {
            // Check if the new username is unique
            const existingUserWithUsername = await usersCollection.findOne({ username: newUsername });
            if (existingUserWithUsername) {
                return res.status(400).json({ message: 'Username already taken' });
            }
            updateFields.username = newUsername;
        }

        // Handle email update
        if (newEmail && newEmail !== user.email) {
            // Check if the new email is unique
            const existingUserWithEmail = await usersCollection.findOne({ email: newEmail });
            if (existingUserWithEmail) {
                return res.status(400).json({ message: 'Email already taken' });
            }
            updateFields.email = newEmail;
        }

        // Handle password update
        if (newPassword) {
            if (newPassword !== confirmNewPassword) {
                return res.status(400).json({ message: 'Passwords do not match' });
            }
            const salt = generateSalt();
            const hashedPassword = hashPassword(newPassword, salt);
            updateFields.password = hashedPassword;
            updateFields.salt = salt;
        }

        // Add other optional fields if provided
        if (name) updateFields.name = name;
        if (surname) updateFields.surname = surname;
        if (age) updateFields.age = age;

        // Update user details in the database
        await usersCollection.updateOne(
            { username: currentUsername },
            { $set: updateFields }
        );

        res.status(200).json({ message: 'User details updated', updatedFields: updateFields });
    } catch (err) {
        console.error('Error updating user details:', err);
        res.status(500).json({ error: 'Failed to update user details' });
    }
});

  return router;
};
