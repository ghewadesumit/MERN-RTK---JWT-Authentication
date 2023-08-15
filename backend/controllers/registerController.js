const { generateRefreshToken, generateToken } = require('./tokenController');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    debugger;
    console.log('Trying to register');

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email and password are required' });
        // throw new Error('Please add all fields');
    }

    // Check if user exists

    const userExists = await User.findOne({ email });
    console.log(`user name is ${name} and ${userExists}`);
    if (userExists !== null) {
        return res.sendStatus(409).json({ message: 'User already exists' });
        // throw new Error('User already exists');
    }

    try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('hashed passowrd', hashedPassword);
        // Generate Refresh Token
        const refreshToken = generateRefreshToken(name);
        console.log('refreshToken', refreshToken);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            refreshToken: [refreshToken],
        });
        const roles = Object.values(user.roles).filter(Boolean);
        if (user) {
            console.log('Created User', user);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            });
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                roles,
                token: generateToken(user.name, roles),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (err) {
        res.status(500).json({ message: `Erroring out here ${err.message}` });
    }
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

module.exports = {
    registerUser,
    getMe,
};
