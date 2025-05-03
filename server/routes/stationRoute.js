const express = require("express");
const Station = require("../models/Station");
const cron = require("node-cron");

const router = express.Router();

// ✨ Daily Slot Reset at 00:00
cron.schedule("0 0 * * *", async () => {
  console.log("🔄 Resetting all booked slots for the new day...");

  try {
    const stations = await Station.find();
    for (const station of stations) {
      for (const point of station.chargingPoints) {
        point.slots = [];
      }
      await station.save();
    }
    console.log("✅ All slots have been reset.");
  } catch (error) {
    console.error("❌ Error resetting slots:", error.message);
  }
});

// 🔧 Utility: Parse time string ("10:00 AM") to Date object
const parseTime = (timeStr) => {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

  if (isNaN(date)) {
    throw new Error("Invalid time format");
  }

  // Log for debugging purposes
  console.log("Parsed Date: ", date);

  return date;
};


// ➕ Add a new station
router.post("/stations", async (req, res) => {
  try {
    const { name, address, chargingPoints, types, payeeVPA, payeeName } = req.body;

    if (!name || !address || !Array.isArray(chargingPoints) || !Array.isArray(types) || !payeeVPA || !payeeName) {
      return res.status(400).json({ message: "Invalid input. Provide name, address, chargingPoints, types, payeeVPA, and payeeName." });
    }

    const newStation = new Station({
      name,
      address,
      chargingPoints,
      types,
      payeeVPA,
      payeeName
    });

    await newStation.save();
    res.status(201).json({ message: "Station added successfully!", station: newStation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📥 Get all stations
router.get("/stations", async (req, res) => {
  try {
    const stations = await Station.find();
    res.json(stations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📆 Book a slot
router.post("/stations/:stationId/book", async (req, res) => {
  try {
    console.log("Incoming booking request:", req.body);

    const { pointNumber, startTime, endTime, userId, typeName } = req.body;
    const stationId = req.params.stationId;

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      console.log("Start time is after end time.");
      return res.status(400).json({ message: "End time must be after start time." });
    }

    const station = await Station.findById(stationId);
    if (!station) {
      console.log("Station not found.");
      return res.status(404).json({ message: "Station not found!" });
    }

    const chargingPoint = station.chargingPoints.find(p => p.pointNumber === pointNumber);
    if (!chargingPoint) {
      console.log("Charging point not found.");
      return res.status(404).json({ message: "Charging point not found!" });
    }

    const overlap = chargingPoint.slots.some(slot => {
      return (start < slot.endTime && end > slot.startTime);
    });

    if (overlap) {
      console.log("Overlapping slot found.");
      return res.status(409).json({ message: "Slot not available. Choose another time range." });
    }

    const selectedType = chargingPoint.types.find(t => t.typeName === typeName);
    if (!selectedType) {
      console.log("Invalid typeName selected.");
      return res.status(400).json({ message: "Invalid typeName selected." });
    }

    console.log("Calculating bill...");
    const hours = (end - start) / (1000 * 60 * 60);
    const billAmount = hours * selectedType.pricePerHour;

    console.log("Calculated billAmount:", billAmount);

    chargingPoint.slots.push({
      startTime: start,
      endTime: end,
      booked: true,
      userId,
      typeName,
      billAmount
    });

    station.markModified('chargingPoints');
    await station.save();

    console.log("Station saved successfully!");

    res.status(200).json({
      message: "Slot booked successfully!",
      billAmount,
      typeName
    });

  } catch (error) {
    console.log("Error occurred:", error.message);
    res.status(500).json({ message: error.message });
  }
});





// 🔓 Release a booked slot
router.post("/stations/:stationId/release", async (req, res) => {
  try {
    const { pointNumber, startTime, endTime } = req.body;
    const { stationId } = req.params;

    const start = new Date(startTime);
    const end = new Date(endTime);

    const station = await Station.findById(stationId);
    if (!station) return res.status(404).json({ message: "Station not found!" });

    const point = station.chargingPoints.find(p => p.pointNumber === pointNumber);
    if (!point) return res.status(404).json({ message: "Charging point not found!" });

    const slot = point.slots.find(
      s => s.startTime.getTime() === start.getTime() && s.endTime.getTime() === end.getTime() && s.booked
    );

    if (!slot) {
      return res.status(400).json({ message: "Matching booked slot not found." });
    }

    slot.booked = false;
    slot.userId = null;

    await station.save();
    res.status(200).json({ message: "Slot released successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Backend route to release a slot
router.delete('/api/stations/:stationId/release', async (req, res) => {
  const { stationId } = req.params;
  const { slotId, pointNumber } = req.body;

  try {
    // Find the station and the specific charging point
    const station = await Station.findById(stationId);
    const point = station.chargingPoints.find(point => point.pointNumber === pointNumber);

    if (!point) {
      return res.status(404).json({ message: "Charging point not found." });
    }

    // Remove the slot from the charging point
    point.slots = point.slots.filter(slot => slot._id.toString() !== slotId);

    // Save the updated station data
    await station.save();

    res.status(200).json({ message: "Slot released successfully." });
  } catch (error) {
    console.error("Error releasing slot:", error);
    res.status(500).json({ message: "Server error while releasing slot." });
  }
});


// 📥 Get single station by ID
router.get("/stations/:stationId", async (req, res) => {
  try {
    const station = await Station.findById(req.params.stationId);
    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }
    res.json(station);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;