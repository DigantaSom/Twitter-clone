const Tweet = require('../models/Tweet.model');

const getAsyncResultsWithForLoop = async array => {
  const promises = array.map(
    async bookmark =>
      await Tweet.findOne({
        $and: [{ _id: bookmark.tweetId }, { isDeleted: false }],
      })
  );

  const resultIncludingNull = await Promise.all(promises);

  const result = resultIncludingNull.filter(tweet => tweet != null);

  return result;
};

module.exports = getAsyncResultsWithForLoop;
