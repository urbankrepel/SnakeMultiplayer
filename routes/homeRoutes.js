const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const authToken = require("../middleware/authToken");

// Define routes
router.get("/", authToken, homeController.homePage);

module.exports = router;
