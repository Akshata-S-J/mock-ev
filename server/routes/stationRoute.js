const express = require("express");
const Station = require("../models/Station.js");
const cron = require("node-cron");

const router = express.Router();

// Predefined fixed time slots
const predefinedTimeSlots = [
  "9:00 AM - 9:30 AM", "9:30 AM - 10:00 AM",
  "10:00 AM - 10:30 AM", "10:30 AM - 11:00 AM",
  "11:00 AM - 11:30 AM", "11:30 AM - 12:00 PM",
  "12:00 PM - 12:30 PM", "12:30 PM - 1:00 PM",
  "1:00 PM - 1:30 PM", "1:30 PM - 2:00 PM",
  "2:00 PM - 2:30 PM", "2:30 PM - 3:00 PM",
  "3:00 PM - 3:30 PM", "3:30 PM - 4:00 PM",
  "4:00 PM - 4:30 PM", "4:30 PM - 5:00 PM",
];

// Function to generate slots for each charging point
function generateTimeSlots() {
  return predefinedTimeSlots.map(timeSlot => ({
    time: timeSlot,
    booked: false,
    userId: null,
  }));
}

// ✅ Schedule a job to reset slots at midnight (00:00) every day
cron.schedule("0 0 * * *", async () => {
  console.log("Resetting all slots for the new day...");

  try {
    const stations = await Station.find();

    for (const station of stations) {
      for (const point of station.chargingPoints) {
        point.slots = generateTimeSlots(); // Reset all slots
      }
      await station.save();
    }
    console.log("All slots have been reset!");
  } catch (error) {
    console.error("Error resetting slots:", error.message);
  }
});

// ✅ Get all stations
router.get("/stations", async (req, res) => {
  try {
    const stations = await Station.find();
    res.json(stations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Add a new station with predefined slots
router.post("/stations", async (req, res) => {
  try {
    const { name, address, chargingPoints } = req.body;

    if (!name || !address || !Array.isArray(chargingPoints)) {
      return res.status(400).json({ message: "Invalid input. Provide name, address, and chargingPoints." });
    }

    // Assign predefined slots to each charging point
    for (const point of chargingPoints) {
      point.slots = generateTimeSlots();
    }

    const newStation = new Station({ name, address, chargingPoints });
    await newStation.save();

    res.status(201).json({ message: "Station added successfully!", station: newStation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Book a charging slot
router.post("/stations/:stationId/book", async (req, res) => {
  try {
    const { pointNumber, time, userId } = req.body;
    const stationId = req.params.stationId;

    const station = await Station.findOne({ _id: stationId });
    if (!station) return res.status(404).json({ message: "Station not found!" });

    const chargingPoint = station.chargingPoints.find(point => point.pointNumber === pointNumber);
    if (!chargingPoint) return res.status(404).json({ message: "Charging point not found!" });

    const slot = chargingPoint.slots.find(s => s.time === time);
    if (!slot) return res.status(404).json({ message: "Time slot not found!" });

    if (slot.booked) return res.status(400).json({ message: "This slot is already booked. Please choose a different time." });

    slot.booked = true;
    slot.userId = userId;
    await station.save();

    res.json({ message: "Slot booked successfully!", station });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Release a slot after payment
router.post("/stations/:stationId/release", async (req, res) => {
  try {
    const { pointNumber, time } = req.body;
    const stationId = req.params.stationId;

    const station = await Station.findOneAndUpdate(
      {
        _id: stationId,
        "chargingPoints.pointNumber": pointNumber,
        "chargingPoints.slots.time": time,
      },
      {
        $set: {
          "chargingPoints.$[point].slots.$[slot].booked": false,
          "chargingPoints.$[point].slots.$[slot].userId": null,
        },
      },
      {
        arrayFilters: [
          { "point.pointNumber": pointNumber },
          { "slot.time": time },
        ],
        new: true,
      }
    );

    if (!station) return res.status(400).json({ message: "Slot not found!" });

    res.json({ message: "Slot released successfully!", station });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
