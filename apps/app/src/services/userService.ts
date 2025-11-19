import {authApi} from '../utils/api';

export const UsersService = {
  fetchUsers: async () => {
    const { data } = await authApi.get('/users');
    return data;
  },

  addUser: async (user: { name: string }) => {
    const { data } = await authApi.post('/users', user);
    return data;
  },

  updateUser: async (user: { id: number; name: string }) => {
    const { data } = await authApi.put(`/users/${user.id}`, user);
    return data;
  },

  deleteUser: async (id: number) => {
    const { data } = await authApi.delete(`/users/${id}`);
    return data;
  },
};
