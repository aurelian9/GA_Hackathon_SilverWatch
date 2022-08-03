const express = require("express");
const router = express.Router();

const Volunteer = require("../models/Volunteer");
const Elderly = require("../models/Elderly");
const auth = require("../middleware/auth");
const seedElderly = require("./seedElderly");

router.post("/list", auth, async (req, res) => {
  const elderList = await Volunteer.find({ _id: req.body._id }).select(
    "elderly_ids"
  );
  res.json(elderList);
});

// input: _id, taskId
router.patch("/todo", auth, async (req, res) => {
  await Elderly.findOne({ _id: req.body._id }, (elderly, err) => {
    if (err) return;
    for (const task of elderly.taskList) {
      if (task._id === req.body.taskId) {
        task.isDone = !task.isDone;
      }
    }
    elderly.save();
    console.log(elderly);
  });

  res.json({ status: "ok", message: "updated" });
});

router.get("/seed", async (req, res) => {
  await Elderly.deleteMany();

  await Elderly.create(seedElderly, (err, data) => {
    if (err) {
      console.log("GET /seed error: " + err.message);
      res
        .status(400)
        .json({ status: "error", message: "seeding error occurred" });
    } else {
      res.json({ status: "ok", message: "seeding successful" });
    }
  });
});

module.exports = router;
