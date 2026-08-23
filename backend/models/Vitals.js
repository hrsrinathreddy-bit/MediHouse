const mongoose = require('mongoose');

const vitalsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  heartRate: { type: Number, required: true },
  bloodPressureSys: { type: Number, required: true },
  bloodPressureDia: { type: Number, required: true },
  bloodGlucose: { type: Number, required: true },
  oxygenLevel: { type: Number, default: 98 },
  steps: { type: Number, default: 0 },
  sleepHours: { type: Number, default: 7 },
  status: { type: String, default: 'Normal' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Vitals || mongoose.model('Vitals', vitalsSchema);
