import { authApi } from "../utils/api";
import type { IExpense } from "@shared/types";

export const ExpenseService = {
  listExpenses: async () => {
    const { data } = await authApi.get<IExpense[]>("/expenses");
    return data;
  },

  deleteExpense: async (internalId: string) => {
    await authApi.delete(`/expenses/${internalId}`);
  },
};
