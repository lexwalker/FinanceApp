"use client";

import { BudgetEditor } from "@/components/budgets/budget-editor";
import { BudgetProgressCard } from "@/components/budgets/budget-progress-card";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { calculateBudgetOverview } from "@/lib/finance";
import { formatCurrency } from "@/lib/format";
import { useFinanceStore } from "@/stores/finance-store";

export default function BudgetsPage() {
  const { categories, transactions, budgetTargets, setBudgetTarget, hasHydrated } =
    useFinanceStore();

  if (!hasHydrated) {
    return (
      <AppShell>
        <LoadingScreen />
      </AppShell>
    );
  }

  const budgetOverview = calculateBudgetOverview(transactions, categories, budgetTargets);
  const categoriesMap = new Map(categories.map((category) => [category.id, category]));

  return (
    <AppShell>
      <div className="grid gap-6">
        <PageHeader
          eyebrow="Лимиты"
          title="Месячные лимиты по категориям"
          description="Задай комфортные суммы по основным категориям и следи, где расходы уже приближаются к пределу."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Общий лимит" value={budgetOverview.totalBudget} helper="Сумма всех установленных лимитов" />
          <MetricCard
            label="Потрачено по лимитам"
            value={budgetOverview.trackedSpent}
            tone="negative"
            helper="Расходы в категориях, где лимит задан"
            percent={budgetOverview.totalBudget > 0 ? (budgetOverview.trackedSpent / budgetOverview.totalBudget) * 100 : 0}
          />
          <MetricCard label="Осталось в лимитах" value={budgetOverview.remainingBudget} tone="positive" helper="Свободный остаток по категориям" />
          <MetricCard label="Без лимита" value={budgetOverview.unplannedSpent} helper="Расходы в категориях без ограничений" />
        </div>

        <BudgetEditor categories={categories} budgetTargets={budgetTargets} onSave={setBudgetTarget} />

        <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <GlassCard className="p-6 md:p-7">
            <p className="text-sm text-slate-500">Состояние лимитов</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">Где нужна осторожность</h2>

            <div className="mt-6 grid gap-3">
              <div className="rounded-[24px] bg-slate-950 px-5 py-5 text-white">
                <p className="text-sm text-white/60">Категорий с перерасходом</p>
                <p className="mt-2 text-4xl font-semibold tracking-[-0.05em]">{budgetOverview.overspentCount}</p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-4">
                <p className="text-sm text-slate-500">Почти достигли лимита</p>
                <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">{budgetOverview.warningCount} категорий</p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-4">
                <p className="text-sm text-slate-500">В пределах лимита</p>
                <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">{budgetOverview.onTrackCount} категорий</p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-4">
                <p className="text-sm text-slate-500">Главный риск месяца</p>
                <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                  {budgetOverview.topOverspend?.name ?? "Пока без перерасхода"}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {budgetOverview.topOverspend
                    ? `Перелимит: ${formatCurrency(budgetOverview.topOverspend.spent - budgetOverview.topOverspend.limit)}`
                    : "Сейчас ни одна категория не вышла за предел лимита."}
                </p>
              </div>
            </div>
          </GlassCard>

          <div className="grid gap-4">
            {budgetOverview.progressItems.length === 0 ? (
              <EmptyState
                title="Лимиты еще не настроены"
                description="Задай лимиты по категориям сверху, и здесь появится живая картина использования бюджета."
              />
            ) : (
              budgetOverview.progressItems.map((item) => {
                const category = categoriesMap.get(item.categoryId);

                if (!category) {
                  return null;
                }

                return (
                  <BudgetProgressCard
                    key={item.categoryId}
                    item={item}
                    categoryName={category.name}
                    categoryColor={category.color}
                    categoryIcon={category.icon}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
