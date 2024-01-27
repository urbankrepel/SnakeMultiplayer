const path = require("path");
const fs = require("fs");
const ejs = require("ejs");

function renderWithLayout(contentFilePath, title, res) {
  const content = fs.readFileSync(contentFilePath, "utf8");

  ejs.renderFile(
    path.join(__dirname, "../views/layout.ejs"),
    { title, body: content },
    (err, html) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error rendering page");
      } else {
        res.send(html);
      }
    }
  );
}

module.exports = renderWithLayout;
