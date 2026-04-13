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

export type RecurringFrequency = "monthly";

export type RecurringTransaction = {
  id: string;
  title: string;
  type: TransactionType;
  amount: number;
  categoryId: CategoryId;
  scheduleDay: number;
  frequency: RecurringFrequency;
  note: string;
  isRequired: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SavingsGoal = {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  note: string;
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
  recurringSourceId?: string;
  recurringInstanceKey?: string;
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

export type RecurringFormValues = {
  title: string;
  type: TransactionType;
  amount: number;
  categoryId: CategoryId;
  scheduleDay: number;
  note: string;
  isRequired: boolean;
  isActive: boolean;
};

export type SavingsGoalFormValues = {
  title: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  note: string;
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

export type MonthlyTrendItem = {
  monthKey: string;
  incomeTotal: number;
  expenseTotal: number;
  net: number;
  requiredExpenseTotal: number;
};

export type MonthComparison = {
  monthKey: string;
  previousMonthKey: string;
  current: MonthlyStats;
  previous: MonthlyStats;
  incomeDelta: number;
  expenseDelta: number;
  netDelta: number;
  requiredDelta: number;
  incomeDeltaPercent: number | null;
  expenseDeltaPercent: number | null;
  netDeltaPercent: number | null;
};

export type CategoryComparisonStatus = "up" | "down" | "flat" | "new";

export type CategoryComparisonItem = {
  categoryId: CategoryId;
  name: string;
  color: string;
  currentAmount: number;
  previousAmount: number;
  delta: number;
  deltaPercent: number | null;
  status: CategoryComparisonStatus;
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

export type UpcomingRecurringItem = {
  recurringId: string;
  title: string;
  type: TransactionType;
  categoryId: CategoryId;
  amount: number;
  dueDate: string;
  daysUntil: number;
  isRequired: boolean;
  note: string;
};

export type RecurringOverview = {
  monthlyIncomePlanned: number;
  monthlyExpensePlanned: number;
  monthlyRequiredPlanned: number;
  activeCount: number;
  monthlyNetPlanned: number;
  upcomingItems: UpcomingRecurringItem[];
  nextExpenseTotal: number;
  nextIncomeTotal: number;
  autoCreatedCount: number;
  autoCreatedAmount: number;
};

export type SavingsProgress = {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  remainingAmount: number;
  progress: number;
  monthlyContribution: number;
  monthsToTarget: number | null;
  note: string;
  isCompleted: boolean;
};

export type SavingsOverview = {
  totalCurrentAmount: number;
  totalTargetAmount: number;
  totalRemainingAmount: number;
  totalMonthlyContribution: number;
  completedGoals: number;
  activeGoals: number;
};

export type InsightTone = "positive" | "neutral" | "warning" | "negative";

export type ProductInsight = {
  id: string;
  title: string;
  description: string;
  tone: InsightTone;
};
