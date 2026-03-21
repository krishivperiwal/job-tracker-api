const express = require("express");

const protect = require("../middlewares/authMiddleware");

const {
  addInterviewStage,
  getInterviewStages,
  updateInterviewStage,
  deleteInterviewStage
} = require("../controllers/interviewController");

const router = express.Router();

router.post("/applications/:id/interviews", protect, addInterviewStage);
router.get("/applications/:id/interviews", protect, getInterviewStages);

router.patch("/interviews/:id", protect, updateInterviewStage);
router.delete("/interviews/:id", protect, deleteInterviewStage);

module.exports = router;