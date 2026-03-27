import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 100, 

  message: {
    status: "fail",
    message: "Too many requests, please try again later."
  },

  standardHeaders: true,
  legacyHeaders: false
});

export default apiLimiter;