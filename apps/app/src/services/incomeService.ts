import { authApi } from "../utils/api";
import type { IIncome, IIncomeCreateDTO } from "@shared/types";

export const IncomeService = {
  listIncomes: async () => {
    const { data } = await authApi.get<IIncome[]>("/incomes");
    return data;
  },

  getIncomeByInternalId: async (internalId: string) => {
    const { data } = await authApi.get<IIncome>(
      `/incomes/internal/${internalId}`,
    );
    console.log("Fetched income:", data);
    return data;
  },

  createIncome: async (payload: IIncomeCreateDTO) => {
    const { data } = await authApi.post<IIncome>("/incomes", payload);
    return data;
  },

  updateIncome: async (income: IIncome) => {
    const { data } = await authApi.put<IIncome>(
      `/incomes/${income.internalId}`,
      income,
    );
    return data;
  },

  deleteIncome: async (internalId: string) => {
    await authApi.delete(`/incomes/${internalId}`);
  },
};
