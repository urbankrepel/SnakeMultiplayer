// models/userModel.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required."],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required."],
  },
  coins: {
    type: Number,
    default: 0,
  },
  highScore: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("User", userSchema);
