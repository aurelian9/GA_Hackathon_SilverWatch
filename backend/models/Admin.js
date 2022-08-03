const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
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
  },
  { timestamps: true },
  { collection: "neighbourwatch admin" }
);

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
