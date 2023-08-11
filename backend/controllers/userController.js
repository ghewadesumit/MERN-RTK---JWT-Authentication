const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;
	debugger;
	console.log('Trying to register')

	if (!name || !email || !password) {
		return res.status(400).json({'message':'Name, email and password are required'});
		// throw new Error('Please add all fields');
	}

	// Check if user exists
	
		const userExists = await User.findOne({ email });
		console.log(`user name is ${name} and ${userExists}`);
		if (userExists !== null) {
			return res.sendStatus(409).json({"message":"User already exists"});
			// throw new Error('User already exists');
		}
	
	
	


	try{
		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		console.log('hashed passowrd', hashedPassword)
		// Generate Refresh Token
		const refreshToken = generateRefreshToken(name);
		console.log('refreshToken',refreshToken);

		// Create user
		const user = await User.create({
			name,
			email,
			password: hashedPassword,
			refreshToken,
		});


		if (user) {
			console.log('Created User',user)
			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				maxAge: 24 * 60 * 60 * 1000,
			});
			res.status(201).json({
				_id: user.id,
				name: user.name,
				email: user.email,
				token: generateToken(user.name),
			});
		} else {
			res.status(400);
			throw new Error('Invalid user data');
		}

	}catch(err){
		res.status(500).json({'message':`Erroring out here ${err.message}`})
	}	
});



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
		return res.sendStatus(403); //forbidden
	}

	//evaluate jwt
	jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, decoded) => {
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



// @desc    Logout a user
// @route   POST /api/users/logout
// @access  Public
const handleLogout = asyncHandler(async (req, res) => {
	const cookie = req.cookies;
	// console.log('cookie', cookie);
	if (!cookie?.refreshToken) return res.sendStatus(401);
	const refreshToken = cookie.refreshToken;
	// console.log(refreshToken);

	// Is refreshtoken in DB
	const user = await User.findOne({ refreshToken });
	// console.log(user);
	if (!user) {
		res.clearCookie('refreshToken', {
			httpOnly: true,
			sameSite: 'None',
			secure: true,
		});
		return res.sendStatus(204); //forbidden
	}

	//Delete refreshtoken from db

	await User.findOneAndUpdate(refreshToken, { refreshToken: '' });

	res.clearCookie('refreshToken', {
		httpOnly: true,
		sameSite: 'None',
		secure: true,
	});
	// Use 'secure:true' for only https
	res.sendStatus(204);
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
	res.status(200).json(req.user);
});

// Generate JWT
const generateToken = (name) => {

	// In production always use 5 mins to 15 mins for JSON Tokens
	return jwt.sign({ username: name }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: '10s',
	});
};
// Refresh Token
const generateRefreshToken = (name) => {

	// Refresh tokens are generally longer than the Access web token
	return jwt.sign({ username: name }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: '1d',
	});
};

module.exports = {
	registerUser,
	getMe,
	handleRefreshToken,
	handleLogout,
	generateToken,
	generateRefreshToken
};
