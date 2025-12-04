import { Router } from "express";
import userRoutes from "./private/user.routes";
import authRoutes from "./public/auth.routes";
import projectRoutes from "./private/project.routes";
import expenseRoutes from "./private/expense.routes";
import incomeRoutes from "./private/income.routes";

const router = Router();

// Public routes (no auth)
router.use("/auth", authRoutes);

// Private routes (secured by auth middleware inside each private route file)
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/expenses", expenseRoutes);
router.use("/incomes", incomeRoutes);

export default router;
