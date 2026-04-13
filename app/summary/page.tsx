"use client";

import { useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { SavingsGoalCard } from "@/components/savings/savings-goal-card";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { MetricCard } from "@/components/shared/metric-card";
import { MonthPicker } from "@/components/shared/month-picker";
import { PageHeader } from "@/components/shared/page-header";
import {
  buildMonthlyTrend,
  buildSavingsOverview,
  calculateMonthComparison,
  calculateRecurringOverview,
  calculateSavingsProgress,
  getMonthOptions,
} from "@/lib/finance";
import { formatCurrency, formatMonthLabel, formatPercent } from "@/lib/format";
import { useFinanceStore } from "@/stores/finance-store";

export default function SummaryPage() {
  const { categories, transactions, recurringTransactions, savingsGoals, hasHydrated } =
    useFinanceStore();
  const monthOptions = getMonthOptions(transactions);
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0]);
  const activeMonth = monthOptions.includes(selectedMonth) ? selectedMonth : monthOptions[0];

  if (!hasHydrated) {
    return (
      <AppShell>
        <LoadingScreen />
      </AppShell>
    );
  }

  const comparison = calculateMonthComparison(transactions, categories, activeMonth);
  const stats = comparison.current;
  const recurringOverview = calculateRecurringOverview(recurringTransactions, transactions);
  const savingsOverview = buildSavingsOverview(savingsGoals);
  const leadGoal = savingsGoals[0] ? calculateSavingsProgress(savingsGoals[0]) : null;
  const trend = buildMonthlyTrend(transactions, categories, 6).reverse();

  return (
    <AppShell>
      <div className="grid gap-6">
        <PageHeader
          eyebrow="Сводка"
          title={`Итоги за ${formatMonthLabel(activeMonth)}`}
          description="Короткий обзор выбранного месяца: сколько пришло, сколько ушло, что изменилось относительно прошлого периода и как чувствуют себя накопления."
        />

        <GlassCard className="p-5 md:p-6">
          <div className="grid gap-4 lg:grid-cols-[280px_1fr] lg:items-end">
            <MonthPicker value={activeMonth} options={monthOptions} onChange={setSelectedMonth} />
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/90 px-4 py-3 text-sm leading-6 text-slate-600">
                Доход: {comparison.incomeDelta >= 0 ? "+" : ""}{formatCurrency(comparison.incomeDelta)}
              </div>
              <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/90 px-4 py-3 text-sm leading-6 text-slate-600">
                Расход: {comparison.expenseDelta >= 0 ? "+" : ""}{formatCurrency(comparison.expenseDelta)}
              </div>
              <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/90 px-4 py-3 text-sm leading-6 text-slate-600">
                Чистый результат: {comparison.netDelta >= 0 ? "+" : ""}{formatCurrency(comparison.netDelta)}
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <MetricCard label="Доход" value={stats.incomeTotal} tone="positive" />
          <MetricCard label="Расход" value={stats.expenseTotal} tone="negative" />
          <MetricCard label="Чистый остаток" value={stats.net} />
          <MetricCard label="Обязательные расходы" value={stats.requiredExpenseTotal} percent={stats.requiredShare} />
          <MetricCard label="Средний расход в день" value={stats.averageDailyExpense} />
          <MetricCard label="Свободные деньги" value={stats.freeMoney} tone="positive" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <GlassCard className="p-6 md:p-7">
            <p className="text-sm text-slate-500">Главные выводы</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Что показывает месяц
            </h2>

            <div className="mt-6 grid gap-3">
              <div className="rounded-[24px] bg-slate-950 px-5 py-5 text-white">
                <p className="text-sm text-white/65">Самая затратная категория</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.05em]">
                  {stats.topCategory?.name ?? "Пока нет данных"}
                </p>
                <p className="mt-2 text-sm text-white/65">
                  {stats.topCategory
                    ? `${formatCurrency(stats.topCategory.amount)} • ${formatPercent(stats.topCategory.percentage)} от всех расходов`
                    : "Добавь расходы, чтобы увидеть структуру трат"}
                </p>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-4">
                <p className="text-sm text-slate-500">Сравнение с прошлым месяцем</p>
                <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                  {comparison.expenseDelta > 0
                    ? "Расходы выросли"
                    : comparison.expenseDelta < 0
                      ? "Расходы снизились"
                      : "Расходы без изменений"}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {comparison.expenseDeltaPercent === null
                    ? "Пока нет полной базы для сравнения."
                    : `${comparison.expenseDelta > 0 ? "+" : ""}${comparison.expenseDeltaPercent}% относительно ${formatMonthLabel(comparison.previousMonthKey)}.`}
                </p>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-4">
                <p className="text-sm text-slate-500">Регулярные списания</p>
                <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                  {formatCurrency(recurringOverview.monthlyExpensePlanned)}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Автоматически создано в этом месяце: {recurringOverview.autoCreatedCount}
                </p>
              </div>
            </div>
          </GlassCard>

          {leadGoal ? <SavingsGoalCard progress={leadGoal} /> : null}
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <GlassCard className="p-6 md:p-7">
            <p className="text-sm text-slate-500">Разбивка по месяцам</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Последние периоды
            </h2>

            <div className="mt-6 grid gap-3">
              {trend.map((item) => (
                <div
                  key={item.monthKey}
                  className="grid gap-3 rounded-[24px] border border-slate-200/80 bg-white/90 px-4 py-4 md:grid-cols-[180px_1fr_1fr_1fr]"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{formatMonthLabel(item.monthKey)}</p>
                    <p className="text-sm text-slate-500">
                      Чистый результат {formatCurrency(item.net)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Доход</p>
                    <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-emerald-700">
                      {formatCurrency(item.incomeTotal)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Расход</p>
                    <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-slate-950">
                      {formatCurrency(item.expenseTotal)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Обязательные</p>
                    <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-slate-950">
                      {formatCurrency(item.requiredExpenseTotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 md:p-7">
            <p className="text-sm text-slate-500">Копилки</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Общий прогресс накоплений
            </h2>

            <div className="mt-6 grid gap-3">
              <div className="rounded-[24px] bg-slate-950 px-5 py-5 text-white">
                <p className="text-sm text-white/65">Всего накоплено</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.05em]">
                  {formatCurrency(savingsOverview.totalCurrentAmount)}
                </p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-4">
                <p className="text-sm text-slate-500">Общий целевой объём</p>
                <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                  {formatCurrency(savingsOverview.totalTargetAmount)}
                </p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-4">
                <p className="text-sm text-slate-500">Ежемесячный вклад</p>
                <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                  {formatCurrency(savingsOverview.totalMonthlyContribution)}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}
