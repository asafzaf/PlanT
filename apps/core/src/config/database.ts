import mongoose from "mongoose";
import env from "./config.env"; // your EnvConfig instance

export const connectDB = async (): Promise<void> => {
  const mongoUri = env.get("MONGO_URI", "mongodb://mongo:27017/planT"); // default local DB

  try {
    await mongoose.connect(mongoUri, {
      // options are optional in Mongoose 7+, defaults are usually fine
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${mongoUri}`);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

// Optional: handle connection events
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err);
});
