"use client";

import { useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { SavingsGoalCard } from "@/components/savings/savings-goal-card";
import { SavingsGoalListItem } from "@/components/savings/savings-goal-list-item";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { buildSavingsOverview, calculateSavingsProgress } from "@/lib/finance";
import { useFinanceStore } from "@/stores/finance-store";

type SavingsDraft = {
  title: string;
  targetAmount: string;
  currentAmount: string;
  monthlyContribution: string;
  note: string;
};

function emptyDraft(): SavingsDraft {
  return {
    title: "",
    targetAmount: "",
    currentAmount: "",
    monthlyContribution: "",
    note: "",
  };
}

function createDraft(goal: {
  title: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  note: string;
}): SavingsDraft {
  return {
    title: goal.title,
    targetAmount: `${goal.targetAmount}`,
    currentAmount: `${goal.currentAmount}`,
    monthlyContribution: `${goal.monthlyContribution}`,
    note: goal.note,
  };
}

export default function SavingsPage() {
  const {
    savingsGoals,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    adjustSavingsGoal,
    hasHydrated,
  } = useFinanceStore();

  const initialGoal = savingsGoals[0] ?? null;
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(initialGoal?.id ?? null);
  const [draft, setDraft] = useState<SavingsDraft>(
    initialGoal ? createDraft(initialGoal) : emptyDraft(),
  );

  const selectedGoal =
    savingsGoals.find((goal) => goal.id === selectedGoalId) ?? null;
  const previewGoal =
    selectedGoal ?? savingsGoals[0] ?? null;
  const savingsOverview = buildSavingsOverview(savingsGoals);
  const progressItems = savingsGoals.map(calculateSavingsProgress);
  const activeProgress =
    progressItems.find((item) => item.id === previewGoal?.id) ?? progressItems[0] ?? null;

  function handleSelectGoal(id: string) {
    const goal = savingsGoals.find((item) => item.id === id);

    if (!goal) {
      return;
    }

    setSelectedGoalId(id);
    setDraft(createDraft(goal));
  }

  function handleCreateNew() {
    setSelectedGoalId(null);
    setDraft(emptyDraft());
  }

  function handleSave() {
    const values = {
      title: draft.title.trim() || "Новая цель",
      targetAmount: Number(draft.targetAmount.replace(",", ".")) || 0,
      currentAmount: Number(draft.currentAmount.replace(",", ".")) || 0,
      monthlyContribution: Number(draft.monthlyContribution.replace(",", ".")) || 0,
      note: draft.note.trim(),
    };

    if (selectedGoalId) {
      updateSavingsGoal(selectedGoalId, values);
      return;
    }

    addSavingsGoal(values);
    setDraft(emptyDraft());
  }

  if (!hasHydrated) {
    return (
      <AppShell>
        <LoadingScreen />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="grid gap-6">
        <PageHeader
          eyebrow="Копилка"
          title="Несколько целей накопления"
          description="Разделяй подушку, отпуск, технику и другие цели. Сразу видно общий прогресс, ежемесячную нагрузку и сколько ещё осталось до каждой цели."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Всего накоплено"
            value={savingsOverview.totalCurrentAmount}
            tone="positive"
            helper="Сумма по всем копилкам"
          />
          <MetricCard
            label="Общая цель"
            value={savingsOverview.totalTargetAmount}
            helper="Сколько хочется собрать суммарно"
          />
          <MetricCard
            label="Осталось собрать"
            value={savingsOverview.totalRemainingAmount}
            tone="negative"
            helper="Сколько ещё нужно до общего финиша"
          />
          <MetricCard
            label="Активных целей"
            value={savingsOverview.activeGoals}
            format="number"
            helper={`Готово: ${savingsOverview.completedGoals}`}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <GlassCard className="p-6 md:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Редактор цели</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                  {selectedGoal ? "Обновить копилку" : "Новая копилка"}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleCreateNew}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Новая цель
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Название цели</span>
                <input
                  value={draft.title}
                  onChange={(event) =>
                    setDraft((state) => ({ ...state, title: event.target.value }))
                  }
                  className="h-14 rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition focus:border-slate-950"
                  placeholder="Например, отпуск или подушка безопасности"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-600">Целевая сумма</span>
                  <input
                    inputMode="decimal"
                    value={draft.targetAmount}
                    onChange={(event) =>
                      setDraft((state) => ({ ...state, targetAmount: event.target.value }))
                    }
                    className="h-14 rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition focus:border-slate-950"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-600">Уже накоплено</span>
                  <input
                    inputMode="decimal"
                    value={draft.currentAmount}
                    onChange={(event) =>
                      setDraft((state) => ({ ...state, currentAmount: event.target.value }))
                    }
                    className="h-14 rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition focus:border-slate-950"
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Ежемесячный вклад</span>
                <input
                  inputMode="decimal"
                  value={draft.monthlyContribution}
                  onChange={(event) =>
                    setDraft((state) => ({
                      ...state,
                      monthlyContribution: event.target.value,
                    }))
                  }
                  className="h-14 rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition focus:border-slate-950"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Комментарий</span>
                <input
                  value={draft.note}
                  onChange={(event) =>
                    setDraft((state) => ({ ...state, note: event.target.value }))
                  }
                  className="h-14 rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 outline-none transition focus:border-slate-950"
                  placeholder="Короткое описание цели"
                />
              </label>

              <button
                type="button"
                onClick={handleSave}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_18px_30px_-18px_rgba(15,23,42,0.6)] transition hover:translate-y-[-1px]"
              >
                {selectedGoal ? "Сохранить изменения" : "Создать копилку"}
              </button>
            </div>
          </GlassCard>

          <div className="grid gap-6">
            {activeProgress ? <SavingsGoalCard progress={activeProgress} /> : null}

            <GlassCard className="p-6 md:p-7">
              <p className="text-sm text-slate-500">Все цели</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Мои копилки
              </h2>

              <div className="mt-6 grid gap-3">
                {progressItems.map((goal) => (
                  <SavingsGoalListItem
                    key={goal.id}
                    goal={goal}
                    isActive={goal.id === previewGoal?.id}
                    onSelect={handleSelectGoal}
                    onAdd={adjustSavingsGoal}
                    onDelete={(id) => {
                      deleteSavingsGoal(id);

                      if (id === selectedGoalId) {
                        handleCreateNew();
                      }
                    }}
                  />
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
