const express = require("express");
const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  uploadResume
} = require("../controllers/applicationController");

const router = express.Router();

router.post("/", protect, createApplication);
router.get("/", protect, getApplications);
router.get("/:id", protect, getApplicationById);
router.patch("/:id", protect, updateApplication);
router.delete("/:id", protect, deleteApplication);
router.post("/:id/upload-resume", protect, upload.single("resume"), uploadResume);

module.exports = router;