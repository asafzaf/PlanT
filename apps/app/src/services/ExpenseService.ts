import { authApi } from "../utils/api";
import type { IExpense, IExpenseCreateDTO } from "@shared/types";

export const ExpenseService = {
  listExpenses: async () => {
    const { data } = await authApi.get<IExpense[]>("/expenses");
    return data;
  },

  createExpense: async (payload: IExpenseCreateDTO) => {
    const { data } = await authApi.post<IExpense>("/expenses", payload);
    return data;
  },

  deleteExpense: async (internalId: string) => {
    await authApi.delete(`/expenses/${internalId}`);
  },
};
