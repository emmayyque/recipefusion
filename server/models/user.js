const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: Number,
    default: 2 //  1 = admin 2 = user
  },
otpHash: String,
  otpExpiry: Date,


}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
