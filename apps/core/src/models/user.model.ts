import { IUser, IUserCreateDTO, IUserUpdateDTO } from "@types";
import { Schema, Model, model, Document, ObjectId } from "mongoose";

export interface IUserDB extends IUser, Document {
  password: string;
}

export interface IUserModel extends Model<IUserDB> {
  createUser(data: IUserCreateDTO): Promise<IUserDB>;
  listUsers(): Promise<IUserDB[]>;
  getUserByEmail(email: string): Promise<IUserDB | null>;
  getUserByInternalId(internalId: string): Promise<IUserDB | null>;
  updateUserInternalId(
    internalId: string,
    data: IUserUpdateDTO
  ): Promise<IUserDB>;
  deleteUser(userId: string): Promise<void>;
}

export const UserSchema = new Schema<IUserDB, IUserModel>(
  {
    internalId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user", "guest"], default: "user" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UserSchema.statics.createUser = async function (
  data: IUserCreateDTO
): Promise<IUserDB> {
  const user = new this(data);
  return user.save();
};

export const UserModel = model<IUserDB, IUserModel>("User", UserSchema);
