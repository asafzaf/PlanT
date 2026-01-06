export interface IUserLoginResponse {
  token: string;
  user: IUser;
}

export interface IUserLoginDTO {
  email: string;
  password: string;
}

export interface IUserCreateDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  businessName: string;
  businessDescription?: string;
}

export interface IUserUpdateDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: "admin" | "user" | "guest";
  isActive?: boolean;
  businessName?: string;
  businessDescription?: string;
}

export interface IUser {
  internalId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "user" | "guest";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  businessName: string;
  businessDescription?: string;
}
