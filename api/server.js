const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");

const usersRouter = require("../users/users-router.js");

const server = express();

// regarding cookies:
const sessionConfig = {
  name: "monster",
  secret: process.env.SESSION_SECRET || "secret!",
  resave: false,
  saveUnitialized: process.env.SEND_COOKIES || true,
  cookie: {
    maxAge: 1000 * 60 * 10, // good for 10 min in ms
    secure: process.env.USE_SECURE_COOKIES || false,
    httpOnly: true,
  }
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api", usersRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;
