const { generateToken } = require('../controllers/tokenController');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc    Refresh TOKEN a user
// @route   POST /api/users/refresh
// @access  Public
const handleRefreshToken = asyncHandler(async (req, res) => {
    // console.log('request body is', req.body);
    // console.log('request cookie is ', req.cookies);
    const cookie = req.cookies;
    // console.log('cookie', cookie);
    // if cookie exist and then jwt exists
    if (!cookie?.refreshToken) return res.sendStatus(401);
    const refreshToken = cookie.refreshToken;
    // console.log('Received Refresh Token', refreshToken)

    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
    });

    // Check for user using refreshtoken
    const user = await User.findOne({ refreshToken });

    // if no user for the refreshtoken then invalid user.
    /**
     * This could also potentially be a situation where your token is compromised
     * This is the case of Refresh Token reuse. Here we want to identify the user by decoding the
     * information in the received Refresh Token.
     * Once the user is been identified we need to delete all the refresh token from the stored refresh token array.
     */
    if (!user) {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            // If the err is there then the refresh token is expired
            if (err) return res.sendStatus(403).json({ message: 'Refresh token not found and is Expired' });

            const hackedUser = await User.findOne({ name: decoded.username }).exec();
            hackedUser.refreshToken = [];
            const result = await hackedUser.save();
            console.log(`Result is ${result}`);
        });
        console.log('Error is returned from here null');
        return res.sendStatus(403).json({ message: 'Refresh token not found' }); //forbidden
    }

    const newRefreshTokenArray = user.refreshToken.filter((rt) => rt !== refreshToken);

    //evaluate jwt
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        // If refresh token is expired
        if (err) {
            user.refreshToken = [...newRefreshTokenArray];
            await user.save();
        }
        if (err || user.name !== decoded.username) {
            return res.sendStatus(403).json({ message: 'Tere refreshtoken k username mai problem hai re baba' });
        }

        // Refresh token is still valid
        const accessToken = generateToken(decoded.username, user.roles);

        const newRefreshToken = generateRefreshToken(user.name);
        user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        await user.save();
        // console.log('Login: Current User is', currentUser);

        // setting httpOnly refreshToken is not accessible by JavaScript
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            sameSite: 'None',
            // secure: true,
            maxAge: 24 * 60 * 60 * 1000, // this is equal to 1day
        });

        res.json({ accessToken });
    });
});

module.exports = { handleRefreshToken };
