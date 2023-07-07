const express = require('express');

const userController = require('../controllers/user.controller');
const verifyJWT = require('../middlewares/verifyJWT');

const router = express.Router();

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router.route('/bookmarks').get(verifyJWT, userController.getBookmarks);

router.route('/basic/:userId').get(userController.getUserBasicInfo);
router.route('/profile/:username').get(userController.getProfile);

router.route('/tweets/:username').get(userController.getTweetsByUsername);

module.exports = router;
