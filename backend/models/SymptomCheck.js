const mongoose = require('mongoose');

const symptomCheckSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientName: { type: String, required: true },
  symptoms: [{ type: String, required: true }],
  duration: { type: String, default: '1 Day' },
  severity: { type: String, enum: ['Mild', 'Moderate', 'Severe'], default: 'Mild' },
  triageLevel: { type: String, enum: ['low', 'medium', 'high', 'emergency'], default: 'low' },
  score: { type: Number, default: 20 },
  analysis: { type: String, required: true },
  recommendedActions: [{ type: String }],
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.models.SymptomCheck || mongoose.model('SymptomCheck', symptomCheckSchema);
