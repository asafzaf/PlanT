import { IProjectCreateDTO, IProjectUpdateDTO, IProject } from "@types";

export interface IProjectService {
  createProject(data: IProjectCreateDTO): Promise<IProject>;
  listProjects(): Promise<IProject[]>;
  getProjectByInternalId(internalId: string): Promise<IProject | null>;
  updateProject(
    internalId: string,
    data: IProjectUpdateDTO
  ): Promise<IProject | null>;
  deleteProject(projectId: string): Promise<void>;
}
