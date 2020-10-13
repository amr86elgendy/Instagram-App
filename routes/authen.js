const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');
const requireLogin = require('../middleware/requireLogin');
const router = express.Router();

// SignUp Route
router.post('/signup', async (req, res) => {
  const { name, email, password, photo } = req.body;
  if (!email || !password || !name) {
    return res.json({ error: 'Please add all the fields' });
  }
  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashedPassword, photo });
    const newUser = await user.save();
    res.json({ msg: 'Registered successfully' });
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

// SignIn Route
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ error: 'please add all the fields' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email' });
    }
    const correctPassword = await bcrypt.compare(password, user.password);
    if (correctPassword) {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '24h',
      });
      return res.json({
        msg: 'Logged in successfully',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          followers: user.followers,
          following: user.following,
          photo: user.photo,
        },
      });
    } else {
      return res.status(400).json({ msg: 'Invalid password' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

module.exports = router;
