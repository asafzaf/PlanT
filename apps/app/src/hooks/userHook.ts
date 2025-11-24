import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UsersService } from "../services/userService";
import type { IUser, IUserCreateDTO } from "@shared/types";

export const useUsers = () => {
  return useQuery<IUser[], Error>({
    queryKey: ["users"],
    queryFn: UsersService.listUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes cache
  });
};

export const useProjects = () => {
  return useQuery<IUser[], Error>({
    queryKey: ["projects"],
    queryFn: UsersService.listUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes cache
  });
};

export const useAddUser = () => {
  const queryClient = useQueryClient();

  return useMutation<IUser, Error, IUserCreateDTO, { previous?: IUser[] }>({
    mutationFn: (newUser: IUserCreateDTO) =>
      UsersService.createNewUser(newUser),
    onMutate: async (newUser: IUserCreateDTO) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previous = queryClient.getQueryData<IUser[]>(["users"]);

      queryClient.setQueryData<IUser[]>(["users"], (old) =>
        old
          ? [...old, newUser as unknown as IUser]
          : [newUser as unknown as IUser]
      );

      return { previous };
    },
    onError: (
      _err: unknown,
      _newUser: IUserCreateDTO,
      context?: { previous?: IUser[] }
    ) => {
      if (context?.previous) {
        queryClient.setQueryData<IUser[]>(["users"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// export const useUpdateUser = () => {
//   const queryClient = useQueryClient();
//   return useMutation<User, Error, User>({
//     mutationFn: (user: User) => UsersService.updateUser(user),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
//   });
// };

// export const useDeleteUser = () => {
//   const queryClient = useQueryClient();
//   return useMutation<any, Error, number>({
//     mutationFn: (id: number) => UsersService.deleteUser(id),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
//   });
// };
