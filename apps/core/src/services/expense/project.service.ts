import { IExpenseService } from "./expense.interface";
import { IExpenseCreateDTO, IExpenseUpdateDTO, IExpense } from "@types";
import { ExpenseModel } from "../../models/expense.model";

export class ExpenseService implements IExpenseService {
  // Create a new expense
  async createExpense(data: IExpenseCreateDTO): Promise<IExpense> {
    return await ExpenseModel.createExpense(data);
  }

  // List all expenses
  async listExpenses(): Promise<IExpense[]> {
    return await ExpenseModel.listExpenses();
  }

  // Get expense by internalId
  async getExpenseByInternalId(internalId: string): Promise<IExpense | null> {
    const expense = await ExpenseModel.getExpenseByInternalId(internalId);
    return expense ?? null;
  }

  // Get expenses by projectId
  async getExpensesByProjectId(projectId: string): Promise<IExpense[]> {
    return await ExpenseModel.getExpensesByProjectId(projectId);
  }

  // Update expense
  async updateExpense(
    internalId: string,
    data: IExpenseUpdateDTO
  ): Promise<IExpense | null> {
    const updated = await ExpenseModel.updateExpenseInternalId(internalId, data);
    return updated ?? null;
  }

  // Delete expense
  async deleteExpense(expenseId: string): Promise<void> {
    await ExpenseModel.deleteExpense(expenseId);
  }
}
