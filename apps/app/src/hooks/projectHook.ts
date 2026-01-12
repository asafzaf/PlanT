import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "../services/projectService";
import type { IProject, IProjectCreateDTO } from "@shared/types";

export const useProjects = () => {
  return useQuery<IProject[], Error>({
    queryKey: ["projects"],
    queryFn: ProjectService.listProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes cache
  });
};

export const useProjectByInternalId = (internalId?: string) => {
  return useQuery<IProject, Error>({
    queryKey: ["projects", internalId],
    queryFn: () => ProjectService.getProjectByInternalId(internalId!),
    enabled: !!internalId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation<IProject, Error, IProjectCreateDTO>({
    mutationFn: ProjectService.createProject,
    onSuccess: (createdProject) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      return createdProject;
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation<IProject, Error, IProject>({
    mutationFn: (project) => ProjectService.updateProject(project),
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["projects", updatedProject.internalId],
      });
      return updatedProject;
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (internalId) => ProjectService.deleteProject(internalId),
    onSuccess: (_, internalId) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["projects", internalId],
      });
    },
  });
};
