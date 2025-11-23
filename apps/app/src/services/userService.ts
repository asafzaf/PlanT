import { authApi } from "../utils/api";
import type { IUser, IUserCreateDTO, IProjectUpdateDTO } from "@shared/types";

export const UsersService = {
  listUsers: async () => {
    const { data } = await authApi.get<IUser[]>("/users");
    return data;
  },

  createNewUser: async (userData: IUserCreateDTO) => {
    const { data } = await authApi.post<IUser>("/users", userData);
    return data;
  },

  updateUser: async (userId: string, userData: IProjectUpdateDTO) => {
    const { data } = await authApi.put<IUser>(`/users/${userId}`, userData);
    return data;
  },

  deleteUser: async (id: string) => {
    const { data } = await authApi.delete(`/users/${id}`);
    return data;
  },
};
