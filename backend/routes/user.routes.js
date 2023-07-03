const express = require('express');

const userController = require('../controllers/user.controller');
const verifyJWT = require('../middlewares/verifyJWT');

const router = express.Router();

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router.route('/:userId').get(userController.getUserBasicInfo);

router.route('/bookmarks').get(verifyJWT, userController.getBookmarks);

module.exports = router;
