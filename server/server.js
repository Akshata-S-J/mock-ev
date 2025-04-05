const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const accountRoutes = require("./routes/account");
const station=require("./routes/stationRoute.js")
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
      console.error('❌ MongoDB Connection Error:', err);
      process.exit(1); // Exit process on failure
  });

// Default route to check if the server is running
app.get('/', (req, res) => {
    res.send('🚀 Server is running...');
});

// Routes
app.use("/api/account", accountRoutes);
app.use('/api/auth', require('./routes/auth')); // Authentication routes
app.use('/api',station);
// Add more routes here if needed, e.g.:
// app.use('/api/users', require('./routes/users'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
