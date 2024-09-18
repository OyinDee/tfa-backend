const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const user = new User({ username, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
} catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {

    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ user: user }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
