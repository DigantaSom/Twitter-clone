const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User.model');
const Tweet = require('../models/Tweet.model');

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

  if (handle.length < 5 || handle.length > 15) {
    return res
      .status(400)
      .json({ message: 'Username must be between 5 and 15 characters' });
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
    bio: '',
    followers: [],
    following: [],
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

// @route GET api/users/bookmarks
// @desc Get all bookmarks of the logged in user
// @access Private
const getBookmarks = async (req, res) => {
  const user = await User.findById(req.user.id)
    .select('-password')
    .lean()
    .exec();

  const bookmarkedTweetsIncludingNull = await getAsyncBookmarkResults(
    user.bookmarks.sort((a, b) => (a.addedDate < b.addedDate ? 1 : -1))
  );

  const bookmarkedTweets = bookmarkedTweetsIncludingNull.filter(t => t != null);

  res.status(200).json(bookmarkedTweets);
};

// this is a helper function for 'getBookmarks'
const getAsyncBookmarkResults = async array => {
  // includes null elements
  const promises = array.map(
    async bookmark =>
      await Tweet.findOne({
        $and: [{ _id: bookmark.tweetId }, { isDeleted: false }],
      })
  );

  return Promise.all(promises);
};

// @route GET api/users/basic/:userId
// @desc Get the basic information of a user by userId
// @access Public
const getUserBasicInfo = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password')
      .lean()
      .exec();

    if (!user) return res.status(404).json({ message: 'User not found' });

    const userToReturn = {
      _id: user._id,
      profilePicture: user.profilePicture,
      name: user.name,
      username: user.handle,
      bio: user.bio || '',
      numberOfFollowers: user.followers.length,
      numberOfFollowing: user.following.length,
    };
    return res.status(200).json(userToReturn);
  } catch (error) {
    console.log(error.message);
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'User not found.' });
    }
  }
};

// @route GET api/users/profile/:username
// @desc Get the entire profile information of a user by their username
// @access Public
const getProfile = async (req, res) => {
  const user = await User.findOne({
    handle_lowercase: req.params.username?.toLowerCase(),
  })
    .select('-password')
    .lean()
    .exec();

  if (!user) return res.status(404).json({ message: 'User not found' });

  const profile = {
    _id: user._id,
    name: user.name,
    username: user.handle,
    profilePicture: user.profilePicture,
    headerPhoto: user.headerPhoto,
    bio: user.bio,
    birthday: user?.birthday || null, // TODO: remove nullable functionality
    joiningDate: user.createdAt,
    numberOfTweets: user.numberOfTweets,
    numberOfFollowing: user.following.length,
    numberOfFollowers: user.followers.length,
  };

  return res.status(200).json(profile);
};

// @route GET api/users/tweets/:username
// @desc Fetch all tweets of a user by their username
// @access Public
const getTweetsByUsername = async (req, res) => {
  const username = req.params.username?.toLowerCase();

  const user = await User.findOne({
    handle_lowercase: username,
  })
    .select('-password')
    .lean()
    .exec();

  if (!user) return res.status(400).json({ message: 'User not found.' });

  const tweetsByUser = await Tweet.find({
    $and: [{ twitterHandle_lowercase: username }, { degree: 0 }],
  })
    .lean()
    .exec();

  if (!tweetsByUser?.length) {
    return res.status(404).json({ message: 'Tweet not found.' });
  }
  res.status(200).json(tweetsByUser);
};

module.exports = {
  getAllUsers,
  createUser,
  getBookmarks,
  getUserBasicInfo,
  getProfile,
  getTweetsByUsername,
};
