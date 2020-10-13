const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config/keys");
const User = require('../models/User');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).json({ error: 'you must be logged in' })
  }
  const token = authorization.slice(7, authorization.length);
  jwt.verify(token, JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(400).json({ error: 'Token not valid' })
    }
    const { _id } = payload;
    try {
      const user = await User.findById(_id);
      req.user = user;
      return next();
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.message })
    }
  })
}