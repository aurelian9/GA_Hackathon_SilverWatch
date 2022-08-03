const express = require("express");
const router = express.Router();

const Volunteer = require("../models/Volunteer");
const Elderly = require("../models/Elderly");
const auth = require("../middleware/auth");

router.post("/list", auth, async (req, res) => {
  const elderList = await Volunteer.find({ _id: req.body._id }).select(
    "elderly_ids"
  );
  res.json(elderList);
});

module.exports = router;
