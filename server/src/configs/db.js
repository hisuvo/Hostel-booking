import mongoose from "mongoose";
import config from "./index.js";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database connected")
    );
    await mongoose.connect(config.mogoDB_url);
  } catch (error) {
    console.error(error.message);
  }
};

export default connectDB;
