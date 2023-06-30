const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    handle: { type: String, required: true, unique: true },
    handle_lowercase: { type: String, required: true, unique: true },
    profilePicture: { type: String },
    birthday: { type: Date },

    bookmarks: [
      {
        tweetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('user', userSchema);
