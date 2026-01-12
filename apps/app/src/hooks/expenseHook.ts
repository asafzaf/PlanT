import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExpenseService } from "../services/ExpenseService";
import type { IExpense, IExpenseCreateDTO } from "@shared/types";

export const useExpenses = () => {
  return useQuery<IExpense[], Error>({
    queryKey: ["expenses"],
    queryFn: ExpenseService.listExpenses,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes cache
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation<IExpense, Error, IExpenseCreateDTO>({
    mutationFn: ExpenseService.createExpense,
    onSuccess: (createdExpense) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      return createdExpense;
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (internalId) => ExpenseService.deleteExpense(internalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
};
