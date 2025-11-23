import { Request, Response, NextFunction } from "express";

export type Rule<T> = (value: T) => true | string;

export type ValidatorRules<T> = {
  [K in keyof T]?: Rule<T[K]>[];
};

export const validate =
  <T>(rules: ValidatorRules<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const errors: Record<string, string[]> = {};

    for (const key in rules) {
      const fieldRules = rules[key]!;
      const value = (req.body as any)[key];

      // If the field is optional (like in Update DTO)
      if (value === undefined) continue;

      for (const rule of fieldRules) {
        const result = rule(value);
        if (result !== true) {
          if (!errors[key]) errors[key] = [];
          errors[key].push(result);
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    next();
  };
