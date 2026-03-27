import mongoose from "mongoose";

const interviewStageSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true
    },

    stageName: {
      type: String,
      required: true,
      trim: true
    },

    scheduledDate: {
      type: Date
    },

    result: {
      type: String,
      enum: ["Pending", "Passed", "Failed"],
      default: "Pending"
    },

    notes: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const InterviewStage = mongoose.model("InterviewStage", interviewStageSchema);

export default InterviewStage;