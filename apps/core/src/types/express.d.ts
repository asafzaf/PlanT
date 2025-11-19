// src/types/express.d.ts
import { JwtPayload } from "@utils/jwt.service";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload; // optional user property
    }
  }
}
