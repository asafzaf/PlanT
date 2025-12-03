import { IIncomeService } from "./income.interface";
import { IIncomeCreateDTO, IIncomeUpdateDTO, IIncome } from "@types";
import { IncomeModel } from "../../models/income.model";

export class IncomeService implements IIncomeService {
  // Create a new income
  async createIncome(data: IIncomeCreateDTO): Promise<IIncome> {
    return await IncomeModel.createIncome(data);
  }

  // List all incomes
  async listIncomes(): Promise<IIncome[]> {
    return await IncomeModel.listIncomes();
  }

  // Get income by internalId
  async getIncomeByInternalId(internalId: string): Promise<IIncome | null> {
    const income = await IncomeModel.getIncomeByInternalId(internalId);
    return income ?? null;
  }

  // Get incomes by projectId
  async getIncomesByProjectId(projectId: string): Promise<IIncome[]> {
    return await IncomeModel.getIncomesByProjectId(projectId);
  }

  // Update income
  async updateIncome(
    internalId: string,
    data: IIncomeUpdateDTO
  ): Promise<IIncome | null> {
    const updated = await IncomeModel.updateIncomeInternalId(internalId, data);
    return updated ?? null;
  }

  // Delete income
  async deleteIncome(incomeId: string): Promise<void> {
    await IncomeModel.deleteIncome(incomeId);
  }
}
