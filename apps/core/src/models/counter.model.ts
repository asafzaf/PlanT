// apps/core/src/models/counter.model.ts
import { Schema, model, Document } from "mongoose";

export interface ICounter extends Document {
  modelName: string;
  seq: number;
}

const CounterSchema = new Schema<ICounter>({
  modelName: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

export const CounterModel = model<ICounter>("Counter", CounterSchema);
