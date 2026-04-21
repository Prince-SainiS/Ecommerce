const User = require("../models/User");
const jwt = require("jsonwebtoken");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");

exports.register = asyncErrorHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  user.password = undefined;

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check email & password exist
  if (!email || !password) {
    return next(new CustomError("Please provide email and password", 400));
  }

  // 2. Find user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new CustomError("Invalid credentials", 401));
  }

  // 3. Compare password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new CustomError("Invalid credentials", 401));
  }

  // 4. Generate JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // 5. Remove password
  user.password = undefined;

  // 6. Send response
  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});
