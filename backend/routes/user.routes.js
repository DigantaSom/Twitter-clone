const express = require('express');

const userController = require('../controllers/user.controller');
const verifyJWT = require('../middlewares/verifyJWT');

const router = express.Router();

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router.route('/bookmarks').get(verifyJWT, userController.getBookmarks);

router.route('/basic').get(userController.getUserBasicInfo); // contains query variables
router.route('/profile').get(userController.getProfile); // contains query variables

router.route('/tweets/:username').get(userController.getTweetsByUsername);
router.route('/replies/:username').get(userController.getRepliesByUsername);
router
  .route('/media-tweets/:username')
  .get(userController.getMediaTweetsByUsername);
router
  .route('/liked-tweets/:username')
  .get(userController.getLikedTweetsByUsername);

router.route('/follow/:targetUserId').put(verifyJWT, userController.followUser);

module.exports = router;
