const express = require("express");

const protect = require("../middlewares/authMiddleware");

const {
  addInterviewStage,
  getInterviewStages,
  updateInterviewStage,
  deleteInterviewStage
} = require("../controllers/interviewController");

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/applications/:id/interviews", protect, asyncHandler(addInterviewStage));
router.get("/applications/:id/interviews", protect, asyncHandler(getInterviewStages));

router.patch("/interviews/:id", protect, asyncHandler(updateInterviewStage));
router.delete("/interviews/:id", protect, asyncHandler(deleteInterviewStage));

module.exports = router;