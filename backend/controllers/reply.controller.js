const Tweet = require('../models/Tweet.model');
const User = require('../models/User.model');

// @route GET api/tweets/replies/:tweetId
// @desc Fetch all replies and inner_replies of a tweet
// @access Public
const getRepliesOfTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId).lean().exec();
    if (!tweet) {
      return res.status(404).json({ message: 'Cannot retrieve tweet.' });
    }
    res.status(200).json(tweet.replies);
  } catch (error) {
    console.log(error.message);
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Cannot retrieve tweet.' });
    }
  }
};

// @route GET api/tweets/replies/:tweetId/:replyId
// @desc Fetch a particular reply
// @access Public
const getReplyById = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId).lean().exec();
    if (!tweet) {
      return res.status(404).json({ message: 'Cannot retrieve tweet.' });
    }

    const reply = tweet.replies.find(
      reply => reply.id.toString() === req.params.replyId
    );
    if (!reply) {
      return res.status(404).json({ message: 'Cannot retrieve reply.' });
    }

    res.status(200).json(reply);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Cannot retrieve tweet.' });
    }
  }
};

// @route PUT api/tweets/replies/:tweetId
// @desc Reply to a tweet
// @access Private
const createReply = async (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({ message: 'Text is required to reply' });
  }

  try {
    const tweet = await Tweet.findById(req.params.tweetId);

    if (!tweet) {
      return res.status(404).json({ message: 'Cannot retrieve Tweet' });
    }

    const user = await User.findById(req.user.id).select('-password');

    const newReply = {
      userId: req.user.id,
      fullName: user.name,
      twitterHandle: user.handle,
      profilePicture: user.profilePicture || '',
      text: req.body.text,
      media: req.body.images || [''],
    };
    tweet.replies.unshift(newReply);

    await tweet.save();
    res.status(200).json(tweet.replies);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Cannot retrieve tweet.' });
    }
  }
};

// @route DELETE api/tweets/replies/:tweetId/:replyId
// @desc Delete a particular reply
// @access Private (Reply owner only)
const deleteReply = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);

    if (!tweet) {
      return res.status(404).json({ message: 'Cannot retrieve tweet' });
    }

    const reply = tweet.replies.find(
      reply => reply._id.toString() === req.params.replyId
    );

    if (!reply) {
      return res.status(404).json({ message: 'Cannot retrieve reply' });
    }

    // if the reply author is not the one who is trying to delete the reply
    if (reply.userId.toString() !== req.user.id) {
      return res.status(401).json({
        message: 'You are not authorized to perform this action.',
      });
    }

    tweet.replies = tweet.replies.filter(
      reply => reply.id.toString() !== req.params.replyId
    );
    await tweet.save();

    res.status(200).json(tweet.replies);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Cannot retrieve tweet.' });
    }
  }
};

// @route PUT api/tweets/replies/like/:tweetId/:replyId
// @desc Like or unlike a reply
// @access Private
const likeReply = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);

    if (!tweet) {
      return res.status(404).json({ message: 'Cannot retrieve tweet' });
    }

    const reply = tweet.replies.find(
      reply => reply.id.toString() === req.params.replyId
    );

    if (!reply) {
      return res.status(404).json({ message: 'Cannot retrieve reply' });
    }

    // if the reply has already been liked by the same user, then unlike the reply
    if (reply.likes.some(like => like.userId.toString() === req.user.id)) {
      reply.likes = reply.likes.filter(
        like => like.userId.toString() !== req.user.id
      );
    } else {
      // else, like the reply
      reply.likes.unshift({ userId: req.user.id });
    }
    await tweet.save();

    res.status(200).json(reply.likes);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Cannot retrieve tweet.' });
    }
  }
};

module.exports = {
  getRepliesOfTweet,
  getReplyById,
  createReply,
  deleteReply,
  likeReply,
};
