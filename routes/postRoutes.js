const express = require('express');
const Post = require('../models/Post');
const requireLogin = require('../middleware/requireLogin');
const router = express.Router();

// Get All Posts
router.get('/', requireLogin, async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate('postedBy', '_id name')
      .populate('comments.postedBy', '_id name')
      .sort('-createdAt');
    return res.json({ posts });
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: error.message });
  }
});

// Get All Posts from following only
router.get('/following', requireLogin, async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: { $in: req.user.following } })
      .populate('postedBy', '_id name')
      .populate('comments.postedBy', '_id name')
      .sort('-createdAt');
    return res.json({ posts });
  } catch (error) {
    console.log(error);
    res.status(422).json({ error: error.message });
  }
});

// Create Posts
router.post('/create', requireLogin, async (req, res) => {
  const { title, body, photo } = req.body;
  
  if (!title || !body || !photo) {
    return res.status(422).json({ error: 'Plase add all the fields' });
  }
  const post = new Post({ title, body, photo, postedBy: req.user });
  try {
    const newPost = await post.save();
    res.json({ msg: 'New Post added', post: newPost });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

// Get My Posts
router.get('/me', requireLogin, async (req, res) => {
  try {
    const myPosts = await Post.find({ postedBy: req.user._id }).populate(
      'postedBy',
      '_id name'
    ).sort('-createdAt');
    return res.json({ myPosts });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

// Like Post
router.put('/like', requireLogin, async (req, res) => {
  const { postId } = req.body;
  const { _id } = req.user;
  try {
    const postLiked = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { likes: _id },
      },
      { new: true }
    ).populate('postedBy', '_id name').populate('comments.postedBy', '_id name');
    return res.json({ postLiked });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: error.message });
  }
});

// UNLike Post
router.put('/unlike', requireLogin, async (req, res) => {
  const { postId } = req.body;
  const { _id } = req.user;
  try {
    const postLiked = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: _id },
      },
      { new: true }
    ).populate('postedBy', '_id name').populate('comments.postedBy', '_id name');
    return res.json({ postLiked });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: error.message });
  }
});

// Write Comment
router.put('/comment', requireLogin, async (req, res) => {
  const { postId, text } = req.body;
  const comment = { text: text, postedBy: req.user._id };
  try {
    const postCommented = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: comment },
      },
      { new: true }
    )
      .populate('postedBy', '_id name')
      .populate('comments.postedBy', 'id name');
    return res.json({ postCommented });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: error.message });
  }
});

// Delete Post
router.delete('/delete/:id', requireLogin, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPost = await Post.findOne({ _id: id }).populate(
      'postedBy',
      '_id'
    );
    if (deletedPost) {
      if (deletedPost.postedBy._id.toString() === req.user._id.toString()) {
        await deletedPost.remove();
        res.json({ deletedPost });
      } else {
        res.json({ msg: 'You cannot dalate this post' });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: error.message });
  }
});

module.exports = router;
