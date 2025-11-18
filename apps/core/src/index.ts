import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Example health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", env: process.env.NODE_ENV });
});

app.listen(port, () => {
  console.log(`Core server running on port ${port}`);
});
