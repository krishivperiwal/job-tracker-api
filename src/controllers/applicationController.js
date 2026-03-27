import Application from "../models/Application.js";
import cloudinary from "../config/cloudinary.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

export const createApplication = asyncHandler(async (req, res) => {
  const application = await Application.create({
    ...req.body,
    userId: req.user.id
  });

  res.status(201).json(application);
});

export const getApplications = asyncHandler(async (req, res) => {
  const { status, company, sort } = req.query;
  const query = { userId: req.user.id };

  if (status) {
    query.status = status;
  }

  if (company) {
    query.companyName = { $regex: company, $options: "i" };
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  let sortOption = "-createdAt";

  if (sort === "oldest") sortOption = "createdAt";
  if (sort === "a-z") sortOption = "companyName";
  if (sort === "z-a") sortOption = "-companyName";

  const applications = await Application.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  res.json(applications);
});

export const getApplicationById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new AppError("Invalid application ID format", 400);
  }
  const application = await Application.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  res.json(application);
});

export const updateApplication = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new AppError("Invalid application ID format", 400);
  }
  const application = await Application.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user.id
    },
    req.body,
    { new: true }
  );

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  res.json(application);
});

export const deleteApplication = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new AppError("Invalid application ID format", 400);
  }
  const application = await Application.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  res.json({ message: "Application deleted" });
});

export const uploadResume = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid application ID format", 400);
  }
  const application = await Application.findOne({
    _id: id,
    userId: req.user.id
  });

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  if (!req.file) {
    throw new AppError("No file uploaded", 400);
  }

  const uploaded = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    stream.end(req.file.buffer);
  });

  application.resumeUrl = uploaded.secure_url;
  await application.save();

  res.json({
    message: "Resume uploaded",
    resumeUrl: uploaded.secure_url
  });
});