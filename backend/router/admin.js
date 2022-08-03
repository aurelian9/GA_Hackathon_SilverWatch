const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const Admin = require("../models/Admin");
const auth = require("../middleware/auth");

let refreshTokens = [];
console.log(refreshTokens);

router.post("/login", async (req, res) => {
    try {
      const admin = await Admin.findOne({ email: req.body.email });
  
      if (!admin) {
        return res
          .status(400)
          .json({ status: "error", message: "volunteer is not found" });
      }
  
      const result = await bcrypt.compare(req.body.password, user.hash);
  
      if (!result) {
        console.log("email or password error");
        return res
          .status(401)
          .json({ status: "error", message: "email or password error" });
      }
  
      const payload = {
        id: admin._id,
        email: admin.email,
      };
  
      const access = jwt.sign(payload, process.env.ACCESS_SECRET, {
        expiresIn: "20m", 
        jwtid: uuidv4(),
      });
  
      const refresh = jwt.sign(payload, process.env.REFRESH_SECRET, {
        expiresIn: "30d", 
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

  router.patch("/match", async(req, res) => {

  })