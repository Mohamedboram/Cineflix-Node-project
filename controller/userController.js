const UsersModel = require("./../models/usersModel");
const asyncHandlerFnc = require("./../utilites/asyncHandlerFnc");
const CustomError = require("./../utilites/CustomError");
const authController = require("./../controller/authController");
exports.updatePassword = asyncHandlerFnc(async (req, res, next) => {
  // getting the password who wants to update from the database

  const user = await UsersModel.findById(req.user._id).select("+password");

  // compare the provided password against the current password in the database

  if (
    !(await user.comparePasswordInDb(req.body.currentPassword, user.password))
  ) {
    return next(
      new CustomError(
        "the provided password does not match the current password",
        401
      )
    );
  }

  // if it matches the current password then updatePassword

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  authController.createSendResponse(user, 200, res);
});

const filteredObject = (obj, ...allowedFields) => {
  let newObj = {};
  Object.keys(obj).forEach((field) => {
    if (allowedFields.includes(field)) newObj[field] = obj[field];
  });
  return newObj;
};

exports.updateMe = asyncHandlerFnc(async (req, res, next) => {
  //check if the user passed a password as part of the body object
  if (req.body.password || req.body.confirmPassword) {
    return new CustomError("you cannot update your password using ");
  }

  // filter what could be updated to prevent overwriting fields that can't be updated
  const filteredObj = filteredObject(req.body, "name", "email");
  const updateUser = await UsersModel.findByIdAndUpdate(
    req.user._id,
    filteredObj,
    {
      runValidators: true,
      new: true,
    }
  );
  res.status(200).json({
    status: "Success",
    data: {
      user: updateUser,
    },
  });
});

exports.deleteMe = asyncHandlerFnc(async (req, res, next) => {
  await UsersModel.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "deleted successfully",
    data: null,
  });
});

exports.getAllUsers = asyncHandlerFnc(async (req, res, next) => {
  const users = await UsersModel.find();

  res.status(200).json({
    status: "Success",
    usersCount: users.length,
    users,
  });
});
