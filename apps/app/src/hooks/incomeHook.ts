import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IncomeService } from "../services/incomeService";
import type { IIncome, IIncomeCreateDTO } from "@shared/types";

export const useIncomes = () => {
  return useQuery<IIncome[], Error>({
    queryKey: ["incomes"],
    queryFn: IncomeService.listIncomes,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes cache
  });
};

export const useIncomeByInternalId = (internalId?: string) => {
  return useQuery<IIncome, Error>({
    queryKey: ["incomes", internalId],
    queryFn: () => IncomeService.getIncomeByInternalId(internalId!),
    enabled: !!internalId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateIncome = () => {
  const queryClient = useQueryClient();

  return useMutation<IIncome, Error, IIncomeCreateDTO>({
    mutationFn: IncomeService.createIncome,
    onSuccess: (createdIncome) => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      return createdIncome;
    },
  });
};

export const useUpdateIncome = () => {
  const queryClient = useQueryClient();

  return useMutation<IIncome, Error, IIncome>({
    mutationFn: (income) => IncomeService.updateIncome(income),
    onSuccess: (updatedIncome) => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      queryClient.invalidateQueries({
        queryKey: ["incomes", updatedIncome.internalId],
      });
      return updatedIncome;
    },
  });
};

export const useDeleteIncome = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (internalId) => IncomeService.deleteIncome(internalId),
    onSuccess: (_, internalId) => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      queryClient.invalidateQueries({
        queryKey: ["incomes", internalId],
      });
    },
  });
};
