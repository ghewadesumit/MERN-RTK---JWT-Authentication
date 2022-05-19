const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			// Get token from header
			const token = req.headers.authorization.split(' ')[1];
			if (!token) {
				res.status(401);
				throw new Error('Not authorized, no token');
			}

			// Verify token
			console.log('Verify the Token in auth middleware', token);
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			// console.log('Decoded data',decoded);

			if (decoded) {
				const name = decoded.username;
				// Get user from the token
				req.user = await User.findOne({ name }).select('-password');
				// console.log('request user is',req.user)

				next();
			}
			// const {payload:refresh} = expired && refreshToken ? verifyRefreshToken(refreshToken) : { payload:null}
		} catch (error) {
			console.log('error is danger', error);
			res.status(403);
			throw new Error('Not authorized');
		}
	}
});

module.exports = { protect };
