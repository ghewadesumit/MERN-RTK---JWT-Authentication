const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		res.status(400);
		throw new Error('Please add all fields');
	}

	// Check if user exists
	const userExists = await User.findOne({ email });
	// console.log(`user name is ${name} and ${userExists}`);
	if (userExists) {
		res.status(400);
		throw new Error('User already exists');
	}

	// Hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// Generate Refresh Token
	const refreshToken = generateRefreshToken(name);

	// Create user
	const user = await User.create({
		name,
		email,
		password: hashedPassword,
		refreshToken,
	});

	if (user) {
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			// sameSite: 'None',
			// secure: true,
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
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// Check for user email
	const user = await User.findOne({ email });

	if (user && (await bcrypt.compare(password, user.password))) {
		const filter = { _id: user.id };
		const refreshToken = generateRefreshToken(user.name);
		const update = { refreshToken };
		const currentUser = await User.findOneAndUpdate(filter, update);
		// console.log('Login: Current User is', currentUser);

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			// sameSite: 'None',
			// secure: true,
			maxAge: 24 * 60 * 60 * 1000,
		});
		const token = generateToken(user.name);
		console.log('Generated access token is', token);
		console.log('Generated refresh token is', refreshToken);
		res.json({
			_id: user.id,
			name: user.name,
			email: user.email,
			token,
		});
	} else {
		res.status(400);
		throw new Error('Invalid credentials');
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
	console.log('Refreshing the access token', refreshToken);

	if (!refreshToken) {
		res.status(400);
		throw new Error('User already exists');
	}
	// Check for user using refreshtoken
	// check if the refreshtoken exists
	const user = await User.findOne({ refreshToken });

	// console.log(user);

	// if no user for the refreshtoken then invalid user.
	if (!user) {
		console.log('Error is returned from here null');
		return res.sendStatus(403); //forbidden
	}

	//evaluate jwt

	jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, decoded) => {
		// console.log(decoded);
		if (err || user.name !== decoded.username)
			return res.status(400).send({
				message: 'Something is wrong with refreshtoken!',
			});
		const accessToken = jwt.sign(
			{ username: decoded.username },
			process.env.JWT_SECRET,
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
	return jwt.sign({ username: name }, process.env.JWT_SECRET, {
		expiresIn: '10s',
	});
};
// Refresh Token
const generateRefreshToken = (name) => {
	return jwt.sign({ username: name }, process.env.REFRESH_JWT_SECRET, {
		expiresIn: '1d',
	});
};

module.exports = {
	registerUser,
	loginUser,
	getMe,
	handleRefreshToken,
	handleLogout,
};
