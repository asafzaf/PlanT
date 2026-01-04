import { Request, Response, NextFunction } from "express";
import { ExpenseService, IExpenseService } from "../../services/expense";

export class ExpenseController {
  private expenseService: IExpenseService;

  constructor(expenseService?: IExpenseService) {
    // allows DI for testing/mocking
    this.expenseService = expenseService || new ExpenseService();
  }

  // Create new expense
  public createExpense = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const expense = await this.expenseService.createExpense(req.body);
      res.status(201).json(expense);
    } catch (err) {
      next(err);
    }
  };

  // List all expenses
  public listExpenses = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const expenses = await this.expenseService.listExpenses();
      res.json(expenses);
    } catch (err) {
      next(err);
    }
  };

  // Get expense by internalId
  public getExpenseByInternalId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { internalId } = req.params;
      const expense = await this.expenseService.getExpenseByInternalId(
        internalId
      );
      if (!expense)
        return res.status(404).json({ message: "Expense not found" });
      res.json(expense);
    } catch (err) {
      next(err);
    }
  };

  // Get expenses by userId
  public getExpensesByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.params;
      const expenses = await this.expenseService.getExpensesByUserId(userId);
      res.json(expenses);
    } catch (err) {
      next(err);
    }
  };

  // Get expenses by projectId
  public getExpensesByProjectId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { projectId } = req.params;
      const expenses = await this.expenseService.getExpensesByProjectId(
        projectId
      );
      res.json(expenses);
    } catch (err) {
      next(err);
    }
  };

  // Update expense
  public updateExpense = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { internalId } = req.params;
      const updated = await this.expenseService.updateExpense(
        internalId,
        req.body
      );
      if (!updated)
        return res.status(404).json({ message: "Expense not found" });
      res.json(updated);
    } catch (err) {
      next(err);
    }
  };

  // Delete expense
  public deleteExpense = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { internalId } = req.params;
      await this.expenseService.deleteExpense(internalId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
