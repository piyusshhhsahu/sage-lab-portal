const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id, role, name, year, semester) => {
    return jwt.sign({ id, role, name, year, semester }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role, enrollmentNumber, year, semester } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            enrollmentNumber,
            year,
            semester,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role, user.name, user.year, user.semester),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    console.log('--- Login Request ---');
    console.log('Email received:', email);
    console.log('Password received:', password);

    try {
        const user = await User.findOne({ email });

        console.log('User found in DB:', user ? 'Yes' : 'No');
        if (user) {
            console.log('User Role:', user.role);
            console.log('Stored Hashed Password:', user.password);
            const isMatch = await user.matchPassword(password);
            console.log('Password Match Result:', isMatch);

            if (isMatch) {
                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id, user.role, user.name, user.year, user.semester),
                });
                return;
            }
        }

        console.log('Login Failed: Invalid email or password match');
        res.status(401).json({ message: 'Invalid email or password' });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };
