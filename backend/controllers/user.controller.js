const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User.model');
const Tweet = require('../models/Tweet.model');

const getAsyncResultsWithForLoop = require('../utils/getAsyncResultsWithForLoop.util');
const checkIfFollowedByLoggedInUser = require('../utils/checkIfFollowedByLoggedInUser.util');

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
    location: '',
    website: '',
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

// @route GET api/users/me/profile_photo
// @desc Get the currently logged-in user's profile photo
// @access Private
const getMyProfilePhoto = async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId)
    .select('profilePicture')
    .lean()
    .exec();

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }
  res.status(200).json({
    userId: user._id,
    profilePhoto: user.profilePicture,
  });
};

// @route GET api/users/basic
// Query Variables: { userId: string, loggedInUserId: string }
// @desc Get the basic information of a user by userId
// @access Public
const getUserBasicInfo = async (req, res) => {
  const { userId, loggedInUserId } = req.query;

  try {
    const user = await User.findById(userId).select('-password').lean().exec();

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isFollowedByLoggedInUser = checkIfFollowedByLoggedInUser(
      loggedInUserId,
      user.followers
    );

    const userToReturn = {
      _id: user._id,
      profilePicture: user.profilePicture,
      name: user.name,
      username: user.handle,
      bio: user.bio || '',
      isFollowedByLoggedInUser,
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

// @route GET api/users/profile
// @Query Variables: { username: string, loggedInUserId: string }
// @desc Get the entire profile information of a user by their username
// @access Public
const getProfile = async (req, res) => {
  const { username, loggedInUserId } = req.query;

  const user = await User.findOne({
    handle_lowercase: username?.toLowerCase(),
  })
    .select('-password')
    .lean()
    .exec();

  if (!user) return res.status(404).json({ message: 'User not found' });

  const isFollowedByLoggedInUser = checkIfFollowedByLoggedInUser(
    loggedInUserId,
    user.followers
  );

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
    location: user.location,
    website: user.website,
    isFollowedByLoggedInUser,
    numberOfFollowing: user.following.length,
    numberOfFollowers: user.followers.length,
  };

  return res.status(200).json(profile);
};

// @route PUT api/users
// @desc Edit Profile
// @access Private (only own profile can be edited)
const editProfile = async (req, res) => {
  const { name, bio, location, website, profilePhoto, headerPhoto } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  const user = await User.findById(req.user.id).select('-password').exec();

  user.name = name;
  user.bio = bio;
  user.location = location;
  user.website = website;
  user.profilePicture = profilePhoto;
  user.headerPhoto = headerPhoto;

  await user.save();

  res.status(200).json({ message: 'Profile edited successfully!' });
};

// @route GET api/users/bookmarks
// @desc Get all bookmarks of the logged in user
// @access Private
const getBookmarks = async (req, res) => {
  const user = await User.findById(req.user.id)
    .select('-password')
    .lean()
    .exec();

  const bookmarkedTweets = await getAsyncResultsWithForLoop(
    user.bookmarks.sort((a, b) => (a.addedDate < b.addedDate ? 1 : -1))
  );

  if (!bookmarkedTweets.length) {
    return res.status(404).json({ message: 'No bookmarked tweets yet!' });
  }
  res.status(200).json(bookmarkedTweets);
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
    $and: [
      { twitterHandle_lowercase: username },
      { degree: 0 },
      { isDeleted: false },
    ],
  })
    .sort({ creationDate: -1 })
    .lean()
    .exec();

  if (!tweetsByUser?.length) {
    return res.status(404).json({ message: 'No Tweets found.' });
  }
  res.status(200).json(tweetsByUser);
};

// @route GET api/users/replies/:username
// @desc Fetch all replies of a user by their username
// @access Public
const getRepliesByUsername = async (req, res) => {
  const username = req.params.username?.toLowerCase();

  const user = await User.findOne({
    handle_lowercase: username,
  })
    .select('-password')
    .lean()
    .exec();

  if (!user) return res.status(400).json({ message: 'User not found.' });

  const tweetsByUser = await Tweet.find({
    $and: [
      { twitterHandle_lowercase: username },
      { degree: { $gt: 0 } },
      { isDeleted: false },
    ],
  })
    .sort({ creationDate: -1 })
    .lean()
    .exec();

  if (!tweetsByUser?.length) {
    return res.status(404).json({ message: 'No Tweet found.' });
  }
  res.status(200).json(tweetsByUser);
};

// @route GET api/users/media-tweets/:username
// @desc Fetch all media tweets of a user by their username
// @access Public
const getMediaTweetsByUsername = async (req, res) => {
  const username = req.params.username?.toLowerCase();

  const user = await User.findOne({
    handle_lowercase: username,
  })
    .select('-password')
    .lean()
    .exec();

  if (!user) return res.status(400).json({ message: 'User not found.' });

  const tweetsByUser = await Tweet.find({
    $and: [
      { twitterHandle_lowercase: username },
      { media: { $ne: [''] } },
      { isDeleted: false },
    ],
  })
    .sort({ creationDate: -1 })
    .lean()
    .exec();

  if (!tweetsByUser?.length) {
    return res.status(404).json({ message: 'No Tweet found.' });
  }
  res.status(200).json(tweetsByUser);
};

// @route GET api/users/liked-tweets/:username
// @desc Fetch all liked tweets of a user by their username
// @access Public
const getLikedTweetsByUsername = async (req, res) => {
  const username = req.params.username?.toLowerCase();
  const user = await User.findOne({ handle_lowercase: username })
    .select('-password')
    .lean()
    .exec();

  const likedTweets = await getAsyncResultsWithForLoop(
    user.likes.sort((a, b) => (a.addedDate < b.addedDate ? 1 : -1))
  );

  if (!likedTweets.length) {
    return res.status(404).json({ message: 'No liked tweets yet!' });
  }
  res.status(200).json(likedTweets);
};

// @route PUT api/users/follow/:targetUserId
// @desc Follow or Unfollow a user
// @access Private
const followUser = async (req, res) => {
  const myId = req.user.id;
  const targetUserId = req.params.targetUserId;

  // cannot follow myself
  if (myId === targetUserId) {
    return res.status(400).json({ message: 'You cannot follow yourself' });
  }

  let successMessage = '';

  try {
    const myself = await User.findById(myId).select('-password').exec();
    const targetUser = await User.findById(targetUserId)
      .select('-password')
      .exec();

    // if I am already following the targetUser, then unfollow that targetUser
    if (myself.following.some(f => f.userId.toString() === targetUserId)) {
      myself.following = myself.following.filter(
        f => f.userId.toString() !== targetUserId
      );
      successMessage = `You have unfollowed @${targetUser.handle}`;
      targetUser.followers = targetUser.followers.filter(
        f => f.userId.toString() !== myId
      );
    } else {
      // else, follow the targetUser
      myself.following.unshift({ userId: targetUserId });
      successMessage = `You are now following @${targetUser.handle}`;
      targetUser.followers.unshift({ userId: myId });
    }

    await myself.save();
    await targetUser.save();

    res.status(200).json({ message: successMessage });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found.' });
    }
  }
};

// @route GET api/users/followers/:username
// @desc Get the follower list of a user by their username
// @access Public
const getFollowers = async (req, res) => {
  const username = req.params.username?.toLowerCase();
  const user = await User.findOne({ handle_lowercase: username })
    .select('-password')
    .lean()
    .exec();

  if (!user.followers.length) {
    return res.status(400).json({ message: 'No followers yet.' });
  }
  res
    .status(200)
    .json(user.followers.sort((a, b) => (a.addedDate < b.addedDate ? 1 : -1)));
};

// @route GET api/users/following/:username
// @desc Get the following list of a user by their username
// @access Public
const getFollowing = async (req, res) => {
  const username = req.params.username?.toLowerCase();
  const user = await User.findOne({ handle_lowercase: username })
    .select('-password')
    .lean()
    .exec();

  if (!user.following.length) {
    return res.status(400).json({ message: 'Not following anyone yet.' });
  }
  res
    .status(200)
    .json(user.following.sort((a, b) => (a.addedDate < b.addedDate ? 1 : -1)));
};

// @route GET api/users/mutual-followers/:username
// @desc Get the mutual follower list of a user by their username
// @access Private
const getMutualFollowers = async (req, res) => {
  const targetUsername = req.params.username?.toLowerCase();
  const loggedInUserId = req.user.id;

  const targetUser = await User.findOne({ handle_lowercase: targetUsername })
    .select('-password')
    .lean()
    .exec();
  const loggedInUser = await User.findById(loggedInUserId)
    .select('-password')
    .lean()
    .exec();

  const result = [];

  targetUser.followers.forEach(targetUserFollower => {
    loggedInUser.following.forEach(loggedInUserFollowing => {
      if (
        targetUserFollower.userId.toString() ===
        loggedInUserFollowing.userId.toString()
      ) {
        result.push(targetUserFollower);
      }
    });
  });

  if (!result.length) {
    return res
      .status(400)
      .json({ message: 'Not followed by anyone you are following.' });
  }
  res
    .status(200)
    .json(result.sort((a, b) => (a.addedDate < b.addedDate ? 1 : -1)));
};

module.exports = {
  getAllUsers,
  createUser,
  getMyProfilePhoto,
  getUserBasicInfo,
  getProfile,
  editProfile,
  getBookmarks,
  getTweetsByUsername,
  getRepliesByUsername,
  getMediaTweetsByUsername,
  getLikedTweetsByUsername,
  getLikedTweetsByUsername,
  followUser,
  getFollowers,
  getFollowing,
  getMutualFollowers,
};
