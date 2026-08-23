const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { getIsInMemory } = require('../config/db');
const memoryStore = require('../config/memoryStore');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const SymptomCheck = require('../models/SymptomCheck');
const Prescription = require('../models/Prescription');

// GET Admin Metrics Dashboard Summary
router.get('/metrics', requireAuth, requireAdmin, async (req, res) => {
  try {
    if (getIsInMemory()) {
      const patients = memoryStore.getAllPatients();
      const appointments = memoryStore.getAllAppointments();
      const symptomChecks = memoryStore.getAllSymptomChecks();
      const prescriptions = memoryStore.getAllPrescriptions();

      const todayStr = new Date().toISOString().split('T')[0];
      const todayAppts = appointments.filter(a => a.date === todayStr || a.status === 'scheduled');
      const highRiskTriages = symptomChecks.filter(s => s.triageLevel === 'high' || s.triageLevel === 'emergency');

      return res.json({
        totalPatients: patients.length,
        scheduledAppointments: todayAppts.length,
        highRiskTriageCount: highRiskTriages.length,
        totalAIChecksProcessed: symptomChecks.length,
        totalPrescriptions: prescriptions.length
      });
    } else {
      const totalPatients = await User.countDocuments({ role: 'patient' });
      const scheduledAppointments = await Appointment.countDocuments({ status: 'scheduled' });
      const highRiskTriageCount = await SymptomCheck.countDocuments({ triageLevel: { $in: ['high', 'emergency'] } });
      const totalAIChecksProcessed = await SymptomCheck.countDocuments();
      const totalPrescriptions = await Prescription.countDocuments();

      return res.json({
        totalPatients,
        scheduledAppointments,
        highRiskTriageCount,
        totalAIChecksProcessed,
        totalPrescriptions
      });
    }
  } catch (err) {
    console.error('Fetch admin metrics error:', err);
    res.status(500).json({ message: 'Failed to compute admin metrics.', error: err.message });
  }
});

// GET all patients directory
router.get('/patients', requireAuth, requireAdmin, async (req, res) => {
  try {
    if (getIsInMemory()) {
      return res.json(memoryStore.getAllPatients());
    } else {
      const patients = await User.find({ role: 'patient' }).select('-password').sort({ createdAt: -1 });
      return res.json(patients);
    }
  } catch (err) {
    console.error('Fetch patients error:', err);
    res.status(500).json({ message: 'Failed to fetch patients list.', error: err.message });
  }
});

// GET user prescriptions (or all for admin)
router.get('/prescriptions', requireAuth, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      if (getIsInMemory()) {
        return res.json(memoryStore.getAllPrescriptions());
      } else {
        const rxs = await Prescription.find().sort({ issuedDate: -1 });
        return res.json(rxs);
      }
    } else {
      const userIdStr = req.user._id.toString();
      if (getIsInMemory()) {
        return res.json(memoryStore.getPrescriptionsForUser(userIdStr));
      } else {
        const rxs = await Prescription.find({ userId: req.user._id });
        return res.json(rxs);
      }
    }
  } catch (err) {
    console.error('Fetch prescriptions error:', err);
    res.status(500).json({ message: 'Failed to fetch prescriptions.', error: err.message });
  }
});

// GET all doctors roster
router.get('/doctors', async (req, res) => {
  try {
    if (getIsInMemory()) {
      return res.json(memoryStore.getAllDoctors());
    }
    return res.json(memoryStore.getAllDoctors());
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch doctors.', error: err.message });
  }
});

// POST Add New Doctor (Admin Permission)
router.post('/doctors', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, title, specialty, fee, hospital, photo, bio, experience } = req.body;
    if (!name || !specialty) {
      return res.status(400).json({ message: 'Doctor Name and Specialty are required.' });
    }
    const newDoc = memoryStore.addDoctor({
      name,
      title: title || 'Specialist Physician',
      specialty,
      fee: fee ? (fee.startsWith('$') ? fee : `$${fee}`) : '$120',
      hospital: hospital || 'MediCare AI Medical Network',
      photo: photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      bio: bio || 'Expert medical practitioner providing high quality specialized healthcare.',
      experience: experience || '10+ Years Exp'
    });
    return res.status(201).json({ message: 'Doctor added successfully to roster.', doctor: newDoc });
  } catch (err) {
    console.error('Add doctor error:', err);
    res.status(500).json({ message: 'Failed to add doctor.', error: err.message });
  }
});

// DELETE Doctor (Admin Permission)
router.delete('/doctors/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const removed = memoryStore.deleteDoctor(id);
    if (!removed) {
      return res.status(404).json({ message: 'Doctor not found in roster.' });
    }
    return res.json({ message: 'Doctor successfully removed from system roster.', id });
  } catch (err) {
    console.error('Delete doctor error:', err);
    res.status(500).json({ message: 'Failed to remove doctor.', error: err.message });
  }
});

// GET all Wellness & Yoga Tips
router.get('/wellness', async (req, res) => {
  try {
    return res.json(memoryStore.getAllWellness());
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch wellness tips.', error: err.message });
  }
});

// POST Add New Wellness & Yoga Tip (Admin Permission)
router.post('/wellness', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, category, benefit, steps, duration, image } = req.body;
    if (!title || !category) {
      return res.status(400).json({ message: 'Title and Category are required.' });
    }
    const newTip = memoryStore.addWellness({
      title,
      category,
      benefit: benefit || 'Enhances metabolic stability, reduces stress, and improves vitality.',
      steps: steps ? (Array.isArray(steps) ? steps : steps.split('\n').filter(Boolean)) : ['Follow standard clinical practice.'],
      duration: duration || '10 Mins',
      image: image || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=500&q=80'
    });
    return res.status(201).json({ message: 'Wellness tip added successfully.', tip: newTip });
  } catch (err) {
    console.error('Add wellness error:', err);
    res.status(500).json({ message: 'Failed to add wellness tip.', error: err.message });
  }
});

// DELETE Wellness & Yoga Tip (Admin Permission)
router.delete('/wellness/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const removed = memoryStore.deleteWellness(id);
    if (!removed) {
      return res.status(404).json({ message: 'Wellness tip not found.' });
    }
    return res.json({ message: 'Wellness tip removed successfully.', id });
  } catch (err) {
    console.error('Delete wellness error:', err);
    res.status(500).json({ message: 'Failed to delete wellness tip.', error: err.message });
  }
});

module.exports = router;
