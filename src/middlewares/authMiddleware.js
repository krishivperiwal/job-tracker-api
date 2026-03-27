import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";

export const protect = (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = { id: decoded.id, email: decoded.email, role: decoded.role };

      next();
    } catch (error) {
      return next(new AppError("Not authorized, token failed", 401));
    }
  }

  if (!token) {
    return next(new AppError("Not authorized, no token", 401));
  }
};
