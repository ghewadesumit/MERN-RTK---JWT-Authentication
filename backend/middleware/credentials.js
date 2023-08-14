const allowedOrigins = require('../config/allowedOrigins');
const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    console.log(`Credential origin is ${origin}`);
    if (allowedOrigins.includes(origin)) {
        console.log('Found the allowed origin');
        // res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', true);
    }

    next();
};

module.exports = credentials;
