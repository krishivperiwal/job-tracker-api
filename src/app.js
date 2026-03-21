const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const viewRoutes = require("./routes/viewRoutes");
const apiLimiter = require("./middlewares/rateLimiter");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", viewRoutes);

app.use("/api", apiLimiter);     
app.use("/api", analyticsRoutes);
app.use("/api", interviewRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/applications",applicationRoutes);

app.get("/", (req, res) => {
  res.send("Job Tracker API running");
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;