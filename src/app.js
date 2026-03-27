import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import viewRoutes from "./routes/viewRoutes.js";
import apiLimiter from "./middlewares/rateLimiter.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

app.get("/", (req, res) => {
  res.send("Job Tracker API running");
});

app.use(notFound);
app.use(errorHandler);

export default app;