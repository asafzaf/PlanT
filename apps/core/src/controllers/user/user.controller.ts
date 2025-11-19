import { Request, Response, NextFunction } from "express";
import { UserService, IUserService } from "../../services/user";

export class UserController {
  private userService: IUserService;

  constructor(userService?: IUserService) {
    // allows DI for testing/mocking
    this.userService = userService || new UserService();
  }

  // Create new user
  public createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  };

  // List all users
  public listUsers = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const users = await this.userService.listUsers();
      res.json(users);
    } catch (err) {
      next(err);
    }
  };

  // Get user by email
  public getUserByEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.params;
      const user = await this.userService.getUserByEmail(email);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err) {
      next(err);
    }
  };

  // Get user by internalId
  public getUserByInternalId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { internalId } = req.params;
      const user = await this.userService.getUserByInternalId(internalId);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err) {
      next(err);
    }
  };

  // Update user
  public updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { internalId } = req.params;
      const updated = await this.userService.updateUser(internalId, req.body);
      if (!updated) return res.status(404).json({ message: "User not found" });
      res.json(updated);
    } catch (err) {
      next(err);
    }
  };

  // Delete user
  public deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.params;
      await this.userService.deleteUser(userId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
