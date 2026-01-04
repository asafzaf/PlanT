import { Router } from "express";
import { ExpenseController } from "../../controllers/expense/expense.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
const controller = new ExpenseController();
router.use(authMiddleware); // secure all routes

router.get("/", controller.listExpenses);
router.get("/internal/:internalId", controller.getExpenseByInternalId);
router.get("/user/:userId", controller.getExpensesByUserId);
router.get("/project/:projectId", controller.getExpensesByProjectId);
router.post("/", controller.createExpense);
router.put("/:internalId", controller.updateExpense);
router.delete("/:internalId", controller.deleteExpense);

export default router;
