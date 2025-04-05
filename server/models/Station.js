const mongoose = require("mongoose");

// Slot schema with fixed predefined time slots
const slotSchema = new mongoose.Schema({
  time: { type: String, required: true, unique: false }, // Example: "9:00 AM - 9:30 AM"
  booked: { type: Boolean, default: false }, // If the slot is booked
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Who booked it
});

const chargingPointSchema = new mongoose.Schema({
  pointNumber: { type: Number, required: true, unique: true }, // Unique ID per charging point
  type: { type: String, enum: ["type1", "type2", "type3", "type4"], required: true },
  slots: [slotSchema], // Predefined time slots
});

const stationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  discountAvailable: { type: Boolean, default: false },
  chargingPoints: [chargingPointSchema], // Each station has multiple charging points
});

// Create and export the model
const Station = mongoose.model("Station", stationSchema);
module.exports = Station;
