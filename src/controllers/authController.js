const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const AppError = require("../utils/appError");

const registerUser = async (req, res, next) => {
  try {

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

  } catch (error) {
    next(error);
  }
};


const loginUser = async (req, res, next) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await user.comparePassword(password);

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

  } catch (error) {
    next(error);
  }
};


module.exports = {registerUser,loginUser};