import { authApi } from "../utils/api";
import type { IExpense, IExpenseCreateDTO } from "@shared/types";

export const ExpenseService = {
  listExpenses: async () => {
    const { data } = await authApi.get<IExpense[]>("/expenses");
    return data;
  },

  getExpenseByInternalId: async (internalId: string) => {
    const { data } = await authApi.get<IExpense>(
      `/expenses/internal/${internalId}`
    );
    console.log("Fetched expense:", data);
    return data;
  },

  createExpense: async (payload: IExpenseCreateDTO) => {
    const { data } = await authApi.post<IExpense>("/expenses", payload);
    return data;
  },

  updateExpense: async (expense: IExpense) => {
    const { data } = await authApi.put<IExpense>(
      `/expenses/${expense.internalId}`,
      expense
    );
    return data;
  },

  deleteExpense: async (internalId: string) => {
    await authApi.delete(`/expenses/${internalId}`);
  },
};
