import { Router } from "express";
import { IncomeController } from "../../controllers/income/income.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
const controller = new IncomeController();
router.use(authMiddleware); // secure all routes

router.get("/", controller.listIncomes);
router.get("/internal/:internalId", controller.getIncomeByInternalId);
router.get("/project/:projectId", controller.getIncomesByProjectId);
router.post("/", controller.createIncome);
router.put("/:internalId", controller.updateIncome);
router.delete("/:internalId", controller.deleteIncome);

export default router;
