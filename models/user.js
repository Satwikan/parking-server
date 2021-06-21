const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Bill = new Schema({
  slotNumber: String,
  vName: String,
  VNumber: String,
  status: {
    type: String,
    enum: ["Ongoing", "Completed"],
    default: "Ongoing",
  },
  start: {
    type: Date,
    default: Date.now,
  },
  end: {
    type: Date,
  },
  pay: Number,
});

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Active"],
    default: "Pending",
  },
  Balance: {
    type: Number,
    default: 0,
  },
  History: [Bill],
  confirmationCode: {
    type: String,
    unique: true,
  },
});

module.exports = User = mongoose.model("users", UserSchema);
