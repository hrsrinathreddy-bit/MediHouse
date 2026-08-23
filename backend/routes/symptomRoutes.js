const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { getIsInMemory } = require('../config/db');
const memoryStore = require('../config/memoryStore');
const SymptomCheck = require('../models/SymptomCheck');

// Simulated AI Medical Assessment Engine
const runAISymptomAnalysis = (symptomsList, duration, severity) => {
  const list = symptomsList.map(s => s.toLowerCase());

  let score = 20;
  let triageLevel = 'low';
  let analysis = '';
  let recommendedActions = [];

  const highRiskKeywords = ['chest pain', 'chest tightness', 'shortness of breath', 'difficulty breathing', 'severe headache', 'sudden weakness', 'fainting', 'numbness'];
  const moderateRiskKeywords = ['persistent cough', 'fever', 'high fever', 'abdominal pain', 'persistent dizziness', 'joint swelling', 'vomiting'];

  const matchedHigh = list.filter(s => highRiskKeywords.some(k => s.includes(k)));
  const matchedMod = list.filter(s => moderateRiskKeywords.some(k => s.includes(k)));

  if (matchedHigh.length > 0 || severity === 'Severe') {
    score = 85 + matchedHigh.length * 5;
    if (score > 98) score = 98;
    triageLevel = matchedHigh.some(s => s.includes('chest') || s.includes('breathing')) ? 'emergency' : 'high';
    analysis = `CRITICAL ALERT: Your reported symptoms (${symptomsList.join(', ')}) trigger high-priority clinical flags. Possible urgent cardiovascular or systemic distress detected.`;
    recommendedActions = [
      'Seek emergency medical evaluation or call emergency triage immediately',
      'Do not engage in physical exertion or drive yourself to the medical facility',
      'Notify emergency contact and prepare your MediCare AI digital health record'
    ];
  } else if (matchedMod.length > 0 || severity === 'Moderate') {
    score = 50 + matchedMod.length * 5;
    triageLevel = 'medium';
    analysis = `MODERATE RISK: Clinical analysis suggests elevated inflammatory or infectious markers based on symptoms (${symptomsList.join(', ')}).`;
    recommendedActions = [
      'Schedule a prompt consultation with your primary physician within 24-48 hours',
      'Monitor body temperature, hydration level, and resting pulse rate',
      'Log any changes or symptom escalation in your MediCare AI daily vitals'
    ];
  } else {
    score = Math.floor(Math.random() * 15) + 15;
    triageLevel = 'low';
    analysis = `LOW RISK: Reported symptoms (${symptomsList.join(', ')}) appear mild and self-limiting. No acute critical red flags identified.`;
    recommendedActions = [
      'Ensure adequate rest (7-8 hours) and proper hydration',
      'Monitor for any symptom progression over the next 48 hours',
      'Consult a physician if symptoms do not improve after 3 days'
    ];
  }

  return { score, triageLevel, analysis, recommendedActions };
};

// GET symptom checks
router.get('/', requireAuth, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      if (getIsInMemory()) {
        return res.json(memoryStore.getAllSymptomChecks());
      } else {
        const checks = await SymptomCheck.find().sort({ timestamp: -1 });
        return res.json(checks);
      }
    } else {
      const userIdStr = req.user._id.toString();
      if (getIsInMemory()) {
        return res.json(memoryStore.getSymptomChecksForUser(userIdStr));
      } else {
        const checks = await SymptomCheck.find({ userId: req.user._id }).sort({ timestamp: -1 });
        return res.json(checks);
      }
    }
  } catch (err) {
    console.error('Fetch symptom checks error:', err);
    res.status(500).json({ message: 'Failed to fetch symptom history.', error: err.message });
  }
});

// POST analyze symptoms
router.post('/analyze', requireAuth, async (req, res) => {
  try {
    const { symptoms, duration, severity } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ message: 'At least one symptom is required.' });
    }

    const aiResult = runAISymptomAnalysis(symptoms, duration || '1 Day', severity || 'Mild');

    if (getIsInMemory()) {
      const newCheck = memoryStore.addSymptomCheck({
        userId: req.user._id.toString(),
        patientName: req.user.name,
        symptoms,
        duration: duration || '1 Day',
        severity: severity || 'Mild',
        triageLevel: aiResult.triageLevel,
        score: aiResult.score,
        analysis: aiResult.analysis,
        recommendedActions: aiResult.recommendedActions
      });
      return res.status(201).json(newCheck);
    } else {
      const check = await SymptomCheck.create({
        userId: req.user._id,
        patientName: req.user.name,
        symptoms,
        duration: duration || '1 Day',
        severity: severity || 'Mild',
        triageLevel: aiResult.triageLevel,
        score: aiResult.score,
        analysis: aiResult.analysis,
        recommendedActions: aiResult.recommendedActions
      });
      return res.status(201).json(check);
    }
  } catch (err) {
    console.error('Analyze symptoms error:', err);
    res.status(500).json({ message: 'Failed to analyze symptoms.', error: err.message });
  }
});

module.exports = router;
