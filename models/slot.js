const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SlotSchema = new Schema({
  name: String,
  occupied: Number,
});

module.exports = Slot = mongoose.model("slot", SlotSchema);
