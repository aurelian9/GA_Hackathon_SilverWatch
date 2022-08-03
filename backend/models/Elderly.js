const mongoose = require("mongoose");

const ElderlySchema = new mongoose.Schema(
  {
    postalCode: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    floor: {
      type: Number,
      required: true,
    },
    unit: {
      type: Number,
      required: true,
    },
    homeNumber: {
      type: Number,
      requried: true,
    },
    mobileNumber: {
      type: Number,
    },
    medicalConditions: {
      type: [String],
    },
    bluetoothDeviceID: {
      type: String,
      required: true,
      unique: true,
    },
    statusList: [
      {
        task: String,
        isDone: Boolean,
        required: true,
      },
    ],
    volunteer_ids: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true },
  { collection: "neighbourwatch elderly" }
);

const Elderly = mongoose.model("Elderly", ElderlySchema);

module.exports = Elderly;
