
const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
    const { username, email, password, address, phone } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ username, email, password, address, phone });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Obtener datos del usuario
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener datos del usuario" });
  }
});

// Actualizar datos del usuario
router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedData = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar datos del usuario" });
  }
});

// Eliminar cuenta del usuario
router.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "Cuenta eliminada con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la cuenta" });
  }
});

module.exports = router;


