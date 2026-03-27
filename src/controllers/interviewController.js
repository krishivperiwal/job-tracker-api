import InterviewStage from "../models/InterviewStage.js";
import Application from "../models/Application.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

export const addInterviewStage = asyncHandler(async (req, res) => {
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

  const interview = await InterviewStage.create({
    ...req.body,
    applicationId: id
  });

  res.status(201).json(interview);
});

export const getInterviewStages = asyncHandler(async (req, res) => {
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

  const interviews = await InterviewStage.find({
    applicationId: id
  });

  res.json(interviews);
});

export const updateInterviewStage = asyncHandler(async (req, res) => {
  const interview = await InterviewStage.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!interview) {
    throw new AppError("Interview not found", 404);
  }

  res.json(interview);
});

export const deleteInterviewStage = asyncHandler(async (req, res) => {
  const interview = await InterviewStage.findByIdAndDelete(req.params.id);

  if (!interview) {
    throw new AppError("Interview not found", 404);
  }

  res.json({
    message: "Interview deleted"
  });
});