import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addInterviewStage,
  getInterviewStages,
  updateInterviewStage,
  deleteInterviewStage
} from "../controllers/interviewController.js";

const router = express.Router();

router.post("/applications/:id/interviews", protect, addInterviewStage);
router.get("/applications/:id/interviews", protect, getInterviewStages);

router.patch("/interviews/:id", protect, updateInterviewStage);
router.delete("/interviews/:id", protect, deleteInterviewStage);

export default router;