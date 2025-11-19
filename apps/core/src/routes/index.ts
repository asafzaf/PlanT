import { Router } from "express";
import userRoutes from "./private/user.routes";
import authRoutes from "./public/auth.routes";

const router = Router();

// Public routes (no auth)
router.use("/auth", authRoutes);

// Private routes (secured by auth middleware inside each private route file)
router.use("/users", userRoutes);

export default router;
