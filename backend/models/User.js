const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'admin'], default: 'patient' },
  age: { type: Number, default: 30 },
  gender: { type: String, default: 'Other' },
  bloodType: { type: String, default: 'A+' },
  allergies: [{ type: String }],
  emergencyContact: { type: String, default: '' },
  title: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
