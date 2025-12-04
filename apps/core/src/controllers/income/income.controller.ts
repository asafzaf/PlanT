import { Request, Response, NextFunction } from "express";
import { IncomeService, IIncomeService } from "../../services/income";

export class IncomeController {
  private incomeService: IIncomeService;

  constructor(incomeService?: IIncomeService) {
    // allows DI for testing/mocking
    this.incomeService = incomeService || new IncomeService();
  }
  // Create new income
  public createIncome = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const income = await this.incomeService.createIncome(req.body);
      res.status(201).json(income);
    } catch (err) {
      next(err);
    }
  };

  // List all incomes
  public listIncomes = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const incomes = await this.incomeService.listIncomes();
      res.json(incomes);
    } catch (err) {
      next(err);
    }
  };

  // Get income by internalId
  public getIncomeByInternalId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { internalId } = req.params;
      const income = await this.incomeService.getIncomeByInternalId(internalId);
      if (!income) return res.status(404).json({ message: "Income not found" });
      res.json(income);
    } catch (err) {
      next(err);
    }
  };

  public getIncomesByProjectId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { projectId } = req.params;
      const incomes = await this.incomeService.getIncomesByProjectId(projectId);
      res.json(incomes);
    } catch (err) {
      next(err);
    }
  };

  // Update income
  public updateIncome = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { internalId } = req.params;
      const updated = await this.incomeService.updateIncome(
        internalId,
        req.body
      );
      if (!updated)
        return res.status(404).json({ message: "Income not found" });
      res.json(updated);
    } catch (err) {
      next(err);
    }
  };

  // Delete income
  public deleteIncome = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { incomeId } = req.params;
      await this.incomeService.deleteIncome(incomeId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
