import { IProject } from "@types";
import { Schema, Model, model, Document } from "mongoose";

export interface IProjectDB extends IProject, Document {}

export interface IProjectModel extends Model<IProjectDB> {
  createProject(data: Partial<IProject>): Promise<IProjectDB>;
  listProjects(): Promise<IProjectDB[]>;
  getProjectByInternalId(internalId: string): Promise<IProjectDB | null>;
  updateProjectInternalId(
    internalId: string,
    data: Partial<IProject>
  ): Promise<IProjectDB>;
  deleteProject(projectId: string): Promise<void>;
}

export const ProjectSchema = new Schema<IProjectDB, IProjectModel>(
  {
    internalId: { type: String, required: true, unique: true },
    name: { type: String, required: true },

    description: { type: String },
    ownerId: { type: String, required: true },
    usersList: { type: [String], default: [] },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
