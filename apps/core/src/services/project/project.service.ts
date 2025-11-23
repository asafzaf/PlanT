import { IProjectService } from "./project.interface";
import { IProjectCreateDTO, IProjectUpdateDTO, IProject } from "@types";
import { ProjectModel } from "../../models/project.model";

export class ProjectService implements IProjectService {
  // Create a new project
  async createProject(data: IProjectCreateDTO): Promise<IProject> {
    return await ProjectModel.createProject(data);
  }

  // List all projects
  async listProjects(): Promise<IProject[]> {
    return await ProjectModel.listProjects();
  }

  // Get project by internalId
  async getProjectByInternalId(internalId: string): Promise<IProject | null> {
    const project = await ProjectModel.getProjectByInternalId(internalId);
    return project ?? null;
  }

  // Update project
  async updateProject(
    internalId: string,
    data: IProjectUpdateDTO
  ): Promise<IProject | null> {
    const updated = await ProjectModel.updateProjectInternalId(internalId, data);
    return updated ?? null;
  }

  // Delete project
  async deleteProject(projectId: string): Promise<void> {
    await ProjectModel.deleteProject(projectId);
  }
}
