const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  booked: { type: Boolean, default: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
});

const chargingPointSchema = new mongoose.Schema({
  pointNumber: { type: Number, required: true },
  slots: [slotSchema]
});

const stationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  chargingPoints: [chargingPointSchema]
});

module.exports = mongoose.model("Station", stationSchema);