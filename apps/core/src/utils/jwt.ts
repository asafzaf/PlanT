import * as jwt from "jsonwebtoken";
import env from "../config/config.env";

export interface JwtPayload {
  id: string;
  email?: string;
  [key: string]: any;
}

export class JwtService {
  private static _instance: JwtService;
  private secret: jwt.Secret;
  private expiresIn: jwt.SignOptions["expiresIn"];

  private constructor() {
    const rawSecret = env.get("JWT_SECRET");
    if (!rawSecret) throw new Error("JWT_SECRET is not set");
    this.secret = String(rawSecret) as jwt.Secret;

    const rawExpires = env.get("JWT_EXPIRES_IN");
    this.expiresIn =
      typeof rawExpires === "number"
        ? rawExpires
        : (String(rawExpires ?? "1h") as jwt.SignOptions["expiresIn"]);
  }

  public static getInstance(): JwtService {
    if (!JwtService._instance) {
      JwtService._instance = new JwtService();
    }
    return JwtService._instance;
  }

  public sign(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  // Verify a token
  public verify(token: string): JwtPayload {
    return jwt.verify(token, this.secret) as JwtPayload;
  }

  // Decode without verifying (optional)
  public decode(token: string): JwtPayload | null {
    return jwt.decode(token) as JwtPayload | null;
  }
}