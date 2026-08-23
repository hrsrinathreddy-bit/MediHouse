const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientName: { type: String, required: true },
  medication: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  duration: { type: String, required: true },
  refillsLeft: { type: Number, default: 0 },
  prescribingDoctor: { type: String, required: true },
  instructions: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'Completed', 'Discontinued'], default: 'Active' },
  issuedDate: { type: String, required: true }
});

module.exports = mongoose.models.Prescription || mongoose.model('Prescription', prescriptionSchema);
