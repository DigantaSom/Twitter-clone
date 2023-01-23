const express = require('express');

const replyController = require('../controllers/reply.controller');
const verifyJWT = require('../middlewares/verifyJWT');

const router = express.Router();

router
  .route('/:tweetId')
  .get(replyController.getRepliesOfTweet)
  .put(verifyJWT, replyController.createReply);

router
  .route('/:tweetId/:replyId')
  .get(replyController.getReplyById)
  .delete(verifyJWT, replyController.deleteReply)
  .put(verifyJWT, replyController.likeReply);

module.exports = router;
