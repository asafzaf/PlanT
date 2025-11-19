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
