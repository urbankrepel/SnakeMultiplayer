const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const authToken = require("../middleware/authToken");

// Define routes
router.get("/game", authToken, homeController.gamePage);
router.get("/home", authToken, homeController.userHomePage);

module.exports = router;
