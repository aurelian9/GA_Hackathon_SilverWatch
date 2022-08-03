const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const User = require("../models/User");
const auth = require("../middleware/auth");

let refreshTokens = [];
console.log(refreshTokens);

router.post("/login", async (req, res) => {
  try {
    // find user
    const user = await User.findOne({ username: req.body.username });

    // if user is not found, then return error message;
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "user is not found" });
    }

    // match the password
    const result = await bcrypt.compare(req.body.password, user.hash);

    if (!result) {
      console.log("username or password error");
      return res
        .status(401)
        .json({ status: "error", message: "username or password error" });
    }

    const payload = {
      id: user._id,
      username: user.username,
    };

    const access = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: "20m", // if you put number here, the time is in miliseconds
      jwtid: uuidv4(),
    });

    const refresh = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: "30d", // if you put number here, the time is in miliseconds
      jwtid: uuidv4(),
    });
    refreshTokens.push(refresh);
    const response = { access, refresh };
    console.log(refreshTokens);
    res.json(response);
  } catch (err) {
    console.log("POST /login: ", err);
    res.status(400).json({ status: "error", message: "login failed" });
  }
});

router.post("/refresh", (req, res) => {
  try {
    const refreshToken = req.body.refresh;
    console.log(refreshTokens);
    console.log("refreshToken: ", refreshToken);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET); // check if the refresh token is what you currently have

    const payload = {
      id: decoded.id,
      username: decoded.username,
    };

    // create access token
    const access = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: "20m", // if you put number here, the time is in miliseconds
      jwtid: uuidv4(),
    });

    const response = { access };

    res.json(response);
  } catch (error) {
    console.log("POST /refresh ", error);
    res.status(401).json({ status: "error", message: "unauthorized" });
  }
});

router.post("/create", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ status: "error", message: "user name is taken" });
    }

    const hash = await bcrypt.hash(req.body.password, 12);
    const createdUser = await User.create({
      email: req.body.email,
      hash,
      name: req.body.name,
    });

    console.log("created user: ", createdUser);
    res.json({ status: "ok", message: "user created" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "error", message: "an error has occured" });
  }
});

router.get("/users", auth, async (req, res) => {
  const users = await User.find().select("username");
  res.json(users);
});

router.delete("/logout", auth, async (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  console.log("successfully logged out");
  res.status(204).json({ message: "successfully logged out" });
});

module.exports = router;
