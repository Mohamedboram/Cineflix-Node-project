const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  // name , email, password, confirmPassword, photo
  name: {
    type: String,
    required: [true, "Please enter a short name"],
    unique: true,
    maxlength: 100,
    minlength: 5,
  },
  email: {
    type: String,
    required: [true, "Please enter an email address"],
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    minlength: 10,
    required: [true, "Please enter a password with at least 10 characters"],
    maxlength: 30,
    select: false,
  },
  confirmPassword: {
    type: String,
  
    validate: {
      validator: function (value) {
        return value === this.password;
      },
    },
  },
  passwordResetToken: String,
  passwordResetTokenExpiresAt: Date,
  passwordUpdatedAt: Date,
  photo: String,
  role: {
    type: String,
    enum: ["user", "admin", "operator"],
    default: "user",
  },
});

// Pre-save middleware for encrypting password before saving
userSchema.pre("save", async function (next) {
  // Only run this if the password field is modified
  if (!this.isModified("password")) return next();

  // Encrypt the password using bcrypt with 12 salt rounds
  this.password = await bcrypt.hash(this.password, 12);

  // Remove confirmPassword field (not needed in DB)
  this.confirmPassword = undefined;

  

  next();
});

userSchema.methods.comparePasswordInDb = async function (
  password,
  passwordInDb
) {
  return await bcrypt.compare(password, passwordInDb);
};

userSchema.methods.isPasswordChanged = function (JWTTimeStamp) {
  if (this.passwordUpdatedAt) {
    const passwordChangedTimeStamp = parseInt(
      this.passwordUpdatedAt.getTime() / 1000
    );
    console.log(
      `password timing: ${passwordChangedTimeStamp}, JWTIssuingTime: ${JWTTimeStamp}`
    );

    return JWTTimeStamp < passwordChangedTimeStamp;
  }
  return false;
};

userSchema.methods.createResetPasswordToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  // encrypting the token which will be saved in the database
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // specifying the time that the token will take before getting expired
  this.passwordResetTokenExpiresAt = Date.now() + 10 * 60 * 1000;

  console.log(
    resetToken,
    this.passwordResetToken,
    this.passwordResetTokenExpiresAt
  );

  // noticed here we are going to return the simple token to the user to use

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
