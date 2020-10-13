const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  photo: { type: String, default: "https://res.cloudinary.com/amrelgendy/image/upload/v1602561748/no-image_fmsa74.png" },
  followers: [{ type: ObjectId, ref: 'User' }],
  following: [{ type: ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('User', userSchema)