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

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/", protect, asyncHandler(createApplication));
router.get("/", protect, asyncHandler(getApplications));
router.get("/:id", protect, asyncHandler(getApplicationById));
router.patch("/:id", protect, asyncHandler(updateApplication));
router.delete("/:id", protect, asyncHandler(deleteApplication));
router.post("/:id/upload-resume", protect, upload.single("resume"), asyncHandler(uploadResume));

module.exports = router;