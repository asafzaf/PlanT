import { authApi } from "../utils/api";
import type { IUserLoginDTO, IUserLoginResponse } from "@shared/types";

export const UsersService = {
  login: async (payload: IUserLoginDTO) => {
    const { data } = await authApi.post<IUserLoginResponse>(
      "/auth/login",
      payload
    );
    return data;
  },
};
