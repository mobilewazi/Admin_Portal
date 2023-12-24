export interface IProject {
  id: number;
  createdAt: string;
  projectName: string;
  projectCode: string;
  projectLink: string;
  targetAmount: number | null;
  startDate: string;
  endDate: string;
  description: string;
  category: string;
  otherCategory: string;
  status: 'InActive' | 'Active';
  deactivateOnTargetAmountReached: boolean;
  deactivateOnEndDateReached: boolean;
  deactivateWhenExpenseExceedCollection: boolean;
  transactions: ITransaction[];
  reportLink: string;
  amountToBePaid: number;
  canViewRePort: boolean;
  isProjectActive: boolean;
  paymentComplete: boolean;
  paymentThresholdMet: boolean;
  projectPayments: any[]; // Replace 'any' with a specific type if needed
  transactionSummary: TransactionSummary[];
  projectAdmin: string;

}
export interface ICreatedProject {
  createdById: number;
  projectName: string;
  projectLink: string;
  targetAmount: number,
  startDate: string;
  endDate: string;
  description: string;
  category: string;
  otherCategory: string;
  status: string;
  deactivateOnTargetAmountReached: boolean,
  deactivateOnEndDateReached: boolean,
  deactivateWhenExpenseExceedCollection: boolean,
  updatedById: null | string,
  projectCode: string;
  id: number,
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean
}

export interface IReport {
  projectAdminPhone: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  createdById: number;
  updatedById: null;
  isDeleted: boolean;
  projectName: string;
  projectCode: string;
  projectLink: string;
  targetAmount: null;
  startDate: Date;
  endDate: null;
  description: null;
  category: string;
  otherCategory: null;
  status: string;
  deactivateOnTargetAmountReached: boolean;
  deactivateOnEndDateReached: boolean;
  deactivateWhenExpenseExceedCollection: boolean;
  transactions: ITransaction[];
  amountToBePaid: number;
  canViewRePort: boolean;
  isProjectActive: boolean;
  transactionSummary: TransactionSummary[];
  timeReportGenerate: string;
  projectAdmin: string;
}

export interface TransactionSummary {
  Category: string;
  Total: number;
}

export interface ITransaction {
  id: number;
  createdAt: string;
  updatedAt?: string | null;
  createdById: number;
  updatedById: number | null;
  isDeleted: boolean;
  senderName: string;
  transactionAmount: number;
  transactionDate: Date;
  transactionCode: string;
  projectId: number;
  additionalComment: string;
  messageId: string;
  transactionType: 'D' | 'C';
  txnType: string;
  isManuallyMapped?: boolean

}
