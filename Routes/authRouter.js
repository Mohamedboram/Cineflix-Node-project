const express = require('express');
const authController = require('./../controller/authController');
const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/signin').post(authController.signin);

router.route('/forgetPassword').post(authController.forgetPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

module.exports = router;