const mongoose = require("mongoose");

const VolunteerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    hash: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    postalCode: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
  { collection: "volunteer" }
);

const Volunteer = mongoose.model("Volunteer", VolunteerSchema);

module.exports = Volunteer;
