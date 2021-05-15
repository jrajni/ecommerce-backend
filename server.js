const express = require("express");
const mongoose = require("mongoose");
const connectDb = require("./config/db");
const http = require("http");
const cors = require("cors");
const socketio = require("socket.io");
const basicAuth = require("express-basic-auth");
const expressValidator = require("express-validator");
const app = express();
app.use(cors());
app.use(expressValidator());

// sockets
const server = http.createServer(app);
const io = socketio(server, {
  pingInterval: 60000,
  pingTimeout: 180000,
  cookie: false,
  origins: "*",
  transports: ["flashsocket", "polling", "websocket"],
  // transports: ["websocket", "polling"],
  connection: "upgrade",
  allowUpgrades: "websocket",
});

// connect db
connectDb();
// init middleware
app.use(express.json({ limit: "50mb", extended: true }));
app.get("/api/home", (req, res) => {
  res.send("A successful response Api Running Fine");
});

// Define Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/product", require("./routes/products"));
app.use("/api/category", require("./routes/category"));

const PORT =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

const connection = mongoose.connection;
connection.on("error", (error) => console.log("Error: " + error));
