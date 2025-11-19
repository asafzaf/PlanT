import { Router } from "express";
import { UserController } from "../../controllers/user/user.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
const controller = new UserController();

router.use(authMiddleware); // secure all routes

router.get("/", controller.listUsers);
router.get("/email/:email", controller.getUserByEmail);
router.get("/internal/:internalId", controller.getUserByInternalId);
router.post("/", controller.createUser);
router.put("/:internalId", controller.updateUser);
router.delete("/:userId", controller.deleteUser);

export default router;
