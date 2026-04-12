"use client";

import Link from "next/link";

import { TransactionList } from "@/components/history/transaction-list";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import {
  calculateMonthlyStats,
  filterTransactionsByMonth,
  sortTransactionsByDate,
} from "@/lib/finance";
import { formatCurrency, formatPercent } from "@/lib/format";
import { useFinanceStore } from "@/stores/finance-store";

export default function RequiredExpensesPage() {
  const { categories, transactions, hasHydrated } = useFinanceStore();

  if (!hasHydrated) {
    return (
      <AppShell>
        <LoadingScreen />
      </AppShell>
    );
  }

  const stats = calculateMonthlyStats(transactions, categories);
  const requiredTransactions = sortTransactionsByDate(
    filterTransactionsByMonth(transactions, stats.monthKey).filter(
      (transaction) => transaction.type === "expense" && transaction.isRequired,
    ),
  );
  const requiredByCategory = stats.categoryBreakdown
    .map((item) => {
      const amount = requiredTransactions
        .filter((transaction) => transaction.categoryId === item.categoryId)
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      return {
        ...item,
        amount,
        percentage:
          stats.requiredExpenseTotal === 0 ? 0 : (amount / stats.requiredExpenseTotal) * 100,
      };
    })
    .filter((item) => item.amount > 0);

  return (
    <AppShell>
      <div className="grid gap-6">
        <PageHeader
          eyebrow="Required Expenses"
          title="Обязательные платежи без сюрпризов"
          description="Отдельный экран для регулярных расходов: аренда, подписки, связь, транспорт и прочие платежи, без которых месяц не сходится."
          action={
            <Link
              href="/transactions/new"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Добавить обязательную трату
            </Link>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Сумма обязательных"
            value={stats.requiredExpenseTotal}
            tone="negative"
            helper="Все обязательные траты за месяц"
          />
          <MetricCard
            label="Доля от расходов"
            value={stats.expenseTotal}
            helper="Какая часть месяца фиксирована"
            percent={stats.requiredShare}
          />
          <MetricCard
            label="Свободные деньги"
            value={stats.freeMoney}
            tone="positive"
            helper="Доход месяца минус обязательные расходы"
          />
          <MetricCard
            label="Платежей в списке"
            value={requiredTransactions.length}
            helper="Количество обязательных операций"
            format="number"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <GlassCard className="p-6 md:p-7">
            <p className="text-sm text-slate-500">Структура обязательных трат</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Где фиксированы деньги
            </h2>

            <div className="mt-6 grid gap-3">
              {requiredByCategory.map((item) => (
                <div
                  key={item.categoryId}
                  className="rounded-[24px] border border-slate-200/70 bg-slate-50/85 px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-semibold text-slate-950">{item.name}</span>
                    </div>
                    <span className="text-sm text-slate-500">
                      {formatPercent(item.percentage)}
                    </span>
                  </div>
                  <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-slate-950">
                    {formatCurrency(item.amount)}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 md:p-7">
            <p className="text-sm text-slate-500">Список платежей</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Регулярные списания
            </h2>

            <div className="mt-6">
              <TransactionList
                transactions={requiredTransactions}
                categories={categories}
                emptyTitle="Обязательных расходов пока нет"
                emptyDescription="Добавь регулярные платежи через форму новой транзакции."
              />
            </div>
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}
