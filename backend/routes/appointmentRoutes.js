const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { getIsInMemory } = require('../config/db');
const memoryStore = require('../config/memoryStore');
const Appointment = require('../models/Appointment');

// GET appointments
router.get('/', requireAuth, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      if (getIsInMemory()) {
        return res.json(memoryStore.getAllAppointments());
      } else {
        const appts = await Appointment.find().sort({ date: -1 });
        return res.json(appts);
      }
    } else {
      const userIdStr = req.user._id.toString();
      if (getIsInMemory()) {
        return res.json(memoryStore.getAppointmentsForUser(userIdStr));
      } else {
        const appts = await Appointment.find({ userId: req.user._id }).sort({ date: -1 });
        return res.json(appts);
      }
    }
  } catch (err) {
    console.error('Fetch appointments error:', err);
    res.status(500).json({ message: 'Failed to fetch appointments.', error: err.message });
  }
});

// POST book appointment
router.post('/', requireAuth, async (req, res) => {
  try {
    const { doctorName, specialty, date, timeSlot, reason } = req.body;

    if (!doctorName || !specialty || !date || !timeSlot) {
      return res.status(400).json({ message: 'Doctor name, specialty, date, and time slot are required.' });
    }

    if (getIsInMemory()) {
      const newAppt = memoryStore.addAppointment({
        userId: req.user._id.toString(),
        patientName: req.user.name,
        doctorName,
        specialty,
        date,
        timeSlot,
        reason: reason || 'Routine Consultation'
      });
      return res.status(201).json(newAppt);
    } else {
      const appt = await Appointment.create({
        userId: req.user._id,
        patientName: req.user.name,
        doctorName,
        specialty,
        date,
        timeSlot,
        reason: reason || 'Routine Consultation'
      });
      return res.status(201).json(appt);
    }
  } catch (err) {
    console.error('Book appointment error:', err);
    res.status(500).json({ message: 'Failed to book appointment.', error: err.message });
  }
});

// PATCH update appointment status
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    if (getIsInMemory()) {
      const updated = memoryStore.updateAppointmentStatus(req.params.id, status);
      if (!updated) {
        return res.status(404).json({ message: 'Appointment not found.' });
      }
      return res.json(updated);
    } else {
      const appt = await Appointment.findById(req.params.id);
      if (!appt) {
        return res.status(404).json({ message: 'Appointment not found.' });
      }

      // Check ownership if patient
      if (req.user.role !== 'admin' && appt.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to modify this appointment.' });
      }

      appt.status = status;
      await appt.save();
      return res.json(appt);
    }
  } catch (err) {
    console.error('Update appointment status error:', err);
    res.status(500).json({ message: 'Failed to update appointment.', error: err.message });
  }
});

module.exports = router;
