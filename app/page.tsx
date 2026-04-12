"use client";

import Link from "next/link";
import { ArrowRight, CirclePlus, PiggyBank, Sparkles } from "lucide-react";

import { CategoryDonutChart } from "@/components/charts/category-donut-chart";
import { TransactionList } from "@/components/history/transaction-list";
import { AppShell } from "@/components/layout/app-shell";
import { CategoryPill } from "@/components/shared/category-pill";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import {
  calculateBudgetOverview,
  calculateBudgetSummary,
  calculateMonthlyStats,
  sortTransactionsByDate,
} from "@/lib/finance";
import { formatCurrency, formatMonthLabel, formatPercent } from "@/lib/format";
import { useFinanceStore } from "@/stores/finance-store";

export default function DashboardPage() {
  const { categories, transactions, budgetTargets, hasHydrated } = useFinanceStore();

  if (!hasHydrated) {
    return (
      <AppShell>
        <LoadingScreen />
      </AppShell>
    );
  }

  const sortedTransactions = sortTransactionsByDate(transactions);
  const monthlyStats = calculateMonthlyStats(transactions, categories);
  const budgetSummary = calculateBudgetSummary(transactions, categories, budgetTargets);
  const budgetOverview = calculateBudgetOverview(transactions, categories, budgetTargets);
  const recentTransactions = sortedTransactions.slice(0, 5);

  return (
    <AppShell>
      <div className="grid gap-6">
        <PageHeader
          eyebrow="MVP Dashboard"
          title="Личный финансовый control center"
          description="Стек MVP: Next.js 16 + TypeScript + Tailwind + Zustand + Recharts + localStorage. Теперь в приложении есть не только учёт, но и лимиты по категориям с сигналами перерасхода."
          action={
            <Link
              href="/transactions/new"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_20px_40px_-18px_rgba(15,23,42,0.7)] transition hover:translate-y-[-1px]"
            >
              <CirclePlus className="h-4 w-4" />
              Добавить транзакцию
            </Link>
          }
        />

        <GlassCard className="overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="border-b border-slate-200/70 p-6 md:p-8 lg:border-b-0 lg:border-r">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-1 text-xs font-medium text-white">
                  <Sparkles className="h-3.5 w-3.5" />
                  Dashboard
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {formatMonthLabel(monthlyStats.monthKey)}
                </span>
              </div>

              <div className="mt-8 space-y-4">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Текущий баланс</p>
                <h2 className="text-5xl font-semibold tracking-[-0.07em] text-slate-950 md:text-7xl">
                  {formatCurrency(budgetSummary.balance)}
                </h2>
                <p className="max-w-xl text-sm leading-7 text-slate-500 md:text-base">
                  Главный экран отвечает на вопросы: сколько денег сейчас, сколько ушло за месяц,
                  сколько расходов обязательные и какие категории съедают бюджет сильнее всего.
                </p>
              </div>

              <div className="mt-8 grid gap-3 md:grid-cols-3">
                <div className="rounded-[24px] bg-slate-950 px-4 py-4 text-white">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/55">Потрачено</p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                    {formatCurrency(monthlyStats.expenseTotal)}
                  </p>
                </div>
                <div className="rounded-[24px] bg-emerald-50 px-4 py-4 text-emerald-950">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-800/60">Доход</p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                    {formatCurrency(monthlyStats.incomeTotal)}
                  </p>
                </div>
                <div className="rounded-[24px] bg-amber-50 px-4 py-4 text-amber-950">
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-800/60">Свободно</p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                    {formatCurrency(monthlyStats.freeMoney)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="space-y-5">
                <div>
                  <p className="text-sm text-slate-500">Следующий продуктовый слой</p>
                  <h3 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                    Бюджеты и контроль лимитов
                  </h3>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-[22px] border border-slate-200/70 bg-slate-50/90 px-4 py-3 text-sm leading-6 text-slate-600">
                    Общий бюджет месяца: {formatCurrency(budgetSummary.totalBudget)}
                  </div>
                  <div className="rounded-[22px] border border-slate-200/70 bg-slate-50/90 px-4 py-3 text-sm leading-6 text-slate-600">
                    Остаток по лимитам: {formatCurrency(budgetSummary.remainingBudget)}
                  </div>
                  <div className="rounded-[22px] border border-slate-200/70 bg-slate-50/90 px-4 py-3 text-sm leading-6 text-slate-600">
                    Перерасход по категориям: {budgetSummary.overspentCount}
                  </div>
                </div>

                <Link
                  href="/budgets"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950"
                >
                  Открыть бюджеты
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Общий баланс"
            value={budgetSummary.balance}
            tone="positive"
            helper="Все доходы минус все расходы"
          />
          <MetricCard
            label="Расходы за месяц"
            value={monthlyStats.expenseTotal}
            tone="negative"
            helper="Все расходы текущего месяца"
          />
          <MetricCard
            label="Обязательные траты"
            value={monthlyStats.requiredExpenseTotal}
            helper="Регулярные и обязательные платежи"
            percent={monthlyStats.requiredShare}
          />
          <MetricCard
            label="Свободные деньги"
            value={monthlyStats.freeMoney}
            tone="positive"
            helper="Доход месяца минус обязательные траты"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <GlassCard className="p-6 md:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Расходы по категориям</p>
                <h3 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                  Куда уходят деньги
                </h3>
              </div>
              <Link
                href="/analytics"
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Аналитика
              </Link>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <CategoryDonutChart
                data={monthlyStats.categoryBreakdown}
                centerLabel="Расходы за месяц"
                centerValue={formatCurrency(monthlyStats.expenseTotal)}
              />
              <div className="grid gap-3">
                {monthlyStats.categoryBreakdown.slice(0, 5).map((item) => (
                  <div
                    key={item.categoryId}
                    className="flex items-center justify-between rounded-[22px] border border-slate-200/70 bg-slate-50/80 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium text-slate-700">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-950">
                        {formatCurrency(item.amount)}
                      </p>
                      <p className="text-sm text-slate-500">{formatPercent(item.percentage)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 md:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Budget radar</p>
                <h3 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                  Лимиты под контролем
                </h3>
              </div>
              <Link
                href="/budgets"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <PiggyBank className="h-4 w-4" />
                Бюджеты
              </Link>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="rounded-[24px] bg-slate-950 px-5 py-5 text-white">
                <p className="text-sm text-white/65">Осталось в лимитах</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.05em]">
                  {formatCurrency(budgetOverview.remainingBudget)}
                </p>
                <p className="mt-2 text-sm text-white/65">
                  Общий бюджет {formatCurrency(budgetOverview.totalBudget)}
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-[24px] border border-slate-200/80 bg-white/90 px-5 py-4">
                  <p className="text-sm text-slate-500">Перерасход</p>
                  <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                    {budgetOverview.overspentCount} категорий
                  </p>
                </div>
                <div className="rounded-[24px] border border-slate-200/80 bg-white/90 px-5 py-4">
                  <p className="text-sm text-slate-500">Без лимита</p>
                  <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                    {formatCurrency(budgetOverview.unplannedSpent)}
                  </p>
                </div>
              </div>

              {budgetOverview.progressItems.slice(0, 3).map((item) => {
                const category = categories.find((entry) => entry.id === item.categoryId);

                if (!category) {
                  return null;
                }

                return (
                  <div
                    key={item.categoryId}
                    className="rounded-[24px] border border-slate-200/80 bg-white/90 px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <CategoryPill category={category} />
                      <p className="text-sm font-medium text-slate-500">
                        {item.limit > 0 ? formatPercent(item.percentageUsed) : "Без лимита"}
                      </p>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${
                          item.status === "overspent"
                            ? "bg-rose-500"
                            : item.status === "warning"
                              ? "bg-amber-500"
                              : item.status === "unplanned"
                                ? "bg-slate-500"
                                : "bg-emerald-500"
                        }`}
                        style={{
                          width: `${item.limit > 0 ? Math.max(Math.min(item.percentageUsed, 100), 6) : 100}%`,
                        }}
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-500">
                      <span>{formatCurrency(item.spent)}</span>
                      <span>
                        {item.limit > 0 ? `Лимит ${formatCurrency(item.limit)}` : "Лимит не задан"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <GlassCard className="p-6 md:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Monthly summary</p>
                <h3 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                  Сводка за месяц
                </h3>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="rounded-[24px] border border-slate-200/80 bg-white/90 px-5 py-4">
                <p className="text-sm text-slate-500">Чистый остаток</p>
                <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                  {formatCurrency(monthlyStats.net)}
                </p>
              </div>
              <div className="rounded-[24px] border border-slate-200/80 bg-white/90 px-5 py-4">
                <p className="text-sm text-slate-500">Самая затратная категория</p>
                <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                  {monthlyStats.topCategory?.name ?? "Пока нет данных"}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {monthlyStats.topCategory
                    ? `${formatCurrency(monthlyStats.topCategory.amount)} • ${formatPercent(
                        monthlyStats.topCategory.percentage,
                      )}`
                    : "Добавь расходы для анализа"}
                </p>
              </div>
              <div className="rounded-[24px] border border-slate-200/80 bg-white/90 px-5 py-4">
                <p className="text-sm text-slate-500">Средний расход в день</p>
                <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                  {formatCurrency(monthlyStats.averageDailyExpense)}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 md:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Последние операции</p>
                <h3 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                  История транзакций
                </h3>
              </div>
              <Link
                href="/history"
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Вся история
              </Link>
            </div>

            <div className="mt-6">
              <TransactionList
                transactions={recentTransactions}
                categories={categories}
                emptyTitle="История пока пустая"
                emptyDescription="Добавь доход или расход, и здесь появятся последние операции."
              />
            </div>
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}
