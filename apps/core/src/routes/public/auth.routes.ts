import { Router } from "express";
import { AuthController } from "../../controllers/auth/auth.controller"; // e.g., login/register
import { validateUserCreate } from "../../validators/user.validator";

const router = Router();
const controller = new AuthController();

router.post("/login", controller.login);
router.post("/register", validateUserCreate, controller.register);

export default router;
