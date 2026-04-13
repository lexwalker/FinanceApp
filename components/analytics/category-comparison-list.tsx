import { ArrowDownRight, ArrowUpRight, Dot, Sparkles } from "lucide-react";

import type { CategoryComparisonItem } from "@/types/finance";

import { formatCurrency } from "@/lib/format";

import { EmptyState } from "../shared/empty-state";

type CategoryComparisonListProps = {
  items: CategoryComparisonItem[];
};

function renderDeltaLabel(item: CategoryComparisonItem) {
  if (item.status === "new") {
    return "Новая трата";
  }

  if (item.deltaPercent === null) {
    return formatCurrency(item.delta);
  }

  return `${item.delta > 0 ? "+" : ""}${item.deltaPercent}%`;
}

export function CategoryComparisonList({ items }: CategoryComparisonListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="Пока нечего сравнивать"
        description="Добавь траты за несколько месяцев, и здесь появится динамика категорий."
      />
    );
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div
          key={item.categoryId}
          className="rounded-[24px] border border-slate-200/80 bg-white/90 px-4 py-4"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <div>
                <p className="font-semibold text-slate-950">{item.name}</p>
                <p className="text-sm text-slate-500">
                  Было {formatCurrency(item.previousAmount)} • стало {formatCurrency(item.currentAmount)}
                </p>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                item.status === "up"
                  ? "bg-rose-50 text-rose-700"
                  : item.status === "down"
                    ? "bg-emerald-50 text-emerald-700"
                    : item.status === "new"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-slate-100 text-slate-600"
              }`}
            >
              {item.status === "up" ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : item.status === "down" ? (
                <ArrowDownRight className="h-3.5 w-3.5" />
              ) : item.status === "new" ? (
                <Sparkles className="h-3.5 w-3.5" />
              ) : (
                <Dot className="h-3.5 w-3.5" />
              )}
              {renderDeltaLabel(item)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
