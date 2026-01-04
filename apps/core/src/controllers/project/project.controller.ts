import { Request, Response, NextFunction } from "express";
import { ProjectService, IProjectService } from "../../services/project";

export class ProjectController {
  private projectService: IProjectService;

  constructor(projectService?: IProjectService) {
    // allows DI for testing/mocking
    this.projectService = projectService || new ProjectService();
  }

  // Create new project
  public createProject = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const project = await this.projectService.createProject(req.body);
      res.status(201).json(project);
    } catch (err) {
      next(err);
    }
  };

  // List all projects
  public listProjects = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const projects = await this.projectService.listProjects();
      res.json(projects);
    } catch (err) {
      next(err);
    }
  };

  // Get project by internalId
  public getProjectByInternalId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { internalId } = req.params;
      const project = await this.projectService.getProjectByInternalId(
        internalId
      );
      if (!project)
        return res.status(404).json({ message: "Project not found" });
      res.json(project);
    } catch (err) {
      next(err);
    }
  };

  // Update project
  public updateProject = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { internalId } = req.params;
      const updated = await this.projectService.updateProject(
        internalId,
        req.body
      );
      if (!updated)
        return res.status(404).json({ message: "Project not found" });
      res.json(updated);
    } catch (err) {
      next(err);
    }
  };

  // Delete project
  public deleteProject = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { internalId } = req.params;
      await this.projectService.deleteProject(internalId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
