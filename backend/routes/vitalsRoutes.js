const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { getIsInMemory } = require('../config/db');
const memoryStore = require('../config/memoryStore');
const Vitals = require('../models/Vitals');

// Helper to determine health status badge
const calculateVitalsStatus = (hr, sys, dia, glucose, o2) => {
  if (sys >= 140 || dia >= 90 || hr > 100 || glucose > 140 || o2 < 95) {
    return 'High Risk';
  }
  if (sys >= 130 || dia >= 85 || hr > 90 || glucose > 115) {
    return 'Elevated';
  }
  return 'Normal';
};

// GET vitals for logged in user (or admin querying specific patient)
router.get('/', requireAuth, async (req, res) => {
  try {
    const targetUserId = (req.user.role === 'admin' && req.query.userId) ? req.query.userId : req.user._id.toString();

    if (getIsInMemory()) {
      const userVitals = memoryStore.getVitalsForUser(targetUserId);
      return res.json(userVitals);
    } else {
      const vitals = await Vitals.find({ userId: targetUserId }).sort({ timestamp: -1 });
      return res.json(vitals);
    }
  } catch (err) {
    console.error('Fetch vitals error:', err);
    res.status(500).json({ message: 'Failed to fetch vitals.', error: err.message });
  }
});

// POST new vitals entry
router.post('/', requireAuth, async (req, res) => {
  try {
    const { heartRate, bloodPressureSys, bloodPressureDia, bloodGlucose, oxygenLevel, steps, sleepHours } = req.body;

    if (!heartRate || !bloodPressureSys || !bloodPressureDia || !bloodGlucose) {
      return res.status(400).json({ message: 'Heart rate, blood pressure, and blood glucose are required.' });
    }

    const hr = Number(heartRate);
    const sys = Number(bloodPressureSys);
    const dia = Number(bloodPressureDia);
    const glucose = Number(bloodGlucose);
    const o2 = oxygenLevel ? Number(oxygenLevel) : 98;
    const stps = steps ? Number(steps) : 0;
    const sleep = sleepHours ? Number(sleepHours) : 7;

    const status = calculateVitalsStatus(hr, sys, dia, glucose, o2);

    if (getIsInMemory()) {
      const newVital = memoryStore.addVitals({
        userId: req.user._id.toString(),
        heartRate: hr,
        bloodPressureSys: sys,
        bloodPressureDia: dia,
        bloodGlucose: glucose,
        oxygenLevel: o2,
        steps: stps,
        sleepHours: sleep,
        status
      });
      return res.status(201).json(newVital);
    } else {
      const vital = await Vitals.create({
        userId: req.user._id,
        heartRate: hr,
        bloodPressureSys: sys,
        bloodPressureDia: dia,
        bloodGlucose: glucose,
        oxygenLevel: o2,
        steps: stps,
        sleepHours: sleep,
        status
      });
      return res.status(201).json(vital);
    }
  } catch (err) {
    console.error('Add vitals error:', err);
    res.status(500).json({ message: 'Failed to record vitals.', error: err.message });
  }
});

module.exports = router;
