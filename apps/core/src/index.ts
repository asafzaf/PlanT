import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import logger from "./utils/logger";
import requestLogger from "./middleware/requestLogger";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Example health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", env: process.env.NODE_ENV });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error({ err }, "Unhandled server error");
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Core server running on port ${port}`);
});

export default app;
