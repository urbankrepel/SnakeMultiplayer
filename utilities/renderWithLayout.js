const path = require("path");
const fs = require("fs");
const ejs = require("ejs");

async function renderWithLayout(contentFilePath, data = {}, title, res) {
  // const content = render cotent with ejs
  const content = await new Promise((resolve, reject) => {
    ejs.renderFile(contentFilePath, data, (err, html) => {
      if (err) {
        reject(err);
      } else {
        resolve(html);
      }
    });
  });

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
