export interface IPaymentMethod {
  methodType: 'bank_transfer' | 'paypal' | 'stripe' | 'cash' | 'check' | 'other';
  details?: string; // e.g., account number, PayPal email, etc.
}

export interface IIncomeUpdateDTO {
  amount?: number;
  description?: string;
  receivedDate?: Date;
  paymentMethod?: IPaymentMethod;
  invoiceNumber?: string;
}

export interface IIncomeCreateDTO {
  projectId: string;
  amount: number;
  userId: string;
  description?: string;
  receivedDate: Date;
  paymentMethod?: string;
  invoiceNumber?: string;
}

export interface IIncome {
  internalId: string;
  projectId: string; // Reference to Project
  userId: string; // Who received it
  
  amount: number;
  currency: string;
  description?: string;
  category: 'payment' | 'deposit' | 'bonus' | 'refund' | 'other';
  
  // Payment details
  receivedDate: Date;
  paymentMethod?: IPaymentMethod;
  invoiceNumber?: string;
  transactionId?: string;
  
  // Tax tracking
  isTaxable: boolean;
  taxAmount?: number;
  
  createdAt: Date;
  updatedAt: Date;
}