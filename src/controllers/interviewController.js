const InterviewStage = require("../models/InterviewStage");
const Application = require("../models/Application");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");

const addInterviewStage = async (req, res, next) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid application ID format", 400);
    }

    const application = await Application.findOne({
      _id: id,
      userId: req.user.userId
    });

    if (!application) {
      throw new AppError("Application not found", 404);
    }

    const interview = await InterviewStage.create({
      ...req.body,
      applicationId: id
    });

    res.status(201).json(interview);

  } catch (error) {
    next(error);
  }
};

const getInterviewStages = async (req, res, next) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid application ID format", 400);
    }

    const application = await Application.findOne({
      _id: id,
      userId: req.user.userId
    });

    if (!application) {
      throw new AppError("Application not found", 404);
    }

    const interviews = await InterviewStage.find({
      applicationId: id
    });

    res.json(interviews);

  } catch (error) {
    next(error);
  }
};

const updateInterviewStage = async (req, res, next) => {
  try {

    const interview = await InterviewStage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!interview) {
      throw new AppError("Interview not found", 404);
    }

    res.json(interview);

  } catch (error) {
    next(error);
  }
};

const deleteInterviewStage = async (req, res, next) => {
  try {

    const interview = await InterviewStage.findByIdAndDelete(req.params.id);

    if (!interview) {
      throw new AppError("Interview not found", 404);
    }

    res.json({
      message: "Interview deleted"
    });

  } catch (error) {
    next(error);
  }
};


module.exports = {
  addInterviewStage,
  getInterviewStages,
  updateInterviewStage,
  deleteInterviewStage
};