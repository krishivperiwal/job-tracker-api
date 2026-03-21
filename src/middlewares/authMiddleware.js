const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

const protect = (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {

      token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;

      next();

    } catch (error) {
      return next(new AppError("Not authorized, token failed", 401));
    }
  }

  if (!token) {
    return next(new AppError("Not authorized, no token", 401));
  }
};

module.exports = protect;   