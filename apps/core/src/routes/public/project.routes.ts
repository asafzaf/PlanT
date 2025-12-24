import { Router } from "express";
import { ProjectController } from "../../controllers/project/project.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
const controller = new ProjectController();

// router.use(authMiddleware); // secure all routes

router.get("/", controller.listProjects);
// router.get("/internal/:internalId", controller.getProjectByInternalId);
// router.post("/", controller.createProject);
// router.put("/:internalId", controller.updateProject);
// router.delete("/:internalId", controller.deleteProject);

export default router;
