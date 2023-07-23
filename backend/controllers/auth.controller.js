const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User.model');

// @route POST api/auth
// @desc Login
// @access Public
const login = async (req, res) => {
  const { handle, password } = req.body;

  if (!handle || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (password.length < 5) {
    return res
      .status(400)
      .json({ message: 'Password must be at least 5 characters long' });
  }

  let user = await User.findOne({ handle_lowercase: handle.toLowerCase() })
    .lean()
    .exec();

  if (!user) {
    return res.status(401).json({ message: 'Inavlid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      message: 'Invalid credentials',
    });
  }

  const payload = {
    user: {
      id: user._id,
      twitterHandle: user.handle,
      fullName: user.name,
    },
  };

  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign(
    {
      user: {
        id: user._id,
      },
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '7d',
    }
  );

  // Creates secure cookie with refresh token
  res.cookie('jwt', refreshToken, {
    httpOnly: true, // accessible only by a web server
    secure: true, // HTTPS
    sameSite: 'none', // cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry: set to match refreshToken's expiration time
  });

  res.status(200).send({ accessToken });
};

// @route GET api/auth/refresh
// @desc Refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const foundUser = await User.findById(decoded.user.id).exec();

      if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const accessToken = jwt.sign(
        {
          user: {
            id: foundUser.id,
            twitterHandle: foundUser.handle,
            fullName: foundUser.name,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );

      res.status(200).json({ accessToken });
    }
  );
};

// @route POST api/auth/logout
// @desc Logout
// @access Public - just to clear cookie, if exists
const logout = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(204); // No content
  }
  res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'none' });
  res.status(200).json({ message: 'Cookie cleared' });
};

module.exports = { login, refresh, logout };
