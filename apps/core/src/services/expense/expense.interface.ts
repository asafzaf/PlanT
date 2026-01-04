import { IExpenseCreateDTO, IExpenseUpdateDTO, IExpense } from "@types";

export interface IExpenseService {
  createExpense(data: IExpenseCreateDTO): Promise<IExpense>;
  listExpenses(): Promise<IExpense[]>;
  getExpenseByInternalId(internalId: string): Promise<IExpense | null>;
  getExpensesByUserId(userId: string): Promise<IExpense[]>;
  getExpensesByProjectId(projectId: string): Promise<IExpense[]>;
  updateExpense(
    internalId: string,
    data: IExpenseUpdateDTO
  ): Promise<IExpense | null>;
  deleteExpense(expenseId: string): Promise<void>;
}
