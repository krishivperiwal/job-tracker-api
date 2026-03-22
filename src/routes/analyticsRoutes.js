const express = require("express");
const protect = require("../middlewares/authMiddleware");

const { getAnalytics } = require("../controllers/analyticsController");

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get("/analytics", protect, asyncHandler(getAnalytics));

module.exports = router;