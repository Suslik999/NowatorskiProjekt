const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { email, password, isTrainer } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email już istnieje' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      isTrainer
    });

    await user.save();
    res.status(201).json({ message: 'Rejestracja udana' });
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Nieprawidłowy email lub hasło' });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Nieprawidłowy email lub hasło' });

    const token = jwt.sign({ id: user._id, isTrainer: user.isTrainer }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, userId: user._id, isTrainer: user.isTrainer });
  } catch (error) {
    res.status(500).json({ message: 'Błąd logowania' });
  }
};
