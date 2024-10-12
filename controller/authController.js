const UsersModel = require("./../models/usersModel");
const asyncHandlerFnc = require("./../utilites/asyncHandlerFnc");
const jwt = require("jsonwebtoken");
const CustomError = require("./../utilites/CustomError");
const sendEmail = require("./../utilites/sendEmail");
const util = require("util");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};
exports.signup = asyncHandlerFnc(async (req, res, nxt) => {
  const newUser = await UsersModel.create(req.body);
  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
      token,
    },
  });
});

exports.signin = asyncHandlerFnc(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    const error = new CustomError(
      "please enter your email or password correctly",
      404
    );
    next(error);
  }

  const user = await UsersModel.findOne({ email: email }).select("+password");
  const token = signToken(user._id);

  if (!user || !(await user.comparePasswordInDb(password, user.password))) {
    const error = new CustomError(
      "please enter your email or password correctly, there was an mismatch in your password",
      400
    );
    return next(error);
  }

  res.status(200).json({
    status: "success",
    data: {
      token,
    },
  });
});

exports.protect = asyncHandlerFnc(async (req, res, next) => {
  //1.read the token & check if it exists
  const testToken = req.headers.authorization;
  let token;
  if (testToken && testToken.startsWith("Bearer")) {
    token = testToken.split(" ")[1];
  }
  //console.log(token);
  if (!token) {
    const error = new CustomError("you are not logged in", 401);
    next(error);
  }
  //2.validate the token

  const decodedToken = await jwt.verify(token, process.env.SECRET_STR);

  console.log(decodedToken);

  //3.check if the user exists in the database
  const user = await UsersModel.findById(decodedToken.id);

  if (!user) {
    const error = new CustomError("the user with give token doesn't exit", 401);
    return next(error);
  }
  if (await user.isPasswordChanged(decodedToken.iat)) {
    const error = new CustomError(
      "the password has changed recently, please login again",
      401
    );
    return next(error);
  }
  //4. if the  user changed their password after the JWT was issued

  req.user = user;
  next();
});

exports.restrict = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      const error = new CustomError(
        "you don't have a permission to do this operation",
        403
      );
      next(error);
    }
    next();
  };
};

exports.forgetPassword = asyncHandlerFnc(async (req, res, next) => {
  // retrieve user based on the user's email
  const user = await UsersModel.findOne({ email: req.body.email });

  // what will we send if the user isn't in the database
  if (!user) {
    return next(
      new CustomError(
        "There is no email with what you asked to change its password",
        404
      )
    );
  }

  // generate a random reset token
  const resetToken = user.createResetPasswordToken();
  user.markModified("passwordResetToken");
  user.markModified("passwordResetTokenExpiresAt");

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;
  const msg = `We have received a password reset request. Please use the link below to reset your password:\n\n${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Change Request",
      message: msg, // Correct the variable name
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (error) {
    // Reset token fields if email fails to send
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresAt = undefined;
    user.markModified("passwordResetToken");
    user.markModified("passwordResetTokenExpiresAt");

    await user.save({ validateBeforeSave: false });

    return next(
      new CustomError(
        "There was an error sending the password reset email, please try again later",
        500
      )
    );
  }
});


exports.resetPassword = asyncHandlerFnc(async (req, res, nex) => {});

/* exports.restrict = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      const error = new CustomError(
        "you don't have a permission to do this operation",
        403
      );
       next(error);
    }
    next();
  };
};
 */
