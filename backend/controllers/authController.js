const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate a JWT ID Badge
const generateToken = (id, role) => {
    // This creates a token holding the user's ID and Role, valid for 30 days
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    try {
        const { username, email, password, mobnumber, role } = req.body;

        // 1. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Create the new user (Password is hashed automatically by our Schema!)
        const user = await User.create({
            username,
            email,
            password,
            mobnumber,
            role // 'customer', 'restaurant_admin', or 'delivery_partner'
        });

        // 3. Send back the success response with the ID badge (Token)
        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find the user by email
        const user = await User.findOne({ email });

        // 2. Check if user exists AND password matches
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

module.exports = { registerUser, loginUser };