const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getIsInMemory } = require('../config/db');
const memoryStore = require('../config/memoryStore');
const User = require('../models/User');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, age, gender, bloodType, allergies, emergencyContact } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const assignedRole = role === 'admin' ? 'admin' : 'patient';

    if (getIsInMemory()) {
      const existing = memoryStore.findUserByEmail(email);
      if (existing) {
        return res.status(400).json({ message: 'User with this email already exists.' });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const newUser = memoryStore.addUser({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: assignedRole,
        age: age ? Number(age) : 30,
        gender: gender || 'Other',
        bloodType: bloodType || 'O+',
        allergies: allergies ? (Array.isArray(allergies) ? allergies : [allergies]) : [],
        emergencyContact: emergencyContact || ''
      });

      const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
      const { password: _, ...userWithoutPassword } = newUser;

      return res.status(201).json({
        token,
        user: userWithoutPassword
      });
    } else {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({ message: 'User with this email already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: assignedRole,
        age: age ? Number(age) : 30,
        gender: gender || 'Other',
        bloodType: bloodType || 'O+',
        allergies: allergies ? (Array.isArray(allergies) ? allergies : [allergies]) : [],
        emergencyContact: emergencyContact || ''
      });

      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          age: user.age,
          gender: user.gender,
          bloodType: user.bloodType,
          allergies: user.allergies,
          emergencyContact: user.emergencyContact
        }
      });
    }
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Registration failed.', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (getIsInMemory()) {
      const user = memoryStore.findUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials. User not found.' });
      }

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials. Password incorrect.' });
      }

      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      const { password: _, ...userWithoutPassword } = user;

      return res.json({
        token,
        user: userWithoutPassword
      });
    } else {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials. User not found.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials. Password incorrect.' });
      }

      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

      return res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          age: user.age,
          gender: user.gender,
          bloodType: user.bloodType,
          allergies: user.allergies,
          emergencyContact: user.emergencyContact,
          title: user.title
        }
      });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed.', error: err.message });
  }
});

// Get profile
router.get('/me', requireAuth, (req, res) => {
  const { password, ...userWithoutPassword } = req.user._doc ? req.user.toObject() : req.user;
  res.json({ user: userWithoutPassword });
});

module.exports = router;
