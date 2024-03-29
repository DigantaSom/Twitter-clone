const express = require('express');

const userController = require('../controllers/user.controller');
const verifyJWT = require('../middlewares/verifyJWT');

const router = express.Router();

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser)
  .put(verifyJWT, userController.editProfile);

router.route('/me/basic').get(verifyJWT, userController.getMyBasicInfo);

router.route('/basic').get(userController.getUserBasicInfo); // contains query variables
router.route('/profile').get(userController.getProfile); // contains query variables

router.route('/bookmarks').get(verifyJWT, userController.getBookmarks);

router.route('/tweets/:username').get(userController.getTweetsOfUser);
router.route('/replies/:username').get(userController.getRepliesOfUser);
router
  .route('/media-tweets/:username')
  .get(userController.getMediaTweetsOfUser);
router
  .route('/liked-tweets/:username')
  .get(userController.getLikedTweetsOfUser);

router.route('/follow/:targetUserId').put(verifyJWT, userController.followUser);
router.route('/followers/:username').get(userController.getFollowers);
router.route('/following/:username').get(userController.getFollowing);
router
  .route('/mutual-followers/:username')
  .get(verifyJWT, userController.getMutualFollowers);

router.route('/search').get(userController.getSearchedUsers); // contains a query variable

module.exports = router;
