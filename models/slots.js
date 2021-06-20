const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SlotSchema = new Schema({
  name: String,
  Occupied: Number,
});

module.exports = Slot = mongoose.model("slot", SlotSchema);
