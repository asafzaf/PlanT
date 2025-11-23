export interface IProjectCreateDTO {
  name: string;
  description?: string;
  ownerId: string;
  usersList?: string[];
}

export interface IProjectUpdateDTO {
  name?: string;
  description?: string;
  usersList?: string[];
  isActive?: boolean;
}

export interface IProject {
  internalId: string;
  name: string;
  description?: string;
  ownerId: string;
  usersList: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
