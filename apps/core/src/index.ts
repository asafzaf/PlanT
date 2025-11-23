import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { connectDB } from "./config/database";
import logger from "./utils/logger";
import requestLogger from "./middleware/requestLogger";
import routes from "./routes";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Example health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", env: process.env.NODE_ENV });
});

app.use("/", routes);

console.log('🔥 HOT RELOAD TEST - Change #2');
console.log('Current time:', new Date().toISOString());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error({ err }, "Unhandled server error");
  res.status(500).json({ error: "Internal server error" });
});

await connectDB();

app.listen(port, () => {
  console.log(`Core server running on port ${port}`);
});

export default app;
