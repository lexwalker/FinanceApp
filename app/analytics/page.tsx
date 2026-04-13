"use client";

import Link from "next/link";
import { useState } from "react";

import { CategoryComparisonList } from "@/components/analytics/category-comparison-list";
import { CategoryDonutChart } from "@/components/charts/category-donut-chart";
import { ExpenseBarChart } from "@/components/charts/expense-bar-chart";
import { MonthlyTrendChart } from "@/components/charts/monthly-trend-chart";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { MetricCard } from "@/components/shared/metric-card";
import { MonthPicker } from "@/components/shared/month-picker";
import { PageHeader } from "@/components/shared/page-header";
import {
  buildCategoryComparison,
  buildMonthlyTrend,
  calculateMonthComparison,
  getMonthOptions,
} from "@/lib/finance";
import { formatCurrency, formatMonthLabel } from "@/lib/format";
import { useFinanceStore } from "@/stores/finance-store";

export default function AnalyticsPage() {
  const { categories, transactions, hasHydrated } = useFinanceStore();
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
  const trend = buildMonthlyTrend(transactions, categories, 6);
  const categoryComparison = buildCategoryComparison(transactions, categories, activeMonth);

  return (
    <AppShell>
      <div className="grid gap-6">
        <PageHeader
          eyebrow="Аналитика"
          title="Сравнение трат по месяцам"
          description="Переключай период, смотри динамику доходов и расходов и быстро находи категории, которые растут сильнее всего."
          action={
            <Link
              href="/summary"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Сводка месяца
            </Link>
          }
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

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Доход месяца" value={stats.incomeTotal} tone="positive" helper={`Сравнение с ${formatMonthLabel(comparison.previousMonthKey)}`} />
          <MetricCard label="Расход месяца" value={stats.expenseTotal} tone="negative" helper={comparison.expenseDeltaPercent === null ? "Нет базы для сравнения" : `${comparison.expenseDeltaPercent > 0 ? "+" : ""}${comparison.expenseDeltaPercent}% к прошлому месяцу`} />
          <MetricCard label="Обязательные" value={stats.requiredExpenseTotal} helper="Регулярные и фиксированные платежи" percent={stats.requiredShare} />
          <MetricCard label="Чистый результат" value={stats.net} helper={comparison.netDeltaPercent === null ? "Нет базы для сравнения" : `${comparison.netDeltaPercent > 0 ? "+" : ""}${comparison.netDeltaPercent}% к прошлому месяцу`} />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <GlassCard className="p-6 md:p-7">
            <div>
              <p className="text-sm text-slate-500">Динамика за месяцы</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Доходы и расходы по периодам
              </h2>
            </div>

            <div className="mt-6">
              <MonthlyTrendChart data={trend} />
            </div>
          </GlassCard>

          <GlassCard className="p-6 md:p-7">
            <div>
              <p className="text-sm text-slate-500">Структура расходов</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Доли по категориям
              </h2>
            </div>

            <CategoryDonutChart
              data={stats.categoryBreakdown}
              centerLabel={formatMonthLabel(activeMonth)}
              centerValue={formatCurrency(stats.expenseTotal)}
            />
          </GlassCard>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <GlassCard className="p-6 md:p-7">
            <div>
              <p className="text-sm text-slate-500">Сравнение категорий</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Где траты выше всего
              </h2>
            </div>

            <div className="mt-6">
              <ExpenseBarChart data={stats.categoryBreakdown.slice(0, 6)} />
            </div>
          </GlassCard>

          <GlassCard className="p-6 md:p-7">
            <p className="text-sm text-slate-500">Что изменилось к прошлому месяцу</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Рост и снижение по категориям
            </h2>

            <div className="mt-6">
              <CategoryComparisonList items={categoryComparison.slice(0, 6)} />
            </div>
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}
