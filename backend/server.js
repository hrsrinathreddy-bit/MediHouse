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

// Initialize Database connection
connectDB();

// Root Landing & Health Status (Fixes "Cannot GET /")
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'MediCare AI API Gateway',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      appointments: '/api/appointments',
      vitals: '/api/vitals',
      symptoms: '/api/symptoms',
      admin: '/api/admin'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MediCare AI Backend API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vitals', vitalsRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/admin', adminRoutes);

// Server listener (Binds cleanly for Render, Koyeb, and Localhost)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[MediCare AI Backend] Server active on port http://localhost:${PORT}`);
});

module.exports = app;