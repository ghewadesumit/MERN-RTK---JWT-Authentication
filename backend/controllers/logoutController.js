const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc    Logout a user
// @route   POST /api/users/logout
// @access  Public
const handleLogout = asyncHandler(async (req, res) => {
    // Delete Accesstoken from session storage when logging out the user

    console.log('trying to logout');
    const cookie = req.cookies;

    console.log('cookie', cookie);
    if (!cookie?.refreshToken) {
        console.log('Cookie not found');
        return res.sendStatus(401).json({ message: 'No refresh token found' });
    }

    const refreshToken = cookie.refreshToken;

    // Is refreshtoken in DB
    const user = await User.findOne({ refreshToken });

    if (!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            /**
             * There was an error in React app if we do not set sameSite.
             * Error was as following
             *
             *
             * This Set-Cookie header didn't specify a "SameSite" attribute and was defaulted to "SameSite=Lax" and was blocked because it came from a
             * cross-site response which was not the response to a top-level navigation. The Set-Cookie had to have been set with "SameSite=None" to enable
             * cross-site usage
             */
        });
        return res.sendStatus(204); //forbidden
    }

    //Delete refreshtoken from db

    user.refreshToken = user.refreshToken.filter((rt) => rt !== refreshToken);
    await user.save();
    // await User.findOneAndUpdate(refreshToken, { refreshToken: '' });

    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
    });
    // Use 'secure:true' for only https
    res.sendStatus(204);
});

module.exports = { handleLogout };
