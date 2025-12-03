// apps/core/src/utils/counter.service.ts
import { CounterModel } from "../models/counter.model";

const DEFAULT_PREFIX: Record<string, number> = {
  User: 100000,
  Project: 200000,
  Income: 30000000,
  Expense: 40000000,

  // add more models here
};

class CounterService {
  private static _instance: CounterService;

  private constructor() {}

  public static get instance(): CounterService {
    if (!this._instance) this._instance = new CounterService();
    return this._instance;
  }

  /**
   * Get the next internal ID for a model
   * @param modelName Name of the model (e.g., "User", "Project")
   * @returns next internalId as string
   */
  public async nextId(modelName: string): Promise<string> {
    const defaultPrefix = DEFAULT_PREFIX[modelName] ?? 0;

    // Atomically increment counter in MongoDB
    const counter = await CounterModel.findOneAndUpdate(
      { modelName },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // Add the default prefix to the counter sequence
    const nextId = defaultPrefix + counter.seq;
    return nextId.toString();
  }
}

export default CounterService.instance;
