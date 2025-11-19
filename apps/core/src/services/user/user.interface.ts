import { IUserCreateDTO, IUserUpdateDTO, IUser } from "@types";

export interface IUserService {
  createUser(data: IUserCreateDTO): Promise<IUser>;
  listUsers(): Promise<IUser[]>;
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserByInternalId(internalId: string): Promise<IUser | null>;
  updateUser(internalId: string, data: IUserUpdateDTO): Promise<IUser | null>;
  deleteUser(userId: string): Promise<void>;
  validatePassword(userId: string, password: string): Promise<boolean>;
}
