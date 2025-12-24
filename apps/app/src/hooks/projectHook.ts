import { useQuery } from "@tanstack/react-query";
import { ProjectService } from "../services/projectService";
import type { IProject } from "@shared/types";

export const useProjects = () => {
  console.log("useProjects hook called");
  return useQuery<IProject[], Error>({
    queryKey: ["projects"],
    queryFn: ProjectService.listProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes cache
  });
};
