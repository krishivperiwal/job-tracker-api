import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const user = await User.create({
    name,
    email,
    password
  });

  const token = generateToken(user);

  res.status(201).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateToken(user);

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  });
});