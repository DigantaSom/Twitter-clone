const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  parent: { type: mongoose.Schema.Types.ObjectId, default: null }, // parent tweet's id
  degree: { type: Number, default: 0 }, // for nested tweet/reply structure (starts from 0)

  // the rest of the author info will be fetched on the frontend with separate request (getUserBasicInfo endpoint)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', nullable: true }, // nullable only in case of retweet or quote

  // any one of the caption and media is a required field at a time; will validate manually
  caption: { type: String },
  media: [String],

  creationDate: { type: Date, default: Date.now },

  likes: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    },
  ],

  retweetOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'tweet',
    default: null,
  },
  retweetedBy: {
    type: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
      username: { type: String, required: true },
      fullName: { type: String, required: true },
    },
    default: null,
  },

  retweets: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
      date: { type: Date, default: Date.now() },
    },
  ],

  quoteRefTweetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'tweet',
    default: null,
  },
  quotes: [
    {
      tweetId: { type: mongoose.Schema.Types.ObjectId, ref: 'tweet' },
      date: { type: Date, default: Date.now() },
    },
  ],

  bookmarks: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    },
  ],

  numberOfReplies: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model('tweet', tweetSchema);
