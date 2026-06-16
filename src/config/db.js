import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri || typeof uri !== "string" || uri.trim() === "") {
    console.error(
      "Database connection failed: MONGO_URI is not defined. Please add MONGO_URI to your .env file and restart the server."
    );
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;