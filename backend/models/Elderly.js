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
      unique: true,
    },
    taskList: [
      {
        task: String,
        isDone: Boolean,
        default: false,
        required: true,
      },
    ],
    volunteer_ids: {
      type: [String],
    },
    isReviewed: {
      type: Boolean,
      default: false,
      required: true,
    },
    isDistressed: {
      type: Boolean,
      default: false,
      required: true,
    },
    isNeedHelp: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true },
  { collection: "neighbourwatch elderly" }
);

const Elderly = mongoose.model("Elderly", ElderlySchema);

module.exports = Elderly;
