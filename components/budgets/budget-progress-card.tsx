import { AlertTriangle, CheckCircle2, Radar, TrendingUp } from "lucide-react";

import type { CategoryBudgetProgress } from "@/types/finance";

import { formatCurrency, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

import { CategoryPill } from "../shared/category-pill";
import { GlassCard } from "../shared/glass-card";

type BudgetProgressCardProps = {
  item: CategoryBudgetProgress;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
};

const statusConfig = {
  safe: {
    label: "В бюджете",
    icon: CheckCircle2,
    tone: "text-emerald-700 bg-emerald-50 border-emerald-100",
    bar: "bg-emerald-500",
  },
  warning: {
    label: "Почти лимит",
    icon: TrendingUp,
    tone: "text-amber-700 bg-amber-50 border-amber-100",
    bar: "bg-amber-500",
  },
  overspent: {
    label: "Перерасход",
    icon: AlertTriangle,
    tone: "text-rose-700 bg-rose-50 border-rose-100",
    bar: "bg-rose-500",
  },
  unplanned: {
    label: "Без бюджета",
    icon: Radar,
    tone: "text-slate-700 bg-slate-100 border-slate-200",
    bar: "bg-slate-500",
  },
} as const;

export function BudgetProgressCard({
  item,
  categoryName,
  categoryColor,
  categoryIcon,
}: BudgetProgressCardProps) {
  const config = statusConfig[item.status];
  const Icon = config.icon;

  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between gap-4">
        <CategoryPill
          category={{
            id: item.categoryId,
            kind: "expense",
            name: categoryName,
            color: categoryColor,
            icon: categoryIcon,
          }}
        />

        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
            config.tone,
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          {config.label}
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Потрачено</p>
          <p className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">
            {formatCurrency(item.spent)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Лимит</p>
          <p className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">
            {item.limit > 0 ? formatCurrency(item.limit) : "Не задан"}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            {item.status === "overspent" ? "Перелимит" : "Остаток"}
          </p>
          <p className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">
            {item.status === "overspent"
              ? formatCurrency(item.spent - item.limit)
              : formatCurrency(item.remaining)}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
          <span>Использовано</span>
          <span>{item.limit > 0 ? formatPercent(item.percentageUsed) : "Без лимита"}</span>
        </div>
        <div className="mt-2 h-2.5 rounded-full bg-slate-100">
          <div
            className={cn("h-full rounded-full", config.bar)}
            style={{
              width: `${item.limit > 0 ? Math.max(Math.min(item.percentageUsed, 100), 4) : 100}%`,
            }}
          />
        </div>
      </div>
    </GlassCard>
  );
}
