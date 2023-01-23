const Tweet = require('../models/Tweet.model');
const User = require('../models/User.model');

// @route GET api/tweets
// desc Get all tweets (testing only)
// @access Public
const getAllTweets = async (_, res) => {
  const tweets = await Tweet.find().lean().lean().exec();
  if (!tweets?.length) {
    return res.status(404).json({ message: 'No tweet found' });
  }
  res.status(200).json(tweets);
};

// @route GET api/tweets/:id
// desc Get a single tweet by its id
// @access Public
const getTweetById = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found.' });
    }
    res.status(200).json(tweet);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Tweet not found.' });
    }
  }
};

// @route GET api/tweets/user/:userId
// @desc Fetch all tweets of a user by their userId
// @access Public
const getTweetsByUserId = async (req, res) => {
  try {
    const tweetsByUser = await Tweet.find({ userId: req.params.userId })
      .lean()
      .exec();
    if (!tweetsByUser?.length) {
      return res.status(404).json({ message: 'Tweet not found.' });
    }
    res.status(200).json(tweetsByUser);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Tweet not found.' });
    }
  }
};

// @route POST api/tweets
// @desc Post a tweet
// @access Private
const createTweet = async (req, res) => {
  if (!req.body.caption) {
    return res.status(400).json({ message: 'Text is required' });
  }

  const user = await User.findById(req.user.id).select('-password');

  const newTweet = new Tweet({
    userId: req.user.id,
    fullName: user.name,
    twitterHandle: user.handle,
    profilePicture: user.profilePicture || '',
    caption: req.body.caption,
    media: req.body.images || [''],
  });
  const tweet = await newTweet.save();
  res.status(200).json(tweet);
};

// @route DELETE api/tweets/:id
// @desc Delete a tweet
// @access Private (only the tweet author)
const deleteTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ message: 'Cannot retrieve tweet.' });
    }

    // if the tweet author is not the one who is trying to delete the tweet
    if (tweet.userId.toString() !== req.user.id) {
      return res.status(401).json({
        message: 'You are not authorized to perform this action.',
      });
    }
    await tweet.delete();
    res.status(200).json({ message: 'Tweet deleted' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Cannot retrieve tweet.' });
    }
  }
};

// @route PUT api/tweets/like/:tweetId
// @desc Like or unlike a tweet
// @access Private
const likeTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);

    // if the tweet has already been liked by the same user, then unlike the tweet
    if (tweet.likes.some(like => like.userId.toString() === req.user.id)) {
      tweet.likes = tweet.likes.filter(
        like => like.userId.toString() !== req.user.id
      );
    } else {
      // else, like the tweet
      tweet.likes.unshift({ userId: req.user.id });
    }
    await tweet.save();

    res.status(200).json(tweet.likes);
  } catch (error) {
    console.log(error.message);
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Tweet not found' });
    }
  }
};

module.exports = {
  getAllTweets,
  getTweetById,
  getTweetsByUserId,
  createTweet,
  deleteTweet,
  likeTweet,
};
