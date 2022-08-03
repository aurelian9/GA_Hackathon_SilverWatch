const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const seedVolunteer = require("./seedVolunteer");

const Volunteer = require("../models/Volunteer");
const auth = require("../middleware/auth");

let refreshTokens = [];
console.log(refreshTokens);

router.post("/login", async (req, res) => {
  try {
    // find volunteer
    const volunteer = await Volunteer.findOne({ email: req.body.email });

    // if volunteer is not found, then return error message;
    if (!volunteer) {
      return res
        .status(400)
        .json({ status: "error", message: "volunteer is not found" });
    }

    // match the password
    const result = await bcrypt.compare(req.body.password, user.hash);

    if (!result) {
      console.log("email or password error");
      return res
        .status(401)
        .json({ status: "error", message: "email or password error" });
    }

    const payload = {
      id: volunteer._id,
      email: volunteer.email,
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
      email: decoded.email,
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

router.post("/register", async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({ email: req.body.email });
    if (volunteer) {
      return res
        .status(400)
        .json({ status: "error", message: "email is taken" });
    }

    const hash = await bcrypt.hash(req.body.password, 12);
    const createdVolunteer = await Volunteer.create({
      email: req.body.email,
      hash,
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      postalCode: req.body.postalCode,
    });

    console.log("successfully registered: ", createdVolunteer);
    res.json({ status: "ok", message: "successfully registered" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "error", message: "an error has occured" });
  }
});

router.delete("/logout", auth, async (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  console.log("successfully logged out");
  res.status(204).json({ message: "successfully logged out" });
});

router.get("/seed", async (req, res) => {
  await Volunteer.deleteMany();

  seed.forEach((volunteer) => {
    volunteer.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
  });

  await Volunteer.create(seed, (err, createdVolunteers) => {
    console.log(createdVolunteers);

    res.status(200).json(createdVolunteers);
  });
});

router.module.exports = router;
