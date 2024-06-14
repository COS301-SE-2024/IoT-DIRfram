const express = require('express');
const router = express.Router();
const User = require('../models/User'); //need to change this model, very simple model for now

//register User
router.post('/register', (req, res) => {
    const newUser = new User(req.body);
    newUser.save()
        .then(() => res.status(201).send('User registered'))
        .catch(err => res.status(500).json(err));
});

//authenticate User
router.post('/login', (req, res) => {
    User.findOne({ email: req.body.email, password: req.body.password })
        .then(user => user ? res.json({ token: 'auth-token' }) : res.status(400).send('Invalid credentials'))
        .catch(err => res.status(500).json(err));
});

//check if Username Exists
router.post('/check-username', (req, res) => {
    const { username } = req.body;
    User.findOne({ username })
        .then(user => user ? res.status(400).send('Username already exists') : res.send('Username available'))
        .catch(err => res.status(500).json(err));
});

//check if Email Exists
router.post('/check-email', (req, res) => {
    const { email } = req.body;
    User.findOne({ email })
        .then(user => user ? res.status(400).send('Email already exists') : res.send('Email available'))
        .catch(err => res.status(500).json(err));
});

module.exports = router;
