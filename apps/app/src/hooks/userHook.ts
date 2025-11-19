import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UsersService } from '../services/userService';

type User = {
  id: number;
  name: string;
};

type NewUser = {
  name: string;
};

export const useUsers = () => {
  return useQuery<User[], Error>({ queryKey: ['users'], queryFn: UsersService.fetchUsers });
};

export const useAddUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, NewUser, { previous?: User[] }>(
    {
      mutationFn: (newUser: NewUser) => UsersService.addUser(newUser),
      onMutate: async (newUser: NewUser) => {
        await queryClient.cancelQueries({ queryKey: ['users'] });
        const previous = queryClient.getQueryData<User[]>(['users']);

        // Optimistically add the new user to the cache. If there's no cache yet, create one.
        queryClient.setQueryData<User[]>(['users'], (old) =>
          old ? [...old, (newUser as unknown) as User] : [(newUser as unknown) as User]
        );

        return { previous };
      },
      onError: (_err: unknown, _newUser: NewUser, context?: { previous?: User[] }) => {
        // Restore previous users only if we have them
        if (context?.previous) {
          queryClient.setQueryData<User[]>(['users'], context.previous);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
    }
  );
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, User>({ mutationFn: (user: User) => UsersService.updateUser(user), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }) });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, number>({ mutationFn: (id: number) => UsersService.deleteUser(id), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }) });
};
