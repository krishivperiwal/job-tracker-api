import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/dashboard");
});

router.get("/dashboard", (req, res) => {
  res.render("dashboard", { title: "Job Tracker" });
});

router.get("/auth", (req, res) => {
  res.render("auth", { title: "Authentication" });
});

router.get("/analytics", (req, res) => {
  res.render("analytics", { title: "Analytics" });
});

router.get("/home", (req, res) => {
  res.redirect("/dashboard");
});

router.get("/login", (req, res) => {
  res.redirect("/auth");
});

router.get("/register", (req, res) => {
  res.redirect("/auth");
});

router.get("/applications", (req, res) => {
  res.render("applications", { title: "Applications" });
});

router.get("/interviews", (req, res) => {
  res.render("interviews", { title: "Interviews" });
});

export default router;