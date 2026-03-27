import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  uploadResume
} from "../controllers/applicationController.js";

const router = express.Router();

router.post("/", protect, createApplication);
router.get("/", protect, getApplications);
router.get("/:id", protect, getApplicationById);
router.patch("/:id", protect, updateApplication);
router.delete("/:id", protect, deleteApplication);
router.post("/:id/upload-resume", protect, upload.single("resume"), uploadResume);

export default router;