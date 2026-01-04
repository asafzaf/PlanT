import { authApi } from "../utils/api";
import type { IProject, IProjectCreateDTO } from "@shared/types";

export const ProjectService = {
  listProjects: async () => {
    const { data } = await authApi.get<IProject[]>("/projects");
    return data;
  },

  createProject: async (payload: IProjectCreateDTO) => {
    const { data } = await authApi.post<IProject>("/projects", payload);
    return data;
  },
};
