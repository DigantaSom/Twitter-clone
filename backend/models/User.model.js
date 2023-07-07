const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    handle: { type: String, required: true, unique: true },
    handle_lowercase: { type: String, required: true, unique: true },
    profilePicture: { type: String, default: '' },
    headerPhoto: { type: String, default: '' },
    bio: { type: String, default: '' },
    birthday: { type: Date },

    numberOfTweets: { type: Number, default: 0 },
    bookmarks: [
      {
        tweetId: { type: mongoose.Schema.Types.ObjectId, ref: 'tweet' },
        addedDate: { type: Date, default: Date.now() },
      },
    ],

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('user', userSchema);
