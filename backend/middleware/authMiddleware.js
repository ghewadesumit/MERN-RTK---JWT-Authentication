const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
    console.log(`Requested header is ${JSON.stringify(req.headers)}`);
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try {
            // Get Bearer token from header

            const token = req.headers.authorization.split(' ')[1];
            console.log('Middleware auth: token is ', token);
            if (!token) {
                res.status(401).json({
                    message: 'This is Middleware, Token is missing bhaiya ',
                });
                throw new Error('Not authorized, no token');
            }

            // Verify token
            // console.log('Verify the Token in auth middleware', token)

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            // console.log('Decoded data',decoded);
            console.log('Decoded value is', decoded);
            if (decoded) {
                const name = decoded.UserInfo.username;
                // Get user from the token
                req.user = await User.findOne({ name }).select('-password');
                req.roles = decoded.UserInfo.roles;
                // console.log('request user is',req.user)

                next();
            }
            // const {payload:refresh} = expired && refreshToken ? verifyRefreshToken(refreshToken) : { payload:null}
        } catch (error) {
            console.log('Error in verifying the ACCESS TOKEN', error);
            res.status(403);
            throw new Error('Not authorized');
        }
    } else {
        return res.sendStatus(401).json({ message: 'Header mai authorization hi nai mila kake' });
    }
});

module.exports = { protect };
