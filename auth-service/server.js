const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ Auth-Service: MongoDB Connected'))
  .catch(err => {
      console.error('❌ MongoDB Connection Error:', err);
      process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('✅ Auth-Service is running...');
});

// Start server on port 5001
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🔐 Auth-Service running on port ${PORT}`));
