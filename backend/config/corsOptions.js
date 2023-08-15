const allowedOrigins = require('./allowedOrigins');
const corsOptions = {
    origin: function (origin, callback) {
        // allow requests with no origin
        // (like mobile apps or curl requests)
        // console.log(` allowed origin are ${allowedOrigins}`);
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' + 'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    optionsSuccessStatus: 200,
};

module.exports = { corsOptions };
