const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware.js'); // Middleware for authentication
require('dotenv').config();

const router = express.Router();

// Email Validation Function
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Password Validation Function
const isValidPassword = (password) => {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[@])[A-Za-z\d@]{6,}$/.test(password);
};

// Signup Route
router.post('/signup', async (req, res) => {
    const { username, email, contactNumber, password } = req.body;

    // Validate Contact Number (Must be 10 digits)
    if (!/^\d{10}$/.test(contactNumber)) {
        return res.status(400).json({ message: 'Contact number must be exactly 10 digits' });
    }

    // Validate Email Format
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate Password
    if (!isValidPassword(password)) {
        return res.status(400).json({ message: 'Password must contain at least one special character (@), one uppercase letter, one digit, and be at least 6 characters long' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ username, email, contactNumber, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '365d' });
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Validate Email Format
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '365d' });
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get User Route (Protected)
router.get('/user/:id', authMiddleware, async (req, res) => {
    try {
        console.log('Received User ID:', req.params.id);  // ✅ Debugging
        const user = await User.findById(req.params.id).select('-password'); // Ensure User model exists
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reset Password Route (Protected)
// Password Reset Without Token
router.post('/reset-password', async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;

        // Validate input
        if (!userId || !currentPassword || !newPassword) {
            return res.status(400).json({ message: 'User ID, current password, and new password are required' });
        }

        if (!isValidPassword(newPassword)) {
            return res.status(400).json({ message: 'New password must contain at least one special character (@), one uppercase letter, one digit, and be at least 6 characters long' });
        }

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;
