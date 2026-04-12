"use client";

import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { calculateMonthlyStats } from "@/lib/finance";
import { formatCurrency, formatMonthLabel, formatPercent } from "@/lib/format";
import { useFinanceStore } from "@/stores/finance-store";

export default function SummaryPage() {
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
          eyebrow="Monthly Summary"
          title={`Сводка за ${formatMonthLabel(stats.monthKey)}`}
          description="Короткая executive summary по месяцу: доход, расход, чистый остаток, обязательные платежи, средний расход в день и самая затратная категория."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <MetricCard label="Доход" value={stats.incomeTotal} tone="positive" />
          <MetricCard label="Расход" value={stats.expenseTotal} tone="negative" />
          <MetricCard label="Чистый остаток" value={stats.net} tone="default" />
          <MetricCard
            label="Обязательные расходы"
            value={stats.requiredExpenseTotal}
            percent={stats.requiredShare}
          />
          <MetricCard label="Средний расход в день" value={stats.averageDailyExpense} />
          <MetricCard label="Свободные деньги" value={stats.freeMoney} tone="positive" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <GlassCard className="p-6 md:p-7">
            <p className="text-sm text-slate-500">Главные выводы</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Что говорит месяц
            </h2>

            <div className="mt-6 grid gap-3">
              <div className="rounded-[24px] bg-slate-950 px-5 py-5 text-white">
                <p className="text-sm text-white/65">Самая затратная категория</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.05em]">
                  {stats.topCategory?.name ?? "Пока нет данных"}
                </p>
                <p className="mt-2 text-sm text-white/65">
                  {stats.topCategory
                    ? `${formatCurrency(stats.topCategory.amount)} • ${formatPercent(
                        stats.topCategory.percentage,
                      )} от всех расходов`
                    : "Добавь расходы, чтобы построить выводы"}
                </p>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-4">
                <p className="text-sm text-slate-500">Куда уходит бюджет</p>
                <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                  {stats.requiredShare >= 50
                    ? "Большая часть расходов уже зафиксирована"
                    : "У тебя ещё достаточно гибкости в бюджете"}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Обязательные расходы занимают {formatPercent(stats.requiredShare)} от общего
                  объёма трат за месяц.
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 md:p-7">
            <p className="text-sm text-slate-500">Логика расчётов</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              Как считается MVP
            </h2>

            <div className="mt-6 grid gap-3 text-sm leading-7 text-slate-600">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 px-4 py-4">
                <strong className="text-slate-950">Общий баланс:</strong> все доходы минус все
                расходы.
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 px-4 py-4">
                <strong className="text-slate-950">Траты за месяц:</strong> сумма всех операций
                типа expense за выбранный месяц.
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 px-4 py-4">
                <strong className="text-slate-950">Обязательные траты:</strong> все расходы с
                флагом `isRequired = true`.
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 px-4 py-4">
                <strong className="text-slate-950">Проценты категорий:</strong> категория / все
                расходы месяца * 100.
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 px-4 py-4">
                <strong className="text-slate-950">Свободные деньги:</strong> доход месяца минус
                обязательные расходы.
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}
