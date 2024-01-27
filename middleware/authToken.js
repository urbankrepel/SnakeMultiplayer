const jwt = require("jsonwebtoken");

function authToken(req, res, next) {
  const token = req.cookies.token;

  if (token == null) return res.redirect("/users/login");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.redirect("/users/login");

    req.user = user;
    next();
  });
}

module.exports = authToken;
