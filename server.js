// server.js
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const homeRoutes = require("./routes/homeRoutes");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const socketIo = require("socket.io");
const socketController = require("./controllers/socketController");
require("dotenv").config();

// Connect to MongoDB
connectDB();

const app = express();

const server = require("http").createServer(app);
const io = socketIo(server);

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json()); // Used to parse JSON bodies
app.use("/users", userRoutes);
app.use("/", homeRoutes);
app.use(express.static("public"));

// Socket.io
socketController(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
