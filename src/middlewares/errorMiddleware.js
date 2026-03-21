const AppError = require("../utils/appError");

const notFound = (req, res, next) => {
	next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

const errorHandler = (err, req, res, next) => {
	let statusCode = err.statusCode || res.statusCode;

	if (!statusCode || statusCode < 400) {
		statusCode = 500;
	}

	let message = err.message || "Something went wrong";

	if (err.name === "CastError") {
		statusCode = 400;
		message = "Invalid resource identifier";
	}

	if (err.name === "ValidationError") {
		statusCode = 400;
		message = Object.values(err.errors)
			.map(item => item.message)
			.join(", ");
	}

	if (err.code === 11000) {
		statusCode = 400;
		message = "Duplicate field value";
	}

	if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
		statusCode = 401;
		message = "Not authorized, token failed";
	}

	if (err.name === "MulterError") {
		statusCode = 400;
		message = err.message;
	}

	if (err instanceof SyntaxError && "body" in err) {
		statusCode = 400;
		message = "Invalid JSON payload";
	}

	const payload = {
		status: `${statusCode}`.startsWith("4") ? "fail" : "error",
		message,
		...(process.env.NODE_ENV !== "production" && { stack: err.stack })
	};

	if (req.originalUrl.startsWith("/api")) {
		res.status(statusCode).json(payload);
		return;
	}

	res.status(statusCode).render("error", {
		message,
		stack: err.stack,
		showStack: process.env.NODE_ENV !== "production"
	});
};

module.exports = {
	notFound,
	errorHandler
};
