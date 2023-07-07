const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  parent: { type: mongoose.Schema.Types.ObjectId, default: null }, // parent tweet's id
  degree: { type: Number, default: 0 }, // for nested tweet/reply structure (starts from 0)

  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  fullName: { type: String, required: true },
  twitterHandle: { type: String, required: true },
  twitterHandle_lowercase: { type: String, required: true },
  profilePicture: { type: String },

  caption: { type: String, required: true },
  media: [String],
  creationDate: { type: Date, default: Date.now },

  likes: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    },
  ],
  retweets: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
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
