const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User.model');

// @route GET api/users
// @desc Fetch all users
// @access Testing only
const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password').lean().exec();
  return res.status(200).json(users);
};

// @route POST api/users
// @desc Create a user
// @access Public
const createUser = async (req, res) => {
  const { name, email, handle, password, profilePicture } = req.body;

  if (!name || !email || !password || !handle) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (handle.length > 15) {
    return res
      .status(400)
      .json({ message: 'Username must not be more than characters long' });
  }

  if (password.length < 5) {
    return res
      .status(400)
      .json({ message: 'Password must be at least 5 characters long' });
  }

  let user = await User.findOne({ handle_lowercase: handle.toLowerCase() });

  if (user) {
    return res.status(409).json({
      message: 'User already exists',
    });
  }

  user = new User({
    name,
    email: email.toLowerCase(),
    handle,
    handle_lowercase: handle.toLowerCase(),
    password,
    profilePicture: profilePicture || '',
  });
  user.password = await bcrypt.hash(password, 12);

  await user.save();

  const payload = {
    user: {
      id: user.id,
      twitterHandle: user.handle,
      fullName: user.name,
      profilePicture: user.profilePicture,
    },
  };

  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign(
    {
      user: {
        id: user.id,
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

module.exports = { getAllUsers, createUser };