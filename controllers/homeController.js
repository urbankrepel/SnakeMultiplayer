const path = require("path");
const renderWithLayout = require("../utilities/renderWithLayout");
const userModel = require("../models/userModel");

exports.gamePage = async (req, res) => {
  const user = await userModel.findById(req.user.id);
  renderWithLayout(
    path.join(__dirname, "../views/game.ejs"),
    { user: user },
    "Play game",
    res
  );
};

exports.userHomePage = async (req, res) => {
  const user = await userModel.findById(req.user.id);
  renderWithLayout(
    path.join(__dirname, "../views/home.ejs"),
    { user: user },
    "Home",
    res
  );
};
