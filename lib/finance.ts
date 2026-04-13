import type {
  BudgetOverview,
  BudgetSummary,
  BudgetTarget,
  Category,
  CategoryBudgetProgress,
  CategoryComparisonItem,
  CategorySpend,
  MonthComparison,
  MonthlyStats,
  MonthlyTrendItem,
  ProductInsight,
  RecurringOverview,
  RecurringTransaction,
  SavingsGoal,
  SavingsOverview,
  SavingsProgress,
  Transaction,
  UpcomingRecurringItem,
} from "@/types/finance";

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function getDaysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function startOfToday(referenceDate = new Date()) {
  return new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
    0,
    0,
    0,
    0,
  );
}

function getPercentDelta(current: number, previous: number) {
  if (previous === 0) {
    return current === 0 ? 0 : null;
  }

  return round(((current - previous) / previous) * 100);
}

export function getMonthKey(dateValue = new Date()) {
  const year = dateValue.getFullYear();
  const month = `${dateValue.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}

export function getPreviousMonthKey(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  return getMonthKey(new Date(year, month - 2, 1));
}

export function createRecurringDate(referenceDate: Date, scheduleDay: number, monthOffset = 0) {
  const monthStart = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth() + monthOffset,
    1,
  );
  const safeDay = Math.min(
    scheduleDay,
    getDaysInMonth(monthStart.getFullYear(), monthStart.getMonth()),
  );

  return new Date(monthStart.getFullYear(), monthStart.getMonth(), safeDay, 12, 0, 0, 0);
}

export function getRecurringInstanceKey(recurringId: string, monthKey: string) {
  return `${recurringId}:${monthKey}`;
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
  const [year, month] = monthKey.split("-").map(Number);
  const currentMonth = new Date();
  const isCurrentMonth =
    currentMonth.getFullYear() === year && currentMonth.getMonth() + 1 === month;
  const daysInScope = isCurrentMonth
    ? Math.max(currentMonth.getDate(), 1)
    : getDaysInMonth(year, month - 1);
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
    averageDailyExpense: round(expenseTotal / daysInScope),
    topCategory,
    categoryBreakdown,
  };
}

export function buildMonthlyTrend(
  transactions: Transaction[],
  categories: Category[],
  monthCount = 6,
): MonthlyTrendItem[] {
  const monthKeys = getMonthOptions(transactions).slice(0, monthCount).reverse();

  return monthKeys.map((monthKey) => {
    const stats = calculateMonthlyStats(transactions, categories, monthKey);

    return {
      monthKey,
      incomeTotal: stats.incomeTotal,
      expenseTotal: stats.expenseTotal,
      net: stats.net,
      requiredExpenseTotal: stats.requiredExpenseTotal,
    };
  });
}

export function calculateMonthComparison(
  transactions: Transaction[],
  categories: Category[],
  monthKey = getMonthKey(),
): MonthComparison {
  const previousMonthKey = getPreviousMonthKey(monthKey);
  const current = calculateMonthlyStats(transactions, categories, monthKey);
  const previous = calculateMonthlyStats(transactions, categories, previousMonthKey);

  return {
    monthKey,
    previousMonthKey,
    current,
    previous,
    incomeDelta: current.incomeTotal - previous.incomeTotal,
    expenseDelta: current.expenseTotal - previous.expenseTotal,
    netDelta: current.net - previous.net,
    requiredDelta: current.requiredExpenseTotal - previous.requiredExpenseTotal,
    incomeDeltaPercent: getPercentDelta(current.incomeTotal, previous.incomeTotal),
    expenseDeltaPercent: getPercentDelta(current.expenseTotal, previous.expenseTotal),
    netDeltaPercent: getPercentDelta(current.net, previous.net),
  };
}

export function buildCategoryComparison(
  transactions: Transaction[],
  categories: Category[],
  monthKey = getMonthKey(),
): CategoryComparisonItem[] {
  const currentStats = calculateMonthlyStats(transactions, categories, monthKey);
  const previousStats = calculateMonthlyStats(
    transactions,
    categories,
    getPreviousMonthKey(monthKey),
  );
  const currentMap = new Map(
    currentStats.categoryBreakdown.map((item) => [item.categoryId, item.amount]),
  );
  const previousMap = new Map(
    previousStats.categoryBreakdown.map((item) => [item.categoryId, item.amount]),
  );

  return categories
    .filter((category) => category.kind === "expense")
    .map((category) => {
      const currentAmount = currentMap.get(category.id) ?? 0;
      const previousAmount = previousMap.get(category.id) ?? 0;
      const delta = currentAmount - previousAmount;

      let status: CategoryComparisonItem["status"] = "flat";

      if (previousAmount === 0 && currentAmount > 0) {
        status = "new";
      } else if (delta > 0) {
        status = "up";
      } else if (delta < 0) {
        status = "down";
      }

      return {
        categoryId: category.id,
        name: category.name,
        color: category.color,
        currentAmount,
        previousAmount,
        delta,
        deltaPercent: getPercentDelta(currentAmount, previousAmount),
        status,
      };
    })
    .filter((item) => item.currentAmount > 0 || item.previousAmount > 0)
    .sort((left, right) => Math.abs(right.delta) - Math.abs(left.delta));
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
  const budgetMap = new Map(
    budgetTargets.map((budgetTarget) => [budgetTarget.categoryId, budgetTarget]),
  );

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

function createAutoRecurringTransaction(
  recurring: RecurringTransaction,
  dueDate: Date,
  monthKey: string,
): Transaction {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    type: recurring.type,
    amount: recurring.amount,
    categoryId: recurring.categoryId,
    date: dueDate.toISOString(),
    note: recurring.note || recurring.title,
    isRequired: recurring.type === "expense" ? recurring.isRequired : false,
    recurringSourceId: recurring.id,
    recurringInstanceKey: getRecurringInstanceKey(recurring.id, monthKey),
    createdAt: now,
    updatedAt: now,
  };
}

export function syncRecurringTransactions(
  transactions: Transaction[],
  recurringTransactions: RecurringTransaction[],
  referenceDate = new Date(),
) {
  const monthKey = getMonthKey(referenceDate);
  const today = startOfToday(referenceDate);
  const nextTransactions = [...transactions];
  let generatedCount = 0;

  for (const recurring of recurringTransactions) {
    if (!recurring.isActive) {
      continue;
    }

    const dueDate = createRecurringDate(referenceDate, recurring.scheduleDay, 0);

    if (dueDate.getTime() > today.getTime()) {
      continue;
    }

    const hasExisting = nextTransactions.some((transaction) => {
      if (getMonthKey(new Date(transaction.date)) !== monthKey) {
        return false;
      }

      if (transaction.recurringInstanceKey === getRecurringInstanceKey(recurring.id, monthKey)) {
        return true;
      }

      return (
        transaction.type === recurring.type &&
        transaction.categoryId === recurring.categoryId &&
        transaction.amount === recurring.amount
      );
    });

    if (hasExisting) {
      continue;
    }

    nextTransactions.unshift(createAutoRecurringTransaction(recurring, dueDate, monthKey));
    generatedCount += 1;
  }

  return {
    transactions: nextTransactions,
    generatedCount,
  };
}

export function calculateRecurringOverview(
  recurringTransactions: RecurringTransaction[],
  transactions: Transaction[],
  referenceDate = new Date(),
  daysAhead = 14,
): RecurringOverview {
  const activeItems = recurringTransactions.filter((item) => item.isActive);
  const today = startOfToday(referenceDate);
  const currentMonthKey = getMonthKey(referenceDate);
  const upcomingItems: UpcomingRecurringItem[] = activeItems
    .map((item) => {
      const currentOccurrence = createRecurringDate(referenceDate, item.scheduleDay, 0);
      const dueDate =
        currentOccurrence.getTime() >= today.getTime()
          ? currentOccurrence
          : createRecurringDate(referenceDate, item.scheduleDay, 1);
      const daysUntil = Math.ceil(
        (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      return {
        recurringId: item.id,
        title: item.title,
        type: item.type,
        categoryId: item.categoryId,
        amount: item.amount,
        dueDate: dueDate.toISOString(),
        daysUntil,
        isRequired: item.isRequired,
        note: item.note,
      };
    })
    .filter((item) => item.daysUntil <= daysAhead)
    .sort((left, right) => left.daysUntil - right.daysUntil);

  const monthlyIncomePlanned = activeItems
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);
  const monthlyExpensePlanned = activeItems
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);
  const monthlyRequiredPlanned = activeItems
    .filter((item) => item.type === "expense" && item.isRequired)
    .reduce((sum, item) => sum + item.amount, 0);
  const autoCreatedTransactions = filterTransactionsByMonth(transactions, currentMonthKey).filter(
    (transaction) => Boolean(transaction.recurringSourceId),
  );

  return {
    monthlyIncomePlanned,
    monthlyExpensePlanned,
    monthlyRequiredPlanned,
    activeCount: activeItems.length,
    monthlyNetPlanned: monthlyIncomePlanned - monthlyExpensePlanned,
    upcomingItems,
    nextExpenseTotal: upcomingItems
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0),
    nextIncomeTotal: upcomingItems
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0),
    autoCreatedCount: autoCreatedTransactions.length,
    autoCreatedAmount: autoCreatedTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    ),
  };
}

export function calculateSavingsProgress(savingsGoal: SavingsGoal): SavingsProgress {
  const currentAmount = Math.max(0, savingsGoal.currentAmount);
  const targetAmount = Math.max(0, savingsGoal.targetAmount);
  const remainingAmount = Math.max(targetAmount - currentAmount, 0);
  const progress = targetAmount === 0 ? 0 : round((currentAmount / targetAmount) * 100);
  const monthsToTarget =
    savingsGoal.monthlyContribution > 0 && remainingAmount > 0
      ? Math.ceil(remainingAmount / savingsGoal.monthlyContribution)
      : remainingAmount === 0
        ? 0
        : null;

  return {
    id: savingsGoal.id,
    title: savingsGoal.title,
    targetAmount,
    currentAmount,
    remainingAmount,
    progress,
    monthlyContribution: savingsGoal.monthlyContribution,
    monthsToTarget,
    note: savingsGoal.note,
    isCompleted: remainingAmount === 0,
  };
}

export function buildSavingsOverview(savingsGoals: SavingsGoal[]): SavingsOverview {
  return savingsGoals.reduce<SavingsOverview>(
    (overview, goal) => {
      overview.totalCurrentAmount += goal.currentAmount;
      overview.totalTargetAmount += goal.targetAmount;
      overview.totalRemainingAmount += Math.max(goal.targetAmount - goal.currentAmount, 0);
      overview.totalMonthlyContribution += goal.monthlyContribution;
      overview.completedGoals += goal.currentAmount >= goal.targetAmount ? 1 : 0;
      overview.activeGoals += 1;
      return overview;
    },
    {
      totalCurrentAmount: 0,
      totalTargetAmount: 0,
      totalRemainingAmount: 0,
      totalMonthlyContribution: 0,
      completedGoals: 0,
      activeGoals: 0,
    },
  );
}

export function buildProductInsights(
  transactions: Transaction[],
  categories: Category[],
  budgetTargets: BudgetTarget[],
  recurringTransactions: RecurringTransaction[],
  referenceDate = new Date(),
): ProductInsight[] {
  const currentMonthKey = getMonthKey(referenceDate);
  const comparison = calculateMonthComparison(transactions, categories, currentMonthKey);
  const budgetOverview = calculateBudgetOverview(
    transactions,
    categories,
    budgetTargets,
    currentMonthKey,
  );
  const recurringOverview = calculateRecurringOverview(
    recurringTransactions,
    transactions,
    referenceDate,
    10,
  );
  const insights: ProductInsight[] = [];

  if (comparison.expenseDeltaPercent !== null && Math.abs(comparison.expenseDeltaPercent) >= 10) {
    insights.push({
      id: "expense-trend",
      title:
        comparison.expenseDelta > 0
          ? "Расходы ускорились"
          : "Расходы стали спокойнее",
      description:
        comparison.expenseDelta > 0
          ? `Траты выше прошлого месяца на ${Math.abs(comparison.expenseDeltaPercent)}%.`
          : `Траты ниже прошлого месяца на ${Math.abs(comparison.expenseDeltaPercent)}%.`,
      tone: comparison.expenseDelta > 0 ? "warning" : "positive",
    });
  }

  if (comparison.current.requiredShare >= 50) {
    insights.push({
      id: "required-share",
      title: "Фиксированные траты занимают заметную долю",
      description: `${round(comparison.current.requiredShare)}% расходов уже уходят на обязательные платежи.`,
      tone: comparison.current.requiredShare >= 65 ? "negative" : "warning",
    });
  }

  if (comparison.current.topCategory && comparison.current.topCategory.percentage >= 30) {
    insights.push({
      id: "top-category",
      title: `${comparison.current.topCategory.name} стала ключевой категорией`,
      description: `Она забирает ${round(comparison.current.topCategory.percentage)}% расходов месяца.`,
      tone: "neutral",
    });
  }

  if (budgetOverview.overspentCount > 0) {
    insights.push({
      id: "budget-overrun",
      title: "Есть категории с перерасходом",
      description: `${budgetOverview.overspentCount} категорий уже вышли за предел лимита.`,
      tone: "negative",
    });
  }

  if (recurringOverview.upcomingItems.length > 0) {
    const nextTotal =
      recurringOverview.nextExpenseTotal > 0
        ? recurringOverview.nextExpenseTotal
        : recurringOverview.nextIncomeTotal;

    insights.push({
      id: "upcoming-payments",
      title: "Впереди регулярные операции",
      description: `В ближайшие 10 дней запланировано ${recurringOverview.upcomingItems.length} операций на ${nextTotal.toLocaleString("ru-RU")} ₽.`,
      tone: recurringOverview.nextExpenseTotal > 0 ? "warning" : "positive",
    });
  }

  return insights.slice(0, 4);
}
