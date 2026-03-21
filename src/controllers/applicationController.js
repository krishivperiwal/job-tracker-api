const Application = require("../models/Application");
const cloudinary = require("../config/cloudinary");
const AppError = require("../utils/appError");

const createApplication = async (req, res, next) => {
  try {
    const application = await Application.create({
      ...req.body,
      userId: req.user.userId
    });

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

const getApplications = async (req, res, next) => {
  try {

    const { status, company, sort } = req.query;

    const query = {
      userId: req.user.userId
    };

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

  } catch (error) {
    next(error);
  }
};

const getApplicationById = async (req, res, next) => {
  try {

    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!application) {
      throw new AppError("Application not found", 404);
    }

    res.json(application);

  } catch (error) {
    next(error);
  }
};

const updateApplication = async (req, res, next) => {
  try {

    const application = await Application.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId
      },
      req.body,
      { new: true }
    );

    if (!application) {
      throw new AppError("Application not found", 404);
    }

    res.json(application);

  } catch (error) {
    next(error);
  }
};

const deleteApplication = async (req, res, next) => {
  try {

    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!application) {
      throw new AppError("Application not found", 404);
    }

    res.json({ message: "Application deleted" });

  } catch (error) {
    next(error);
  }
};

const uploadResume = async (req, res, next) => {
  try {

    const { id } = req.params;

    const application = await Application.findOne({
      _id: id,
      userId: req.user.userId
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

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  uploadResume
};