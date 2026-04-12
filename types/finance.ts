export type TransactionType = "income" | "expense";

export type CategoryKind = TransactionType;

export type CategoryId =
  | "salary"
  | "freelance"
  | "refund"
  | "gift_income"
  | "other_income"
  | "food"
  | "apartment"
  | "subscriptions"
  | "transport"
  | "entertainment"
  | "health"
  | "clothes"
  | "gifts"
  | "other_expense";

export type Category = {
  id: CategoryId;
  name: string;
  kind: CategoryKind;
  color: string;
  icon: string;
};

export type BudgetTarget = {
  categoryId: CategoryId;
  limit: number;
  createdAt: string;
  updatedAt: string;
};

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: CategoryId;
  date: string;
  note: string;
  isRequired: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TransactionFormValues = {
  type: TransactionType;
  amount: number;
  categoryId: CategoryId;
  date: string;
  note: string;
  isRequired: boolean;
};

export type CategorySpend = {
  categoryId: CategoryId;
  name: string;
  color: string;
  amount: number;
  percentage: number;
};

export type MonthlyStats = {
  monthKey: string;
  incomeTotal: number;
  expenseTotal: number;
  requiredExpenseTotal: number;
  optionalExpenseTotal: number;
  currentBalance: number;
  net: number;
  freeMoney: number;
  requiredShare: number;
  averageDailyExpense: number;
  topCategory: CategorySpend | null;
  categoryBreakdown: CategorySpend[];
};

export type BudgetProgressStatus = "safe" | "warning" | "overspent" | "unplanned";

export type CategoryBudgetProgress = {
  categoryId: CategoryId;
  name: string;
  color: string;
  spent: number;
  limit: number;
  remaining: number;
  percentageUsed: number;
  status: BudgetProgressStatus;
};

export type BudgetOverview = {
  monthKey: string;
  totalBudget: number;
  trackedSpent: number;
  remainingBudget: number;
  overspentAmount: number;
  overspentCount: number;
  warningCount: number;
  onTrackCount: number;
  unplannedSpent: number;
  trackedShare: number;
  progressItems: CategoryBudgetProgress[];
  topOverspend: CategoryBudgetProgress | null;
};

export type BudgetSummary = {
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  requiredExpenses: number;
  freeMoney: number;
  topCategory: CategorySpend | null;
  totalBudget: number;
  remainingBudget: number;
  overspentCount: number;
};
