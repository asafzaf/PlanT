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

export const useExpenseByInternalId = (internalId?: string) => {
  return useQuery<IExpense, Error>({
    queryKey: ["expenses", internalId],
    queryFn: () => ExpenseService.getExpenseByInternalId(internalId!),
    enabled: !!internalId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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
export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation<IExpense, Error, IExpense>({
    mutationFn: (expense) => ExpenseService.updateExpense(expense),
    onSuccess: (updatedExpense) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({
        queryKey: ["expenses", updatedExpense.internalId],
      });
      return updatedExpense;
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (internalId) => ExpenseService.deleteExpense(internalId),
    onSuccess: (_, internalId) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({
        queryKey: ["expenses", internalId],
      });
    },
  });
};
