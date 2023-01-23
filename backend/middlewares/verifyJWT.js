const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // get the token from header
  const authHeader = req.header('Authorization') || req.header('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'No token, authorization denied',
    });
  }
  const token = authHeader.split(' ')[1].trim();

  // Verify token
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
      if (error) {
        return res.status(403).json({ message: 'Invalid token' });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
