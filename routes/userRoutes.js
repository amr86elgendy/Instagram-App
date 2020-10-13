const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');
const requireLogin = require('../middleware/requireLogin');
const router = express.Router();

// Get User Profile
router.get('/:id', requireLogin, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id }).select('-password');
    if (user) {
      const userPosts = await Post.find({ postedBy: id }).populate(
        'postedBy',
        '_id name'
      );
      res.json({ user, userPosts });
    } else {
      res.status(404).json({ msg: 'User not found' });
    }
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: error.message });
  }
});

// Follow User
router.put('/follow', requireLogin, async (req, res) => {
  const { id: followedId } = req.body; // the user that has been followed
  const { _id: followerId } = req.user; // the user that follows the other user
  try {
    const userFollowed = await User.findByIdAndUpdate(
      followedId,
      {
        $push: { followers: followerId },
      },
      { new: true }
    ).select('-password');
    const userFollower = await User.findByIdAndUpdate(
      followerId,
      {
        $push: { following: followedId },
      },
      { new: true }
    ).select('-password');
    return res.json({ userFollowed, userFollower });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: error.message });
  }
});

// UNFollow User
router.put('/unfollow', requireLogin, async (req, res) => {
  const { id: followedId } = req.body; // the user that has been followed
  const { _id: followerId } = req.user; // the user that follows the other user
  try {
    const userFollowed = await User.findByIdAndUpdate(
      followedId,
      {
        $pull: { followers: followerId },
      },
      { new: true }
    ).select('-password');
    const userFollower = await User.findByIdAndUpdate(
      followerId,
      {
        $pull: { following: followedId },
      },
      { new: true }
    ).select('-password');
    return res.json({ userFollowed, userFollower });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: error.message });
  }
});

// Update Photo
router.put('/updatephoto', requireLogin, async (req, res) => {
  const { photo } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { photo } },
      { new: true }
    );
    return res.json({ user });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: error.message });
  }
});

module.exports = router;
