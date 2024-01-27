const path = require("path");
const renderWithLayout = require("../utilities/renderWithLayout");
const userModel = require("../models/userModel");

exports.homePage = async (req, res) => {
  const user = await userModel.findById(req.user.id);
  renderWithLayout(
    path.join(__dirname, "../views/index.ejs"),
    { user: user },
    "Create a new user",
    res
  );
};
