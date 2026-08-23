const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const vitalsRoutes = require('./routes/vitalsRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const symptomRoutes = require('./routes/symptomRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Enable CORS and JSON parsing
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Initialize Database connection (with memory store fallback)
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vitals', vitalsRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MediCare AI Backend API',
    timestamp: new Date().toISOString()
  });
});

// Standalone local server listener
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[MediCare AI Backend] Server active on port http://localhost:${PORT}`);
  });
}

module.exports = app;
