import { authApi } from "../utils/api";
import type { IProject } from "@shared/types";

export const ProjectService = {
  listProjects: async () => {
    console.log("useProjects service called");
    const { data } = await authApi.get<IProject[]>("/projects");
    console.log("useProjects service return");

    return data;
  },
};
