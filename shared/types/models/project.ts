export interface IBudget {
  totalAmount: number;
  currency: string; // 'USD', 'EUR', etc.
}

export interface IProjectCreateDTO {
  name: string;
  description?: string;
  ownerId: string;
  usersList?: string[];
  budget?: IBudget;
  status?: "planning" | "active" | "on-hold" | "completed" | "cancelled";
  startDate: Date;
  endDate?: Date;
  deadlineDate?: Date;
}

export interface IProjectUpdateDTO {
  name?: string;
  description?: string;
  usersList?: string[];
  isActive?: boolean;

  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;

  budget?: IBudget;
  status?: "planning" | "active" | "on-hold" | "completed" | "cancelled";
  startDate?: Date;
  endDate?: Date;
  deadlineDate?: Date;
}

export interface IProject {
  internalId: string;
  name: string;
  description?: string;
  ownerId: string; // Reference to User
  usersList: string[]; // References to Users

  // Customer Informations
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;

  // Financial
  budget?: IBudget;

  // Status & Tracking
  status: "planning" | "active" | "on-hold" | "completed" | "cancelled";
  isActive: boolean;

  startDate: Date;
  endDate?: Date;
  deadlineDate?: Date;

  createdAt: Date;
  updatedAt: Date;
}
