const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password are required' });
        }

        const user = await User.findOne({ username: username.toLowerCase().trim() });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        const match = await user.comparePassword(password);
        if (!match) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role, name: user.name, collegeId: user.collegeId },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                collegeId: user.collegeId,
                role: user.role,
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/auth/forgot-password  (simulated — just confirms email)
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    // In production: send real email via nodemailer / SES
    res.json({ success: true, message: `Password reset link sent to ${email}` });
});

module.exports = router;


