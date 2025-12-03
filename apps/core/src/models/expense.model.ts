import { IExpense, IExpenseCreateDTO, IExpenseUpdateDTO } from "@types";
import { Schema, Model, model, Document } from "mongoose";
import CounterService from "../utils/counter.service";

export interface IExpenseDB extends IExpense, Document {}
export interface IExpenseModel extends Model<IExpenseDB> {
  createExpense(data: IExpenseCreateDTO): Promise<IExpenseDB>;
  listExpenses(): Promise<IExpenseDB[]>;
  getExpenseByInternalId(internalId: string): Promise<IExpenseDB | null>;
  getExpensesByProjectId(projectId: string): Promise<IExpenseDB[]>;
  updateExpenseInternalId(
    internalId: string,
    data: IExpenseUpdateDTO
  ): Promise<IExpenseDB>;
  deleteExpense(expenseId: string): Promise<void>;
}

export const ExpenseSchema = new Schema<IExpenseDB, IExpenseModel>(
  {
    internalId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      enum: ['software', 'hardware', 'contractor', 'marketing', 'travel', 'office', 'utilities', 'general', 'other'],
      required: true,
      default: 'other',
    },
    expenseDate: { type: Date, required: true },
  },
  { timestamps: true }
);

ExpenseSchema.statics.createExpense = async function (
  data: IExpenseCreateDTO
): Promise<IExpenseDB> {
  const internalId = await CounterService.nextId("Expense");
  const expense = new this({ ...data, internalId });
  return expense.save();
};

ExpenseSchema.statics.listExpenses = function (): Promise<IExpenseDB[]> {
  return this.find().exec();
};

ExpenseSchema.statics.getExpenseByInternalId = function (
  internalId: string
): Promise<IExpenseDB | null> {
  return this.findOne({ internalId }).exec();
};

ExpenseSchema.statics.getExpensesByProjectId = function (
  projectId: string
): Promise<IExpenseDB[]> {
  return this.find({ projectId }).exec();
};

ExpenseSchema.statics.updateExpenseInternalId = function (
  internalId: string,
  data: IExpenseUpdateDTO
): Promise<IExpenseDB | null> {
  return this.findOneAndUpdate({ internalId }, data, { new: true }).exec();
};

ExpenseSchema.statics.deleteExpense = async function (
  internalId: string
): Promise<void> {
  return this.deleteOne({ internalId }).then(() => {});
};
    
export const ExpenseModel = model<IExpenseDB, IExpenseModel>(
  "Expense",
  ExpenseSchema
);
