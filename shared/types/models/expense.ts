export interface IExpenseCreateDTO {
  amount: number;
  description: string;
  expenseDate: Date;
  category: string;
  
  // Project allocation - flexible!
  projectAllocations?: Array<{
    projectId: string;
    percentage: number; // 0-100
    amount?: number; // Calculated or manual
  }>;
  
  // Or leave empty for general expenses
}

export interface IExpense {
  internalId: string;
  userId: string; // Who incurred the expense
  
  amount: number;
  currency: string;
  description: string;
  category: 'software' | 'hardware' | 'contractor' | 'marketing' | 'travel' | 'office' | 'utilities' | 'general' | 'other';
  
  expenseDate: Date;
  receipt?: string; // URL to receipt image
  
  // PROJECT ALLOCATION - The key part!
  projectAllocations: Array<{
    projectId: string;
    percentage: number; // Must sum to 100 if allocated
    amount: number; // Calculated: (percentage / 100) * total amount
  }>;
  // If empty array = general/overhead expense not tied to any project
  
  // Allocation type for reporting
  allocationType: 'single' | 'multiple' | 'general';
  
  // Tax tracking
  isDeductible: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}