const express = require("express");
const authController = require("./../controller/authController");
const userController = require("./../controller/userController");
const userRouter = express.Router();
userRouter
  .route("/updatePassword")
  .patch(authController.protect, userController.updatePassword);

userRouter
  .route("/updateMe")
  .patch(authController.protect, userController.updateMe);

userRouter
  .route("/deleteMe")
  .delete(authController.protect, userController.deleteMe);

userRouter.route("/getAllUsers").get(userController.getAllUsers);

module.exports = userRouter;
