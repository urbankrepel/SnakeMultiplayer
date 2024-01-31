// controllers/userController.js
const UserModel = require("../models/userModel");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors
        .array()
        .map((err) => err.msg)
        .join(", ");
      return res.status(400).json({ message: formattedErrors });
    }
    const { username, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const findUser = await UserModel.findOne({ username });
    if (findUser) {
      return res
        .status(400)
        .json({ message: "User already exists whith that username" });
    }

    const findEmail = await UserModel.findOne({ email });
    if (findEmail) {
      return res
        .status(400)
        .json({ message: "User already exists whith that email" });
    }

    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", redirect: "/users/login" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors
        .array()
        .map((err) => err.msg)
        .join(", ");
      return res.status(400).json({ message: formattedErrors });
    }
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const userToken = { id: user._id };
    const token = jwt.sign(userToken, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
      secure: process.env.NODE_ENV === "production",
    });
    res
      .status(200)
      .json({ message: "User logged in successfully", redirect: "/home" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logoutUser = (req, res) => {
  res.clearCookie("token");
  res.status(200).redirect("/");
};
