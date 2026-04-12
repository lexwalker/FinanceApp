import type {
  BudgetOverview,
  BudgetTarget,
  BudgetSummary,
  Category,
  CategoryBudgetProgress,
  CategorySpend,
  MonthlyStats,
  Transaction,
} from "@/types/finance";

function round(value: number) {
  return Math.round(value * 100) / 100;
}

export function getMonthKey(dateValue = new Date()) {
  const year = dateValue.getFullYear();
  const month = `${dateValue.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}

export function getMonthOptions(transactions: Transaction[]) {
  const monthKeys = new Set<string>();

  for (const transaction of transactions) {
    monthKeys.add(getMonthKey(new Date(transaction.date)));
  }

  monthKeys.add(getMonthKey(new Date()));

  return [...monthKeys].sort((left, right) => right.localeCompare(left));
}

export function filterTransactionsByMonth(transactions: Transaction[], monthKey: string) {
  return transactions.filter(
    (transaction) => getMonthKey(new Date(transaction.date)) === monthKey,
  );
}

export function sortTransactionsByDate(transactions: Transaction[]) {
  return [...transactions].sort(
    (left, right) => new Date(right.date).getTime() - new Date(left.date).getTime(),
  );
}

export function calculateBalance(transactions: Transaction[]) {
  return transactions.reduce((sum, transaction) => {
    return sum + (transaction.type === "income" ? transaction.amount : -transaction.amount);
  }, 0);
}

export function buildCategoryBreakdown(
  transactions: Transaction[],
  categories: Category[],
): CategorySpend[] {
  const expenses = transactions.filter((transaction) => transaction.type === "expense");
  const totalExpenses = expenses.reduce((sum, transaction) => sum + transaction.amount, 0);

  return categories
    .filter((category) => category.kind === "expense")
    .map((category) => {
      const amount = expenses
        .filter((transaction) => transaction.categoryId === category.id)
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      return {
        categoryId: category.id,
        name: category.name,
        color: category.color,
        amount,
        percentage: totalExpenses === 0 ? 0 : round((amount / totalExpenses) * 100),
      };
    })
    .filter((category) => category.amount > 0)
    .sort((left, right) => right.amount - left.amount);
}

export function calculateMonthlyStats(
  transactions: Transaction[],
  categories: Category[],
  monthKey = getMonthKey(),
): MonthlyStats {
  const monthTransactions = filterTransactionsByMonth(transactions, monthKey);
  const incomeTotal = monthTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const expenseTotal = monthTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const requiredExpenseTotal = monthTransactions
    .filter((transaction) => transaction.type === "expense" && transaction.isRequired)
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const optionalExpenseTotal = expenseTotal - requiredExpenseTotal;
  const categoryBreakdown = buildCategoryBreakdown(monthTransactions, categories);
  const daysPassed = Math.max(new Date().getDate(), 1);
  const currentBalance = calculateBalance(transactions);
  const topCategory = categoryBreakdown[0] ?? null;

  return {
    monthKey,
    incomeTotal,
    expenseTotal,
    requiredExpenseTotal,
    optionalExpenseTotal,
    currentBalance,
    net: incomeTotal - expenseTotal,
    freeMoney: incomeTotal - requiredExpenseTotal,
    requiredShare: expenseTotal === 0 ? 0 : round((requiredExpenseTotal / expenseTotal) * 100),
    averageDailyExpense: round(expenseTotal / daysPassed),
    topCategory,
    categoryBreakdown,
  };
}

export function calculateBudgetSummary(
  transactions: Transaction[],
  categories: Category[],
  budgetTargets: BudgetTarget[],
  monthKey = getMonthKey(),
): BudgetSummary {
  const stats = calculateMonthlyStats(transactions, categories, monthKey);
  const budgetOverview = calculateBudgetOverview(transactions, categories, budgetTargets, monthKey);

  return {
    balance: stats.currentBalance,
    monthlyIncome: stats.incomeTotal,
    monthlyExpenses: stats.expenseTotal,
    requiredExpenses: stats.requiredExpenseTotal,
    freeMoney: stats.freeMoney,
    topCategory: stats.topCategory,
    totalBudget: budgetOverview.totalBudget,
    remainingBudget: budgetOverview.remainingBudget,
    overspentCount: budgetOverview.overspentCount,
  };
}

export function calculateBudgetOverview(
  transactions: Transaction[],
  categories: Category[],
  budgetTargets: BudgetTarget[],
  monthKey = getMonthKey(),
): BudgetOverview {
  const stats = calculateMonthlyStats(transactions, categories, monthKey);
  const expenseCategories = categories.filter((category) => category.kind === "expense");
  const breakdownMap = new Map(stats.categoryBreakdown.map((item) => [item.categoryId, item]));
  const budgetMap = new Map(budgetTargets.map((budgetTarget) => [budgetTarget.categoryId, budgetTarget]));

  const progressItems: CategoryBudgetProgress[] = expenseCategories
    .map((category) => {
      const spent = breakdownMap.get(category.id)?.amount ?? 0;
      const limit = budgetMap.get(category.id)?.limit ?? 0;
      const percentageUsed = limit === 0 ? 0 : round((spent / limit) * 100);
      const remaining = Math.max(limit - spent, 0);

      let status: CategoryBudgetProgress["status"] = "safe";

      if (limit === 0 && spent > 0) {
        status = "unplanned";
      } else if (limit > 0 && spent >= limit) {
        status = "overspent";
      } else if (limit > 0 && percentageUsed >= 80) {
        status = "warning";
      }

      return {
        categoryId: category.id,
        name: category.name,
        color: category.color,
        spent,
        limit,
        remaining,
        percentageUsed,
        status,
      };
    })
    .filter((item) => item.limit > 0 || item.spent > 0)
    .sort((left, right) => {
      if (left.status === "overspent" && right.status !== "overspent") {
        return -1;
      }

      if (left.status !== "overspent" && right.status === "overspent") {
        return 1;
      }

      return right.spent - left.spent;
    });

  const trackedItems = progressItems.filter((item) => item.limit > 0);
  const totalBudget = trackedItems.reduce((sum, item) => sum + item.limit, 0);
  const trackedSpent = trackedItems.reduce((sum, item) => sum + item.spent, 0);
  const overspentAmount = trackedItems.reduce(
    (sum, item) => sum + Math.max(item.spent - item.limit, 0),
    0,
  );
  const unplannedSpent = progressItems
    .filter((item) => item.limit === 0)
    .reduce((sum, item) => sum + item.spent, 0);

  return {
    monthKey,
    totalBudget,
    trackedSpent,
    remainingBudget: Math.max(totalBudget - trackedSpent, 0),
    overspentAmount,
    overspentCount: trackedItems.filter((item) => item.status === "overspent").length,
    warningCount: trackedItems.filter((item) => item.status === "warning").length,
    onTrackCount: trackedItems.filter((item) => item.status === "safe").length,
    unplannedSpent,
    trackedShare: stats.expenseTotal === 0 ? 0 : round((trackedSpent / stats.expenseTotal) * 100),
    progressItems,
    topOverspend: trackedItems.find((item) => item.status === "overspent") ?? null,
  };
}
