// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const userController = require("../controllers/userController");
const renderWithLayout = require("../utilities/renderWithLayout");
const path = require("path");

// Define routes

router.get("/", (req, res) => {
  renderWithLayout(
    path.join(__dirname, "../views/users/new.ejs"),
    {},
    "Create a new user",
    res
  );
});

router.post(
  "/",
  [
    body("username")
      .trim()
      .isLength({ min: 3 })
      .escape()
      .withMessage("Username must be at least 3 characters long"),
    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email address"),
    body("password")
      .trim()
      .isLength({ min: 3 })
      .escape()
      .withMessage("Password must be at least 3 characters long"),
    body("confirmPassword")
      .trim()
      .isLength({ min: 3 })
      .escape()
      .withMessage("Confirm password must be at least 3 characters long"),
  ],
  userController.createUser
);

router.get("/login", (req, res) => {
  renderWithLayout(
    path.join(__dirname, "../views/users/login.ejs"),
    {},
    "Login",
    res
  );
});

router.post(
  "/login",
  [
    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email address"),
    body("password")
      .trim()
      .isLength({ min: 3 })
      .escape()
      .withMessage("Password must be at least 3 characters long"),
  ],
  userController.loginUser
);

router.get("/logout", userController.logoutUser);

module.exports = router;
