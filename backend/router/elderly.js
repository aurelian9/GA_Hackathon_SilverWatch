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

router.patch("/todo", auth, async (req, res) => {
  const response = await Elderly.updateOne(
    {
      _id: req.body._id,
    },
    {
      colour: req.body.newColour,
    }
  );
  console.log(response);

  res.json({ status: "ok", message: "updated" });
});

module.exports = router;
