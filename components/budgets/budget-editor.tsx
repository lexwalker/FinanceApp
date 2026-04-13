"use client";

import { useMemo, useState } from "react";
import { Save } from "lucide-react";

import type { BudgetTarget, Category } from "@/types/finance";

import { formatCurrency } from "@/lib/format";

import { CategoryPill } from "../shared/category-pill";
import { GlassCard } from "../shared/glass-card";

type BudgetEditorProps = {
  categories: Category[];
  budgetTargets: BudgetTarget[];
  onSave: (categoryId: Category["id"], limit: number) => void;
};

export function BudgetEditor({ categories, budgetTargets, onSave }: BudgetEditorProps) {
  const expenseCategories = categories.filter((category) => category.kind === "expense");
  const initialValues = useMemo(
    () =>
      Object.fromEntries(
        expenseCategories.map((category) => [
          category.id,
          `${budgetTargets.find((target) => target.categoryId === category.id)?.limit ?? 0}`,
        ]),
      ),
    [budgetTargets, expenseCategories],
  );
  const [drafts, setDrafts] = useState<Record<string, string>>(initialValues);

  function handleSaveAll() {
    for (const category of expenseCategories) {
      const nextValue = Number((drafts[category.id] ?? "0").replace(",", "."));
      onSave(category.id, Number.isFinite(nextValue) ? nextValue : 0);
    }
  }

  return (
    <GlassCard className="p-6 md:p-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-slate-500">Настройка лимитов</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
            Сколько комфортно тратить по категориям
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Поставь пределы по основным расходам, чтобы быстрее замечать зоны риска и свободный запас.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_18px_30px_-18px_rgba(15,23,42,0.6)] transition hover:translate-y-[-1px]"
        >
          <Save className="h-4 w-4" />
          Сохранить лимиты
        </button>
      </div>

      <div className="mt-6 grid gap-3">
        {expenseCategories.map((category) => {
          const currentLimit = Number(drafts[category.id] ?? 0);

          return (
            <div
              key={category.id}
              className="grid gap-4 rounded-[24px] border border-slate-200/80 bg-white/90 px-4 py-4 lg:grid-cols-[0.9fr_1.1fr]"
            >
              <div className="flex items-center gap-3">
                <CategoryPill category={category} />
                <span className="text-sm text-slate-500">
                  Текущий лимит: {currentLimit > 0 ? formatCurrency(currentLimit) : "не задан"}
                </span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <input
                  inputMode="numeric"
                  value={drafts[category.id] ?? ""}
                  onChange={(event) =>
                    setDrafts((state) => ({
                      ...state,
                      [category.id]: event.target.value,
                    }))
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-950 outline-none transition focus:border-slate-950 sm:max-w-[220px]"
                  placeholder="Например, 15000"
                />
                <button
                  type="button"
                  onClick={() => onSave(category.id, Number(drafts[category.id] ?? 0))}
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Сохранить
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
