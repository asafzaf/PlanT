import { IIncomeCreateDTO, IIncomeUpdateDTO, IIncome } from "@types";

export interface IIncomeService {
  createIncome(data: IIncomeCreateDTO): Promise<IIncome>;
  listIncomes(): Promise<IIncome[]>;
  getIncomeByInternalId(internalId: string): Promise<IIncome | null>;
  getIncomesByProjectId(projectId: string): Promise<IIncome[]>;
  updateIncome(
    internalId: string,
    data: IIncomeUpdateDTO
  ): Promise<IIncome | null>;
  deleteIncome(incomeId: string): Promise<void>;
}
