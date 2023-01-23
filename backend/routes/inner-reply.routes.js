const express = require('express');

const innerReplyController = require('../controllers/inner-reply.controller');
const verifyJWT = require('../middlewares/verifyJWT');

const router = express.Router();

router
  .route('/:tweetId/:replyId')
  .put(verifyJWT, innerReplyController.createInnerReply);

router
  .route('/:tweetId/:replyId/:innerReplyId')
  .delete(verifyJWT, innerReplyController.deleteInnerReply)
  .put(verifyJWT, innerReplyController.likeInnerReply);

module.exports = router;
