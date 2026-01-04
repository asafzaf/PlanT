import { IProject, IProjectCreateDTO, IProjectUpdateDTO } from "@types";
import { Schema, Model, model, Document } from "mongoose";
import CounterService from "../utils/counter.service";

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

    // Customer Informations
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String },
    customerAddress: { type: String, required: true },

    // Financial
    budget: {
      totalAmount: { type: Number },
      currency: { type: String },
    },

    status: {
      type: String,
      enum: ["planning", "active", "on-hold", "completed", "cancelled"],
      required: true,
      default: "planning",
    },

    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date },
    deadlineDate: { type: Date },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProjectSchema.statics.createProject = async function (
  data: IProjectCreateDTO
): Promise<IProjectDB> {
  const internalId = await CounterService.nextId("Project");
  const project = new this({ ...data, internalId });
  return project.save();
};

ProjectSchema.statics.listProjects = function (): Promise<IProjectDB[]> {
  return this.find().exec();
};

ProjectSchema.statics.getProjectByInternalId = function (
  internalId: string
): Promise<IProjectDB | null> {
  return this.findOne({ internalId }).exec();
};

ProjectSchema.statics.updateProjectInternalId = function (
  internalId: string,
  data: IProjectUpdateDTO
): Promise<IProjectDB | null> {
  return this.findOneAndUpdate({ internalId }, data, { new: true }).exec();
};

ProjectSchema.statics.deleteProject = async function (
  projectId: string
): Promise<void> {
  return this.deleteOne({ internalId: projectId }).then(() => {});
};

export const ProjectModel = model<IProjectDB, IProjectModel>(
  "Project",
  ProjectSchema
);
