const { generateRefreshToken, generateToken } = require('../controllers/tokenController');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const handleLogin = asyncHandler(async (req, res) => {
    const cookie = req.cookie;
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
        return res.status(400).json({ message: 'email and password are required' });
        // throw new Error('Please add all fields');
    }

    try {
        // Check for user email
        const user = await User.findOne({ email });
        const match = await bcrypt.compare(password, user.password);

        if (user && match) {
            const roles = Object.values(user.roles).filter(Boolean);
            const filter = { _id: user.id };

            // We are saving refresh token inside the Database to invalidate the user if they decide to logout earlier than the
            // refresh token expiry(1day)
            const newRefreshToken = generateRefreshToken(user.name);

            /**
             * If cookie is not present and doesn't have refresh token set on it.
             * Then we simply use the refresh token inside the User refreshtoken array.
             * else we delete the refresh token which matches with cookie's refresh token.
             */
            const newRefreshTokenArray = !cookie?.refreshToken ? user.refreshToken : user.refreshToken.filter((rt) => rt !== cookie.refreshToken);

            if (cookie?.jwt) {
                res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
            }

            user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            await user.save();
            // const update = { refreshToken };
            // await User.findOneAndUpdate(filter, update);
            // console.log('Login: Current User is', currentUser);

            // setting httpOnly refreshToken is not accessible by JavaScript
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                maxAge: 24 * 60 * 60 * 1000, // this is equal to 1day
            });
            const token = generateToken(user.name, roles);
            console.log('Generated access token is', token);
            // console.log('Generated refresh token is', refreshToken);

            // Never store access token in cookie or local storage. Keep it in Session Storage.
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                roles,
                token,
            });
        } else {
            res.status(401).json({
                message: 'email and password did not match',
            });
            // throw new Error('Invalid credentials');
        }
    } catch (err) {
        res.status(401).json({ message: 'email and password did not match' });
    }
});

module.exports = { handleLogin };
