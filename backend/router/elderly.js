const express = require("express");
const router = express.Router();

const Volunteer = require("../models/Volunteer");
const Elderly = require("../models/Elderly");
const auth = require("../middleware/auth");
const seedElderly = require("./seedElderly");

const ObjectId = require("mongodb").ObjectId;

router.post("/list", auth, async (req, res) => {
  const elderList = await Volunteer.find({ _id: req.body._id }).select(
    "elderly_ids"
  );
  res.json(elderList);
});

// input: _id, taskId
router.patch("/todo", auth, async (req, res) => {
  const elderly = await Elderly.findOne({ _id: req.body._id });

  const taskId = new ObjectId(req.body.taskId);
  for (const task of elderly.taskList) {
    if (taskId.equals(task._id)) {
      task.isDone = !task.isDone;
    }
  }
  elderly.save();

  res.json({ status: "ok", elderly });
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

// input: elderlyId
router.patch("/help", auth, async (req, res) => {
  try {
    const elderly = await Elderly.findOne({ _id: req.body.elderlyId });
    elderly.isNeedHelp = false;
    elderly.save();
    res.status(200).json(elderly);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "error occurred" });
  }
});

module.exports = router;
