const {generateRefreshToken,generateToken} = require('../controllers/userController');
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
	console.log('Received Refresh Token', refreshToken);

	// if (!refreshToken) {
	// 	res.sendStatus(400);
	// 	// throw new Error('User already exists');
	// }

    // try{}catch(err){}
	// Check for user using refreshtoken
	// check if the refreshtoken exists
	const user = await User.findOne({ refreshToken });


	// if no user for the refreshtoken then invalid user.
	if (!user) {
		console.log('Error is returned from here null');
		return res.sendStatus(403).json({'message':'Refresh token not found'}); //forbidden
	}

	//evaluate jwt
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
		// console.log(decoded);
		if (err || user.name !== decoded.username){
            return res.sendStatus(403);
        }
			
		const accessToken = jwt.sign(
			{ name: decoded.username },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '30s' }
		);

		res.json({ accessToken });
	});
});


module.exports = {handleRefreshToken};
