const Tweet = require('../models/Tweet.model');

// @route PUT api/inner-replies/:tweetId/:replyId
// @desc Post an inner-reply to a reply
// @access Private
const createInnerReply = async (req, res) => {
  if (!req.body.text) {
    return res.status(404).json({ message: 'Text is required' });
  }

  try {
    const tweet = await Tweet.findById(req.params.tweetId);

    if (!tweet) {
      return res.status(404).json({ message: 'Cannot retrieve tweet.' });
    }

    const reply = tweet.replies.find(
      reply => reply.id.toString() === req.params.replyId
    );

    if (!reply) {
      return res.status(404).json({ message: 'Cannot retrieve reply.' });
    }

    const user = await User.findById(req.user.id).select('-password');

    const newInnerReply = {
      userId: req.user.id,
      fullName: user.name,
      twitterHandle: user.handle,
      profilePicture: user.profilePicture || '',
      text: req.body.text,
      media: req.body.images || [''],
    };
    reply.inner_replies.push(newInnerReply);

    await tweet.save();
    res.status(200).send(tweet.replies);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Cannot retrieve tweet.' });
    }
  }
};

// @route DELETE api/inner-replies/:tweetId/:replyId/:innerReplyId
// @desc Delete a particular inner-reply
// @access Private (inner-reply owner only)
const deleteInnerReply = async (req, res) => {
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

    const innerReply = reply.inner_replies.find(
      innerReply => innerReply.id.toString() === req.params.innerReplyId
    );
    if (!innerReply) {
      return res.status(404).json({ message: 'Cannot retrieve reply' });
    }

    // if the inner-reply author is not the one who is trying to delete the it
    if (innerReply.userId.toString() !== req.user.id) {
      return res.status(401).json({
        message: 'You are not authorized to perform this action',
      });
    }
    // else, delete it
    reply.inner_replies = reply.inner_replies.filter(
      innerReply => innerReply.id.toString() !== req.params.innerReplyId
    );

    await tweet.save();
    res.status(200).json(reply.inner_replies);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Cannot retrieve tweet.' });
    }
  }
};

// @route PUT api/inner-replies/:tweetId/:replyId/:innerReplyId
// @desc Like or unlike a particular inner-reply
// @access Private
const likeInnerReply = async (req, res) => {
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

    const innerReply = reply.inner_replies.find(
      innerReply => innerReply.id.toString() === req.params.innerReplyId
    );
    if (!innerReply) {
      return res.status(404).json({ message: 'Cannot retrieve reply' });
    }

    // if the inner-reply has already been liked by the same user, then unlike it
    if (
      innerReply.likes.some(
        innerReply => innerReply.userId.toString() === req.user.id
      )
    ) {
      innerReply.likes = innerReply.likes.filter(
        like => like.userId.toString() !== req.user.id
      );
    } else {
      // else, like it
      innerReply.likes.unshift({ userId: req.user.id });
    }

    await tweet.save();
    res.status(200).json(innerReply.likes);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      res.status(404).json({ message: 'Cannot retrieve tweet.' });
    }
  }
};

module.exports = { createInnerReply, deleteInnerReply, likeInnerReply };
