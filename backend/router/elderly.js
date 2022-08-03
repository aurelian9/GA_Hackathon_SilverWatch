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

module.exports = router;
