import bcrypt from "bcryptjs";
import { Schema, Model, model, Document } from "mongoose";
import { IUser, IUserCreateDTO, IUserUpdateDTO } from "@types";
import CounterService from "../utils/counter.service";
import { hashPassword, comparePassword } from "../utils/bcrypt";

export interface IUserDB extends IUser, Document {
  password: string;
}

export interface IUserModel extends Model<IUserDB> {
  createUser(data: IUserCreateDTO): Promise<IUserDB>;
  validatePassword(internalId: string, password: string): Promise<boolean>;
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
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "user", "guest"], default: "user" },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_, ret) {
        delete (ret as any).password; // remove password when converting to JSON
        return ret;
      },
    },
    toObject: {
      transform: function (_, ret) {
        delete (ret as any).password; // remove password when converting to Object
        return ret;
      },
    },
  }
);

UserSchema.pre<IUserDB>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.statics.createUser = async function (
  data: IUserCreateDTO
): Promise<IUserDB> {
  const internalId = await CounterService.nextId("User");
  const user = new this({ ...data, internalId });
  return user.save();
};

UserSchema.statics.validatePassword = async function (
  internalId: string,
  plain: string
) {
  const userWithPassword = await this.findOne({ internalId })
    .select("+password")
    .exec();
  if (!userWithPassword) return false;
  return comparePassword(plain, userWithPassword.password);
};

UserSchema.statics.listUsers = function () {
  return this.find().exec();
};

UserSchema.statics.getUserByEmail = function (email: string) {
  return this.findOne({ email }).exec();
};

UserSchema.statics.getUserByInternalId = function (internalId: string) {
  return this.findOne({ internalId }).exec();
};

UserSchema.statics.updateUserInternalId = async function (
  internalId: string,
  data: IUserUpdateDTO
): Promise<IUserDB | null> {
  if (data.password) {
    data.password = await hashPassword(data.password);
  }
  return this.findOneAndUpdate({ internalId }, data, { new: true }).exec();
};

UserSchema.statics.deleteUser = function (userId: string) {
  return this.findByIdAndDelete(userId).exec();
};

export const UserModel = model<IUserDB, IUserModel>("User", UserSchema);
