// server.js
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

const app = express();

app.use(express.json()); // Used to parse JSON bodies
app.use("/users", userRoutes);
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
