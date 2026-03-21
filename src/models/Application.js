const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true
		},
		companyName: {
			type: String,
			required: true,
			trim: true
		},
		role: {
			type: String,
			required: true,
			trim: true
		},
		status: {
			type: String,
			enum: ["Applied", "Interview", "Offer", "Rejected", "Ghosted"],
			default: "Applied"
		},
		jobLink: {
			type: String,
			trim: true
		},
		notes: {
			type: String,
			trim: true
		},
		resumeUrl: {
			type: String,
			trim: true
		}
	},
	{
		timestamps: true
	}
);

applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ companyName: "text" });

module.exports = mongoose.model("Application", applicationSchema);
