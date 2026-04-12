"use client";

import Link from "next/link";

import { CategoryDonutChart } from "@/components/charts/category-donut-chart";
import { ExpenseBarChart } from "@/components/charts/expense-bar-chart";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { calculateMonthlyStats } from "@/lib/finance";
import { formatCurrency, formatPercent } from "@/lib/format";
import { useFinanceStore } from "@/stores/finance-store";

export default function AnalyticsPage() {
  const { categories, transactions, hasHydrated } = useFinanceStore();

  if (!hasHydrated) {
    return (
      <AppShell>
        <LoadingScreen />
      </AppShell>
    );
  }

  const stats = calculateMonthlyStats(transactions, categories);

  return (
    <AppShell>
      <div className="grid gap-6">
        <PageHeader
          eyebrow="Analytics"
          title="Понятная картина расходов"
          description="Здесь видно проценты по категориям, абсолютные суммы, обязательные vs необязательные траты и сравнение доходов с расходами за месяц."
          action={
            <Link
              href="/summary"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Monthly summary
            </Link>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Доход месяца"
            value={stats.incomeTotal}
            tone="positive"
            helper="Все поступления за текущий месяц"
          />
          <MetricCard
            label="Расход месяца"
            value={stats.expenseTotal}
            tone="negative"
            helper="Все списания за текущий месяц"
          />
          <MetricCard
            label="Обязательные"
            value={stats.requiredExpenseTotal}
            helper="Регулярные и обязательные платежи"
            percent={stats.requiredShare}
          />
          <MetricCard
            label="Необязательные"
            value={stats.optionalExpenseTotal}
            helper="Гибкая часть расходов"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <GlassCard className="p-6 md:p-7">
            <div>
              <p className="text-sm text-slate-500">Pie / Donut</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Проценты расходов
              </h2>
            </div>

            <CategoryDonutChart
              data={stats.categoryBreakdown}
              centerLabel="Траты месяца"
              centerValue={formatCurrency(stats.expenseTotal)}
            />
          </GlassCard>

          <GlassCard className="p-6 md:p-7">
            <div>
              <p className="text-sm text-slate-500">Bar chart</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Категории по сумме
              </h2>
            </div>

            <div className="mt-6">
              <ExpenseBarChart data={stats.categoryBreakdown.slice(0, 6)} />
            </div>
          </GlassCard>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <GlassCard className="p-6 md:p-7">
            <p className="text-sm text-slate-500">Income vs expenses</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Сравнение за месяц
            </h2>

            <div className="mt-6 grid gap-3">
              <div className="rounded-[26px] bg-slate-950 p-5 text-white">
                <p className="text-sm text-white/60">Чистый результат месяца</p>
                <p className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
                  {formatCurrency(stats.net)}
                </p>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">Доходы</span>
                  <span className="font-semibold text-emerald-700">
                    {formatCurrency(stats.incomeTotal)}
                  </span>
                </div>
                <div className="mt-3 h-3 rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: "100%" }} />
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">Расходы</span>
                  <span className="font-semibold text-rose-700">
                    {formatCurrency(stats.expenseTotal)}
                  </span>
                </div>
                <div className="mt-3 h-3 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-rose-500"
                    style={{
                      width: `${
                        stats.incomeTotal === 0
                          ? 0
                          : Math.min((stats.expenseTotal / stats.incomeTotal) * 100, 100)
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 md:p-7">
            <p className="text-sm text-slate-500">Top categories</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              На что уходит больше всего
            </h2>

            <div className="mt-6 grid gap-3">
              {stats.categoryBreakdown.map((item, index) => (
                <div
                  key={item.categoryId}
                  className="flex items-center justify-between rounded-[24px] border border-slate-200/70 bg-slate-50/85 px-4 py-4"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold text-white"
                      style={{ backgroundColor: item.color }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-950">{item.name}</p>
                      <p className="text-sm text-slate-500">{formatPercent(item.percentage)}</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold tracking-[-0.03em] text-slate-950">
                    {formatCurrency(item.amount)}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}
