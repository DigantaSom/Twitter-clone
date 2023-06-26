const Tweet = require('../models/Tweet.model');
const User = require('../models/User.model');

// @route GET api/tweets
// desc Get all tweets, neither replies nor inner-replies (testing only)
// @access Public
const getAllTweets = async (_, res) => {
  const tweets = await Tweet.find({ degree: 0 }).lean().exec();
  if (!tweets?.length) {
    return res.status(404).json({ message: 'No tweet found.' });
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

// @route GET api/tweets/replies/:parentTweetId
// @desc Get all replies of a tweet
// @access Public
const getReplies = async (req, res) => {
  try {
    const replies = await Tweet.find({ parent: req.params.parentTweetId })
      .lean()
      .exec();

    if (!replies?.length) {
      return res.status(404).json({ message: 'No replies for this tweet.' });
    }
    res.status(200).json(replies);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Tweet not found.' });
    }
  }
};

// @route POST api/tweets (body: parentTweetId?, tweetDegree, caption, media)
// @desc Post a tweet
// @access Private
const createTweet = async (req, res) => {
  if (!req.body.caption) {
    return res.status(400).json({ message: 'Text is required' });
  }

  const user = await User.findById(req.user.id)
    .select('-password')
    .lean()
    .exec();

  const newTweet = new Tweet({
    parent: req.body.parentTweetId || null,
    degree: req.body.tweetDegree || 0,
    userId: req.user.id,
    fullName: user.name,
    twitterHandle: user.handle,
    profilePicture: user.profilePicture || '',
    caption: req.body.caption,
    media: req.body.media || [''],
    numberOfReplies: 0,
    isDeleted: false,
  });

  const tweet = await newTweet.save();

  // numberOfReplies++ in the parent tweet, if any
  await Tweet.findOneAndUpdate(
    { _id: req.body.parentTweetId },
    { $inc: { numberOfReplies: 1 } }
  );

  res.status(200).json(tweet);
};

// @route DELETE api/tweets/:id (body: parentTweetId?)
// @desc Delete a tweet
// @access Private (only the tweet author)
const deleteTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id).exec();

    if (!tweet) {
      return res.status(404).json({ message: 'Cannot retrieve tweet.' });
    }

    // if the tweet author is not the one who is trying to delete the tweet
    if (tweet.userId.toString() !== req.user.id) {
      return res.status(401).json({
        message: 'You are not authorized to perform this action.',
      });
    }

    // (virtually) delete the target tweet
    tweet.isDeleted = true;
    await tweet.save();

    // numberOfReplies-- in the parent tweet, if any
    await Tweet.findOneAndUpdate(
      { _id: req.body.parentTweetId },
      { $inc: { numberOfReplies: -1 } }
    );

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
  getReplies,
  createTweet,
  deleteTweet,
  likeTweet,
};
