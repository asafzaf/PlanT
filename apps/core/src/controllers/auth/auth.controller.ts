import { Request, Response, NextFunction } from "express";
import { UserService } from "../../services/user";
import { JwtService } from "../../utils/jwt";

export class AuthController {
  private userService: UserService;

  constructor(userService?: UserService) {
    this.userService = userService || new UserService();
  }

  // REGISTER
  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        businessName,
        businessDescription,
      } = req.body;

      // Check if user exists
      const existing = await this.userService.getUserByEmail(email);
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Create user
      const newUser = await this.userService.createUser({
        firstName,
        lastName,
        email,
        password,
        businessName,
        businessDescription,
      });
      // Sign JWT
      const token = JwtService.getInstance().sign({
        id: newUser.internalId,
        email: newUser.email,
      });

      res.status(201).json({
        user: newUser,
        token,
      });
    } catch (err) {
      next(err);
    }
  };

  // LOGIN
  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isMatch = await this.userService.validatePassword(
        user.internalId,
        password
      );
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Sign JWT
      const token = JwtService.getInstance().sign({
        id: user.internalId,
        email: user.email,
      });

      res.json({
        user,
        token,
      });
    } catch (err) {
      next(err);
    }
  };
}
