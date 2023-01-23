const mongoose = require('mongoose');

const Reply = {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  fullName: { type: String, required: true },
  twitterHandle: { type: String, required: true },
  profilePicture: { type: String },
  text: { type: String, required: true },
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
};

const tweetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  fullName: { type: String, required: true },
  twitterHandle: { type: String, required: true },
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
  replies: [
    {
      ...Reply,
      inner_replies: [Reply],
    },
  ],
});

module.exports = mongoose.model('tweet', tweetSchema);
