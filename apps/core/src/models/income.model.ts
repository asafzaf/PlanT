import { IIncome, IIncomeCreateDTO, IIncomeUpdateDTO } from "@types";
import { Schema, Model, model, Document } from "mongoose";
import CounterService from "../utils/counter.service";

export interface IIncomeDB extends IIncome, Document {}
export interface IIncomeModel extends Model<IIncomeDB> {
  createIncome(data: IIncomeCreateDTO): Promise<IIncomeDB>;
  listIncomes(): Promise<IIncomeDB[]>;
  getIncomeByInternalId(internalId: string): Promise<IIncomeDB | null>;
  getIncomesByProjectId(projectId: string): Promise<IIncomeDB[]>;
  updateIncomeInternalId(
    internalId: string,
    data: IIncomeUpdateDTO
  ): Promise<IIncomeDB>;
  deleteIncome(incomeId: string): Promise<void>;
}

export const IncomeSchema = new Schema<IIncomeDB, IIncomeModel>(
  {
    internalId: { type: String, required: true, unique: true },
    projectId: { type: String, required: true },
    userId: { type: String, required: true },

    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      enum: ["payment", "deposit", "bonus", "refund", "other"],
      required: true,
      default: "other",
    },
    receivedDate: { type: Date, required: true },
    paymentMethod: {
      methodType: {
        type: String,
        enum: ["bank_transfer", "paypal", "stripe", "cash", "check", "other"],
      },
      details: { type: String },
    },
    invoiceNumber: { type: String },
    transactionId: { type: String },

    isTaxable: { type: Boolean, required: true, default: true },
    taxAmount: { type: Number },
  },
  { timestamps: true }
);

IncomeSchema.statics.createIncome = async function (
  data: IIncomeCreateDTO
): Promise<IIncomeDB> {
  const internalId = await CounterService.nextId("Income");
  const income = new this({ ...data, internalId });
  return income.save();
};

IncomeSchema.statics.listIncomes = function (): Promise<IIncomeDB[]> {
  return this.find().exec();
};

IncomeSchema.statics.getIncomeByInternalId = function (
  internalId: string
): Promise<IIncomeDB | null> {
  return this.findOne({ internalId }).exec();
};

IncomeSchema.statics.getIncomesByProjectId = function (
  projectId: string
): Promise<IIncomeDB[]> {
  return this.find({ projectId }).exec();
};

IncomeSchema.statics.updateIncomeInternalId = function (
  internalId: string,
  data: IIncomeUpdateDTO
): Promise<IIncomeDB | null> {
  return this.findOneAndUpdate({ internalId }, data, { new: true }).exec();
};

IncomeSchema.statics.deleteIncome = async function (
  internalId: string
): Promise<void> {
  return this.deleteOne({ internalId }).then(() => {});
};

export const IncomeModel = model<IIncomeDB, IIncomeModel>(
  "Income",
  IncomeSchema
);
