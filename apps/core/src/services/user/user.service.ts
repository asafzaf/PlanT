import { IUserService } from "./user.interface";
import { IUserCreateDTO, IUserUpdateDTO, IUser } from "@types";
import { UserModel } from "../../models/user.model";

export class UserService implements IUserService {
  // Create a new user
  async createUser(data: IUserCreateDTO): Promise<IUser> {
    return await UserModel.createUser(data);
  }

  // List all users
  async listUsers(): Promise<IUser[]> {
    return await UserModel.listUsers();
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<IUser | null> {
    const user = await UserModel.getUserByEmail(email);
    return user ?? null;
  }

  // Get user by internalId
  async getUserByInternalId(internalId: string): Promise<IUser | null> {
    const user = await UserModel.getUserByInternalId(internalId);
    return user ?? null;
  }

  // Update user
  async updateUser(
    internalId: string,
    data: IUserUpdateDTO
  ): Promise<IUser | null> {
    const updated = await UserModel.updateUserInternalId(internalId, data);
    return updated ?? null;
  }

  // Delete user
  async deleteUser(userId: string): Promise<void> {
    await UserModel.deleteUser(userId);
  }

  // Validate password (login)
  async validatePassword(userId: string, password: string): Promise<boolean> {
    const UserData = await this.getUserByInternalId(userId);
    if (!UserData) return false;
    return UserModel.validatePassword(userId, password);
  }
}
