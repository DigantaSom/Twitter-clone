const express = require('express');

const tweetController = require('../controllers/tweet.controller');
const verifyJWT = require('../middlewares/verifyJWT');

const router = express.Router();

router
  .route('/')
  .get(tweetController.getAllTweets)
  .post(verifyJWT, tweetController.createTweet);

router.route('/search').get(tweetController.getSearchedTweets); // contains a query variable
router.route('/media/search').get(tweetController.getSearchedMediaTweets); // contains a query variable

router
  .route('/:id')
  .get(tweetController.getTweetById)
  .delete(verifyJWT, tweetController.deleteTweet);

router.route('/like/:tweetId').put(verifyJWT, tweetController.likeTweet);

router
  .route('/bookmark/:tweetId')
  .put(verifyJWT, tweetController.bookmarkTweet);

router.route('/replies/:parentTweetId').get(tweetController.getReplies);

router.route('/retweet').post(verifyJWT, tweetController.retweet); // contains query variables
router
  .route('/getRetweetedPostId/:refTweetId')
  .get(tweetController.getRetweetedPostId); // contains a query variable

router
  .route('/quote/:quoteRefTweetId')
  .post(verifyJWT, tweetController.quoteTweet);
router.route('/quote/:tweetId').get(tweetController.getQuotes);

module.exports = router;
