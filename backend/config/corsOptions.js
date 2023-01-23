const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
  origin: (origin, callback) => {
    // !origin is for Postman or similar applications
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // (error, allowed)
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200, // default is 204 but some devices may have problems with the default
};

module.exports = corsOptions;
