const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (name, roles) => {
    // In production always use 5 mins to 15 mins for JSON Tokens
    return jwt.sign(
        {
            UserInfo: { username: name, roles },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '120s',
        }
    );
};
// Refresh Token
const generateRefreshToken = (name) => {
    // Refresh tokens are generally longer than the Access web token
    return jwt.sign({ username: name }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1d',
    });
};

module.exports = { generateRefreshToken, generateToken };
